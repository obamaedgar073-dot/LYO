// ==================== INFINITE SCROLL HOOK ====================

import { useEffect, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'

interface UseInfiniteScrollOptions {
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
}

export function useInfiniteScroll({ onLoadMore, hasMore, isLoading }: UseInfiniteScrollOptions) {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  })

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      onLoadMore()
    }
  }, [inView, hasMore, isLoading, onLoadMore])

  return { ref }
}
