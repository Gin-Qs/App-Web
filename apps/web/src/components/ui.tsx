import type { ReactNode } from 'react'

type Tone = 'info' | 'warn' | 'success' | 'danger' | 'muted'

export function Badge({ tone = 'muted', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

export function Card({
  title,
  action,
  children,
  className,
}: {
  title?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`card${className ? ` ${className}` : ''}`}>
      {(title || action) && (
        <header className="card-head">
          {title && <h3>{title}</h3>}
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

export function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string
  value: ReactNode
  hint?: ReactNode
  tone?: Tone
}) {
  return (
    <div className={`stat${tone ? ` stat-${tone}` : ''}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {hint && <div className="stat-hint">{hint}</div>}
    </div>
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>
}

/** Small telemetry chip, e.g. `Online ●`, `GPS`, `LTE`. */
export function Chip({ children, online }: { children: ReactNode; online?: boolean }) {
  return (
    <span className={`chip${online ? ' online' : ''}`}>
      {online && <span className="dot" />}
      {children}
    </span>
  )
}

export interface TabItem {
  id: string
  label: ReactNode
}

export function Tabs({
  items,
  active,
  onChange,
}: {
  items: TabItem[]
  active: string
  onChange: (id: string) => void
}) {
  return (
    <div className="tabs" role="tablist">
      {items.map((it) => (
        <button
          key={it.id}
          role="tab"
          aria-selected={active === it.id}
          className={`tab${active === it.id ? ' active' : ''}`}
          onClick={() => onChange(it.id)}
        >
          {it.label}
        </button>
      ))}
    </div>
  )
}

/**
 * Stylized mini route: draws origin → current → destination as a normalized
 * polyline (the telemetry-card look), without a full map per row.
 */
export function RouteSpark({
  points,
  progressIndex,
}: {
  points: Array<[number, number]> // [lat, lon]
  progressIndex?: number
}) {
  const valid = points.filter(([la, lo]) => Number.isFinite(la) && Number.isFinite(lo))
  if (valid.length < 2) return <div className="route-spark" />

  const W = 260
  const H = 46
  const pad = 10
  const lats = valid.map((p) => p[0])
  const lons = valid.map((p) => p[1])
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLon = Math.min(...lons)
  const maxLon = Math.max(...lons)
  const spanLat = maxLat - minLat || 1
  const spanLon = maxLon - minLon || 1

  const toXY = ([la, lo]: [number, number]) => {
    const x = pad + ((lo - minLon) / spanLon) * (W - pad * 2)
    const y = pad + ((maxLat - la) / spanLat) * (H - pad * 2) // invert lat for screen
    return [x, y] as const
  }

  const xy = valid.map(toXY)
  const d = xy.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const cur = xy[progressIndex ?? xy.length - 1]
  const start = xy[0]
  const end = xy[xy.length - 1]

  return (
    <svg className="route-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <path d={d} fill="none" stroke="#e65100" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
      <circle cx={start[0]} cy={start[1]} r="3" fill="#847f7a" />
      <circle cx={end[0]} cy={end[1]} r="3.5" fill="#43c267" />
      <circle cx={cur[0]} cy={cur[1]} r="4.5" fill="#e65100" stroke="#fff" strokeWidth="1.5" />
    </svg>
  )
}
