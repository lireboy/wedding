import { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'

type Preview = { id: string; file: File; url: string }
const maxFiles = 12
const maxSize = 100 * 1024 * 1024

export default function UploadSection() {
  const [files, setFiles] = useState<Preview[]>([])
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const urls = useRef(new Set<string>())
  useEffect(() => {
    const current = urls.current
    return () => {
      current.forEach((url) => URL.revokeObjectURL(url))
      current.clear()
    }
  }, [])
  function addFiles(incoming: FileList | null) {
    if (!incoming) return
    const next: Preview[] = []
    const errors: string[] = []
    for (const file of Array.from(incoming)) {
      if (
        ![
          'image/jpeg',
          'image/png',
          'image/webp',
          'video/mp4',
          'video/webm',
        ].includes(file.type)
      ) {
        errors.push(
          `${file.name}: Dieses Format wird in der Vorschau nicht unterstützt.`,
        )
        continue
      }
      if (file.size > maxSize) {
        errors.push(`${file.name}: größer als 100 MB.`)
        continue
      }
      if (files.length + next.length >= maxFiles) {
        errors.push('Maximal 12 Dateien pro Vorschau.')
        break
      }
      const id = `${file.name}-${file.size}-${file.lastModified}`
      if ([...files, ...next].some((item) => item.id === id)) continue
      const url = URL.createObjectURL(file)
      urls.current.add(url)
      next.push({ id, file, url })
    }
    setFiles((previous) => [...previous, ...next])
    setError(errors.join(' '))
  }
  function removeFile(id: string) {
    const item = files.find((file) => file.id === id)
    if (item) {
      URL.revokeObjectURL(item.url)
      urls.current.delete(item.url)
    }
    setFiles((previous) => previous.filter((file) => file.id !== id))
  }
  return (
    <section
      id="erinnerungen-teilen"
      aria-labelledby="upload-title"
      className="section-space sage-section px-4 md:px-6"
    >
      <div className="page-width mx-auto grid">
        <div className="col-12 lg:col-5 lg:pr-6 mb-4 lg:mb-0">
          <p className="eyebrow">04 / EUER BLICK AUF UNSEREN TAG</p>
          <h2 id="upload-title" className="section-title mt-3 mb-4">
            Die schönsten Bilder?
            <br />
            <em>Vielleicht auf eurem Handy.</em>
          </h2>
          <p className="muted line-height-3">
            Die spontane Umarmung, das Lachen am Tisch oder der Tanz spät in der
            Nacht: Hier entsteht ein Platz für eure Fotos und Videos.
          </p>
          <div className="flex gap-3 align-items-start mt-5">
            <i className="pi pi-qrcode text-2xl accent" aria-hidden="true" />
            <div>
              <h3 className="text-base mt-0 mb-2">Für unsere Hochzeitsgäste</h3>
              <p className="muted line-height-3 m-0 text-sm">
                Der Upload wird später über euren QR-Zugang freigeschaltet.
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 lg:col-7">
          <div className="surface-card border-round-xl p-4 md:p-5">
            <span className="draft-label">Lokale Vorschau</span>
            <h3 className="editorial text-2xl font-normal mt-3">
              Erinnerungen auswählen
            </h3>
            <p id="upload-help" className="muted line-height-3 text-sm">
              Du kannst die Dateiauswahl schon ausprobieren. Es wird nichts
              hochgeladen oder gespeichert. Beim Neuladen wird die Auswahl
              geleert.
            </p>
            <div
              className={`drop-zone border-1 border-dashed border-round-xl p-4 md:p-5 text-center ${dragging ? 'is-dragging' : ''}`}
              onDragOver={(event) => {
                event.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault()
                setDragging(false)
                addFiles(event.dataTransfer.files)
              }}
            >
              <i
                className="pi pi-cloud-upload text-4xl accent"
                aria-hidden="true"
              />
              <p className="mt-3 mb-2">Eure Momente finden hier ihren Platz.</p>
              <p className="text-sm muted mb-4">
                Dateien hierher ziehen oder auswählen
              </p>
              <input
                ref={input}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                className="hidden"
                aria-label="Fotos und Videos auswählen"
                onChange={(event) => {
                  addFiles(event.target.files)
                  event.target.value = ''
                }}
              />
              <Button
                label="Fotos & Videos auswählen"
                icon="pi pi-plus"
                outlined
                onClick={() => input.current?.click()}
                aria-describedby="upload-help upload-formats"
              />
              <p
                id="upload-formats"
                className="text-xs muted line-height-3 mb-0 mt-3"
              >
                JPG, PNG, WebP, MP4, WebM
                <br />
                Bis zu 12 Dateien · maximal 100 MB
              </p>
            </div>
            {error && (
              <div role="alert" className="mt-3">
                <Message
                  severity="warn"
                  text={error}
                  className="w-full justify-content-start"
                />
              </div>
            )}
            <p className="text-sm muted" aria-live="polite">
              {files.length
                ? `${files.length} Dateien ausgewählt · ${(files.reduce((sum, item) => sum + item.file.size, 0) / 1024 / 1024).toFixed(1)} MB · nur auf diesem Gerät`
                : 'Noch keine Dateien ausgewählt.'}
            </p>
            {files.length > 0 && (
              <ul className="list-none p-0 m-0 flex flex-column gap-3">
                {files.map((item) => (
                  <li
                    key={item.id}
                    className="border-1 surface-border border-round-lg p-3"
                  >
                    <div className="flex align-items-center gap-3">
                      <i
                        className={`pi ${item.file.type.startsWith('video/') ? 'pi-video' : 'pi-image'} accent`}
                        aria-hidden="true"
                      />
                      <span className="flex-1 min-w-0 overflow-hidden text-overflow-ellipsis white-space-nowrap text-sm">
                        {item.file.name}
                      </span>
                      <Button
                        icon="pi pi-times"
                        text
                        rounded
                        size="small"
                        aria-label={`${item.file.name} entfernen`}
                        onClick={() => removeFile(item.id)}
                      />
                    </div>
                    {item.file.type.startsWith('image/') ? (
                      <img
                        src={item.url}
                        alt={`Vorschau: ${item.file.name}`}
                        className="upload-preview w-full border-round mt-2"
                      />
                    ) : (
                      <video
                        src={item.url}
                        controls
                        preload="metadata"
                        className="upload-preview w-full border-round mt-2"
                      >
                        Dein Browser kann dieses Video nicht abspielen.
                      </video>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex align-items-center gap-2 mt-4 text-sm muted">
              <i className="pi pi-lock" aria-hidden="true" />
              <span>Das Hochladen ist noch nicht freigeschaltet.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
