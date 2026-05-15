// ==================== STORY RING ====================
// Circular avatar with colored ring for unviewed stories

import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { StoryGroup } from '@/types'

interface StoryRingProps {
  storyGroup?: StoryGroup
  isMyStory?: boolean
  onCreate?: () => void
}

export default function StoryRing({ storyGroup, isMyStory, onCreate }: StoryRingProps) {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  if (isMyStory) {
    return (
      <button
        onClick={onCreate}
        className="flex flex-col items-center gap-1 min-w-[72px]"
      >
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-primary-500 transition-colors">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} className="w-14 h-14 rounded-full object-cover" />
          ) : (
            <Plus className="w-6 h-6 text-gray-400" />
          )}
        </div>
        <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[72px]">Your Story</span>
      </button>
    )
  }

  if (!storyGroup) return null

  const { user: storyUser, hasUnviewed } = storyGroup

  return (
    <button
      onClick={() => navigate('/stories', { state: { storyGroup } })}
      className="flex flex-col items-center gap-1 min-w-[72px]"
    >
      <div className={`w-16 h-16 rounded-full p-[3px] ${
        hasUnviewed
          ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500'
          : 'bg-gray-200 dark:bg-gray-700'
      }`}>
        <img
          src={storyUser.avatarUrl || '/default-avatar.png'}
          alt={storyUser.displayName}
          className="w-full h-full rounded-full object-cover border-2 border-white dark:border-lyo-dark"
        />
      </div>
      <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[72px]">
        {storyUser.displayName}
      </span>
    </button>
  )
}
