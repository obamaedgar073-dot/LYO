// ==================== LIVE STREAMS PAGE ====================

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { liveApi } from '@/services/api'
import LiveStreamCard from '@/components/features/LiveStreamCard'
import { Video, Radio } from 'lucide-react'

export default function LiveStreams() {
  const [activeTab, setActiveTab] = useState<'live' | 'scheduled'>('live')

  const { data: streams, isLoading } = useQuery({
    queryKey: ['streams'],
    queryFn: () => liveApi.getStreams().then((res) => res.data),
  })

  const liveStreams = streams?.filter((s: any) => s.status === 'LIVE') || []
  const scheduledStreams = streams?.filter((s: any) => s.status === 'SCHEDULED') || []

  return (
    <div className="max-w-6xl mx-auto p-4 pb-20 md:pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Live Streams</h1>
          <p className="text-gray-500">Watch and discover live content</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600">
          <Radio className="w-5 h-5" />
          <span className="font-medium">Go Live</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('live')}
          className={`px-4 py-2 rounded-xl font-medium transition-colors ${
            activeTab === 'live'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          Live Now ({liveStreams.length})
        </button>
        <button
          onClick={() => setActiveTab('scheduled')}
          className={`px-4 py-2 rounded-xl font-medium transition-colors ${
            activeTab === 'scheduled'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          Scheduled ({scheduledStreams.length})
        </button>
      </div>

      {/* Streams Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-lyo-card rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(activeTab === 'live' ? liveStreams : scheduledStreams).map((stream: any) => (
            <LiveStreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      )}

      {activeTab === 'live' && liveStreams.length === 0 && !isLoading && (
        <div className="text-center py-20">
          <Video className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No live streams right now</p>
          <p className="text-gray-400">Be the first to go live!</p>
        </div>
      )}
    </div>
  )
}
