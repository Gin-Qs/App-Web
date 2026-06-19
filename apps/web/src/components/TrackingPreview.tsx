import { Chip } from './ui'

/**
 * On-brand product preview for the landing hero: a live-tracking telemetry card
 * (a real, small version of what the app shows) instead of stock photography.
 * Pure SVG route + a pulsing "current position" dot (reduced-motion safe).
 */
export function TrackingPreview() {
  return (
    <div className="track-card" aria-hidden="false">
      <div className="track-head">
        <div className="track-id">
          <span className="track-ref">TR-8912</span>
          <span className="track-route">Monterrey → Ciudad de México</span>
        </div>
        <Chip online>EN RUTA</Chip>
      </div>

      <div className="track-map" role="img" aria-label="Seguimiento en vivo de la unidad TR-8912">
        <svg viewBox="0 0 300 168" className="track-svg" preserveAspectRatio="xMidYMid meet">
          <path className="track-rest" d="M150 92 C 200 102, 238 58, 278 38" />
          <path className="track-done" d="M22 138 C 64 128, 96 130, 150 92" />
          <circle className="track-origin" cx="22" cy="138" r="4" />
          <circle className="track-dest" cx="278" cy="38" r="5" />
          <circle className="track-halo" cx="150" cy="92" r="12" />
          <circle className="track-now" cx="150" cy="92" r="5" />
        </svg>
      </div>

      <div className="track-chips">
        <Chip>GPS</Chip>
        <Chip>LTE</Chip>
        <Chip>92 km/h</Chip>
        <Chip>ETA 3h 40m</Chip>
      </div>

      <div className="track-foot">
        <span>22 tarimas · frutas y verduras</span>
        <span className="track-upd">Hace 1 min</span>
      </div>
    </div>
  )
}
