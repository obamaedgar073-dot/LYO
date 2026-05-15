// ==================== MODERATION BADGE ====================
// Shows moderation status on content

interface ModerationBadgeProps {
  status: string
  size?: 'sm' | 'md'
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  APPROVED: { label: 'Approved', color: 'text-green-700', bg: 'bg-green-100' },
  PENDING: { label: 'Pending Review', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  FLAGGED: { label: 'Flagged', color: 'text-orange-700', bg: 'bg-orange-100' },
  BLOCKED: { label: 'Blocked', color: 'text-red-700', bg: 'bg-red-100' },
  UNDER_REVIEW: { label: 'Under Review', color: 'text-blue-700', bg: 'bg-blue-100' },
  APPEALED: { label: 'Appealed', color: 'text-purple-700', bg: 'bg-purple-100' },
}

export default function ModerationBadge({ status, size = 'sm' }: ModerationBadgeProps) {
  const config = statusConfig[status] || statusConfig.PENDING

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
    } ${config.color} ${config.bg}`}>
      {config.label}
    </span>
  )
}
