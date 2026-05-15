// ==================== ADMIN USERS ====================

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/services/api'
import { Search, Ban, UserCheck, Shield, AlertTriangle } from 'lucide-react'

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['admin-users', search, status],
    queryFn: () => adminApi.getUsers({ search, status }).then((res) => res.data),
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, status, reason }: any) =>
      adminApi.updateUserStatus(userId, { status, reason }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  const users = data?.users || []

  return (
    <div>
      <h1 className="text-3xl font-bold dark:text-white mb-6">User Management</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-lyo-card border border-gray-200 dark:border-lyo-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-lyo-card border border-gray-200 dark:border-lyo-border rounded-xl dark:text-white"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="BANNED">Banned</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-lyo-card rounded-xl border border-gray-200 dark:border-lyo-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">User</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Trust Score</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {users.map((user: any) => (
              <tr key={user.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={user.avatarUrl || '/default-avatar.png'} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-medium dark:text-white">{user.displayName}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' :
                    user.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' :
                    user.role === 'MODERATOR' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                    user.status === 'SUSPENDED' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          user.trustScore > 0.7 ? 'bg-green-500' :
                          user.trustScore > 0.4 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${user.trustScore * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">{(user.trustScore * 100).toFixed(0)}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {user.status !== 'BANNED' && (
                      <button
                        onClick={() => updateStatusMutation.mutate({ userId: user.id, status: 'BANNED', reason: 'Banned by admin' })}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        title="Ban"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    )}
                    {user.status !== 'ACTIVE' && (
                      <button
                        onClick={() => updateStatusMutation.mutate({ userId: user.id, status: 'ACTIVE', reason: 'Restored by admin' })}
                        className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                        title="Activate"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" title="View History">
                      <Shield className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
