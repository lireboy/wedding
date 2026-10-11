import { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { navigation } from '../data/wedding'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('start')
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin: '-15% 0px -60% 0px', threshold: 0 },
    )
    navigation.forEach(({ id }) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })
    return () => observer.disconnect()
  }, [])
  return (
    <header className="site-header sticky top-0 z-5 border-bottom-1 surface-border px-4 md:px-6">
      <div className="page-width mx-auto flex align-items-center justify-content-between gap-3 py-3">
        <a
          href="#start"
          onClick={() => setOpen(false)}
          className="brand no-underline flex align-items-center gap-2"
        >
          <i className="pi pi-heart text-sm" aria-hidden="true" />
          <span>
            Unser <em>Ja.</em>
          </span>
        </a>
        <nav
          aria-label="Hauptnavigation"
          className="hidden lg:flex align-items-center gap-4"
        >
          {navigation
            .filter((item) => item.id !== 'gaestebereich')
            .map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={active === item.id ? 'location' : undefined}
                className="nav-link no-underline text-sm py-2"
              >
                {item.label}
              </a>
            ))}
          <a
            href="#gaestebereich"
            aria-current={active === 'gaestebereich' ? 'location' : undefined}
            className="p-button p-button-sm no-underline gap-2"
          >
            <i className="pi pi-lock" aria-hidden="true" />
            Gästezugang
          </a>
        </nav>
        <Button
          id="navigation-toggle"
          className="lg:hidden"
          text
          rounded
          icon={open ? 'pi pi-times' : 'pi pi-bars'}
          aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        />
      </div>
      <nav
        id="mobile-navigation"
        aria-label="Mobile Hauptnavigation"
        hidden={!open}
        className="lg:hidden pb-3"
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setOpen(false)
            document.getElementById('navigation-toggle')?.focus()
          }
        }}
      >
        {navigation.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => setOpen(false)}
            aria-current={active === item.id ? 'location' : undefined}
            className="nav-link block no-underline py-3"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
