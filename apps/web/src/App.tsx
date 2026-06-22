import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './auth/AuthProvider'
import { LandingPage } from './pages/LandingPage'
import { TechnologyPage } from './pages/TechnologyPage'
import { SupportPage } from './pages/SupportPage'
import { RastreoPage } from './pages/RastreoPage'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { TripDetailPage } from './pages/TripDetailPage'
import { AppShell } from './components/AppShell'

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { session, loading } = useAuth()
  if (loading) {
    return <div className="page-loading">Cargando…</div>
  }
  if (!session) return <Navigate to="/login" replace />
  return children
}

/** Scrolls to #hash sections after route changes (so /#nosotros works from any page). */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        // wait a tick for the target route/section to render
        const t = setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
        return () => clearTimeout(t)
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])
  return null
}

export function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tecnologia" element={<TechnologyPage />} />
        <Route path="/soporte" element={<SupportPage />} />
        <Route path="/rastreo" element={<RastreoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/app" element={<DashboardPage />} />
          <Route path="/app/trips/:tripId" element={<TripDetailPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
