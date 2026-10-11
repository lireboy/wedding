import Header from './components/Header'
import Footer from './components/Footer'
import GuestArea from './components/GuestArea'
import PhotoPlaceholder from './components/PhotoPlaceholder'
import { wedding } from './data/wedding'

export default function App() {
  return (
    <div className="min-h-screen">
      <a href="#inhalt" className="skip-link">
        Zum Inhalt springen
      </a>
      <Header />
      <main id="inhalt" tabIndex={-1}>
        <section
          id="start"
          aria-labelledby="hero-title"
          className="px-4 md:px-6 pt-5 pb-6"
        >
          <div className="page-width mx-auto grid align-items-center">
            <div className="col-12 lg:col-6 py-5 lg:pr-6">
              <p className="eyebrow flex align-items-center gap-2">
                <span className="little-line" /> EIN TAG. SO VIELE ERINNERUNGEN.
              </p>
              <h1 id="hero-title" className="hero-title my-4">
                Unser Ja.
                <br />
                Unser <em>Für immer.</em>
              </h1>
              <p className="text-xl mb-2">{wedding.names}</p>
              <p className="muted line-height-3 mb-5 max-w-25rem">
                Ein Ort für all die kleinen und großen Momente unserer Hochzeit.
                Und für die Menschen, die sie besonders gemacht haben.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#unser-tag" className="p-button no-underline gap-2">
                  Unseren Tag entdecken{' '}
                  <i className="pi pi-arrow-down text-sm" aria-hidden="true" />
                </a>
                <a
                  href="#gaestebereich"
                  className="p-button p-button-outlined no-underline gap-2"
                >
                  <i className="pi pi-upload" />
                  Erinnerungen teilen
                </a>
              </div>
              <div className="flex flex-wrap align-items-center gap-3 mt-6 text-sm muted">
                <i className="pi pi-heart" aria-hidden="true" />
                <span>{wedding.date}</span>
                <span aria-hidden="true">·</span>
                <span>{wedding.location}</span>
              </div>
            </div>
            <div className="col-12 lg:col-6 relative p-3 md:p-5">
              <PhotoPlaceholder
                variant="hero"
                label="Euer Lieblingsfoto"
                detail="Hier beginnt eure Geschichte in Bildern."
              />
              <div className="photo-note absolute bottom-0 right-0 px-4 py-3 shadow-2">
                <span className="editorial text-2xl">Ein kleines Ja.</span>
                <br />
                <span className="text-sm muted">Ein ganz großes Glück.</span>
              </div>
            </div>
          </div>
        </section>
        <div className="sage-band px-4 py-4 text-center">
          <p className="m-0 editorial text-xl md:text-2xl">
            Das Schönste an diesem Tag? <em>Dass ihr dabei wart.</em>
          </p>
        </div>
        <section
          id="unsere-geschichte"
          aria-labelledby="story-title"
          className="section-space px-4 md:px-6"
        >
          <div className="page-width mx-auto">
            <div className="grid align-items-center mb-5">
              <div className="col-12 md:col-6">
                <p className="eyebrow">01 / WIR ZWEI</p>
                <h2 id="story-title" className="section-title mt-3 mb-3">
                  Wie aus zwei
                  <br />
                  <em>ein Wir wurde.</em>
                </h2>
              </div>
            </div>
            <div className="grid">
              {wedding.story.map((item, index) => (
                <article key={item.title} className="col-12 md:col-4">
                  <div className="h-full surface-card border-round-xl p-4 md:p-5">
                    <span className="editorial text-4xl accent">
                      0{index + 1}
                    </span>
                    <h3 className="editorial text-2xl font-normal mb-3">
                      {item.title}
                    </h3>
                    <p className="muted line-height-3 m-0">{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          id="unser-tag"
          aria-labelledby="day-title"
          className="section-space rose-section px-4 md:px-6"
        >
          <div className="page-width mx-auto">
            <div className="text-center mb-6">
              <p className="eyebrow">02 / NOCH EINMAL ZURÜCK</p>
              <h2 id="day-title" className="section-title mt-3 mb-3">
                Ein Tag fürs <em>Herz.</em>
              </h2>
              <p className="muted line-height-3">
                Vom ersten aufgeregten Lächeln bis zum letzten Tanz.
              </p>
              <span className="draft-label">
                Beispielablauf · mit euren Momenten füllen
              </span>
            </div>
            <div className="grid align-items-center">
              <div className="col-12 md:col-5 md:pr-5">
                <PhotoPlaceholder
                  variant="portrait"
                  label="Ein Moment, der bleibt"
                  detail="Platz für ein Foto von eurem Tag"
                />
              </div>
              <div className="col-12 md:col-7 pt-5 md:pt-0">
                <ol className="list-none p-0 m-0">
                  {wedding.day.map((item, index) => (
                    <li key={item.title} className="flex gap-4">
                      <div className="flex flex-column align-items-center">
                        <span className="timeline-dot flex align-items-center justify-content-center flex-shrink-0">
                          <i className={`pi ${item.icon}`} aria-hidden="true" />
                        </span>
                        {index < wedding.day.length - 1 && (
                          <span className="timeline-line flex-1" />
                        )}
                      </div>
                      <div className="pb-5">
                        <span className="eyebrow">MOMENT 0{index + 1}</span>
                        <h3 className="editorial text-2xl font-normal mt-2 mb-2">
                          {item.title}
                        </h3>
                        <p className="muted line-height-3 m-0">{item.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>
        <GuestArea />
      </main>
      <Footer />
    </div>
  )
}
