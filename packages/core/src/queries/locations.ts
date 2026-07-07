import type { AppSupabaseClient } from '../supabase'
import type { TripLocation } from '../types'

/**
 * Ordered breadcrumb trail for one trip (oldest -> newest), capped at the
 * most recent `limit` points so long-running trips don't ship megabytes of
 * history to the browser just to draw a polyline.
 */
export async function getTripTrail(
  client: AppSupabaseClient,
  tripId: string,
  limit = 500,
): Promise<TripLocation[]> {
  const { data, error } = await client
    .from('trip_locations')
    .select('*')
    .eq('trip_id', tripId)
    .order('recorded_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data ?? []).reverse()
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
 * marker per active shipment on the dashboard map. Reads the
 * `trip_latest_locations` view (one row per trip, RLS still applies) instead
 * of downloading every breadcrumb ever recorded.
 */
export async function getLatestLocations(
  client: AppSupabaseClient,
  tripIds: string[],
): Promise<Record<string, TripLocation>> {
  if (tripIds.length === 0) return {}
  const { data, error } = await client
    .from('trip_latest_locations')
    .select('*')
    .in('trip_id', tripIds)
  if (error) throw error

  const latest: Record<string, TripLocation> = {}
  for (const row of data ?? []) {
    // View columns are typed nullable, but every row comes from a NOT NULL base table.
    if (row.trip_id != null) latest[row.trip_id] = row as TripLocation
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
