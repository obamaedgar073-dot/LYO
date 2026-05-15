// ==================== PROTECTED ROUTE ====================

import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
