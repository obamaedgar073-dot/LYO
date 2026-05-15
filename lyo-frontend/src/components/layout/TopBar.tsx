// ==================== TOP BAR ====================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, PlusCircle } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { userApi } from '@/services/api'

export default function TopBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const debouncedQuery = useDebounce(searchQuery, 300)
  const navigate = useNavigate()

  useState(() => {
    if (debouncedQuery.length >= 2) {
      userApi.search(debouncedQuery).then((res) => {
        setSearchResults(res.data)
        setShowResults(true)
      })
    }
  })

  return (
    <header className="h-16 bg-white dark:bg-lyo-card border-b border-gray-200 dark:border-lyo-border flex items-center px-4 gap-4">
      {/* Search */}
      <div className="flex-1 max-w-xl relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users, posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
          />
        </div>
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-lyo-card rounded-xl shadow-lg border border-gray-200 dark:border-lyo-border overflow-hidden z-50">
            {searchResults.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  navigate(`/${user.username}`)
                  setShowResults(false)
                  setSearchQuery('')
                }}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <img src={user.avatarUrl || '/default-avatar.png'} className="w-10 h-10 rounded-full" />
                <div className="text-left">
                  <p className="font-medium dark:text-white">{user.displayName}</p>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Create Post Button */}
      <button
        onClick={() => navigate('/?create=true')}
        className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
      >
        <PlusCircle className="w-5 h-5" />
        <span className="hidden sm:inline font-medium">Create</span>
      </button>
    </header>
  )
}
