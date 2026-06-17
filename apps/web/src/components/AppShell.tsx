import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { ThemeToggle } from './ThemeToggle'

export function AppShell() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()

  const roleLabel =
    profile?.role === 'customer'
      ? 'Cliente'
      : profile?.role === 'employee'
        ? 'Empleado'
        : profile?.role === 'admin'
          ? 'Admin'
          : ''

  async function handleLogout() {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="app-shell">
      <header className="app-bar">
        <Link to="/app" className="brand">
          Fleet<span>er</span>
        </Link>
        <div className="app-bar-right">
          <div className="who">
            <strong>{profile?.full_name ?? 'Usuario'}</strong>
            <span className="who-meta">
              {roleLabel}
              {profile?.company?.name ? ` · ${profile.company.name}` : ''}
            </span>
          </div>
          <ThemeToggle />
          <button className="btn btn-ghost" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
