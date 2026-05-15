// ==================== ADMIN ANALYTICS ====================

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/services/api'
import { BarChart3, TrendingUp, Users, Shield } from 'lucide-react'

export default function AdminAnalytics() {
  const [period, setPeriod] = useState('7d')

  const { data: analytics } = useQuery({
    queryKey: ['admin-analytics', period],
    queryFn: () => adminApi.getAnalytics(period).then((res) => res.data),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Analytics</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-lyo-card border border-gray-200 dark:border-lyo-border rounded-xl dark:text-white"
        >
          <option value="1d">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Stats */}
        <div className="bg-white dark:bg-lyo-card rounded-xl border border-gray-200 dark:border-lyo-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold dark:text-white">User Statistics</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Users</span>
              <span className="font-medium dark:text-white">{analytics?.users?.total?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Active Users</span>
              <span className="font-medium dark:text-white">{analytics?.users?.active?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">New Users</span>
              <span className="font-medium dark:text-white">{analytics?.users?.new?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        {/* Content Stats */}
        <div className="bg-white dark:bg-lyo-card rounded-xl border border-gray-200 dark:border-lyo-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-bold dark:text-white">Content Statistics</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Posts</span>
              <span className="font-medium dark:text-white">{analytics?.content?.totalPosts?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Flagged Content</span>
              <span className="font-medium text-orange-500">{analytics?.content?.flagged?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Blocked Content</span>
              <span className="font-medium text-red-500">{analytics?.content?.blocked?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        {/* Report Stats */}
        <div className="bg-white dark:bg-lyo-card rounded-xl border border-gray-200 dark:border-lyo-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-lg font-bold dark:text-white">Report Statistics</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Reports</span>
              <span className="font-medium dark:text-white">{analytics?.reports?.total?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Resolved</span>
              <span className="font-medium text-green-500">{analytics?.reports?.resolved?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pending</span>
              <span className="font-medium text-yellow-500">{analytics?.reports?.pending?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        {/* Moderation Actions */}
        <div className="bg-white dark:bg-lyo-card rounded-xl border border-gray-200 dark:border-lyo-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-bold dark:text-white">Moderation Actions</h2>
          </div>
          <div className="space-y-3">
            {analytics?.actions?.breakdown?.map((action: any) => (
              <div key={action.action} className="flex justify-between">
                <span className="text-gray-500">{action.action}</span>
                <span className="font-medium dark:text-white">{action._count.action}</span>
              </div>
            )) || <p className="text-gray-500">No actions recorded</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
