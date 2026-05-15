// ==================== STORY STORE ====================

import { create } from 'zustand'
import { StoryGroup, Story } from '@/types'

interface StoryState {
  storyGroups: StoryGroup[]
  activeStoryGroup: StoryGroup | null
  activeStoryIndex: number
  myStories: Story[]
  setStoryGroups: (groups: StoryGroup[]) => void
  setActiveStoryGroup: (group: StoryGroup | null) => void
  setActiveStoryIndex: (index: number) => void
  markStoryViewed: (userId: string, storyId: string) => void
  setMyStories: (stories: Story[]) => void
  addStory: (story: Story) => void
}

export const useStoryStore = create<StoryState>((set) => ({
  storyGroups: [],
  activeStoryGroup: null,
  activeStoryIndex: 0,
  myStories: [],

  setStoryGroups: (groups) => set({ storyGroups: groups }),
  setActiveStoryGroup: (group) => set({ activeStoryGroup: group, activeStoryIndex: 0 }),
  setActiveStoryIndex: (index) => set({ activeStoryIndex: index }),

  markStoryViewed: (userId, storyId) =>
    set((state) => ({
      storyGroups: state.storyGroups.map((g) =>
        g.user.id === userId
          ? {
              ...g,
              stories: g.stories.map((s) =>
                s.id === storyId ? { ...s, hasViewed: true } : s
              ),
              hasUnviewed: g.stories.some((s) => s.id !== storyId && !s.hasViewed),
            }
          : g
      ),
    })),

  setMyStories: (stories) => set({ myStories: stories }),
  addStory: (story) => set((state) => ({ myStories: [story, ...state.myStories] })),
}))
