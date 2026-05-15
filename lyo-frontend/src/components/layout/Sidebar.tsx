// ==================== SIDEBAR ====================

import { NavLink } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useNotificationStore } from '@/store/notificationStore'
import {
  Home, Search, MessageCircle, Bell, User, Settings,
  Video, Bookmark, LogOut, Shield
} from 'lucide-react'

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const { unreadCount } = useNotificationStore()

  const navItems = [
    { to: '/', icon: Home, label: 'Feed' },
    { to: '/explore', icon: Search, label: 'Explore' },
    { to: '/messages', icon: MessageCircle, label: 'Messages' },
    { to: '/live', icon: Video, label: 'Live' },
    { to: '/notifications', icon: Bell, label: 'Notifications', badge: unreadCount },
    { to: `/${user?.username}`, icon: User, label: 'Profile' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="flex flex-col h-full p-4">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-xl">L</span>
        </div>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">LYO</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
            {item.badge ? (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      {/* Admin Link */}
      {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-3 rounded-xl transition-colors mb-2 ${
              isActive
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`
          }
        >
          <Shield className="w-5 h-5" />
          <span className="font-medium">Admin Panel</span>
        </NavLink>
      )}

      {/* User Profile */}
      <div className="border-t border-gray-200 dark:border-lyo-border pt-4 mt-4">
        <div className="flex items-center gap-3 px-2 mb-3">
          <img
            src={user?.avatarUrl || '/default-avatar.png'}
            alt={user?.displayName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate">{user?.displayName}</p>
            <p className="text-sm text-gray-500 truncate">@{user?.username}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}
