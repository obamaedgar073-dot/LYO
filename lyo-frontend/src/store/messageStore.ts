// ==================== MESSAGE STORE ====================

import { create } from 'zustand'
import { Chat, Message } from '@/types'

interface MessageState {
  chats: Chat[]
  activeChat: Chat | null
  messages: Record<string, Message[]>
  typingUsers: Record<string, string[]>
  unreadCounts: Record<string, number>
  setChats: (chats: Chat[]) => void
  setActiveChat: (chat: Chat | null) => void
  addMessage: (chatId: string, message: Message) => void
  updateMessage: (chatId: string, messageId: string, updates: Partial<Message>) => void
  deleteMessage: (chatId: string, messageId: string) => void
  setTyping: (chatId: string, userId: string, isTyping: boolean) => void
  setUnreadCount: (chatId: string, count: number) => void
  addChat: (chat: Chat) => void
  removeChat: (chatId: string) => void
}

export const useMessageStore = create<MessageState>((set) => ({
  chats: [],
  activeChat: null,
  messages: {},
  typingUsers: {},
  unreadCounts: {},

  setChats: (chats) => set({ chats }),
  setActiveChat: (chat) => set({ activeChat: chat }),

  addMessage: (chatId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), message],
      },
    })),

  updateMessage: (chatId, messageId, updates) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: state.messages[chatId]?.map((m) =>
          m.id === messageId ? { ...m, ...updates } : m
        ) || [],
      },
    })),

  deleteMessage: (chatId, messageId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: state.messages[chatId]?.map((m) =>
          m.id === messageId ? { ...m, isDeleted: true, content: '[Deleted]' } : m
        ) || [],
      },
    })),

  setTyping: (chatId, userId, isTyping) =>
    set((state) => {
      const current = state.typingUsers[chatId] || []
      const updated = isTyping
        ? [...new Set([...current, userId])]
        : current.filter((id) => id !== userId)
      return { typingUsers: { ...state.typingUsers, [chatId]: updated } }
    }),

  setUnreadCount: (chatId, count) =>
    set((state) => ({
      unreadCounts: { ...state.unreadCounts, [chatId]: count },
    })),

  addChat: (chat) =>
    set((state) => ({
      chats: [chat, ...state.chats],
    })),

  removeChat: (chatId) =>
    set((state) => ({
      chats: state.chats.filter((c) => c.id !== chatId),
      activeChat: state.activeChat?.id === chatId ? null : state.activeChat,
    })),
}))
