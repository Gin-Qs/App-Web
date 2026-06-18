import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  NavigationArrow,
  ChatCircleDots,
  Receipt,
  ShieldCheck,
  Snowflake,
  ChartLineUp,
  ArrowRight,
} from '@phosphor-icons/react'
import { ThemeToggle } from '../components/ThemeToggle'
import { TrackingPreview } from '../components/TrackingPreview'

const VALUE_PROPS = [
  {
    icon: NavigationArrow,
    title: 'Trazabilidad en tiempo real',
    body: 'GPS con link compartible: ves tu carga en todo momento, con histórico de ruta y ETA.',
    featured: true,
  },
  {
    icon: ChatCircleDots,
    title: 'Comunicación proactiva',
    body: '7 puntos de contacto por viaje. Nunca tienes que preguntar dónde va tu mercancía.',
  },
  {
    icon: Receipt,
    title: 'Facturación completa',
    body: 'CFDI más Carta Porte dentro de 24 horas. 100% deducible.',
  },
  {
    icon: ShieldCheck,
    title: 'Seguridad documentada',
    body: 'GPS, candados satelitales, botón de pánico y seguros completos.',
  },
  {
    icon: Snowflake,
    title: 'Cadena de frío',
    body: 'Monitoreo de temperatura en vivo para productos perecederos.',
  },
  {
    icon: ChartLineUp,
    title: 'Reportes mensuales',
    body: 'Métricas de cumplimiento reales para tus registros y decisiones.',
  },
]

const STATS = [
  { big: '7', label: 'Puntos de contacto por viaje' },
  { big: '24 h', label: 'Facturación CFDI y Carta Porte' },
  { big: '24/7', label: 'Monitoreo de flota' },
  { big: 'GPS', label: 'Rastreo en vivo de cada viaje' },
]

export function LandingPage() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="landing">
      <header className="top-nav">
        <div className="brand">
          Fleet<span>er</span>
        </div>
        <nav>
          <ThemeToggle />
          <a className="btn btn-ghost" href="#contacto">
            Solicitar información
          </a>
          <Link className="btn btn-primary" to="/login">
            Iniciar sesión
          </Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy reveal-group">
            <span className="eyebrow">Rastreo GPS en vivo</span>
            <h1>Tu carga, visible en tiempo real.</h1>
            <p>
              Transporte de carga profesional con tecnología. Sabes dónde está tu mercancía en todo
              momento y facturamos al día.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary btn-lg" to="/login">
                Iniciar sesión <ArrowRight weight="bold" size={18} />
              </Link>
              <a className="btn btn-outline btn-lg" href="#contacto">
                Solicitar información
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <TrackingPreview />
          </div>
        </div>
      </section>

      <div className="stat-strip reveal">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="big">{s.big}</div>
            <div className="lbl">{s.label}</div>
          </div>
        ))}
      </div>

      <section className="section" id="nosotros">
        <h2>Quiénes somos</h2>
        <p className="lead">
          En México, la mayoría del transporte de carga opera sin factura, sin seguro y sin
          visibilidad. Fleeter cambia eso. Somos una empresa de tecnología que mueve carga:
          trazabilidad en tiempo real, comunicación proactiva y formalidad fiscal en cada viaje.
        </p>
        <p className="pull-quote">No somos el más barato; somos el que no te deja colgado.</p>
      </section>

      <section className="section" id="servicios">
        <h2>Lo que entregamos en cada viaje</h2>
        <div className="bento">
          {VALUE_PROPS.map(({ icon: Icon, title, body, featured }) => (
            <article key={title} className={`bento-tile${featured ? ' bento-feature' : ''}`}>
              <span className="bento-icon">
                <Icon size={featured ? 28 : 24} weight="duotone" />
              </span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="contacto">
        <div className="contact-grid">
          <div>
            <h2>Solicitar información</h2>
            <p className="lead">
              ¿Nuevo cliente? Cuéntanos qué necesitas mover y te contactamos el mismo día.
            </p>
          </div>
          {sent ? (
            <div className="notice success">
              ¡Gracias! Recibimos tu solicitud y te contactamos pronto.
            </div>
          ) : (
            <form className="card form" onSubmit={handleSubmit}>
              <label>
                Empresa
                <input type="text" placeholder="Nombre de tu empresa" required />
              </label>
              <label>
                Correo de trabajo
                <input type="email" placeholder="nombre@empresa.com" required />
              </label>
              <label>
                Mensaje
                <textarea rows={4} placeholder="¿Qué necesitas mover y a dónde?" />
              </label>
              <button type="submit" className="btn btn-primary">
                Enviar solicitud
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Fleeter Soluciones Logísticas S.A. de C.V.</span>
        <Link to="/login">Iniciar sesión</Link>
      </footer>
    </div>
  )
}
