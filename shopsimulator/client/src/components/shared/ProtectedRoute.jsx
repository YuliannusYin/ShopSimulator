import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

export default function ProtectedRoute({ children, roles }) {
  const { token, user } = useAuthStore()

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(user.role)) {
    const defaultPaths = {
      admin: '/admin',
      merchant: '/merchant',
      user: '/',
    }
    return <Navigate to={defaultPaths[user.role] || '/'} replace />
  }

  return children
}
