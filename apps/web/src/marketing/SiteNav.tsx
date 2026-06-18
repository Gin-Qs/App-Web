import { useState } from 'react'
import { Link } from 'react-router-dom'
import { List, X } from '@phosphor-icons/react'
import { ThemeToggle } from '../components/ThemeToggle'

const LINKS = [
  { label: 'Servicios', href: '/#servicios' },
  { label: 'Tecnología', href: '/tecnologia' },
  { label: 'Soporte', href: '/soporte' },
  { label: 'Nosotros', href: '/#nosotros' },
]

export function SiteNav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="site-nav">
      <Link to="/" className="brand" onClick={() => setOpen(false)}>
        Fleet<span>er</span>
      </Link>

      <nav className={`site-nav-links${open ? ' open' : ''}`}>
        {LINKS.map((l) =>
          l.href.startsWith('/#') ? (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ) : (
            <Link key={l.label} to={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ),
        )}
        <Link className="btn btn-primary nav-cta" to="/login" onClick={() => setOpen(false)}>
          Iniciar sesión
        </Link>
      </nav>

      <div className="site-nav-actions">
        <ThemeToggle />
        <Link className="btn btn-primary nav-cta-desktop" to="/login">
          Iniciar sesión
        </Link>
        <button
          className="nav-burger"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <List size={22} />}
        </button>
      </div>
    </header>
  )
}
