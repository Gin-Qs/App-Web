import { useEffect, useMemo } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'

export interface MapMarker {
  id: string
  lat: number
  lon: number
  label: string
  sublabel?: string
  tone?: 'info' | 'warn' | 'success' | 'muted'
}

interface LiveMapProps {
  markers: MapMarker[]
  trail?: Array<[number, number]>
  height?: number
  /** Center used only when there are no markers/trail to fit. */
  fallbackCenter?: [number, number]
}

const TONE_COLORS: Record<NonNullable<MapMarker['tone']>, string> = {
  info: '#2563eb',
  warn: '#d97706',
  success: '#059669',
  muted: '#64748b',
}

function truckIcon(color: string) {
  return L.divIcon({
    className: 'truck-pin',
    html: `<span class="truck-pin-dot" style="--pin:${color}"></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

/** Keeps the viewport framed around the current markers/trail. */
function FitBounds({ points }: { points: Array<[number, number]> }) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 0) return
    if (points.length === 1) {
      map.setView(points[0], 9)
      return
    }
    map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 11 })
  }, [map, points])
  return null
}

export function LiveMap({ markers, trail, height = 320, fallbackCenter = [23.6345, -102.5528] }: LiveMapProps) {
  const points = useMemo<Array<[number, number]>>(() => {
    const pts: Array<[number, number]> = markers.map((m) => [m.lat, m.lon])
    if (trail) pts.push(...trail)
    return pts
  }, [markers, trail])

  const center = points[0] ?? fallbackCenter

  return (
    <div className="map-wrap" style={{ height }}>
      <MapContainer center={center} zoom={6} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {trail && trail.length > 1 && (
          <Polyline positions={trail} pathOptions={{ color: '#2563eb', weight: 3, opacity: 0.6 }} />
        )}
        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lon]} icon={truckIcon(TONE_COLORS[m.tone ?? 'info'])}>
            <Popup>
              <strong>{m.label}</strong>
              {m.sublabel && (
                <>
                  <br />
                  {m.sublabel}
                </>
              )}
            </Popup>
          </Marker>
        ))}
        <FitBounds points={points} />
      </MapContainer>
    </div>
  )
}
