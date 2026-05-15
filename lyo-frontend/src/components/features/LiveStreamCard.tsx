// ==================== LIVE STREAM CARD ====================

import { useNavigate } from 'react-router-dom'
import { Video, Users, Radio } from 'lucide-react'
import { LiveStream } from '@/types'

interface LiveStreamCardProps {
  stream: LiveStream
}

export default function LiveStreamCard({ stream }: LiveStreamCardProps) {
  const navigate = useNavigate()
  const isLive = stream.status === 'LIVE'

  return (
    <button
      onClick={() => navigate(`/live/${stream.id}`)}
      className="relative bg-white dark:bg-lyo-card rounded-2xl overflow-hidden border border-gray-200 dark:border-lyo-border hover:shadow-lg transition-shadow"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-900">
        {stream.thumbnailUrl ? (
          <img src={stream.thumbnailUrl} alt={stream.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Video className="w-12 h-12 text-gray-600" />
          </div>
        )}

        {/* Live Badge */}
        {isLive && (
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            <Radio className="w-4 h-4 animate-pulse" />
            LIVE
          </div>
        )}

        {/* Viewer Count */}
        {isLive && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded-lg text-sm">
            <Users className="w-4 h-4" />
            {stream.viewerCount}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <img
            src={stream.user.avatarUrl || '/default-avatar.png'}
            alt={stream.user.displayName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{stream.user.displayName}</p>
            <p className="text-sm text-gray-500">@{stream.user.username}</p>
          </div>
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{stream.title}</h3>
        {stream.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{stream.description}</p>
        )}
      </div>
    </button>
  )
}
