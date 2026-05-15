// ==================== SOCKET.IO HOOK ====================
// Real-time WebSocket connection for messages, notifications, live streams

import { useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { useMessageStore } from '@/store/messageStore'
import { useNotificationStore } from '@/store/notificationStore'
import { useLiveStore } from '@/store/liveStore'
import { Message, Notification, LiveChatMessage } from '@/types'
import toast from 'react-hot-toast'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000'

export function useSocket() {
  const socketRef = useRef<Socket | null>(null)
  const { addMessage, updateMessage, deleteMessage, setTyping, addChat } = useMessageStore()
  const { addNotification } = useNotificationStore()
  const { addChatMessage, setViewerCount, setIsBanned } = useLiveStore()

  const connect = useCallback((token: string) => {
    if (socketRef.current?.connected) return

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    })

    socket.on('connect', () => {
      console.log('Socket connected')
    })

    // Message events
    socket.on('new_message', (message: Message & { chatId: string }) => {
      addMessage(message.chatId, message)
      // Show toast for new message if not in active chat
      const activeChat = useMessageStore.getState().activeChat
      if (activeChat?.id !== message.chatId) {
        toast(`${message.sender.displayName}: ${message.content.slice(0, 50)}`, {
          icon: '💬',
        })
      }
    })

    socket.on('message_edited', (message: Message & { chatId: string }) => {
      updateMessage(message.chatId, message.id, message)
    })

    socket.on('message_deleted', ({ messageId, chatId }: { messageId: string; chatId: string }) => {
      deleteMessage(chatId, messageId)
    })

    socket.on('message_reaction', ({ messageId, reaction }: { messageId: string; reaction: any }) => {
      // Reaction handling
    })

    socket.on('typing', ({ chatId, userId, isTyping }: { chatId: string; userId: string; isTyping: boolean }) => {
      setTyping(chatId, userId, isTyping)
    })

    // Chat events
    socket.on('new_chat', (chat: any) => {
      addChat(chat)
    })

    socket.on('chat_updated', (chat: any) => {
      // Update chat info
    })

    // Notification events
    socket.on('notification', (notification: Notification) => {
      addNotification(notification)
      if (!notification.isRead) {
        toast(notification.message || 'New notification', { icon: '🔔' })
      }
    })

    // Live stream events
    socket.on('live_started', (stream: any) => {
      toast(`${stream.streamer.displayName} is now live!`, { icon: '🔴' })
    })

    socket.on('live_chat_message', (message: LiveChatMessage) => {
      addChatMessage(message)
    })

    socket.on('viewer_joined', ({ viewerCount }: { viewerCount: number }) => {
      setViewerCount(viewerCount)
    })

    socket.on('viewer_left', ({ viewerCount }: { viewerCount: number }) => {
      setViewerCount(viewerCount)
    })

    socket.on('viewer_banned', ({ reason }: { reason: string }) => {
      setIsBanned(true)
      toast.error(`You have been banned from this stream: ${reason}`)
    })

    socket.on('stream_ended', () => {
      toast('Stream has ended')
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })

    socketRef.current = socket
  }, [addMessage, updateMessage, deleteMessage, setTyping, addChat, addNotification, addChatMessage, setViewerCount, setIsBanned])

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect()
    socketRef.current = null
  }, [])

  const emit = useCallback((event: string, data?: any) => {
    socketRef.current?.emit(event, data)
  }, [])

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return { connect, disconnect, emit, socket: socketRef.current }
}
