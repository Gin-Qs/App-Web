import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './auth/AuthProvider'
import { LandingPage } from './pages/LandingPage'
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

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
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
  )
}
