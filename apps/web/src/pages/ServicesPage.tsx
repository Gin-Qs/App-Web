import { Link } from 'react-router-dom'
import {
  NavigationArrow,
  ChatCircleDots,
  Receipt,
  ShieldCheck,
  Wallet,
  ChartLineUp,
  Package,
  Plant,
  Basket,
  Buildings,
  ArrowRight,
  Check,
} from '@phosphor-icons/react'
import { SiteNav } from '../marketing/SiteNav'
import { SiteFooter } from '../marketing/SiteFooter'
import { TrackingPreview } from '../components/TrackingPreview'
import { PHOTOS } from '../marketing/media'

const SERVICES = [
  {
    icon: NavigationArrow,
    title: 'Rastreo en tiempo real',
    body: 'GPS con link compartible: ves tu carga en todo momento, con histórico de ruta y ETA.',
    featured: true,
  },
  { icon: ChatCircleDots, title: 'Comunicación proactiva', body: '7 puntos de contacto por viaje. Nunca preguntas dónde va tu mercancía.' },
  { icon: Receipt, title: 'Facturación completa', body: 'CFDI más Carta Porte dentro de 24 horas. 100% deducible, sin perseguirnos.' },
  { icon: ShieldCheck, title: 'Seguridad documentada', body: 'GPS, candados satelitales y botón de pánico. Seguro de carga opcional según tu necesidad.' },
  { icon: Wallet, title: 'Crédito y estado de cuenta', body: 'Línea de crédito y todas tus facturas, siempre visibles en tu panel.' },
  { icon: ChartLineUp, title: 'Reportes mensuales', body: 'Métricas de cumplimiento reales para tus registros y decisiones.' },
]

const SECTORS = [
  { icon: Package, title: 'Carga general', body: 'Mercancía paletizada y suelta para productores, distribuidores y comercios.' },
  { icon: Plant, title: 'Perecederos', body: 'Planeamos cada ruta para entregar a tiempo lo que no puede esperar.' },
  { icon: Basket, title: 'Abarrotes', body: 'Reabasto constante y confiable para tu cadena de distribución.' },
  { icon: Buildings, title: 'Empresas (próximamente)', body: 'Estamos formalizando soluciones a la medida para volúmenes mayores.' },
]

export function ServicesPage() {
  return (
    <div className="landing">
      <SiteNav />

      <section className="hero hero-page">
        <div className="hero-grid">
          <div className="hero-copy reveal-group">
            <span className="eyebrow">Servicios</span>
            <h1>Todo lo que tu carga necesita.</h1>
            <p>
              Movemos tu carga por México, incluidos perecederos y abarrotes, con visibilidad en
              tiempo real, facturación al día y soporte humano en cada viaje.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary btn-lg" href="/#contacto">
                Solicitar cotización <ArrowRight weight="bold" size={18} />
              </a>
              <Link className="btn btn-outline btn-lg" to="/login">
                Iniciar sesión
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <TrackingPreview />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Lo que entregamos en cada viaje</h2>
          <p className="lead">No es solo mover una caja de un punto a otro. Es saber dónde está, llegar a tiempo y dejar todo en regla.</p>
        </div>
        <div className="bento">
          {SERVICES.map(({ icon: Icon, title, body, featured }) => (
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

      <section className="section feature-split">
        <div
          className="feature-media"
          style={{ backgroundImage: `var(--photo-scrim), url(${PHOTOS.warehouse})` }}
        >
          <div className="feature-card-float"><TrackingPreview /></div>
        </div>
        <div className="feature-text">
          <h2>Visibilidad de extremo a extremo</h2>
          <p>
            Desde que tu carga sale hasta que llega, todo queda registrado: posición, ruta, tiempos
            y evidencia de entrega. Sin llamadas para preguntar dónde va.
          </p>
          <ul className="ticks">
            <li><Check weight="bold" /> Ubicación en vivo y ETA en tu panel</li>
            <li><Check weight="bold" /> Histórico de ruta de cada viaje</li>
            <li><Check weight="bold" /> Evidencia de entrega: foto y estatus</li>
          </ul>
          <Link className="btn btn-primary" to="/tecnologia">
            Ver la tecnología <ArrowRight weight="bold" size={16} />
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Sectores que movemos</h2>
          <p className="lead">Nos enfocamos en quienes mueven carga todos los días y no pueden fallar.</p>
        </div>
        <div className="values values-2">
          {SECTORS.map(({ icon: Icon, title, body }) => (
            <div className="value-item" key={title}>
              <span className="value-icon"><Icon size={20} weight="duotone" /></span>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="cta-band">
          <h2>Cotiza tu envío</h2>
          <p>Cuéntanos qué necesitas mover y a dónde. Te contactamos el mismo día.</p>
          <div className="hero-actions">
            <a className="btn btn-primary btn-lg" href="/#contacto">Solicitar cotización</a>
            <Link className="btn btn-outline btn-lg" to="/soporte">Conocer el soporte</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
