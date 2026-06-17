import type { AppSupabaseClient } from '../supabase'
import {
  ACTIVE_TRIP_STATUSES,
  type TripStatus,
  type TripWithCompany,
  type TripWithPosition,
} from '../types'
import { getLatestLocations } from './locations'

const TRIP_SELECT = '*, company:companies(id, name)'

export interface ListTripsOptions {
  statuses?: TripStatus[]
  companyId?: string
  limit?: number
}

/**
 * Lists trips visible to the signed-in user (RLS handles scoping: customers see
 * only their company's trips; staff see all).
 */
export async function listTrips(
  client: AppSupabaseClient,
  options: ListTripsOptions = {},
): Promise<TripWithCompany[]> {
  let query = client.from('trips').select(TRIP_SELECT)

  if (options.statuses?.length) query = query.in('status', options.statuses)
  if (options.companyId) query = query.eq('company_id', options.companyId)

  query = query.order('departure_at', { ascending: false, nullsFirst: false })
  if (options.limit) query = query.limit(options.limit)

  const { data, error } = await query
  if (error) throw error
  return (data as TripWithCompany[]) ?? []
}

export function listActiveTrips(client: AppSupabaseClient, companyId?: string) {
  return listTrips(client, { statuses: ACTIVE_TRIP_STATUSES, companyId })
}

export function listPastTrips(client: AppSupabaseClient, companyId?: string) {
  return listTrips(client, { statuses: ['delivered', 'cancelled'], companyId })
}

export async function getTrip(
  client: AppSupabaseClient,
  tripId: string,
): Promise<TripWithCompany | null> {
  const { data, error } = await client
    .from('trips')
    .select(TRIP_SELECT)
    .eq('id', tripId)
    .maybeSingle()
  if (error) throw error
  return (data as TripWithCompany) ?? null
}

/** Active trips enriched with their latest known position, for the live map. */
export async function listActiveTripsWithPositions(
  client: AppSupabaseClient,
  companyId?: string,
): Promise<TripWithPosition[]> {
  const trips = await listActiveTrips(client, companyId)
  const latest = await getLatestLocations(
    client,
    trips.map((t) => t.id),
  )
  return trips.map((t) => ({ ...t, latest_location: latest[t.id] ?? null }))
}
