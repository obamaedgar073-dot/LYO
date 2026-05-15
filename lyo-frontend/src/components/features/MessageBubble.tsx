// ==================== MESSAGE BUBBLE ====================

import { useState } from 'react'
import { Edit2, Trash2, Smile } from 'lucide-react'
import { Message } from '@/types'
import { format } from 'date-fns'
import { messageApi } from '@/services/api'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  onEdit?: (id: string, content: string) => void
  onDelete?: (id: string) => void
}

export default function MessageBubble({ message, isOwn, onEdit, onDelete }: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)

  const handleEdit = async () => {
    if (!editContent.trim() || editContent === message.content) {
      setIsEditing(false)
      return
    }
    try {
      await messageApi.editMessage(message.id, editContent)
      onEdit?.(message.id, editContent)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to edit:', error)
    }
  }

  if (message.isDeleted) {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2 text-gray-400 text-sm italic">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2 group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
        {!isOwn && (
          <img
            src={message.sender.avatarUrl || '/default-avatar.png'}
            className="w-8 h-8 rounded-full mb-1"
          />
        )}

        <div
          className={`relative rounded-2xl px-4 py-2 ${
            isOwn
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
          }`}
        >
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
                className="bg-transparent border-b border-white/50 focus:outline-none text-white w-full"
                autoFocus
              />
              <button onClick={handleEdit} className="text-xs">Save</button>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex gap-1 mt-1">
              {message.reactions.map((reaction) => (
                <span key={reaction.id} className="text-sm bg-black/10 rounded-full px-1.5 py-0.5">
                  {reaction.emoji}
                </span>
              ))}
            </div>
          )}

          <span className={`text-xs mt-1 block ${isOwn ? 'text-white/70' : 'text-gray-500'}`}>
            {format(new Date(message.createdAt), 'h:mm a')}
            {message.isEdited && ' (edited)'}
          </span>
        </div>

        {/* Actions */}
        {showActions && isOwn && !isEditing && (
          <div className="flex gap-1 mt-1 justify-end">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              <Edit2 className="w-3 h-3 text-gray-500" />
            </button>
            <button
              onClick={() => onDelete?.(message.id)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              <Trash2 className="w-3 h-3 text-red-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
