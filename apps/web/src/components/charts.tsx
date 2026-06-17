// Lightweight dependency-free SVG charts for the analytics view.

export function Sparkline({
  data,
  height = 56,
  color = 'var(--accent)',
  fill = true,
}: {
  data: number[]
  height?: number
  color?: string
  fill?: boolean
}) {
  const W = 240
  const H = height
  const pad = 4
  if (data.length < 2) return <div className="chart" style={{ height }} />
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const stepX = (W - pad * 2) / (data.length - 1)
  const pts = data.map((v, i) => {
    const x = pad + i * stepX
    const y = pad + (1 - (v - min) / span) * (H - pad * 2)
    return [x, y] as const
  })
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${H} L${pts[0][0].toFixed(1)} ${H} Z`
  const id = `g${Math.round(min * 1000)}-${data.length}`
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height }}>
      {fill && (
        <>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${id})`} />
        </>
      )}
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function BarChart({
  data,
  labels,
  height = 90,
  color = 'var(--accent)',
}: {
  data: number[]
  labels?: string[]
  height?: number
  color?: string
}) {
  const max = Math.max(...data, 1)
  return (
    <div className="barchart" style={{ height }}>
      {data.map((v, i) => (
        <div className="bar-col" key={i}>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ height: `${(v / max) * 100}%`, background: color }}
              title={String(v)}
            />
          </div>
          {labels && <span className="bar-label">{labels[i]}</span>}
        </div>
      ))}
    </div>
  )
}

/** Circular progress gauge for a 0–100 percentage. */
export function Gauge({ value, size = 96, color = 'var(--accent)' }: { value: number; size?: number; color?: string }) {
  const r = size / 2 - 8
  const c = 2 * Math.PI * r
  const off = c * (1 - Math.max(0, Math.min(100, value)) / 100)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="gauge">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--glass-border)" strokeWidth="8" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={off}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" className="gauge-text">
        {Math.round(value)}%
      </text>
    </svg>
  )
}
