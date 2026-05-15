// ==================== MODERATION QUEUE ====================

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/services/api'
import ModerationBadge from '@/components/features/ModerationBadge'
import { CheckCircle, XCircle, Eye, AlertTriangle } from 'lucide-react'

export default function AdminModeration() {
  const [filter, setFilter] = useState('PENDING')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['moderation-queue', filter],
    queryFn: () => adminApi.getQueue({ status: filter }).then((res) => res.data),
  })

  const resolveMutation = useMutation({
    mutationFn: ({ queueId, action, reason }: any) =>
      adminApi.resolveQueueItem(queueId, { action, reason }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['moderation-queue'] }),
  })

  const queue = data?.queue || []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Moderation Queue</h1>
        <div className="flex gap-2">
          {['PENDING', 'ASSIGNED', 'RESOLVED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl font-medium ${
                filter === status
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-lyo-card rounded-xl h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {queue.map((item: any) => (
            <div key={item.id} className="bg-white dark:bg-lyo-card rounded-xl border border-gray-200 dark:border-lyo-border p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <img src={item.user.avatarUrl || '/default-avatar.png'} className="w-8 h-8 rounded-full" />
                    <span className="font-medium dark:text-white">{item.user.displayName}</span>
                    <span className="text-gray-500">@{item.user.username}</span>
                    <ModerationBadge status={item.status} />
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                      item.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                      item.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    Content Type: {item.contentType} · AI Score: {(item.aiScore * 100).toFixed(1)}%
                  </p>
                  <div className="flex gap-2 mb-3">
                    {item.policies.map((policy: string) => (
                      <span key={policy} className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs">
                        {policy}
                      </span>
                    ))}
                  </div>
                  {item.aiResult?.categories && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Detected: {item.aiResult.categories.map((c: any) => `${c.category} (${(c.confidence * 100).toFixed(0)}%)`).join(', ')}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => resolveMutation.mutate({ queueId: item.id, action: 'ALLOW', reason: 'Approved by moderator' })}
                    className="p-2 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-xl hover:bg-green-200"
                    title="Allow"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => resolveMutation.mutate({ queueId: item.id, action: 'BLOCK', reason: 'Blocked by moderator' })}
                    className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-xl hover:bg-red-200"
                    title="Block"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => resolveMutation.mutate({ queueId: item.id, action: 'FLAG', reason: 'Flagged for review' })}
                    className="p-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 rounded-xl hover:bg-yellow-200"
                    title="Flag"
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {queue.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p className="text-lg">Queue is empty! All caught up.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
