// ==================== ADMIN REPORTS ====================

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/services/api'
import { Flag, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export default function AdminReports() {
  const [filter, setFilter] = useState('PENDING')
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['admin-reports', filter],
    queryFn: () => adminApi.getReports({ status: filter }).then((res) => res.data),
  })

  const resolveMutation = useMutation({
    mutationFn: ({ reportId, action, resolution }: any) =>
      adminApi.resolveReport(reportId, { action, resolution }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-reports'] }),
  })

  const reports = data?.reports || []

  return (
    <div>
      <h1 className="text-3xl font-bold dark:text-white mb-6">User Reports</h1>

      <div className="flex gap-2 mb-6">
        {['PENDING', 'UNDER_REVIEW', 'RESOLVED'].map((status) => (
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
        {reports.map((report: any) => (
          <div key={report.id} className="bg-white dark:bg-lyo-card rounded-xl border border-gray-200 dark:border-lyo-border p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Flag className="w-5 h-5 text-red-500" />
                  <span className="font-medium dark:text-white">Reported for {report.reason}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    report.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                    report.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {report.priority}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <span>Reporter: <span className="dark:text-gray-300">{report.reporter.displayName}</span></span>
                  {report.reportedUser && (
                    <span>Reported User: <span className="dark:text-gray-300">{report.reportedUser.displayName}</span></span>
                  )}
                  <span>Type: {report.targetType}</span>
                </div>
                {report.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{report.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => resolveMutation.mutate({ reportId: report.id, action: 'DISMISS', resolution: 'Dismissed by moderator' })}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  title="Dismiss"
                >
                  <XCircle className="w-5 h-5" />
                </button>
                <button
                  onClick={() => resolveMutation.mutate({ reportId: report.id, action: 'REMOVE_CONTENT', resolution: 'Content removed' })}
                  className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg"
                  title="Remove Content"
                >
                  <AlertTriangle className="w-5 h-5" />
                </button>
                <button
                  onClick={() => resolveMutation.mutate({ reportId: report.id, action: 'SUSPEND', resolution: 'User suspended' })}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  title="Suspend User"
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {reports.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <p>No reports in this category</p>
          </div>
        )}
      </div>
    </div>
  )
}
