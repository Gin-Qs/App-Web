import { Link } from 'react-router-dom'
import {
  UserCircleGear,
  WhatsappLogo,
  Phone,
  ChatCircleDots,
  BellRinging,
  ClockCountdown,
  ArrowRight,
  Check,
} from '@phosphor-icons/react'
import { SiteNav } from '../marketing/SiteNav'
import { SiteFooter } from '../marketing/SiteFooter'
import { PHOTOS } from '../marketing/media'
import { CONTACT, WHATSAPP_URL } from '../marketing/content'

const PILLARS = [
  { icon: UserCircleGear, title: 'Ejecutivo de cuenta dedicado', body: 'Una persona que conoce tu operación y tus rutas. No un call center que vuelve a empezar cada vez.' },
  { icon: WhatsappLogo, title: 'WhatsApp y teléfono directo', body: 'Canales humanos reales. Escribes o llamas y te contesta alguien que puede resolver.' },
  { icon: BellRinging, title: '7 puntos de contacto por viaje', body: 'Te avisamos en cada etapa, de forma proactiva. Si algo cambia, lo sabes tú primero.' },
]

const PROMISE = [
  'Respondemos rápido, con una persona, no con un ticket.',
  'Si hay un problema, lo comunicamos antes de que preguntes.',
  'Tu ejecutivo conoce tu historial y tus prioridades.',
  'Reporte mensual de cumplimiento, sin que lo pidas.',
]

const FAQ = [
  { q: '¿Con quién hablo cuando tengo una duda?', a: 'Con tu ejecutivo de cuenta asignado. Tienes su WhatsApp y teléfono directo desde el primer viaje.' },
  { q: '¿Qué pasa si mi carga se retrasa?', a: 'Te avisamos de inmediato con el motivo y el nuevo tiempo estimado. La proactividad es parte del servicio.' },
  { q: '¿El seguro de carga está incluido?', a: 'Es opcional. Lo contratas solo si tu carga lo necesita; nosotros te asesoramos según el tipo de mercancía.' },
  { q: '¿Qué tipo de carga mueven?', a: 'Carga en general, incluidos perecederos y abarrotes. Planeamos cada ruta para entregar a tiempo.' },
]

export function SupportPage() {
  return (
    <div className="landing">
      <SiteNav />

      <section className="hero hero-page">
        <div className="hero-grid">
          <div className="hero-copy reveal-group">
            <span className="eyebrow">Soporte</span>
            <h1>El mejor soporte, de verdad.</h1>
            <p>
              El soporte excepcional es parte de nuestra propuesta de valor, no un extra. Hablas con
              personas que conocen tu cuenta y resuelven rápido.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary btn-lg" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <WhatsappLogo weight="fill" size={18} /> Escríbenos por WhatsApp
              </a>
              <a className="btn btn-outline btn-lg" href="/#contacto">Solicitar información</a>
            </div>
          </div>
          <div className="hero-visual">
            <div
              className="support-photo"
              style={{ backgroundImage: `var(--photo-scrim), url(${PHOTOS.support})` }}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Soporte que no te deja colgado</h2>
        </div>
        <div className="bento">
          {PILLARS.map(({ icon: Icon, title, body }, i) => (
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
        <div className="feature-text">
          <span className="eyebrow">Nuestra promesa</span>
          <h2>Comunicación proactiva, siempre</h2>
          <ul className="ticks">
            {PROMISE.map((p) => (
              <li key={p}><Check weight="bold" /> {p}</li>
            ))}
          </ul>
          <div className="support-channels">
            <a className="chan" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"><WhatsappLogo size={20} weight="duotone" /> WhatsApp</a>
            <a className="chan" href={CONTACT.phoneHref}><Phone size={20} weight="duotone" /> Teléfono</a>
            <a className="chan" href="/#contacto"><ChatCircleDots size={20} weight="duotone" /> Formulario</a>
          </div>
        </div>
        <div
          className="feature-media"
          style={{ backgroundImage: `var(--photo-scrim), url(${PHOTOS.control})` }}
        >
          <div className="feature-badge"><ClockCountdown size={20} weight="duotone" /> Respuesta el mismo día</div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Preguntas frecuentes</h2>
        </div>
        <div className="faq">
          {FAQ.map((f) => (
            <details className="faq-item" key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="cta-band">
          <h2>¿Hablamos?</h2>
          <p>Cuéntanos qué mueves. Te contactamos el mismo día.</p>
          <div className="hero-actions">
            <a className="btn btn-primary btn-lg" href="/#contacto">Solicitar información</a>
            <a className="btn btn-outline btn-lg" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp directo</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
