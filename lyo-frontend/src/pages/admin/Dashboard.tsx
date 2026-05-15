// ==================== ADMIN DASHBOARD ====================

import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/services/api'
import { Users, Shield, Flag, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react'

export default function AdminDashboard() {
  const { data: analytics } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => adminApi.getAnalytics('7d').then((res) => res.data),
  })

  const stats = [
    { label: 'Total Users', value: analytics?.users?.total || 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Active Users', value: analytics?.users?.active || 0, icon: BarChart3, color: 'bg-green-500' },
    { label: 'Pending Reports', value: analytics?.reports?.pending || 0, icon: Flag, color: 'bg-yellow-500' },
    { label: 'Flagged Content', value: analytics?.content?.flagged || 0, icon: AlertTriangle, color: 'bg-orange-500' },
    { label: 'Blocked Content', value: analytics?.content?.blocked || 0, icon: Shield, color: 'bg-red-500' },
    { label: 'Resolved Today', value: analytics?.reports?.resolved || 0, icon: CheckCircle, color: 'bg-purple-500' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold dark:text-white mb-6">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-lyo-card rounded-xl p-6 border border-gray-200 dark:border-lyo-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold dark:text-white mt-1">{stat.value.toLocaleString()}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-lyo-card rounded-xl border border-gray-200 dark:border-lyo-border p-6">
        <h2 className="text-xl font-bold dark:text-white mb-4">Recent Moderation Actions</h2>
        <div className="space-y-3">
          {analytics?.actions?.breakdown?.map((action: any) => (
            <div key={action.action} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="dark:text-gray-300">{action.action}</span>
              <span className="font-medium dark:text-white">{action._count.action}</span>
            </div>
          )) || <p className="text-gray-500">No recent actions</p>}
        </div>
      </div>
    </div>
  )
}
