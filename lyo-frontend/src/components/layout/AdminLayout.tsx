// ==================== ADMIN LAYOUT ====================
// Sidebar + Main content for admin dashboard

import { Outlet, NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Shield, Flag, MessageSquare,
  BarChart3, Settings, ArrowLeft
} from 'lucide-react'

export default function AdminLayout() {
  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/moderation', icon: Shield, label: 'Moderation Queue' },
    { to: '/admin/reports', icon: Flag, label: 'Reports' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/appeals', icon: MessageSquare, label: 'Appeals' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ]

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-lyo-dark">
      {/* Admin Sidebar */}
      <aside className="w-64 flex-col border-r border-gray-200 dark:border-lyo-border bg-white dark:bg-lyo-card flex">
        <div className="p-4 border-b border-gray-200 dark:border-lyo-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">L</span>
            </div>
            <span className="text-xl font-bold dark:text-white">LYO Admin</span>
          </div>
          <NavLink
            to="/"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to App</span>
          </NavLink>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
