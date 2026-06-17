import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

export function LandingPage() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Front-end only for now. Wire this to a Supabase `leads` table or an email
    // function when you're ready to capture requests.
    setSent(true)
  }

  return (
    <div className="landing">
      <header className="top-nav">
        <div className="brand">
          Fleet<span>er</span>
        </div>
        <nav>
          <a className="btn btn-ghost" href="#contacto">
            Solicitar información
          </a>
          <Link className="btn btn-primary" to="/login">
            Iniciar sesión
          </Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-ghost" aria-hidden="true">
          EN MOVIMIENTO
        </div>
        <div className="hero-inner">
          <span className="eyebrow">● Rastreo GPS en vivo · Transporte de carga</span>
          <h1>Tu carga, visible en tiempo real.</h1>
          <p>
            Transporte de carga profesional con tecnología. Sabemos dónde está tu carga en todo
            momento, facturamos al día y tú nunca tienes que preguntar.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary btn-lg" to="/login">
              Entrar a mi panel →
            </Link>
            <a className="btn btn-outline btn-lg" href="#servicios">
              Conocer servicios
            </a>
          </div>
          <div className="hero-badges">
            <span>📍 Rastreo GPS en vivo</span>
            <span>🧾 CFDI + Carta Porte</span>
            <span>❄️ Cadena de frío</span>
          </div>
        </div>
      </section>

      <div className="stat-strip">
        <div>
          <div className="big">99.4%</div>
          <div className="lbl">Entregas a tiempo</div>
        </div>
        <div>
          <div className="big">24/7</div>
          <div className="lbl">Monitoreo de flota</div>
        </div>
        <div>
          <div className="big">+150</div>
          <div className="lbl">Clientes B2B</div>
        </div>
        <div>
          <div className="big">&lt; 2 min</div>
          <div className="lbl">Actualización de posición</div>
        </div>
      </div>

      <section className="section" id="nosotros">
        <h2>Quiénes somos</h2>
        <p className="lead">
          En México, la mayoría del transporte de carga opera sin factura, sin seguro y sin
          visibilidad. Fleeter cambia eso. Somos una empresa de tecnología que mueve carga:
          trazabilidad en tiempo real, comunicación proactiva y formalidad fiscal en cada viaje.
        </p>
        <p className="lead" style={{ marginTop: '1rem', color: 'var(--accent-2)', fontWeight: 600 }}>
          “No somos el más barato; somos el que no te deja colgado.”
        </p>
      </section>

      <section className="section alt" id="servicios">
        <h2>Lo que entregamos en cada viaje</h2>
        <div className="features">
          <article>
            <h3>📍 Trazabilidad en tiempo real</h3>
            <p>GPS con link compartible para que veas tu carga en todo momento, con histórico y ETA.</p>
          </article>
          <article>
            <h3>📣 Comunicación proactiva</h3>
            <p>7 puntos de contacto por viaje. El cliente nunca tiene que preguntar.</p>
          </article>
          <article>
            <h3>🧾 Facturación completa</h3>
            <p>CFDI + Carta Porte dentro de 24 horas. 100% deducible.</p>
          </article>
          <article>
            <h3>🛡️ Seguridad documentada</h3>
            <p>GPS, candados satelitales, botón de pánico y seguros completos.</p>
          </article>
          <article>
            <h3>❄️ Garantía de cadena de frío</h3>
            <p>Monitoreo de temperatura en tiempo real para perecederos.</p>
          </article>
          <article>
            <h3>📊 Reportes mensuales</h3>
            <p>Métricas de cumplimiento reales para tus registros y decisiones.</p>
          </article>
        </div>
      </section>

      <section className="section" id="contacto">
        <h2>Solicitar información</h2>
        <p className="lead">¿Nuevo cliente? Cuéntanos qué necesitas mover y te contactamos.</p>
        {sent ? (
          <div className="notice success">
            ¡Gracias! Recibimos tu solicitud y te contactaremos pronto.
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
              <textarea rows={4} placeholder="Cuéntanos tus necesidades de logística" />
            </label>
            <button type="submit" className="btn btn-primary">
              Enviar solicitud
            </button>
          </form>
        )}
      </section>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Fleeter Soluciones Logísticas S.A. de C.V.</span>
        <Link to="/login">Iniciar sesión</Link>
      </footer>
    </div>
  )
}
