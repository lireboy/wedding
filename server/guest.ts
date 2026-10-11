import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { gallery } from './gallery.js'
import { fileRequestUrl } from './dropbox.js'

type Environment = Record<string, string | undefined>
type RequestWithBody = IncomingMessage & { body?: unknown }
const lifetime = 8 * 60 * 60
const windowSeconds = 15 * 60
const limit = 10
const digest = (value: string) => createHash('sha256').update(value).digest()
const equal = (a: string, b: string) => timingSafeEqual(digest(a), digest(b))

export function createGuestHandler(env: Environment) {
  // Only for the local Vite server. Production uses shared, atomic Redis counters.
  const attempts = new Map<string, { count: number; until: number }>()
  const production = env.VERCEL === '1' || env.NODE_ENV === 'production'
  const cookieName = production ? '__Host-wedding_guest' : 'wedding_guest'
  const secret = env.GUEST_SESSION_SECRET || ''
  const password = env.GUEST_PASSWORD || ''
  const redisUrl =
    env.UPSTASH_REDIS_REST_URL ||
    env.UPSTASH_REDIS_REST_KV_REST_API_URL ||
    ''
  const redisToken =
    env.UPSTASH_REDIS_REST_TOKEN ||
    env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN ||
    ''
  const passwordValid = password.length >= 12 && password.length <= 512
  const configured = passwordValid && secret.length >= 32
  const sign = (value: string) =>
    createHmac('sha256', secret).update(value).digest('base64url')
  const version = () => sign(`password:${password}`)
  const cookie = (value: string, age: number) =>
    `${cookieName}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${age}${production ? '; Secure' : ''}`

  function session(req: IncomingMessage) {
    if (!configured) return null
    const token = (req.headers.cookie || '')
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${cookieName}=`))
      ?.slice(cookieName.length + 1)
    if (!token || token.length > 2048) return null
    const [payload, signature, extra] = token.split('.')
    if (!payload || !signature || extra || !equal(signature, sign(payload)))
      return null
    try {
      const value = JSON.parse(
        Buffer.from(payload, 'base64url').toString('utf8'),
      )
      if (
        typeof value.exp !== 'number' ||
        value.exp <= Date.now() / 1000 ||
        value.exp > Date.now() / 1000 + lifetime + 5 ||
        value.version !== version()
      )
        return null
      return value as { exp: number; nonce: string; version: string }
    } catch {
      return null
    }
  }

  async function allowLogin(req: IncomingMessage) {
    const address = production
      ? req.headers['x-vercel-forwarded-for']
      : req.socket.remoteAddress
    // Never trust arbitrary client-supplied X-Forwarded-For.
    const key = `wedding:login:${digest(String(address || 'unknown')).toString('hex')}`
    if (production) {
      if (!redisUrl || !redisToken) throw new Error('Rate limit not configured')
      const response = await fetch(redisUrl, {
        method: 'POST',
        signal: AbortSignal.timeout(5000),
        headers: {
          Authorization: `Bearer ${redisToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          'EVAL',
          "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n",
          '1',
          key,
          String(windowSeconds),
        ]),
      })
      const result = (await response.json()) as { result: number }
      if (!response.ok || !Number.isInteger(result.result))
        throw new Error('Rate limit unavailable')
      return result.result <= limit
    }
    const now = Date.now()
    for (const [entry, value] of attempts)
      if (value.until <= now) attempts.delete(entry)
    const value = attempts.get(key) || {
      count: 0,
      until: now + windowSeconds * 1000,
    }
    value.count++
    attempts.set(key, value)
    return value.count <= limit
  }

  return async function handler(req: RequestWithBody, res: ServerResponse) {
    res.setHeader('Cache-Control', 'private, no-store, max-age=0')
    res.setHeader('Vary', 'Cookie')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Referrer-Policy', 'no-referrer')
    const json = (status: number, value: unknown) => {
      res.statusCode = status
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(value))
    }
    const action =
      new URL(req.url || '/', 'http://localhost').searchParams.get('action') ||
      'session'
    const methods: Record<string, string> = {
      session: 'GET',
      login: 'POST',
      logout: 'POST',
      gallery: 'GET',
      'file-request': 'GET',
    }
    if (!methods[action]) return json(404, { error: 'Nicht gefunden.' })
    if (req.method !== methods[action]) {
      res.setHeader('Allow', methods[action])
      return json(405, { error: 'Methode nicht erlaubt.' })
    }
    if (req.method === 'POST') {
      const expected = production
        ? env.APP_ORIGIN
        : `http://${req.headers.host}`
      if (
        !expected ||
        req.headers.origin !== expected ||
        req.headers['sec-fetch-site'] === 'cross-site'
      )
        return json(403, { error: 'Anfrage nicht erlaubt.' })
    }
    if (action === 'logout') {
      res.setHeader('Set-Cookie', cookie('', 0))
      return json(200, { authenticated: false })
    }
    if (!configured)
      return json(503, {
        error: production
          ? 'Der Gästezugang ist noch nicht eingerichtet.'
          : !passwordValid
            ? 'GUEST_PASSWORD in .env.local muss 12 bis 512 Zeichen lang sein. Bitte anpassen und den Entwicklungsserver neu starten.'
            : 'GUEST_SESSION_SECRET fehlt oder ist zu kurz. Bitte npm run setup:guest ausführen und den Entwicklungsserver neu starten.',
      })
    if (action === 'session') {
      const current = session(req)
      return json(200, {
        authenticated: !!current,
        expiresAt: current ? current.exp * 1000 : null,
      })
    }
    if (action === 'login') {
      try {
        if (!(await allowLogin(req))) {
          res.setHeader('Retry-After', String(windowSeconds))
          return json(429, {
            error: 'Zu viele Versuche. Bitte in 15 Minuten erneut versuchen.',
          })
        }
        if (!req.headers['content-type']?.startsWith('application/json'))
          return json(415, { error: 'JSON erwartet.' })
        if (Number(req.headers['content-length'] || 0) > 2048)
          return json(413, { error: 'Anfrage zu groß.' })
        let body = req.body
        if (body === undefined) {
          let raw = ''
          for await (const chunk of req) {
            raw += chunk.toString()
            if (Buffer.byteLength(raw) > 2048)
              return json(413, { error: 'Anfrage zu groß.' })
          }
          try {
            body = JSON.parse(raw)
          } catch {
            return json(400, { error: 'Ungültige Anfrage.' })
          }
        }
        const supplied = (body as { password?: unknown })?.password
        if (typeof supplied !== 'string' || supplied.length > 512)
          return json(400, { error: 'Bitte ein Passwort eingeben.' })
        if (!equal(supplied, password))
          return json(401, { error: 'Das Passwort stimmt leider nicht.' })
        const exp = Math.floor(Date.now() / 1000) + lifetime
        const payload = Buffer.from(
          JSON.stringify({
            exp,
            nonce: randomBytes(16).toString('hex'),
            version: version(),
          }),
        ).toString('base64url')
        res.setHeader(
          'Set-Cookie',
          cookie(`${payload}.${sign(payload)}`, lifetime),
        )
        return json(200, { authenticated: true, expiresAt: exp * 1000 })
      } catch {
        return json(503, {
          error:
            'Der Zugang ist gerade nicht verfügbar. Bitte später erneut versuchen.',
        })
      }
    }
    const current = session(req)
    if (!current)
      return json(401, { error: 'Bitte zuerst den Gästezugang öffnen.' })
    if (action === 'file-request')
      return json(200, { url: fileRequestUrl(env.DROPBOX_FILE_REQUEST_URL) })
    if (action === 'gallery') return json(200, { photos: gallery })
    return json(404, { error: 'Nicht gefunden.' })
  }
}
