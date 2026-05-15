// ==================== POST CARD ====================

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Flame, Laugh, Lightbulb, ThumbsUp } from 'lucide-react'
import { Post, VibeType } from '@/types'
import { postApi } from '@/services/api'
import { formatDistanceToNow } from 'date-fns'

type VibeConfig = {
  icon: typeof Heart
  label: string
  color: string
  activeColor: string
}

const vibes: Record<VibeType, VibeConfig> = {
  HEART: { icon: Heart, label: 'Love', color: 'text-gray-500', activeColor: 'text-red-500 fill-red-500' },
  FIRE: { icon: Flame, label: 'Fire', color: 'text-gray-500', activeColor: 'text-orange-500 fill-orange-500' },
  LAUGH: { icon: Laugh, label: 'Haha', color: 'text-gray-500', activeColor: 'text-yellow-500 fill-yellow-500' },
  IDEA: { icon: Lightbulb, label: 'Insight', color: 'text-gray-500', activeColor: 'text-purple-500 fill-purple-500' },
  COOL: { icon: ThumbsUp, label: 'Cool', color: 'text-gray-500', activeColor: 'text-blue-500 fill-blue-500' },
}

interface PostCardProps {
  post: Post
  onDelete?: (id: string) => void
}

export default function PostCard({ post, onDelete }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [activeVibe, setActiveVibe] = useState<VibeType | null>(post.likedVibe || null)
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked)
  const [showVibePicker, setShowVibePicker] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)

  const handleVibe = async (vibe: VibeType) => {
    try {
      if (activeVibe === vibe) {
        await postApi.unlike(post.id)
        setIsLiked(false)
        setActiveVibe(null)
        setLikeCount((c) => c - 1)
      } else {
        await postApi.like(post.id, vibe)
        setIsLiked(true)
        setActiveVibe(vibe)
        if (!isLiked) setLikeCount((c) => c + 1)
      }
      setShowVibePicker(false)
    } catch (error) {
      console.error('Failed to vibe:', error)
    }
  }

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await postApi.unbookmark(post.id)
      } else {
        await postApi.bookmark(post.id)
      }
      setIsBookmarked(!isBookmarked)
    } catch (error) {
      console.error('Failed to bookmark:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return
    try {
      await postApi.delete(post.id)
      setIsDeleted(true)
      onDelete?.(post.id)
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  if (isDeleted) return null

  return (
    <article className="bg-white dark:bg-lyo-card rounded-2xl border border-gray-200 dark:border-lyo-border p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <Link to={`/${post.author.username}`} className="flex items-center gap-3">
          <img
            src={post.author.avatarUrl || '/default-avatar.png'}
            alt={post.author.displayName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{post.author.displayName}</p>
            <p className="text-sm text-gray-500">
              @{post.author.username} · {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </Link>
        <div className="relative">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-900 dark:text-gray-100 mb-3 whitespace-pre-wrap">{post.content}</p>

      {/* Media */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className={`grid gap-2 mb-3 ${post.mediaUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {post.mediaUrls.map((media, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              {media.type === 'image' ? (
                <img src={media.url} alt="" className="w-full h-64 object-cover" loading="lazy" />
              ) : (
                <video src={media.url} controls className="w-full h-64 object-cover" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-1">
          {/* Vibe Button */}
          <div className="relative">
            <button
              onClick={() => setShowVibePicker(!showVibePicker)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                isLiked ? vibes[activeVibe!].activeColor : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {activeVibe ? (
                <>{(() => {
                  const Icon = vibes[activeVibe].icon
                  return <Icon className="w-5 h-5" />
                })()} <span>{likeCount}</span></>
              ) : (
                <><Heart className="w-5 h-5" /> <span>{likeCount}</span></>
              )}
            </button>

            {/* Vibe Picker */}
            {showVibePicker && (
              <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-lyo-card rounded-xl shadow-lg border border-gray-200 dark:border-lyo-border p-2 flex gap-1 z-10">
                {(Object.keys(vibes) as VibeType[]).map((vibe) => {
                  const config = vibes[vibe]
                  const Icon = config.icon
                  return (
                    <button
                      key={vibe}
                      onClick={() => handleVibe(vibe)}
                      className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                        activeVibe === vibe ? config.activeColor : config.color
                      }`}
                      title={config.label}
                    >
                      <Icon className="w-6 h-6" />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <button className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span>{post.commentCount}</span>
          </button>

          <button className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
            <Share2 className="w-5 h-5" />
            <span>{post.shareCount}</span>
          </button>
        </div>

        <button
          onClick={handleBookmark}
          className={`p-2 rounded-xl transition-colors ${
            isBookmarked ? 'text-primary-500' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>
    </article>
  )
}
