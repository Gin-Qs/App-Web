import { Link } from 'react-router-dom'
import {
  NavigationArrow,
  ThermometerSimple,
  Receipt,
  ShieldCheck,
  ChartLineUp,
  DeviceMobile,
  ArrowRight,
  Check,
} from '@phosphor-icons/react'
import { SiteNav } from '../marketing/SiteNav'
import { SiteFooter } from '../marketing/SiteFooter'
import { TrackingPreview } from '../components/TrackingPreview'
import { PHOTOS } from '../marketing/media'

const CAPS = [
  { icon: NavigationArrow, title: 'Rastreo GPS en vivo', body: 'Posición de cada unidad en tiempo real, con ruta, velocidad y ETA. Link compartible para tu equipo.' },
  { icon: ThermometerSimple, title: 'Telemetría y cadena de frío', body: 'Monitoreo de temperatura en vivo para perecederos, con alertas si algo se sale de rango.' },
  { icon: DeviceMobile, title: 'Panel para cliente y operación', body: 'La misma plataforma para ti y para nosotros: viajes, mapa, facturas y crédito en un solo lugar.' },
  { icon: Receipt, title: 'Facturación automatizada', body: 'CFDI y Carta Porte generados en 24 horas, listos para deducir.' },
  { icon: ShieldCheck, title: 'Seguridad documentada', body: 'GPS, candados satelitales y botón de pánico. Seguro de carga opcional según tu necesidad.' },
  { icon: ChartLineUp, title: 'Datos y reportes', body: 'Métricas de cumplimiento y reportes mensuales con información real de tus envíos.' },
]

export function TechnologyPage() {
  return (
    <div className="landing">
      <SiteNav />

      <section className="hero hero-page">
        <div className="hero-grid">
          <div className="hero-copy reveal-group">
            <span className="eyebrow">Tecnología</span>
            <h1>La plataforma que mueve tu carga.</h1>
            <p>
              Fleeter es una empresa de tecnología que opera transporte. Telemetría, automatización y
              datos en cada viaje, para que tengas visibilidad total y cero sorpresas.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary btn-lg" to="/login">
                Iniciar sesión <ArrowRight weight="bold" size={18} />
              </Link>
              <a className="btn btn-outline btn-lg" href="/#contacto">
                Solicitar demo
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <TrackingPreview />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Todo en una sola plataforma</h2>
          <p className="lead">Lo que tu equipo necesita para mover carga con confianza y cumplimiento.</p>
        </div>
        <div className="bento">
          {CAPS.map(({ icon: Icon, title, body }, i) => (
            <article key={title} className={`bento-tile${i === 0 ? ' bento-feature' : ''}`}>
              <span className="bento-icon">
                <Icon size={i === 0 ? 28 : 24} weight="duotone" />
              </span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section feature-split">
        <div
          className="feature-media"
          style={{ backgroundImage: `var(--photo-scrim), url(${PHOTOS.warehouse})` }}
        >
          <div className="feature-badge">En vivo · GPS · LTE</div>
        </div>
        <div className="feature-text">
          <h2>Visibilidad de extremo a extremo</h2>
          <p>
            Desde que tu carga sale hasta que llega, todo queda registrado: posición, temperatura,
            tiempos y evidencia de entrega. Sin llamadas para preguntar dónde va.
          </p>
          <ul className="ticks">
            <li><Check weight="bold" /> Histórico completo de cada viaje</li>
            <li><Check weight="bold" /> Alertas proactivas ante cualquier cambio</li>
            <li><Check weight="bold" /> Integración con tu operación y tu contabilidad</li>
          </ul>
          <Link className="btn btn-primary" to="/soporte">
            Y siempre con soporte humano <ArrowRight weight="bold" size={16} />
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="cta-band">
          <h2>¿Listo para ver tu carga en tiempo real?</h2>
          <p>Te damos acceso y te mostramos la plataforma con tus propias rutas.</p>
          <div className="hero-actions">
            <a className="btn btn-primary btn-lg" href="/#contacto">Solicitar información</a>
            <Link className="btn btn-outline btn-lg" to="/login">Iniciar sesión</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
