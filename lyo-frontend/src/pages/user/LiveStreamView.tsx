// ==================== LIVE STREAM VIEW PAGE ====================
// Watch a live stream with real-time chat

import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { liveApi } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import { useLiveStore } from '@/store/liveStore'
import { useSocket } from '@/hooks/useSocket'
import { ArrowLeft, Send, Users, Heart, Share2, Ban } from 'lucide-react'

export default function LiveStreamView() {
  const { streamId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { emit } = useSocket()
  const { activeStream, chatMessages, viewerCount, setActiveStream, addChatMessage, setViewerCount } = useLiveStore()
  const [chatInput, setChatInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  const { data: stream } = useQuery({
    queryKey: ['stream', streamId],
    queryFn: () => liveApi.getStream(streamId!).then((res) => res.data),
    enabled: !!streamId,
  })

  useEffect(() => {
    if (stream) {
      setActiveStream(stream)
      liveApi.join(streamId!)
      emit('join_stream', streamId)
    }
    return () => {
      liveApi.leave(streamId!)
      emit('leave_stream', streamId)
    }
  }, [stream, streamId, setActiveStream, emit])

  const sendChatMutation = useMutation({
    mutationFn: (content: string) => liveApi.sendChat(streamId!, content),
    onSuccess: (res) => {
      addChatMessage(res.data)
      setChatInput('')
    },
  })

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleSendChat = () => {
    if (!chatInput.trim()) return
    sendChatMutation.mutate(chatInput)
  }

  if (!stream) return null

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row">
      {/* Video Area */}
      <div className="flex-1 bg-black relative">
        <button
          onClick={() => navigate('/live')}
          className="absolute top-4 left-4 z-10 p-2 bg-black/50 text-white rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Video Placeholder */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-2xl font-bold">LIVE</span>
            </div>
            <p className="text-xl font-medium">{stream.title}</p>
            <p className="text-white/70">{stream.user.displayName}</p>
          </div>
        </div>

        {/* Stream Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="bg-black/50 backdrop-blur rounded-xl p-3 text-white">
            <div className="flex items-center gap-2 mb-1">
              <img src={stream.user.avatarUrl || '/default-avatar.png'} className="w-8 h-8 rounded-full" />
              <span className="font-medium">{stream.user.displayName}</span>
            </div>
            <p className="text-sm text-white/80">{stream.description}</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-black/50 backdrop-blur rounded-xl px-3 py-2 text-white flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{viewerCount || stream.viewerCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className="w-full md:w-80 bg-white dark:bg-lyo-card border-l border-gray-200 dark:border-lyo-border flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-lyo-border">
          <h3 className="font-semibold dark:text-white">Live Chat</h3>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.map((msg) => (
            <div key={msg.id} className="flex gap-2">
              <img src={msg.user.avatarUrl || '/default-avatar.png'} className="w-6 h-6 rounded-full flex-shrink-0" />
              <div>
                <span className="font-medium text-sm text-primary-500">{msg.user.displayName}</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-lyo-border">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Say something..."
              className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
            />
            <button
              onClick={handleSendChat}
              disabled={!chatInput.trim()}
              className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
