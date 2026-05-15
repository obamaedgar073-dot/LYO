import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import { useSocket } from './hooks/useSocket'

// Layouts
import MainLayout from './components/layout/MainLayout'
import AdminLayout from './components/layout/AdminLayout'

// User Pages
import Feed from './pages/user/Feed'
import Explore from './pages/user/Explore'
import Profile from './pages/user/Profile'
import Messages from './pages/user/Messages'
import StoryViewer from './pages/user/StoryViewer'
import LiveStreams from './pages/user/LiveStreams'
import LiveStreamView from './pages/user/LiveStreamView'
import Notifications from './pages/user/Notifications'
import Settings from './pages/user/Settings'

// Auth Pages
import Login from './pages/user/Login'
import Register from './pages/user/Register'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminModeration from './pages/admin/Moderation'
import AdminReports from './pages/admin/Reports'
import AdminAppeals from './pages/admin/Appeals'
import AdminAnalytics from './pages/admin/Analytics'

// Components
import ProtectedRoute from './components/features/ProtectedRoute'
import AdminRoute from './components/features/AdminRoute'

function App() {
  const { checkAuth } = useAuthStore()
  const { connect } = useSocket()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      connect(token)
    }
  }, [connect])

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Feed />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:chatId" element={<Messages />} />
          <Route path="/stories" element={<StoryViewer />} />
          <Route path="/live" element={<LiveStreams />} />
          <Route path="/live/:streamId" element={<LiveStreamView />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/:username" element={<Profile />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>  
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/moderation" element={<AdminModeration />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/appeals" element={<AdminAppeals />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
