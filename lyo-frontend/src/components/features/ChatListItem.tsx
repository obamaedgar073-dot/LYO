// ==================== CHAT LIST ITEM ====================

import { Link } from 'react-router-dom'
import { MessageSquare, Users } from 'lucide-react'
import { Chat } from '@/types'
import { formatDistanceToNow } from 'date-fns'

interface ChatListItemProps {
  chat: Chat
  isActive?: boolean
}

export default function ChatListItem({ chat, isActive }: ChatListItemProps) {
  const otherMember = chat.type === 'DIRECT'
    ? chat.members.find(m => m.userId !== chat.members[0]?.userId)?.user
    : undefined

  const displayName = chat.type === 'DIRECT'
    ? otherMember?.displayName || 'Unknown'
    : chat.name || 'Group Chat'

  const avatarUrl = chat.type === 'DIRECT'
    ? otherMember?.avatarUrl
    : chat.avatarUrl

  return (
    <Link
      to={`/messages/${chat.id}`}
      className={`flex items-center gap-3 px-4 py-3 transition-colors ${
        isActive
          ? 'bg-primary-50 dark:bg-primary-900/20'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      <div className="relative">
        <img
          src={avatarUrl || '/default-avatar.png'}
          alt={displayName}
          className="w-12 h-12 rounded-full object-cover"
        />
        {chat.type === 'GROUP' && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
            <Users className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-medium text-gray-900 dark:text-white truncate">{displayName}</p>
          {chat.lastMessage && (
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(chat.lastMessage.createdAt), { addSuffix: true })}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 truncate">
            {chat.lastMessage
              ? `${chat.lastMessage.sender.displayName}: ${chat.lastMessage.content.slice(0, 30)}`
              : 'No messages yet'}
          </p>
          {chat.unreadCount > 0 && (
            <span className="ml-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
