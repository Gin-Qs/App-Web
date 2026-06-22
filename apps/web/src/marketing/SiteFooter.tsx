import { Link } from 'react-router-dom'
import { WhatsappLogo, Phone, EnvelopeSimple } from '@phosphor-icons/react'

export function SiteFooter() {
  return (
    <footer className="site-footer-lg">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="brand">
            Fleet<span>er</span>
          </div>
          <p>Transporte de carga profesional con tecnología. Desde Toluca, Estado de México.</p>
          <p className="footer-claim">No somos el más barato; somos el que no te deja colgado.</p>
        </div>

        <div className="footer-col">
          <h4>Plataforma</h4>
          <Link to="/servicios">Servicios</Link>
          <Link to="/tecnologia">Tecnología</Link>
          <Link to="/soporte">Soporte</Link>
          <Link to="/nosotros">Nosotros</Link>
        </div>

        <div className="footer-col">
          <h4>Contacto</h4>
          <a href="https://wa.me/5210000000000" className="footer-contact">
            <WhatsappLogo size={17} weight="fill" /> WhatsApp directo
          </a>
          <a href="tel:+520000000000" className="footer-contact">
            <Phone size={17} weight="fill" /> Llamar
          </a>
          <a href="mailto:hola@fleeter.mx" className="footer-contact">
            <EnvelopeSimple size={17} weight="fill" /> hola@fleeter.mx
          </a>
        </div>

        <div className="footer-col">
          <h4>Empieza</h4>
          <a href="/#contacto">Solicitar información</a>
          <Link to="/login">Iniciar sesión</Link>
        </div>
      </div>

      <div className="footer-base">
        <span>© {new Date().getFullYear()} Fleeter Soluciones Logísticas S.A. de C.V.</span>
        <span>Toluca · CDMX · Puebla · y creciendo</span>
      </div>
    </footer>
  )
}
