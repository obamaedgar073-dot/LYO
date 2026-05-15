// ==================== ADMIN ROUTE ====================

import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function AdminRoute() {
  const { user, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'MODERATOR'
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />
}
