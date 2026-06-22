import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  NavigationArrow,
  ChatCircleDots,
  Receipt,
  ShieldCheck,
  Wallet,
  ChartLineUp,
  ArrowRight,
  Check,
  X,
  Headset,
  WhatsappLogo,
  UserCircleGear,
  Cpu,
  ShieldCheckered,
  Lightning,
  Eye,
  Handshake,
} from '@phosphor-icons/react'
import { SiteNav } from '../marketing/SiteNav'
import { SiteFooter } from '../marketing/SiteFooter'
import { TrackingPreview } from '../components/TrackingPreview'
import { PHOTOS } from '../marketing/media'

const SECTORS = ['Carga general', 'Perecederos', 'Abarrotes', 'Empresas (próximamente)']

const STATS = [
  { big: '7', label: 'Puntos de contacto por viaje' },
  { big: '24 h', label: 'Factura CFDI y Carta Porte' },
  { big: '24/7', label: 'Monitoreo de la unidad' },
  { big: '100%', label: 'Viajes con GPS y factura' },
]

const VALUE_PROPS = [
  {
    icon: NavigationArrow,
    title: 'Trazabilidad en tiempo real',
    body: 'GPS con link compartible: ves tu carga en todo momento, con histórico de ruta y ETA.',
    featured: true,
  },
  { icon: ChatCircleDots, title: 'Comunicación proactiva', body: '7 puntos de contacto por viaje. Nunca preguntas dónde va tu mercancía.' },
  { icon: Receipt, title: 'Facturación completa', body: 'CFDI más Carta Porte dentro de 24 horas. 100% deducible.' },
  { icon: ShieldCheck, title: 'Seguridad documentada', body: 'GPS, candados satelitales y botón de pánico. Seguro de carga opcional, según tu necesidad.' },
  { icon: Wallet, title: 'Crédito y estado de cuenta', body: 'Línea de crédito y tus facturas, siempre visibles en tu panel.' },
  { icon: ChartLineUp, title: 'Reportes mensuales', body: 'Métricas de cumplimiento reales para tus registros y decisiones.' },
]

const COMPARE = [
  'Factura con CFDI y Carta Porte',
  'Rastreo GPS en vivo del viaje',
  'Avisos proactivos, sin que preguntes',
  'Ejecutivo de cuenta dedicado',
  'Seguro de carga disponible',
  'Reportes de cumplimiento',
] as const

const VALUES = [
  { icon: ShieldCheckered, title: 'Confiabilidad', body: 'Cumplimos lo que prometemos. Si dijimos a las 8:00, llega a las 8:00.' },
  { icon: ShieldCheck, title: 'Seguridad', body: 'GPS, candados satelitales y protocolos. Protegemos tu carga y a nuestros operadores.' },
  { icon: Lightning, title: 'Innovación', body: 'Somos una empresa de tecnología que mueve carga, no al revés.' },
  { icon: Eye, title: 'Transparencia', body: 'Visibilidad total. Si algo sale mal, lo comunicamos primero.' },
  { icon: Handshake, title: 'Compromiso', body: 'Con nuestros clientes, nuestro equipo y un sector que necesita formalizarse.' },
]

const PROCESS = [
  { n: 1, title: 'Cotización clara', body: 'Nos dices qué mueves y a dónde. Te damos precio y tiempo, sin letras chiquitas.' },
  { n: 2, title: 'Confirmación', body: 'Asignamos unidad y operador. Recibes los datos del viaje por escrito.' },
  { n: 3, title: 'Monitoreo en vivo', body: 'GPS activo desde que carga. Sigues tu mercancía con un link.' },
  { n: 4, title: '7 puntos de contacto', body: 'Te avisamos en cada etapa. Si algo cambia, lo sabes primero.' },
  { n: 5, title: 'Entrega confirmada', body: 'Evidencia de entrega y estatus final en tu panel.' },
  { n: 6, title: 'Factura en 24 h', body: 'CFDI y Carta Porte listos para deducir, sin perseguirnos.' },
]

export function LandingPage() {
  const [sent, setSent] = useState(false)
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="landing">
      <SiteNav />

      {/* CINEMATIC HERO */}
      <section className="hero-cine">
        <div
          className="hero-cine-bg"
          style={{ backgroundImage: `var(--hero-scrim), url(${PHOTOS.hero})` }}
        />
        <div className="hero-cine-ghost" aria-hidden="true">EN RUTA</div>

        <div className="hero-cine-inner">
          <div className="hero-cine-copy reveal-group">
            <span className="eyebrow">Transporte de carga en México</span>
            <h1>Tu carga, visible en tiempo real.</h1>
            <p>
              Movemos tu carga por México, incluidos perecederos y abarrotes. Sabes dónde está tu
              mercancía en todo momento, te avisamos en cada etapa y facturamos al día.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary btn-lg" href="#contacto">
                Solicitar cotización <ArrowRight weight="bold" size={18} />
              </a>
              <Link className="btn btn-glass btn-lg" to="/login">
                Iniciar sesión
              </Link>
            </div>
          </div>

          <div className="hero-cine-card">
            <TrackingPreview />
          </div>
        </div>

        <div className="hero-cine-foot">
          <div className="sector-chips">
            {SECTORS.map((s) => (
              <span key={s} className="sector-chip">{s}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="stat-strip">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="big">{s.big}</div>
            <div className="lbl">{s.label}</div>
          </div>
        ))}
      </div>

      {/* WHY FLEETER — comparison */}
      <section className="section" id="por-que">
        <div className="section-head">
          <h2>Por qué Fleeter es la mejor decisión</h2>
          <p className="lead">
            En México casi todo el transporte de carga opera sin factura, sin seguro y sin
            visibilidad. Nosotros hacemos lo contrario, en cada viaje.
          </p>
        </div>
        <div className="compare">
          <div className="compare-corner" aria-hidden="true" />
          <div className="compare-head compare-bad">Transporte informal</div>
          <div className="compare-head compare-good">Fleet<span>er</span></div>
          {COMPARE.map((label) => (
            <div className="compare-row" key={label}>
              <span className="compare-label">{label}</span>
              <span className="compare-cell no"><X weight="bold" /></span>
              <span className="compare-cell yes"><Check weight="bold" /></span>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE TRACKING proof */}
      <section className="section feature-split">
        <div className="feature-media" style={{ backgroundImage: `var(--photo-scrim), url(${PHOTOS.warehouse})` }}>
          <div className="feature-card-float"><TrackingPreview /></div>
        </div>
        <div className="feature-text">
          <h2>Sabes dónde va tu carga, siempre</h2>
          <p>
            Cada unidad envía su posición en vivo. Tú y tu equipo abren un link y ven la ruta, la
            velocidad y el tiempo estimado de llegada, sin llamadas ni incertidumbre.
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

      {/* VALUE BENTO */}
      <section className="section" id="servicios">
        <div className="section-head"><h2>Lo que entregamos en cada viaje</h2></div>
        <div className="bento">
          {VALUE_PROPS.map(({ icon: Icon, title, body, featured }) => (
            <article key={title} className={`bento-tile${featured ? ' bento-feature' : ''}`}>
              <span className="bento-icon"><Icon size={featured ? 28 : 24} weight="duotone" /></span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* SUPPORT highlight */}
      <section className="section">
        <div className="support-band" style={{ backgroundImage: `var(--photo-scrim-strong), url(${PHOTOS.support})` }}>
          <div className="support-inner">
            <span className="eyebrow">El mejor soporte, de verdad</span>
            <h2>No te dejamos colgado</h2>
            <p>
              Nuestro soporte es parte de lo que pagas, no un extra. Hablas con personas que conocen
              tu cuenta y resuelven rápido.
            </p>
            <div className="support-points">
              <div><UserCircleGear size={22} weight="duotone" /> Ejecutivo de cuenta dedicado</div>
              <div><WhatsappLogo size={22} weight="duotone" /> WhatsApp y teléfono directo</div>
              <div><Headset size={22} weight="duotone" /> 7 puntos de contacto por viaje</div>
            </div>
            <Link className="btn btn-primary" to="/soporte">
              Conocer nuestro soporte <ArrowRight weight="bold" size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* TECHNOLOGY teaser */}
      <section className="section feature-split reverse">
        <div className="feature-text">
          <span className="eyebrow">Tecnología</span>
          <h2>Una empresa de tecnología que mueve carga</h2>
          <p>
            Telemetría, automatización y datos en cada viaje. La misma plataforma que usa nuestro
            equipo te da visibilidad total, desde la posición de la unidad hasta tu estado de cuenta.
          </p>
          <ul className="ticks">
            <li><Check weight="bold" /> Panel en vivo para cliente y operación</li>
            <li><Check weight="bold" /> Facturación CFDI y Carta Porte automatizada</li>
            <li><Check weight="bold" /> Seguridad: GPS, candados satelitales, botón de pánico</li>
          </ul>
          <Link className="btn btn-primary" to="/tecnologia">
            Explorar la plataforma <ArrowRight weight="bold" size={16} />
          </Link>
        </div>
        <div className="feature-media" style={{ backgroundImage: `var(--photo-scrim), url(${PHOTOS.control})` }}>
          <div className="feature-badge"><Cpu size={20} weight="duotone" /> Telemetría en vivo</div>
        </div>
      </section>

      {/* NOSOTROS — about */}
      <section className="section" id="nosotros">
        <div className="about-grid">
          <div className="about-intro">
            <span className="eyebrow">Nosotros</span>
            <h2>Nacimos para mover la carga de México mejor</h2>
            <p className="lead">
              Fleeter nació en Toluca, Estado de México, para cambiar una realidad: el transporte de
              carga del país opera mayormente sin factura, sin seguro y sin visibilidad. Empezamos
              moviendo carga, incluidos perecederos y abarrotes, y vamos creciendo hacia más empresas.
            </p>
            <p className="pull-quote">No somos el más barato; somos el que no te deja colgado.</p>
          </div>
          <div className="values">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <div className="value-item" key={title}>
                <span className="value-icon"><Icon size={20} weight="duotone" /></span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section" id="proceso">
        <div className="section-head">
          <h2>Cómo trabajamos</h2>
          <p className="lead">Así es cada viaje con nosotros, de principio a fin.</p>
        </div>
        <ol className="process">
          {PROCESS.map((s) => (
            <li className="process-step" key={s.n}>
              <span className="process-n">{s.n}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* CONTACT */}
      <section className="section" id="contacto">
        <div className="contact-grid">
          <div>
            <h2>Cotiza tu envío</h2>
            <p className="lead">
              Cuéntanos qué necesitas mover y a dónde. Te contactamos el mismo día.
            </p>
          </div>
          {sent ? (
            <div className="notice success">¡Gracias! Recibimos tu solicitud y te contactamos pronto.</div>
          ) : (
            <form className="card form" onSubmit={handleSubmit}>
              <label>
                Nombre o empresa
                <input type="text" placeholder="Tu nombre o empresa" required />
              </label>
              <label>
                Correo o WhatsApp
                <input type="text" placeholder="Para contactarte" required />
              </label>
              <label>
                ¿Qué necesitas mover?
                <textarea rows={4} placeholder="Producto, origen y destino" />
              </label>
              <button type="submit" className="btn btn-primary">Solicitar cotización</button>
            </form>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
