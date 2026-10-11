import { Button } from 'primereact/button'

type Props = { requestUrl: string | null; loading: boolean; error: string }

export default function UploadSection({ requestUrl, loading, error }: Props) {
  return (
    <section
      id="erinnerungen-teilen"
      aria-labelledby="upload-title"
      className="section-space sage-section px-4 md:px-6"
    >
      <div className="page-width mx-auto grid align-items-center">
        <div className="col-12 lg:col-5 lg:pr-6 mb-4 lg:mb-0">
          <p className="eyebrow">04 / EUER BLICK AUF UNSEREN TAG</p>
          <h2 id="upload-title" className="section-title mt-3 mb-4">
            Die schönsten Bilder?
            <br />
            <em>Vielleicht auf eurem Handy.</em>
          </h2>
          <p className="muted line-height-3">
            Die spontane Umarmung, das Lachen am Tisch oder der Tanz spät in der
            Nacht: Teilt eure Fotos und Videos mit uns und helft uns, diese
            Momente festzuhalten.
          </p>
          <div className="flex align-items-start gap-3 mt-5">
            <i className="pi pi-heart text-2xl accent" aria-hidden="true" />
            <p className="muted line-height-3 m-0 text-sm">
              Eure Aufnahmen sammeln wir zunächst für uns. Sie erscheinen nicht
              automatisch in der Galerie.
            </p>
          </div>
        </div>
        <div className="col-12 lg:col-7">
          <div className="surface-card border-round-xl p-4 md:p-5">
            <i className="pi pi-images text-4xl accent" aria-hidden="true" />
            <h3 className="editorial text-2xl font-normal mt-4">
              Eure Erinnerungen für uns
            </h3>
            <p className="muted line-height-3">
              Über unsere Dropbox-Dateianfrage könnt ihr Fotos und Videos direkt
              an uns senden. Ihr braucht dafür kein eigenes Dropbox-Konto.
            </p>
            <ol className="pl-3 line-height-3 flex flex-column gap-2 mb-4">
              <li>Unsere Dateianfrage bei Dropbox öffnen.</li>
              <li>
                Falls abgefragt, das von uns mitgeteilte Dropbox-Passwort
                eingeben.
              </li>
              <li>Fotos und Videos auswählen und bei Dropbox absenden.</li>
            </ol>
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
                label={
                  loading
                    ? 'Dateianfrage wird geladen …'
                    : 'Dateianfrage noch nicht verfügbar'
                }
                icon="pi pi-lock"
                disabled
              />
            )}
            <p
              id="dropbox-info"
              className="text-sm muted line-height-3 mt-3 mb-0"
            >
              Öffnet Dropbox in einem neuen Tab. Dateiauswahl und Übertragung
              finden dort statt.
            </p>
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
