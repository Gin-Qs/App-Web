import type { AppSupabaseClient } from '../supabase'
import type { TripStatus } from '../types'

export interface ShipmentTracking {
  reference: string
  status: TripStatus
  origin_label: string | null
  destination_label: string | null
  eta: string | null
  departure_at: string | null
  delivered_at: string | null
  last_lat: number | null
  last_lon: number | null
  last_at: string | null
}

/**
 * Public tracking by reference (guía). Backed by the SECURITY DEFINER
 * `track_shipment` RPC, callable by anonymous visitors — for one-time customers
 * who don't have a portal account. Returns null if the reference isn't found.
 */
export async function trackShipment(
  client: AppSupabaseClient,
  reference: string,
): Promise<ShipmentTracking | null> {
  // rpc isn't in the generated Database types; cast to call it.
  const { data, error } = await (client as unknown as {
    rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: ShipmentTracking[] | null; error: unknown }>
  }).rpc('track_shipment', { p_ref: reference })
  if (error) throw error
  return data && data.length ? data[0] : null
}
