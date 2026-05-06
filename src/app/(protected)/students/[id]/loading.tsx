import { Skeleton } from '@/components/ui/Skeleton'

export default function StudentDetailLoading() {
  return (
    <div className="max-w-2xl mx-auto">
      <Skeleton className="h-4 w-28 mb-4" />

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          </div>
          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>
      </div>

      {/* Two-col grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <Skeleton className="h-4 w-24 mb-4" />
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="flex gap-2 py-2 border-b border-gray-50 last:border-0">
                <Skeleton className="h-4 w-28 flex-shrink-0" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Fee card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mt-4">
        <Skeleton className="h-4 w-16 mb-3" />
        <div className="flex gap-3">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>

      {/* Attendance card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mt-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <Skeleton key={i} className="w-7 h-7 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  )
}