import { Button } from '@primereact/ui/button'

type Props = { requestUrl: string | null; loading: boolean; error: string }

export default function UploadSection({ requestUrl, loading, error }: Props) {
  return (
    <section
      id="erinnerungen-teilen"
      aria-labelledby="upload-title"
      className="sage-section py-6"
    >
      <div className="page-width mx-auto grid align-items-center">
        <div className="col-12">
          <div className="surface-card border-round-xl p-4 md:p-5">
            <i className="pi pi-images text-4xl accent" aria-hidden="true" />
            <h3 className="editorial text-2xl font-normal mt-4">
              Eure Erinnerungen für uns
            </h3>
            <p className="muted line-height-3">
              Über unsere Dropbox-Dateianfrage könnt ihr Fotos und Videos direkt
              an uns senden. Ihr braucht dafür kein eigenes Dropbox-Konto. Wir gehen die Bilder durch und werden sie in unsere Sammlung aufnehmen.<br /><br /> Falls ihr wollt, dass wir bestimmte Bilder nicht verwenden, schreibt uns bitte eine kurze Nachricht.
            </p>
            {requestUrl ? (
              <a
                href={requestUrl}
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="no-referrer"
                className="p-button no-underline gap-2"
                aria-describedby="dropbox-info"
              >
                <i className="pi pi-external-link" aria-hidden="true" />
                Fotos & Videos bei Dropbox teilen
              </a>
            ) : (
              <Button
                disabled
              >
                <i className="pi pi-lock" aria-hidden="true" />
                {loading
                  ? 'Dateianfrage wird geladen …'
                  : 'Dateianfrage noch nicht verfügbar'}
              </Button>
            )}
            {error && (
              <p role="alert" className="text-red-700 line-height-3 mb-0">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
