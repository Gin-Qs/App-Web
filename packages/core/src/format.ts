import type { InvoiceStatus, TripStatus } from './types'

export function formatCurrency(amount: number, currency = 'MXN', locale = 'es-MX'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(value: string | null | undefined, locale = 'es-MX'): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatDateTime(value: string | null | undefined, locale = 'es-MX'): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

/** Compact "hace 5 min" / "in 3 h" style relative label. */
export function formatRelative(value: string | null | undefined, locale = 'es-MX'): string {
  if (!value) return '—'
  const diffMs = new Date(value).getTime() - Date.now()
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const minutes = Math.round(diffMs / 60000)
  if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute')
  const hours = Math.round(minutes / 60)
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour')
  return rtf.format(Math.round(hours / 24), 'day')
}

export const TRIP_STATUS_LABELS: Record<TripStatus, string> = {
  scheduled: 'Programado',
  loading: 'Cargando',
  in_transit: 'En tránsito',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Borrador',
  sent: 'Emitida',
  paid: 'Pagada',
  overdue: 'Vencida',
}

/** Maps a status to a semantic tone used by the UI Badge component. */
export function tripStatusTone(status: TripStatus): 'info' | 'warn' | 'success' | 'muted' {
  switch (status) {
    case 'in_transit':
      return 'info'
    case 'loading':
    case 'scheduled':
      return 'warn'
    case 'delivered':
      return 'success'
    default:
      return 'muted'
  }
}

export function invoiceStatusTone(status: InvoiceStatus): 'info' | 'warn' | 'success' | 'danger' | 'muted' {
  switch (status) {
    case 'paid':
      return 'success'
    case 'sent':
      return 'info'
    case 'overdue':
      return 'danger'
    case 'draft':
      return 'muted'
    default:
      return 'muted'
  }
}
