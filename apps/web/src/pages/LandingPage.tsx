import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  X,
  Headset,
  WhatsappLogo,
  UserCircleGear,
  Cpu,
} from '@phosphor-icons/react'
import { SiteNav } from '../marketing/SiteNav'
import { SiteFooter } from '../marketing/SiteFooter'
import { TrackingPreview } from '../components/TrackingPreview'
import { PHOTOS } from '../marketing/media'
import { MAILTO_URL, SECTORS, VALUES, VALUE_PROPS, whatsappWithMessage } from '../marketing/content'

const STATS = [
  { big: '7', label: 'Puntos de contacto por viaje' },
  { big: '24 h', label: 'Factura CFDI y Carta Porte' },
  { big: '24/7', label: 'Monitoreo de la unidad' },
  { big: '100%', label: 'Viajes con GPS y factura' },
]

const COMPARE = [
  'Factura con CFDI y Carta Porte',
  'Rastreo GPS en vivo del viaje',
  'Avisos proactivos, sin que preguntes',
  'Ejecutivo de cuenta dedicado',
  'Seguro de carga disponible',
  'Reportes de cumplimiento',
] as const

const PROCESS = [
  { n: 1, title: 'Cotización clara', body: 'Nos dices qué mueves y a dónde. Te damos precio y tiempo, sin letras chiquitas.' },
  { n: 2, title: 'Confirmación', body: 'Asignamos unidad y operador. Recibes los datos del viaje por escrito.' },
  { n: 3, title: 'Monitoreo en vivo', body: 'GPS activo desde que carga. Sigues tu mercancía con un link.' },
  { n: 4, title: '7 puntos de contacto', body: 'Te avisamos en cada etapa. Si algo cambia, lo sabes primero.' },
  { n: 5, title: 'Entrega confirmada', body: 'Evidencia de entrega y estatus final en tu panel.' },
  { n: 6, title: 'Factura en 24 h', body: 'CFDI y Carta Porte listos para deducir, sin perseguirnos.' },
]

export function LandingPage() {
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
              <span key={s.title} className="sector-chip">{s.title}</span>
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
          <ContactForm />
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

/**
 * Quote request form. There is no backend for leads yet, so submitting
 * composes the request into the visitor's email client (mailto) — and offers
 * WhatsApp with the same prefilled message as an alternative.
 */
function ContactForm() {
  const [sent, setSent] = useState(false)
  const [message, setMessage] = useState('')

  function buildMessage(form: HTMLFormElement): string {
    const data = new FormData(form)
    return [
      `Hola, quiero cotizar un envío.`,
      `Nombre/empresa: ${data.get('nombre')}`,
      `Contacto: ${data.get('contacto')}`,
      `Necesito mover: ${data.get('detalle') || '(por definir)'}`,
    ].join('\n')
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const msg = buildMessage(e.currentTarget)
    setMessage(msg)
    setSent(true)
    window.location.href = `${MAILTO_URL}?subject=${encodeURIComponent('Solicitud de cotización')}&body=${encodeURIComponent(msg)}`
  }

  if (sent) {
    return (
      <div className="card">
        <div className="notice success">
          Abrimos tu correo con la solicitud lista para enviar. Si no se abrió, escríbenos
          directamente y te contactamos el mismo día.
        </div>
        <div className="hero-actions">
          <a
            className="btn btn-primary"
            href={whatsappWithMessage(message)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsappLogo weight="fill" size={18} /> Enviar por WhatsApp
          </a>
          <a className="btn btn-outline" href={MAILTO_URL}>
            Escribir correo
          </a>
        </div>
      </div>
    )
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <label>
        Nombre o empresa
        <input type="text" name="nombre" placeholder="Tu nombre o empresa" required />
      </label>
      <label>
        Correo o WhatsApp
        <input type="text" name="contacto" placeholder="Para contactarte" required />
      </label>
      <label>
        ¿Qué necesitas mover?
        <textarea rows={4} name="detalle" placeholder="Producto, origen y destino" />
      </label>
      <button type="submit" className="btn btn-primary">Solicitar cotización</button>
    </form>
  )
}
