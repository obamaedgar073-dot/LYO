// ==================== ADMIN APPEALS ====================

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/services/api'
import { MessageSquare, CheckCircle, XCircle } from 'lucide-react'

export default function AdminAppeals() {
  const [filter, setFilter] = useState('PENDING')
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['admin-appeals', filter],
    queryFn: () => adminApi.getAppeals({ status: filter }).then((res) => res.data),
  })

  const resolveMutation = useMutation({
    mutationFn: ({ appealId, decision, reason }: any) =>
      adminApi.resolveAppeal(appealId, { decision, reason }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-appeals'] }),
  })

  const appeals = data?.appeals || []

  return (
    <div>
      <h1 className="text-3xl font-bold dark:text-white mb-6">Appeals</h1>

      <div className="flex gap-2 mb-6">
        {['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map((status) => (
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

      <div className="space-y-4">
        {appeals.map((appeal: any) => (
          <div key={appeal.id} className="bg-white dark:bg-lyo-card rounded-xl border border-gray-200 dark:border-lyo-border p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  <span className="font-medium dark:text-white">Appeal from {appeal.user.displayName}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    appeal.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    appeal.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {appeal.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{appeal.reason}</p>
              </div>
              {appeal.status === 'PENDING' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => resolveMutation.mutate({ appealId: appeal.id, decision: 'APPROVED', reason: 'Appeal approved' })}
                    className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                    title="Approve"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => resolveMutation.mutate({ appealId: appeal.id, decision: 'REJECTED', reason: 'Appeal rejected' })}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    title="Reject"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {appeals.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <p>No appeals in this category</p>
          </div>
        )}
      </div>
    </div>
  )
}
