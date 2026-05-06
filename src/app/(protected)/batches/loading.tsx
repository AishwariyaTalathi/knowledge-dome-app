import { Skeleton } from '@/components/ui/Skeleton'

export default function BatchesLoading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
            <div>
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-4 w-64 mb-1.5" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-9 w-16 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}