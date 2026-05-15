// ==================== MOBILE NAVIGATION ====================

import { NavLink } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Home, Search, MessageCircle, Video, User } from 'lucide-react'

export default function MobileNav() {
  const { user } = useAuthStore()

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/explore', icon: Search, label: 'Explore' },
    { to: '/messages', icon: MessageCircle, label: 'Messages' },
    { to: '/live', icon: Video, label: 'Live' },
    { to: `/${user?.username}`, icon: User, label: 'Profile' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-lyo-card border-t border-gray-200 dark:border-lyo-border z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 ${
                isActive ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
