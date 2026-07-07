import { useEffect, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import { useTheme } from '../theme'

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
  info: '#e65100', // Naranja Fleeter
  warn: '#f9a825',
  success: '#43c267',
  muted: '#847f7a',
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
  const [theme] = useTheme()
  const tileStyle = theme === 'light' ? 'light_all' : 'dark_all'

  return (
    <div className="map-wrap" style={{ height }}>
      <MapContainer center={center} zoom={6} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          key={tileStyle}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={`https://{s}.basemaps.cartocdn.com/${tileStyle}/{z}/{x}/{y}{r}.png`}
        />
        {trail && trail.length > 1 && (
          <Polyline positions={trail} pathOptions={{ color: '#e65100', weight: 3, opacity: 0.65 }} />
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
