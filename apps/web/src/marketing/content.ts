import type { Icon } from '@phosphor-icons/react'
import {
  Basket,
  Buildings,
  ChartLineUp,
  ChatCircleDots,
  Eye,
  Handshake,
  Lightning,
  NavigationArrow,
  Package,
  Plant,
  Receipt,
  ShieldCheck,
  ShieldCheckered,
  Wallet,
} from '@phosphor-icons/react'

/**
 * Single source of truth for the marketing copy that appears on more than one
 * page, and for the business contact channels used across nav, footer,
 * support and the contact form. Update phone/WhatsApp/email HERE only.
 */

// TODO: replace the placeholder phone/WhatsApp with the real business numbers.
export const CONTACT = {
  email: 'hola@fleeter.mx',
  /** wa.me format: country code + number, digits only. */
  whatsappDigits: '5210000000000',
  phoneDisplay: '+52 00 0000 0000',
  phoneHref: 'tel:+520000000000',
} as const

export const WHATSAPP_URL = `https://wa.me/${CONTACT.whatsappDigits}`
export const MAILTO_URL = `mailto:${CONTACT.email}`

/** Prefilled WhatsApp conversation, e.g. for the quote form. */
export function whatsappWithMessage(message: string): string {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`
}

export interface ContentItem {
  icon: Icon
  title: string
  body: string
  featured?: boolean
}

/** What every trip includes — shown on the landing page and /servicios. */
export const VALUE_PROPS: ContentItem[] = [
  {
    icon: NavigationArrow,
    title: 'Rastreo en tiempo real',
    body: 'GPS con link compartible: ves tu carga en todo momento, con histórico de ruta y ETA.',
    featured: true,
  },
  { icon: ChatCircleDots, title: 'Comunicación proactiva', body: '7 puntos de contacto por viaje. Nunca preguntas dónde va tu mercancía.' },
  { icon: Receipt, title: 'Facturación completa', body: 'CFDI más Carta Porte dentro de 24 horas. 100% deducible, sin perseguirnos.' },
  { icon: ShieldCheck, title: 'Seguridad documentada', body: 'GPS, candados satelitales y botón de pánico. Seguro de carga opcional, según tu necesidad.' },
  { icon: Wallet, title: 'Crédito y estado de cuenta', body: 'Línea de crédito y todas tus facturas, siempre visibles en tu panel.' },
  { icon: ChartLineUp, title: 'Reportes mensuales', body: 'Métricas de cumplimiento reales para tus registros y decisiones.' },
]

/** Sectors we serve — chips on the landing hero, cards on /servicios. */
export const SECTORS: ContentItem[] = [
  { icon: Package, title: 'Carga general', body: 'Mercancía paletizada y suelta para productores, distribuidores y comercios.' },
  { icon: Plant, title: 'Perecederos', body: 'Planeamos cada ruta para entregar a tiempo lo que no puede esperar.' },
  { icon: Basket, title: 'Abarrotes', body: 'Reabasto constante y confiable para tu cadena de distribución.' },
  { icon: Buildings, title: 'Empresas (próximamente)', body: 'Estamos formalizando soluciones a la medida para volúmenes mayores.' },
]

/** Company values — landing #nosotros section and /nosotros page. */
export const VALUES: ContentItem[] = [
  { icon: ShieldCheckered, title: 'Confiabilidad', body: 'Cumplimos lo que prometemos. Si dijimos a las 8:00, llega a las 8:00.' },
  { icon: ShieldCheck, title: 'Seguridad', body: 'GPS, candados satelitales y protocolos. Protegemos tu carga y a nuestros operadores.' },
  { icon: Lightning, title: 'Innovación', body: 'Somos una empresa de tecnología que mueve carga, no al revés.' },
  { icon: Eye, title: 'Transparencia', body: 'Visibilidad total. Si algo sale mal, lo comunicamos primero.' },
  { icon: Handshake, title: 'Compromiso', body: 'Con nuestros clientes, nuestro equipo y un sector que necesita formalizarse.' },
]
