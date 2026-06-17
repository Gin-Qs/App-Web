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
          Gin-Qs <span>Logistics</span>
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
        <div className="hero-inner">
          <h1>Logística B2B con visibilidad de carga en tiempo real</h1>
          <p>
            Movemos la carga de tu empresa con operaciones confiables, rastreo transparente y
            visibilidad financiera — todo en un solo lugar.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary btn-lg" to="/login">
              Entrar a mi panel
            </Link>
            <a className="btn btn-outline btn-lg" href="#servicios">
              Conocer servicios
            </a>
          </div>
          <div className="hero-badges">
            <span>📍 Rastreo en vivo</span>
            <span>🧾 Facturación y crédito</span>
            <span>📦 Historial de viajes</span>
          </div>
        </div>
      </section>

      <section className="section" id="nosotros">
        <h2>Quiénes somos</h2>
        <p className="lead">
          Gin-Qs apoya cadenas de suministro modernas con planeación de rutas, monitoreo de carga en
          vivo y atención a clientes basada en datos. Operamos con un enfoque de transparencia total:
          tú siempre sabes dónde está tu carga y cuál es tu estado de cuenta.
        </p>
      </section>

      <section className="section alt" id="servicios">
        <h2>Servicios</h2>
        <div className="features">
          <article>
            <h3>📍 Rastreo en tiempo real</h3>
            <p>Ubicación en vivo de cada viaje sobre mapa, con histórico de recorrido y ETA.</p>
          </article>
          <article>
            <h3>🧾 Facturación y crédito</h3>
            <p>Factura actual, facturas pagadas y línea de crédito disponible siempre a la vista.</p>
          </article>
          <article>
            <h3>📦 Historial de viajes</h3>
            <p>Registro completo de viajes y entregas para auditoría y planeación.</p>
          </article>
          <article>
            <h3>👥 Paneles por rol</h3>
            <p>Vistas dedicadas para clientes y para el equipo operativo de Gin-Qs.</p>
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
        <span>© {new Date().getFullYear()} Gin-Qs Logistics</span>
        <Link to="/login">Iniciar sesión</Link>
      </footer>
    </div>
  )
}
