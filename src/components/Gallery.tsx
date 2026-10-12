import { useState } from 'react'
import {
  ArrowDownLeftAndArrowUpRightToCenter,
  ArrowsH,
  ArrowsV,
  ArrowUpRightAndArrowDownLeftFromCenter,
  ChevronLeft,
  ChevronRight,
  Download,
  Refresh,
  Replay,
  SearchMinus,
  SearchPlus,
} from '@primeicons/react'
import { Button } from '@primereact/ui/button'
import { Gallery as PrimeGallery } from '@primereact/ui/gallery'
import { Toolbar } from '@primereact/ui/toolbar'

type GalleryPhoto = {
  category: string
  src: string
}

const imageModules = import.meta.glob<string>(
  '../assets/gallery/*/*.webp',
  {
    eager: true,
    query: '?url',
    import: 'default',
  },
)

const categoryLabel = (folder: string) =>
  folder.charAt(0).toLocaleUpperCase('de') + folder.slice(1)

const photos: GalleryPhoto[] = Object.entries(imageModules)
  .sort(([pathA], [pathB]) =>
    pathA.localeCompare(pathB, 'de', { numeric: true }),
  )
  .map(([path, src]) => {
    const folder = path.split('/').at(-2) || 'weitere'

    return {
      category: categoryLabel(folder),
      src,
    }
  })

const categories = ['Alle', ...new Set(photos.map((photo) => photo.category))]

export default function Gallery() {
  const [category, setCategory] = useState('Alle')
  const filtered = photos.filter(
    (photo) => category === 'Alle' || photo.category === category,
  )

  const selectCategory = (nextCategory: string) => {
    setCategory(nextCategory)
  }

  return (
    <section
      id="lieblingsmomente"
      aria-labelledby="gallery-title"
      className="section-space px-4 md:px-6"
    >
      <div className="page-width mx-auto">
        <h2 id="gallery-title" className="section-title mt-3 mb-5">
          Unsere <em>Lieblingsmomente.</em>
        </h2>

        <Toolbar.Root className="gallery-toolbar mb-4 bg-transparent border-none p-0">
          <Toolbar.Start>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Fotokategorie"
            >
              {categories.map((item) => (
                <Button
                  key={item}
                  className={category === item ? 'gallery-filter-active' : ''}
                  aria-pressed={category === item}
                  onClick={() => selectCategory(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </Toolbar.Start>
          <Toolbar.End className="flex flex-nowrap gap-4">
            <a className="p-button no-underline gap-2" href='https://www.dropbox.com/scl/fo/21va46lroqokv2f9ah1pg/ANLOWRXApLYbhtDpkvu9bz0?rlkey=16zn8a5vi0qvy487791fauvxr&st=wcktcuo2&dl=0' target='_blank' rel='noopener noreferrer'>
              <i className="pi pi-cloud-download" />
              Bilder herunterladen (Dropbox)
            </a>
            <span className="text-sm muted" aria-live="polite">
              {filtered.length} Bilder
            </span>
          </Toolbar.End>
        </Toolbar.Root>

        <PrimeGallery.Root
          key={category}
          className="w-full wedding-gallery"
        >
          <PrimeGallery.Backdrop />
          <PrimeGallery.Prev aria-label="Vorheriges Bild">
            <ChevronLeft />
          </PrimeGallery.Prev>
          <PrimeGallery.Next aria-label="Nächstes Bild">
            <ChevronRight />
          </PrimeGallery.Next>

          <PrimeGallery.Header className="justify-content-end gap-1">
            <PrimeGallery.RotateLeft aria-label="Nach links drehen" title="Nach links drehen">
              <Replay />
            </PrimeGallery.RotateLeft>
            <PrimeGallery.RotateRight aria-label="Nach rechts drehen" title="Nach rechts drehen">
              <Refresh />
            </PrimeGallery.RotateRight>
            <PrimeGallery.ZoomIn aria-label="Vergrößern" title="Vergrößern">
              <SearchPlus />
            </PrimeGallery.ZoomIn>
            <PrimeGallery.ZoomOut aria-label="Verkleinern" title="Verkleinern">
              <SearchMinus />
            </PrimeGallery.ZoomOut>
            <PrimeGallery.FlipX aria-label="Horizontal spiegeln" title="Horizontal spiegeln">
              <ArrowsH />
            </PrimeGallery.FlipX>
            <PrimeGallery.FlipY aria-label="Vertikal spiegeln" title="Vertikal spiegeln">
              <ArrowsV />
            </PrimeGallery.FlipY>
            <PrimeGallery.Download aria-label="Bild herunterladen" title="Bild herunterladen">
              <Download />
            </PrimeGallery.Download>
            <PrimeGallery.FullScreen
              className="gallery-fullscreen-toggle"
              aria-label="Vollbild umschalten"
              title="Vollbild umschalten"
            >
              <ArrowUpRightAndArrowDownLeftFromCenter className="gallery-expand-icon" />
              <ArrowDownLeftAndArrowUpRightToCenter className="gallery-compress-icon" />
            </PrimeGallery.FullScreen>
          </PrimeGallery.Header>

          <PrimeGallery.Content>
            {filtered.map((photo) => (
              <PrimeGallery.Item key={photo.src}>
                <img
                  src={photo.src}
                  alt={`Hochzeitsfoto aus der Kategorie ${photo.category}`}
                  className="gallery-main-image"
                  draggable={false}
                />
              </PrimeGallery.Item>
            ))}
          </PrimeGallery.Content>

          <PrimeGallery.Footer>
            <PrimeGallery.Thumbnail>
              <PrimeGallery.ThumbnailContent>
                {filtered.map((photo, index) => (
                  <PrimeGallery.ThumbnailItem key={photo.src} index={index}>
                    <img
                      src={photo.src}
                      alt=""
                      className="gallery-thumbnail-image w-full h-full media-cover"
                      draggable={false}
                    />
                  </PrimeGallery.ThumbnailItem>
                ))}
              </PrimeGallery.ThumbnailContent>
            </PrimeGallery.Thumbnail>
          </PrimeGallery.Footer>
        </PrimeGallery.Root>
      </div>
    </section>
  )
}
