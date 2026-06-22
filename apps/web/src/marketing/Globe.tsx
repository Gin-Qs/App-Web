import { Component, lazy, Suspense, useMemo, type ReactNode } from 'react'

const Globe3D = lazy(() => import('./Globe3D'))

function webglSupported(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl') || c.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

class GlobeBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/** Flat, always-renderable route-globe (SVG). Hub = Toluca. */
export function GlobeFallback() {
  return (
    <div className="globe-flat" aria-hidden="true">
      <svg viewBox="0 0 320 320" className="globe-flat-svg">
        <defs>
          <radialGradient id="globeFill" cx="38%" cy="32%" r="80%">
            <stop offset="0%" stopColor="#26262b" />
            <stop offset="100%" stopColor="#121214" />
          </radialGradient>
        </defs>
        <circle cx="160" cy="160" r="120" fill="url(#globeFill)" stroke="rgba(255,255,255,0.08)" />
        {/* latitudes */}
        <ellipse cx="160" cy="160" rx="120" ry="40" fill="none" stroke="rgba(255,255,255,0.07)" />
        <ellipse cx="160" cy="160" rx="120" ry="82" fill="none" stroke="rgba(255,255,255,0.06)" />
        {/* longitudes */}
        <ellipse cx="160" cy="160" rx="42" ry="120" fill="none" stroke="rgba(255,255,255,0.07)" />
        <ellipse cx="160" cy="160" rx="84" ry="120" fill="none" stroke="rgba(255,255,255,0.06)" />
        <circle cx="160" cy="160" r="120" fill="none" stroke="rgba(255,255,255,0.1)" />
        {/* routes from hub */}
        <g fill="none" stroke="#e65100" strokeWidth="2" opacity="0.7">
          <path d="M150 175 Q 120 110 96 96" />
          <path d="M150 175 Q 200 150 234 120" />
          <path d="M150 175 Q 175 230 210 246" />
          <path d="M150 175 Q 96 200 84 168" />
        </g>
        <circle cx="96" cy="96" r="4" fill="#43c267" />
        <circle cx="234" cy="120" r="4" fill="#43c267" />
        <circle cx="210" cy="246" r="4" fill="#43c267" />
        <circle cx="84" cy="168" r="4" fill="#43c267" />
        <circle className="globe-hub-halo" cx="150" cy="175" r="11" fill="#e65100" opacity="0.3" />
        <circle cx="150" cy="175" r="5.5" fill="#ff7a33" stroke="#fff" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

export function GlobeVisual() {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const use3d = useMemo(() => webglSupported() && !reduce, [reduce])

  return (
    <div className="globe-stage">
      <div className="globe-glow" aria-hidden="true" />
      {use3d ? (
        <GlobeBoundary fallback={<GlobeFallback />}>
          <Suspense fallback={<GlobeFallback />}>
            <Globe3D spin />
          </Suspense>
        </GlobeBoundary>
      ) : (
        <GlobeFallback />
      )}
    </div>
  )
}
