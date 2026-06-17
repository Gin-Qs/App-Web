import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '../config'

export function LoginPage() {
  const { session, loading, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && session) return <Navigate to="/app" replace />

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await signIn(email.trim(), password)
      navigate('/app', { replace: true })
    } catch {
      setError('Correo o contraseña incorrectos.')
    } finally {
      setSubmitting(false)
    }
  }

  function fillDemo(demoEmail: string) {
    setEmail(demoEmail)
    setPassword(DEMO_PASSWORD)
    setError(null)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="back-link">
          ← Volver al sitio
        </Link>
        <h1>Iniciar sesión</h1>
        <p className="muted">Accede a tu panel de cliente o de operaciones.</p>

        <form onSubmit={handleSubmit} className="form">
          <label>
            Correo
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error && <div className="notice error">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Entrando…' : 'Continuar'}
          </button>
        </form>

        <div className="demo-box">
          <span className="demo-title">Cuentas de demostración</span>
          <div className="demo-buttons">
            {DEMO_ACCOUNTS.map((acc) => (
              <button key={acc.email} className="btn btn-outline btn-sm" onClick={() => fillDemo(acc.email)}>
                {acc.label}
              </button>
            ))}
          </div>
          <span className="demo-hint">Contraseña: {DEMO_PASSWORD}</span>
        </div>
      </div>
    </div>
  )
}
