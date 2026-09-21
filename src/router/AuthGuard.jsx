import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../features/auth/store/authStore'

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#010828',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        border: '3px solid rgba(255,255,255,0.1)',
        borderTopColor: '#7c3aed',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: '12px', letterSpacing: '2px' }}>
        ĐANG TẢI...
      </p>
    </div>
  )
}

export default function RequireAuth({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isInitializing = useAuthStore((state) => state.isInitializing)
  const location = useLocation()

  if (isInitializing) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export function GuestOnlyRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isInitializing = useAuthStore((state) => state.isInitializing)

  if (isInitializing) {
    return <LoadingScreen />
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  return children
}