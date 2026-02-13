import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRole?: 'donor' | 'volunteer' | 'admin'
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const { user, token } = useAuthStore()

  // If no token or user, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  // If role is specified and doesn't match, redirect to appropriate dashboard
  if (allowedRole && user.role !== allowedRole) {
    if (user.role === 'donor') {
      return <Navigate to="/donor/dashboard" replace />
    } else if (user.role === 'volunteer') {
      return <Navigate to="/volunteer/dashboard" replace />
    } else {
      return <Navigate to="/admin/dashboard" replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
