import { Skeleton } from '@/components/ui/Skeleton'

export default function AnnouncementsLoading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Skeleton className="h-5 w-56 mb-2" />
                <Skeleton className="h-4 w-full mb-1.5" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Skeleton className="h-9 w-14 rounded-lg" />
                <Skeleton className="h-9 w-14 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}