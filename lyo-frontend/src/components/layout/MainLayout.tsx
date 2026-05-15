// ==================== MAIN LAYOUT ====================
// Sidebar + Main content area for user-facing pages

import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import TopBar from './TopBar'

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-lyo-dark">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 dark:border-lyo-border bg-white dark:bg-lyo-card">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <Outlet />
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}
