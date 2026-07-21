import { Link } from 'react-router-dom'
import { MapPin, ArrowRight } from '@phosphor-icons/react'
import { SiteNav } from '../marketing/SiteNav'
import { SiteFooter } from '../marketing/SiteFooter'
import { PHOTOS } from '../marketing/media'
import { VALUES } from '../marketing/content'

export function AboutPage() {
  return (
    <div className="landing">
      <SiteNav />

      <section className="hero hero-page">
        <div className="hero-grid">
          <div className="hero-copy reveal-group">
            <span className="eyebrow">Nosotros</span>
            <h1>Nacimos para mover la carga de México mejor.</h1>
            <p>
              Fleeter nació en Toluca, Estado de México, para cambiar una realidad: el transporte de
              carga del país opera mayormente sin factura, sin seguro y sin visibilidad. Nosotros
              hacemos lo contrario, en cada viaje.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary btn-lg" href="/#contacto">
                Solicitar cotización <ArrowRight weight="bold" size={18} />
              </a>
              <Link className="btn btn-outline btn-lg" to="/servicios">
                Ver servicios
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div
              className="support-photo"
              style={{ backgroundImage: `var(--photo-scrim), url(${PHOTOS.control})` }}
            />
          </div>
        </div>
      </section>

      <section className="section feature-split">
        <div
          className="feature-media"
          style={{ backgroundImage: `var(--photo-scrim), url(${PHOTOS.warehouse})` }}
        >
          <div className="feature-badge"><MapPin size={20} weight="duotone" /> Toluca, Estado de México</div>
        </div>
        <div className="feature-text">
          <h2>De dónde venimos y a dónde vamos</h2>
          <p>
            Empezamos moviendo carga, incluidos perecederos y abarrotes, para productores,
            distribuidores y comercios que no pueden permitirse fallar. Crecemos hacia más empresas,
            sin perder lo que nos define: el cliente siempre sabe dónde está su mercancía.
          </p>
          <p className="pull-quote">No somos el más barato; somos el que no te deja colgado.</p>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Lo que nos mueve</h2>
          <p className="lead">Cinco principios que están en cada viaje, no en una pared.</p>
        </div>
        <div className="bento">
          {VALUES.map(({ icon: Icon, title, body }) => (
            <article key={title} className="bento-tile">
              <span className="bento-icon"><Icon size={24} weight="duotone" /></span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="cta-band">
          <h2>Movamos tu carga juntos</h2>
          <p>Cuéntanos qué mueves. Te contactamos el mismo día.</p>
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
