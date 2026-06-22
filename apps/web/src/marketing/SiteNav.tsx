import { useState } from 'react'
import { Link } from 'react-router-dom'
import { List, X, MagnifyingGlass } from '@phosphor-icons/react'
import { ThemeToggle } from '../components/ThemeToggle'

const LINKS = [
  { label: 'Servicios', to: '/servicios' },
  { label: 'Tecnología', to: '/tecnologia' },
  { label: 'Soporte', to: '/soporte' },
  { label: 'Nosotros', to: '/nosotros' },
]

export function SiteNav() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return (
    <header className="site-nav">
      <Link to="/" className="brand" onClick={close}>
        Fleet<span>er</span>
      </Link>

      <nav className={`site-nav-links${open ? ' open' : ''}`}>
        {LINKS.map((l) => (
          <Link key={l.label} to={l.to} onClick={close}>
            {l.label}
          </Link>
        ))}
        <Link className="btn btn-outline nav-cta" to="/rastreo" onClick={close}>
          Rastrear guía
        </Link>
        <Link className="btn btn-primary nav-cta" to="/login" onClick={close}>
          Iniciar sesión
        </Link>
      </nav>

      <div className="site-nav-actions">
        <ThemeToggle />
        <Link className="btn btn-outline btn-sm nav-track-desktop" to="/rastreo">
          <MagnifyingGlass size={16} weight="bold" /> Rastrear guía
        </Link>
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
