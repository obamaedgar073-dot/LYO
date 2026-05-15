import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

interface PostCardProps {
  post: {
    id: string;
    author: {
      username: string;
      displayName: string;
      avatarUrl?: string;
    };
    content: string;
    imageUrl?: string;
    createdAt: string;
    likesCount: number;
    commentsCount: number;
    isLiked?: boolean;
    isBookmarked?: boolean;
  };
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const handleLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {post.author.displayName?.charAt(0)?.toUpperCase() || post.author.username?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              {post.author.displayName || post.author.username}
            </h3>
            <p className="text-xs text-gray-500">@{post.author.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{formatDate(post.createdAt)}</span>
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Image */}
      {post.imageUrl && (
        <div className="mb-3 rounded-lg overflow-hidden">
          <img
            src={post.imageUrl}
            alt="Post image"
            className="w-full h-auto max-h-96 object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${
              liked
                ? 'text-red-500 bg-red-50 hover:bg-red-100'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            <span className="text-xs font-medium">{likesCount}</span>
          </button>

          <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-medium">{post.commentsCount}</span>
          </button>

          <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleBookmark}
          className={`p-1.5 rounded-lg transition-colors ${
            bookmarked
              ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
}
