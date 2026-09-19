import { wedding } from '../data/wedding'
export default function Footer() {
  return (
    <footer className="sage-band px-4 md:px-6 py-5">
      <div className="page-width mx-auto flex flex-column md:flex-row align-items-center justify-content-between gap-4 text-center">
        <a href="#start" className="brand no-underline">
          Unser <em>Ja.</em>
        </a>
        <p className="m-0 text-sm">
          {wedding.names} <span aria-hidden="true">·</span> Mit Liebe in
          Erinnerung behalten.
        </p>
        <a
          href="#start"
          className="nav-link no-underline text-sm flex align-items-center gap-2"
        >
          Zurück nach oben <i className="pi pi-arrow-up" aria-hidden="true" />
        </a>
      </div>
    </footer>
  )
}
