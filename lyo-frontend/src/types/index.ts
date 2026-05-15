// ==================== LYO TYPE DEFINITIONS ====================

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  isVerified: boolean;
  isPrivate: boolean;
  role: 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED' | 'PENDING_VERIFICATION';
  trustScore: number;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  author: User;
  content: string;
  mediaUrls?: { url: string; type: 'image' | 'video' }[];
  visibility: 'PUBLIC' | 'FOLLOWERS' | 'PRIVATE';
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isPinned: boolean;
  isLiked?: boolean;
  likedVibe?: VibeType;
  isBookmarked?: boolean;
  moderationStatus: string;
  createdAt: string;
  updatedAt: string;
}

export type VibeType = 'HEART' | 'FIRE' | 'LAUGH' | 'IDEA' | 'COOL';

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  parentId?: string;
  likeCount: number;
  isLiked?: boolean;
  replies?: Comment[];
  createdAt: string;
}

export interface Chat {
  id: string;
  type: 'DIRECT' | 'GROUP' | 'CHANNEL';
  name?: string;
  avatarUrl?: string;
  description?: string;
  members: ChatMember[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface ChatMember {
  id: string;
  userId: string;
  user: User;
  role: 'MEMBER' | 'ADMIN' | 'OWNER';
  isMuted: boolean;
  joinedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  sender: User;
  content: string;
  mediaUrls?: string[];
  replyToId?: string;
  isEdited: boolean;
  isDeleted: boolean;
  isRead?: boolean;
  reactions: MessageReaction[];
  moderationStatus: string;
  createdAt: string;
}

export interface MessageReaction {
  id: string;
  emoji: string;
  user: User;
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'TEXT' | 'POLL' | 'LINK';
  caption?: string;
  musicTrack?: string;
  stickerData?: any;
  visibility: 'PUBLIC' | 'FOLLOWERS' | 'PRIVATE';
  expiresAt: string;
  isArchived: boolean;
  hasViewed?: boolean;
  userReaction?: string;
  viewCount: number;
  createdAt: string;
}

export interface StoryGroup {
  user: User;
  stories: Story[];
  hasUnviewed: boolean;
}

export interface LiveStream {
  id: string;
  userId: string;
  user: User;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  status: 'SCHEDULED' | 'LIVE' | 'ENDED' | 'BANNED';
  viewerCount: number;
  maxViewers: number;
  startedAt?: string;
  endedAt?: string;
  isModerated: boolean;
  createdAt: string;
}

export interface LiveChatMessage {
  id: string;
  streamId: string;
  user: User;
  content: string;
  isDeleted: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  recipientId: string;
  actor?: User;
  type: string;
  referenceId?: string;
  referenceType?: string;
  message?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ModerationQueueItem {
  id: string;
  contentType: string;
  contentId: string;
  user: User;
  aiScore: number;
  aiResult: any;
  policies: string[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assignedTo?: string;
  status: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporter: User;
  targetType: string;
  targetId: string;
  reportedUser?: User;
  reason: string;
  description?: string;
  status: string;
  priority: string;
  createdAt: string;
}

export interface ModerationAction {
  id: string;
  policy: { name: string; category: string };
  moderator: User;
  targetType: string;
  targetId: string;
  action: string;
  reason: string;
  createdAt: string;
}

export interface Appeal {
  id: string;
  user: User;
  actionId: string;
  reason: string;
  status: string;
  decision?: string;
  createdAt: string;
}

export interface ApiError {
  error: string;
  details?: any;
}
