import type { Database } from './database.types'

// ---- Enums ----
export type UserRole = Database['public']['Enums']['user_role']
export type TripStatus = Database['public']['Enums']['trip_status']
export type InvoiceStatus = Database['public']['Enums']['invoice_status']

// ---- Row types ----
export type Company = Database['public']['Tables']['companies']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Trip = Database['public']['Tables']['trips']['Row']
export type TripLocation = Database['public']['Tables']['trip_locations']['Row']
export type Invoice = Database['public']['Tables']['invoices']['Row']

// ---- Convenience composites returned by joined queries ----
export type TripWithCompany = Trip & {
  company: Pick<Company, 'id' | 'name'> | null
}

export type ProfileWithCompany = Profile & {
  company: Company | null
}

// A trip enriched with its latest known position (for map markers / lists).
export type TripWithPosition = TripWithCompany & {
  latest_location: TripLocation | null
}

export const ACTIVE_TRIP_STATUSES: TripStatus[] = ['scheduled', 'loading', 'in_transit']
export const OPEN_INVOICE_STATUSES: InvoiceStatus[] = ['draft', 'sent', 'overdue']
