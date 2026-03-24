import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, adminOnly = false, attendeeOnly = false, requireAuth = true }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1410]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b45309]"></div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  if (attendeeOnly && isAdmin) {
    return <Navigate to="/host" replace />
  }

  return children
}

export default ProtectedRoute

