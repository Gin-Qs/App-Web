import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './auth/AuthProvider'
import { LandingPage } from './pages/LandingPage'
import { ServicesPage } from './pages/ServicesPage'
import { TechnologyPage } from './pages/TechnologyPage'
import { AboutPage } from './pages/AboutPage'
import { SupportPage } from './pages/SupportPage'
import { LoginPage } from './pages/LoginPage'
import { AppShell } from './components/AppShell'

// Heavy routes (Leaflet maps, charts) load on demand so the marketing site
// ships a small first bundle.
const RastreoPage = lazy(() => import('./pages/RastreoPage').then((m) => ({ default: m.RastreoPage })))
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const TripDetailPage = lazy(() => import('./pages/TripDetailPage').then((m) => ({ default: m.TripDetailPage })))

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
      <Suspense fallback={<div className="page-loading">Cargando…</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/tecnologia" element={<TechnologyPage />} />
          <Route path="/nosotros" element={<AboutPage />} />
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
      </Suspense>
    </>
  )
}
