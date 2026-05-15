// ==================== MESSAGES PAGE ====================
// Full messaging interface with chat list and conversation

import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { messageApi } from '@/services/api'
import { useMessageStore } from '@/store/messageStore'
import { useAuthStore } from '@/store/authStore'
import ChatListItem from '@/components/features/ChatListItem'
import MessageBubble from '@/components/features/MessageBubble'
import { Send, Phone, Video, Info, ArrowLeft, Smile, Paperclip } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'

export default function Messages() {
  const { chatId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [newMessage, setNewMessage] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)

  const { chats, activeChat, setActiveChat, messages, setChats, addMessage, updateMessage, deleteMessage } = useMessageStore()

  // Fetch chats
  const { data: chatsData } = useQuery({
    queryKey: ['chats'],
    queryFn: () => messageApi.getChats().then((res) => res.data),
    enabled: !chatId,
  })

  useEffect(() => {
    if (chatsData) setChats(chatsData)
  }, [chatsData, setChats])

  // Fetch active chat
  const { data: chatData } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => messageApi.getChat(chatId!).then((res) => res.data),
    enabled: !!chatId,
  })

  useEffect(() => {
    if (chatData) setActiveChat(chatData)
  }, [chatData, setActiveChat])

  // Fetch messages
  const { data: messagesData } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => messageApi.getMessages(chatId!).then((res) => res.data),
    enabled: !!chatId,
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messagesData])

  // Send message
  const sendMutation = useMutation({
    mutationFn: (content: string) => messageApi.sendMessage(chatId!, { content }),
    onSuccess: (res) => {
      addMessage(chatId!, res.data)
      setNewMessage('')
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
  })

  const handleSend = () => {
    if (!newMessage.trim()) return
    sendMutation.mutate(newMessage)
  }

  const chatMessages = messages[chatId || ''] || []

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]">
      {/* Chat List */}
      <div className={`${chatId ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col border-r border-gray-200 dark:border-lyo-border bg-white dark:bg-lyo-card`}>
        <div className="p-4 border-b border-gray-200 dark:border-lyo-border">
          <h2 className="text-xl font-bold dark:text-white">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <ChatListItem key={chat.id} chat={chat} isActive={chat.id === chatId} />
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {chatId && activeChat ? (
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-lyo-dark">
          {/* Chat Header */}
          <div className="h-16 bg-white dark:bg-lyo-card border-b border-gray-200 dark:border-lyo-border flex items-center px-4 gap-3">
            <button onClick={() => navigate('/messages')} className="md:hidden p-2">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img
              src={activeChat.members.find(m => m.userId !== user?.id)?.user.avatarUrl || '/default-avatar.png'}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <p className="font-medium dark:text-white">
                {activeChat.type === 'DIRECT'
                  ? activeChat.members.find(m => m.userId !== user?.id)?.user.displayName
                  : activeChat.name}
              </p>
              <p className="text-xs text-green-500">Online</p>
            </div>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <Phone className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <Video className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <Info className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {chatMessages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === user?.id}
                onEdit={(id, content) => updateMessage(chatId, id, { content })}
                onDelete={(id) => deleteMessage(chatId, id)}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-lyo-card border-t border-gray-200 dark:border-lyo-border">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEmoji(!showEmoji)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <Smile className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <Paperclip className="w-5 h-5 text-gray-500" />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim() || sendMutation.isPending}
                className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            {showEmoji && (
              <div className="absolute bottom-20 left-4 z-50">
                <EmojiPicker onEmojiClick={(emoji) => setNewMessage((prev) => prev + emoji.emoji)} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-gray-400">
          <div className="text-center">
            <MessageBubbleIcon className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg font-medium">Select a chat to start messaging</p>
          </div>
        </div>
      )}
    </div>
  )
}

function MessageBubbleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
