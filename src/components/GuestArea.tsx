import { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import { Password } from 'primereact/password'
import Gallery from './Gallery'
import UploadSection from './UploadSection'

type Photo = {
  id: number | string
  title: string
  category: string
  variant: string
  src: string
}

export default function GuestArea() {
  const [password, setPassword] = useState('')
  const [expiresAt, setExpiresAt] = useState<number | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [requestUrl, setRequestUrl] = useState<string | null>(null)
  const [requestLoading, setRequestLoading] = useState(true)
  const [requestError, setRequestError] = useState('')
  const [checking, setChecking] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [galleryError, setGalleryError] = useState('')
  const heading = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/guest?action=session', {
      credentials: 'same-origin',
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok)
          throw new Error(
            data.error || 'Der Gästezugang ist gerade nicht erreichbar.',
          )
        setExpiresAt(data.authenticated ? data.expiresAt : null)
      })
      .catch((reason) => {
        if (!controller.signal.aborted) setError(reason.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setChecking(false)
      })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!expiresAt) return
    const controller = new AbortController()
    const expire = () => {
      setExpiresAt(null)
      setPhotos([])
      setRequestUrl(null)
      setError('Dein Zugang ist abgelaufen. Bitte melde dich erneut an.')
    }
    const timer = window.setTimeout(expire, Math.max(0, expiresAt - Date.now()))
    const checkTime = () => {
      if (Date.now() >= expiresAt) expire()
    }
    window.addEventListener('focus', checkTime)
    const loadGallery = () =>
      fetch('/api/guest?action=gallery', {
        credentials: 'same-origin',
        signal: controller.signal,
      })
        .then(async (response) => {
          if (response.status === 401) {
            expire()
            return
          }
          const data = await response.json()
          if (!response.ok)
            throw new Error('Die Galerie konnte nicht geladen werden.')
          setPhotos(data.photos)
        })
        .catch(() => {
          if (!controller.signal.aborted)
            setGalleryError(
              'Die Galerie konnte nicht geladen werden. Bitte lade die Seite erneut.',
            )
        })
    void loadGallery()
    // Load the Dropbox link independently of the gallery.
    fetch('/api/guest?action=file-request', {
      credentials: 'same-origin',
      signal: controller.signal,
    })
      .then(async (response) => {
        if (response.status === 401) {
          expire()
          return
        }
        if (!response.ok) throw new Error('Dateianfrage nicht erreichbar.')
        const data = await response.json()
        if (!controller.signal.aborted) setRequestUrl(data.url)
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setRequestError(
            'Die Dateianfrage konnte nicht geladen werden. Bitte lade die Seite erneut.',
          )
      })
      .finally(() => {
        if (!controller.signal.aborted) setRequestLoading(false)
      })
    return () => {
      controller.abort()
      clearTimeout(timer)
      window.removeEventListener('focus', checkTime)
    }
  }, [expiresAt])

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setGalleryError('')
    setRequestError('')
    setRequestLoading(true)
    try {
      const response = await fetch('/api/guest?action=login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await response.json()
      if (!response.ok)
        throw new Error(
          data.error || 'Der Zugang konnte nicht geöffnet werden.',
        )
      setPassword('')
      setExpiresAt(data.expiresAt)
      heading.current?.focus()
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Bitte versuche es später erneut.',
      )
    } finally {
      setBusy(false)
    }
  }

  async function logout() {
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/guest?action=logout', {
        method: 'POST',
        credentials: 'same-origin',
      })
      if (!response.ok)
        throw new Error('Abmelden fehlgeschlagen. Bitte erneut versuchen.')
      setExpiresAt(null)
      setPhotos([])
      setRequestUrl(null)
      setRequestLoading(true)
      setRequestError('')
      setGalleryError('')
      heading.current?.focus()
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Abmelden fehlgeschlagen.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div id="gaestebereich">
      <section
        className="section-space sage-section px-4 md:px-6"
        aria-labelledby="guest-title"
      >
        <div className="page-width mx-auto">
          <p className="eyebrow">NUR FÜR UNSERE LIEBLINGSMENSCHEN</p>
          <h2
            ref={heading}
            tabIndex={-1}
            id="guest-title"
            className="section-title mt-3 mb-4"
          >
            Für unsere <em>Gäste.</em>
          </h2>
          {checking ? (
            <p role="status">Dein Zugang wird geprüft …</p>
          ) : expiresAt ? (
            <div className="flex flex-wrap align-items-center justify-content-between gap-3">
              <p className="m-0 line-height-3">
                Schön, dass du da bist. Unser Gästebereich ist für dich
                geöffnet.
              </p>
              <Button
                label="Abmelden"
                icon="pi pi-lock"
                outlined
                loading={busy}
                onClick={logout}
              />
            </div>
          ) : (
            <div className="surface-card border-round-xl p-4 md:p-5 max-w-30rem">
              <p className="line-height-3 mt-0" id="guest-help">
                Unsere Fotos und der Bereich zum Teilen von Erinnerungen sind
                privat. Öffne sie mit dem Gästepasswort, das du von uns erhalten
                hast.
              </p>
              <form onSubmit={login} className="flex flex-column gap-3">
                <label htmlFor="guest-password" className="font-medium">
                  Gästepasswort
                </label>
                <Password
                  inputId="guest-password"
                  name="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  feedback={false}
                  toggleMask
                  required
                  autoComplete="current-password"
                  maxLength={512}
                  disabled={busy}
                  className="w-full"
                  inputClassName="w-full"
                  aria-describedby="guest-help guest-error"
                />
                <Button
                  type="submit"
                  label="Zugang öffnen"
                  icon="pi pi-unlock"
                  loading={busy}
                  disabled={!password}
                />
              </form>
              <p className="text-sm muted line-height-3 mb-0">
                Der Zugang bleibt auf diesem Gerät bis zu acht Stunden geöffnet.
                Auf gemeinsam genutzten Geräten bitte anschließend abmelden.
              </p>
            </div>
          )}
          <p
            id="guest-error"
            role="alert"
            className="text-red-700 line-height-3"
          >
            {error}
          </p>
          {galleryError && (
            <p role="alert" className="text-red-700">
              {galleryError}
            </p>
          )}
        </div>
      </section>
      {expiresAt && (
        <>
          <Gallery photos={photos} />
          <UploadSection
            requestUrl={requestUrl}
            loading={requestLoading}
            error={requestError}
          />
        </>
      )}
    </div>
  )
}
