import { Link } from 'react-router-dom'
import { WhatsappLogo, Phone, EnvelopeSimple } from '@phosphor-icons/react'
import { CONTACT, MAILTO_URL, WHATSAPP_URL } from './content'

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
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="footer-contact">
            <WhatsappLogo size={17} weight="fill" /> WhatsApp directo
          </a>
          <a href={CONTACT.phoneHref} className="footer-contact">
            <Phone size={17} weight="fill" /> Llamar
          </a>
          <a href={MAILTO_URL} className="footer-contact">
            <EnvelopeSimple size={17} weight="fill" /> {CONTACT.email}
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
