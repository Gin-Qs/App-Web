import type { AppSupabaseClient } from '../supabase'
import type { TripLocation } from '../types'

/** Full ordered breadcrumb trail for one trip (oldest -> newest). */
export async function getTripTrail(
  client: AppSupabaseClient,
  tripId: string,
): Promise<TripLocation[]> {
  const { data, error } = await client
    .from('trip_locations')
    .select('*')
    .eq('trip_id', tripId)
    .order('recorded_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

/** Latest known position for a single trip, or null if none recorded yet. */
export async function getLatestLocation(
  client: AppSupabaseClient,
  tripId: string,
): Promise<TripLocation | null> {
  const { data, error } = await client
    .from('trip_locations')
    .select('*')
    .eq('trip_id', tripId)
    .order('recorded_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data ?? null
}

/**
 * Latest position for many trips at once, keyed by trip_id. Used to place a
 * marker per active shipment on the dashboard map.
 */
export async function getLatestLocations(
  client: AppSupabaseClient,
  tripIds: string[],
): Promise<Record<string, TripLocation>> {
  if (tripIds.length === 0) return {}
  const { data, error } = await client
    .from('trip_locations')
    .select('*')
    .in('trip_id', tripIds)
    .order('recorded_at', { ascending: false })
  if (error) throw error

  const latest: Record<string, TripLocation> = {}
  for (const row of data ?? []) {
    // rows are newest-first, so the first one seen per trip is the latest
    if (!latest[row.trip_id]) latest[row.trip_id] = row
  }
  return latest
}

/**
 * Subscribes to live location inserts. Returns an unsubscribe function.
 * Pass a `tripId` to follow one shipment, or omit it to follow every shipment
 * the signed-in user is allowed to see (RLS still applies on the initial read;
 * realtime payloads are filtered the same way on the server).
 */
export function subscribeToLocations(
  client: AppSupabaseClient,
  opts: { tripId?: string; onInsert: (location: TripLocation) => void },
): () => void {
  const channelName = opts.tripId ? `loc:${opts.tripId}` : 'loc:all'
  const channel = client
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'trip_locations',
        ...(opts.tripId ? { filter: `trip_id=eq.${opts.tripId}` } : {}),
      },
      (payload) => opts.onInsert(payload.new as TripLocation),
    )
    .subscribe()

  return () => {
    void client.removeChannel(channel)
  }
}
