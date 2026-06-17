import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ACTIVE_TRIP_STATUSES,
  formatDateTime,
  formatRelative,
  getTrip,
  getTripTrail,
  subscribeToLocations,
  TRIP_STATUS_LABELS,
  tripStatusTone,
  type TripLocation,
  type TripWithCompany,
} from '@ginqs/core'
import { supabase } from '../lib/supabase'
import { Badge, Card, Chip, EmptyState } from '../components/ui'
import { LiveMap, type MapMarker } from '../components/LiveMap'

export function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const [trip, setTrip] = useState<TripWithCompany | null>(null)
  const [trail, setTrail] = useState<TripLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!tripId) return
    let active = true
    setLoading(true)
    Promise.all([getTrip(supabase, tripId), getTripTrail(supabase, tripId)])
      .then(([t, trailRows]) => {
        if (!active) return
        if (!t) setNotFound(true)
        setTrip(t)
        setTrail(trailRows)
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [tripId])

  // Live updates for this trip's position.
  useEffect(() => {
    if (!tripId) return
    const unsubscribe = subscribeToLocations(supabase, {
      tripId,
      onInsert: (loc) => setTrail((prev) => [...prev, loc]),
    })
    return unsubscribe
  }, [tripId])

  if (loading) return <div className="page-loading">Cargando viaje…</div>
  if (notFound || !trip) {
    return (
      <div className="dashboard">
        <Link to="/app" className="back-link">
          ← Volver al panel
        </Link>
        <EmptyState>No encontramos ese viaje (o no tienes acceso).</EmptyState>
      </div>
    )
  }

  const latest = trail[trail.length - 1]
  const isActive = ACTIVE_TRIP_STATUSES.includes(trip.status)

  const trailPoints: Array<[number, number]> = trail.map((p) => [p.lat, p.lon])
  const markers: MapMarker[] = []
  if (trip.origin_lat != null && trip.origin_lon != null)
    markers.push({ id: 'origin', lat: trip.origin_lat, lon: trip.origin_lon, label: 'Origen', sublabel: trip.origin_label ?? '', tone: 'muted' })
  if (trip.destination_lat != null && trip.destination_lon != null)
    markers.push({ id: 'dest', lat: trip.destination_lat, lon: trip.destination_lon, label: 'Destino', sublabel: trip.destination_label ?? '', tone: 'success' })
  if (latest)
    markers.push({ id: 'current', lat: latest.lat, lon: latest.lon, label: `${trip.reference} (actual)`, sublabel: `${formatRelative(latest.recorded_at)}`, tone: tripStatusTone(trip.status) as MapMarker['tone'] })

  return (
    <div className="dashboard">
      <Link to="/app" className="back-link">
        ← Volver al panel
      </Link>

      <div className="dash-head trip-head">
        <div>
          <h1>{trip.reference}</h1>
          <p className="muted">
            {trip.company?.name ? `${trip.company.name} · ` : ''}
            {trip.origin_label} → {trip.destination_label}
          </p>
        </div>
        <Badge tone={tripStatusTone(trip.status)}>{TRIP_STATUS_LABELS[trip.status]}</Badge>
      </div>

      <Card
        title="Recorrido"
        action={
          isActive ? (
            <span className="chips">
              <Chip online>EN VIVO</Chip>
              <Chip>GPS</Chip>
              <Chip>LTE</Chip>
            </span>
          ) : undefined
        }
      >
        {markers.length ? (
          <LiveMap markers={markers} trail={trailPoints} height={420} />
        ) : (
          <EmptyState>Sin coordenadas registradas para este viaje.</EmptyState>
        )}
      </Card>

      <div className="dash-grid">
        <Card title="Detalle del viaje">
          <dl className="detail">
            <dt>Carga</dt>
            <dd>{trip.cargo_description ?? '—'}</dd>
            <dt>Salida</dt>
            <dd>{formatDateTime(trip.departure_at)}</dd>
            <dt>ETA</dt>
            <dd>{formatDateTime(trip.eta)}</dd>
            <dt>Entregado</dt>
            <dd>{formatDateTime(trip.delivered_at)}</dd>
            {latest && (
              <>
                <dt>Última posición</dt>
                <dd>
                  {latest.lat.toFixed(4)}, {latest.lon.toFixed(4)} ({formatRelative(latest.recorded_at)})
                  {latest.speed_kph != null ? ` · ${Math.round(latest.speed_kph)} km/h` : ''}
                </dd>
              </>
            )}
          </dl>
        </Card>

        <Card title="Historial de posiciones">
          {trail.length ? (
            <ul className="rows">
              {[...trail].reverse().map((p) => (
                <li key={p.id} className="row">
                  <div>
                    <div className="row-title">
                      {p.lat.toFixed(4)}, {p.lon.toFixed(4)}
                    </div>
                    <div className="row-sub">{formatDateTime(p.recorded_at)}</div>
                  </div>
                  {p.speed_kph != null && <span className="row-meta">{Math.round(p.speed_kph)} km/h</span>}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState>Sin posiciones registradas.</EmptyState>
          )}
        </Card>
      </div>
    </div>
  )
}
