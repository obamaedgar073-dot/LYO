// ==================== FEED PAGE ====================

import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useInfiniteQuery } from '@tanstack/react-query'
import { postApi, storyApi } from '@/services/api'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import PostCard from '@/components/features/PostCard'
import StoryRing from '@/components/features/StoryRing'
import { StoryGroup } from '@/types'

export default function Feed() {
  const [searchParams] = useSearchParams()
  const showCreate = searchParams.get('create') === 'true'
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([])

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam = 1 }) => postApi.getFeed(pageParam).then((res) => res.data),
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === 20 ? pages.length + 1 : undefined,
    initialPageParam: 1,
  })

  const { ref } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasMore: !!hasNextPage,
    isLoading: isFetchingNextPage,
  })

  useEffect(() => {
    storyApi.getFeed().then((res) => setStoryGroups(res.data))
  }, [])

  const posts = data?.pages.flatMap((page) => page) || []

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20 md:pb-4">
      {/* Stories Row */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide mb-6 pb-2">
        <StoryRing isMyStory onCreate={() => {}} />
        {storyGroups.map((group) => (
          <StoryRing key={group.user.id} storyGroup={group} />
        ))}
      </div>

      {/* Create Post (if triggered) */}
      {showCreate && (
        <div className="bg-white dark:bg-lyo-card rounded-2xl border border-gray-200 dark:border-lyo-border p-4 mb-4">
          <textarea
            placeholder="What's on your mind?"
            className="w-full bg-transparent resize-none focus:outline-none dark:text-white"
            rows={3}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button className="px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
              Cancel
            </button>
            <button className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600">
              Post
            </button>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-lyo-card rounded-2xl h-48 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          <div ref={ref} className="h-10" />
          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
            </div>
          )}
        </>
      )}
    </div>
  )
}
