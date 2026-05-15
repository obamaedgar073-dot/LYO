// ==================== STORY VIEWER ====================
// Full-screen story viewer with progress bar

import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { storyApi } from '@/services/api'
import { useStoryStore } from '@/store/storyStore'
import { X, Heart, Send, ChevronLeft, ChevronRight } from 'lucide-react'

export default function StoryViewer() {
  const navigate = useNavigate()
  const location = useLocation()
  const { storyGroups, activeStoryGroup, setActiveStoryGroup, activeStoryIndex, setActiveStoryIndex, markStoryViewed } = useStoryStore()
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const group = activeStoryGroup || location.state?.storyGroup || storyGroups[0]
  const story = group?.stories[activeStoryIndex]

  const nextStory = useCallback(() => {
    if (!group) return
    if (activeStoryIndex < group.stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1)
      setProgress(0)
    } else {
      const currentIndex = storyGroups.findIndex((g) => g.user.id === group.user.id)
      if (currentIndex < storyGroups.length - 1) {
        setActiveStoryGroup(storyGroups[currentIndex + 1])
        setProgress(0)
      } else {
        navigate('/')
      }
    }
  }, [group, activeStoryIndex, storyGroups, setActiveStoryIndex, setActiveStoryGroup, navigate])

  const prevStory = useCallback(() => {
    if (!group) return
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1)
      setProgress(0)
    } else {
      const currentIndex = storyGroups.findIndex((g) => g.user.id === group.user.id)
      if (currentIndex > 0) {
        const prevGroup = storyGroups[currentIndex - 1]
        setActiveStoryGroup(prevGroup)
        setActiveStoryIndex(prevGroup.stories.length - 1)
        setProgress(0)
      }
    }
  }, [group, activeStoryIndex, storyGroups, setActiveStoryIndex, setActiveStoryGroup])

  useEffect(() => {
    if (!story || isPaused) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextStory()
          return 0
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(interval)
  }, [story, isPaused, nextStory])

  useEffect(() => {
    if (story && !story.hasViewed) {
      storyApi.view(story.id)
      markStoryViewed(story.userId, story.id)
    }
  }, [story, markStoryViewed])

  if (!group || !story) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p>No stories available</p>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Story Content */}
      <div className="relative w-full max-w-md h-full max-h-[90vh]">
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
          {group.stories.map((_, i) => (
            <div key={i} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width: `${i < activeStoryIndex ? 100 : i === activeStoryIndex ? progress : 0}%`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 flex items-center gap-3 z-10">
          <img src={group.user.avatarUrl || '/default-avatar.png'} className="w-10 h-10 rounded-full border-2 border-white" />
          <div className="flex-1">
            <p className="text-white font-medium">{group.user.displayName}</p>
            <p className="text-white/70 text-sm">@{group.user.username}</p>
          </div>
          <button onClick={() => navigate('/')} className="text-white p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Media */}
        <div
          className="w-full h-full flex items-center justify-center"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {story.mediaType === 'VIDEO' ? (
            <video src={story.mediaUrl} autoPlay muted loop className="max-w-full max-h-full object-contain" />
          ) : (
            <img src={story.mediaUrl} alt="" className="max-w-full max-h-full object-contain" />
          )}
        </div>

        {/* Navigation */}
        <button
          onClick={prevStory}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={nextStory}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Footer */}
        <div className="absolute bottom-8 left-4 right-4 flex items-center gap-3">
          <input
            type="text"
            placeholder="Send a reaction..."
            className="flex-1 bg-white/20 backdrop-blur rounded-full px-4 py-2 text-white placeholder-white/70 focus:outline-none"
          />
          <button className="p-2 bg-white/20 backdrop-blur rounded-full text-white">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-2 bg-white/20 backdrop-blur rounded-full text-white">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
