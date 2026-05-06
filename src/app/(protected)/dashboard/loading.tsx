import { Skeleton } from '@/components/ui/Skeleton'

export default function DashboardLoading() {
  return (
    <div>
      <Skeleton className="h-8 w-36 mb-6" />

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <Skeleton className="h-9 w-9 rounded-lg mb-3" />
            <Skeleton className="h-7 w-16 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>

      {/* Quick action cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-5 w-36 mb-2" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}