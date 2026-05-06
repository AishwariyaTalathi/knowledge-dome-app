import { Skeleton } from '@/components/ui/Skeleton'

export default function StudentsLoading() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>

      <Skeleton className="h-4 w-28 mb-3" />

      {/* Desktop table skeleton */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 px-4 py-3 flex gap-8">
          {['w-40', 'w-32', 'w-20', 'w-24', 'w-16'].map((w, i) => (
            <Skeleton key={i} className={`h-4 ${w}`} />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="px-4 py-3 border-b border-gray-50 flex items-center gap-8">
            <div className="flex items-center gap-3 w-40">
              <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>

      {/* Mobile card skeleton */}
      <div className="md:hidden space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
            <Skeleton className="w-11 h-11 rounded-full flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex flex-col items-end gap-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}