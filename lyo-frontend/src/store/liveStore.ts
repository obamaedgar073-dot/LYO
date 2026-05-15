// ==================== LIVE STREAM STORE ====================

import { create } from 'zustand'
import { LiveStream, LiveChatMessage } from '@/types'

interface LiveState {
  streams: LiveStream[]
  activeStream: LiveStream | null
  isStreaming: boolean
  myStream: LiveStream | null
  chatMessages: LiveChatMessage[]
  viewerCount: number
  isBanned: boolean
  setStreams: (streams: LiveStream[]) => void
  setActiveStream: (stream: LiveStream | null) => void
  setIsStreaming: (isStreaming: boolean) => void
  setMyStream: (stream: LiveStream | null) => void
  addChatMessage: (message: LiveChatMessage) => void
  setViewerCount: (count: number) => void
  setIsBanned: (isBanned: boolean) => void
  updateStreamStatus: (streamId: string, status: string) => void
}

export const useLiveStore = create<LiveState>((set) => ({
  streams: [],
  activeStream: null,
  isStreaming: false,
  myStream: null,
  chatMessages: [],
  viewerCount: 0,
  isBanned: false,

  setStreams: (streams) => set({ streams }),
  setActiveStream: (stream) => set({ activeStream: stream, chatMessages: [] }),
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  setMyStream: (stream) => set({ myStream: stream }),
  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message].slice(-100),
    })),
  setViewerCount: (count) => set({ viewerCount: count }),
  setIsBanned: (isBanned) => set({ isBanned }),
  updateStreamStatus: (streamId, status) =>
    set((state) => ({
      streams: state.streams.map((s) =>
        s.id === streamId ? { ...s, status: status as any } : s
      ),
    })),
}))
