import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../stores/authStore'

interface Props {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function AuthGuard({ children, requireAdmin = false }: Props) {
  const { user, loading } = useAuthContext()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>로딩 중...</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  if (user.status === 'PENDING') return <Navigate to="/pending" replace />

  if (user.status === 'BANNED') return <Navigate to="/banned" replace />

  if (user.status === 'REJECTED') return <Navigate to="/login" replace />

  if (requireAdmin && !user.is_admin) return <Navigate to="/" replace />

  return <>{children}</>
}
