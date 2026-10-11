import { useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import PhotoPlaceholder from './PhotoPlaceholder'

type Photo = {
  id: number | string
  title: string
  category: string
  variant: string
  src: string
}

export default function Gallery({ photos }: { photos: Photo[] }) {
  const [category, setCategory] = useState('Alle')
  const [selected, setSelected] = useState<number | string | null>(null)
  const filtered = photos.filter(
    (photo) => category === 'Alle' || photo.category === category,
  )
  const photo = filtered.find((item) => item.id === selected)
  const move = (direction: number) => {
    const index = filtered.findIndex((item) => item.id === selected)
    setSelected(
      filtered[(index + direction + filtered.length) % filtered.length].id,
    )
  }
  return (
    <section
      id="lieblingsmomente"
      aria-labelledby="gallery-title"
      className="section-space px-4 md:px-6"
    >
      <div className="page-width mx-auto">
        <div className="flex flex-column md:flex-row md:align-items-end justify-content-between gap-4 mb-5">
          <div>
            <p className="eyebrow">03 / FÜR IMMER FESTGEHALTEN</p>
            <h2 id="gallery-title" className="section-title mt-3 mb-0">
              Unsere <em>Lieblingsmomente.</em>
            </h2>
          </div>
        </div>
        <div
          className="flex flex-wrap gap-2 mb-4"
          role="group"
          aria-label="Fotokategorie"
        >
          {['Alle', ...new Set(photos.map((photo) => photo.category))].map(
            (item) => (
              <Button
                key={item}
                label={item}
                rounded
                outlined={category !== item}
                size="small"
                aria-pressed={category === item}
                onClick={() => {
                  setCategory(item)
                  setSelected(null)
                }}
              />
            ),
          )}
        </div>
        <p className="text-sm muted mb-4" aria-live="polite">
          {filtered.length} Momente
        </p>
        <div className="grid">
          {filtered.map((item) => (
            <div key={item.id} className="col-12 sm:col-6 lg:col-4">
              <button
                type="button"
                className="gallery-card w-full p-0 border-none text-left cursor-pointer"
                onClick={() => setSelected(item.id)}
                aria-label={`${item.title} – große Ansicht öffnen`}
              >
                <div className="gallery-photo">
                  {item.src ? (
                    <img
                      className="media-cover w-full h-full"
                      src={item.src}
                      alt={item.title}
                      loading="lazy"
                    />
                  ) : (
                    <PhotoPlaceholder
                      label={item.title ?? 'Foto'}
                      variant={item.variant}
                    />
                  )}
                </div>
                <span className="flex align-items-center justify-content-between gap-2 py-3">
                  <span>
                    <span className="eyebrow block mb-2">{item.category}</span>
                    <span className="editorial text-xl">{item.title}</span>
                  </span>
                  <i
                    className="pi pi-arrow-up-right muted"
                    aria-hidden="true"
                  />
                </span>
              </button>
            </div>
          ))}
        </div>
        <Dialog
          header={photo?.title}
          visible={!!photo}
          onHide={() => setSelected(null)}
          className="w-11 md:w-8 lg:w-6"
          modal
          dismissableMask
          draggable={false}
        >
          {photo && (
            <>
              <div className="gallery-detail">
                {photo.src ? (
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="w-full h-full media-contain"
                  />
                ) : (
                  <PhotoPlaceholder
                    label={photo.title}
                    variant={photo.variant}
                    detail="Hier wird später euer echtes Foto angezeigt."
                  />
                )}
              </div>
              <div className="flex align-items-center justify-content-between mt-3">
                <Button
                  icon="pi pi-arrow-left"
                  text
                  aria-label="Vorheriges Foto"
                  onClick={() => move(-1)}
                />
                <span className="muted text-sm" aria-live="polite">
                  {filtered.findIndex((item) => item.id === selected) + 1} /{' '}
                  {filtered.length}
                </span>
                <Button
                  icon="pi pi-arrow-right"
                  text
                  aria-label="Nächstes Foto"
                  onClick={() => move(1)}
                />
              </div>
            </>
          )}
        </Dialog>
      </div>
    </section>
  )
}
