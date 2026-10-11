// Accept only actual Dropbox request URLs, never arbitrary redirect targets.
export function fileRequestUrl(value: string | undefined): string | null {
  if (!value) return null
  try {
    const url = new URL(value.trim())
    if (
      url.protocol !== 'https:' ||
      !['www.dropbox.com', 'dropbox.com'].includes(url.hostname) ||
      url.username ||
      url.password ||
      url.port ||
      !/^\/request\/[a-zA-Z0-9]+\/?$/.test(url.pathname)
    )
      return null
    url.hash = ''
    return url.toString()
  } catch {
    return null
  }
}
