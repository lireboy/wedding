import Header from './components/Header'
import Footer from './components/Footer'
import GuestArea from './components/GuestArea'
import WeddingDay from './components/WeddingDay'
import { wedding } from './data/wedding'
import './App.css'

import { Analytics } from '@vercel/analytics/react';

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
                  className="p-button no-underline gap-2"
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
              <img src={wedding.heroImage} alt="Euer Lieblingsfoto" className="torbogen w-full h-full object-cover" />
            </div>
          </div>
        </section>
        <div className="sage-band px-4 py-4 text-center">
          <p className="m-0 editorial text-xl md:text-2xl">
            Das Schönste an diesem Tag? <em>Dass ihr dabei wart.</em>
          </p>
        </div>
        <WeddingDay />
        <GuestArea />
      </main>
      <Footer />
      <Analytics />
    </div>
  )
}
