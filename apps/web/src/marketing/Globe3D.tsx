import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Interactive 3D route globe: routes radiate from Toluca (the Fleeter hub) to
// cities across Mexico, with travelling pulses. Lazy-loaded; a CSS fallback is
// shown by the parent when WebGL is missing or motion is reduced.

const HUB = { lat: 19.2826, lon: -99.6557, name: 'Toluca' }
const CITIES = [
  { lat: 19.4326, lon: -99.1332 }, // CDMX
  { lat: 19.0414, lon: -98.2063 }, // Puebla
  { lat: 20.6597, lon: -103.3496 }, // Guadalajara
  { lat: 25.6866, lon: -100.3161 }, // Monterrey
  { lat: 19.1738, lon: -96.1342 }, // Veracruz
  { lat: 20.5888, lon: -100.3899 }, // Querétaro
]

const R = 1.6

function toVec(lat: number, lon: number, radius = R) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

function Dots() {
  const geom = useMemo(() => {
    const pts: number[] = []
    const n = 700
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const phi = i * Math.PI * (3 - Math.sqrt(5))
      pts.push(Math.cos(phi) * r * R, y * R, Math.sin(phi) * r * R)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return g
  }, [])
  return (
    <points geometry={geom}>
      <pointsMaterial color="#6b6560" size={0.022} sizeAttenuation transparent opacity={0.55} />
    </points>
  )
}

function Arc({ from, to, offset }: { from: THREE.Vector3; to: THREE.Vector3; offset: number }) {
  const dotRef = useRef<THREE.Mesh>(null)
  const curve = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5)
    const lift = 1 + from.distanceTo(to) * 0.35
    mid.setLength(R * lift)
    return new THREE.QuadraticBezierCurve3(from, mid, to)
  }, [from, to])

  const line = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(curve.getPoints(60))
    const m = new THREE.LineBasicMaterial({ color: '#e65100', transparent: true, opacity: 0.5 })
    return new THREE.Line(g, m)
  }, [curve])

  useFrame(({ clock }) => {
    if (!dotRef.current) return
    const t = (clock.getElapsedTime() * 0.18 + offset) % 1
    const p = curve.getPointAt(t)
    dotRef.current.position.copy(p)
    const s = 0.5 + Math.sin(t * Math.PI) * 0.9
    dotRef.current.scale.setScalar(s)
  })

  return (
    <group>
      <primitive object={line} />
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color="#ff7a33" />
      </mesh>
    </group>
  )
}

function Scene({ spin }: { spin: boolean }) {
  const group = useRef<THREE.Group>(null)
  const hub = useMemo(() => toVec(HUB.lat, HUB.lon), [])
  const targets = useMemo(() => CITIES.map((c) => toVec(c.lat, c.lon)), [])

  useFrame((_, delta) => {
    if (group.current && spin) group.current.rotation.y += delta * 0.12
  })

  return (
    <group ref={group} rotation={[0.35, 0, 0.1]}>
      {/* core */}
      <mesh>
        <sphereGeometry args={[R * 0.985, 48, 48]} />
        <meshStandardMaterial color="#17171a" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* glow shell */}
      <mesh>
        <sphereGeometry args={[R * 1.02, 32, 32]} />
        <meshBasicMaterial color="#e65100" transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>
      <Dots />
      {targets.map((t, i) => (
        <Arc key={i} from={hub} to={t} offset={i / targets.length} />
      ))}
      {/* hub marker */}
      <mesh position={hub.clone().setLength(R * 1.01)}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#ff7a33" />
      </mesh>
    </group>
  )
}

export default function Globe3D({ spin = true }: { spin?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 2, 4]} intensity={1.1} />
      <Scene spin={spin} />
    </Canvas>
  )
}
