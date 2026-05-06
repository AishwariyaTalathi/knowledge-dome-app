import { Skeleton } from '@/components/ui/Skeleton'

export default function NewStudentLoading() {
  return (
    <div className="max-w-lg mx-auto">
      <Skeleton className="h-8 w-44 mb-6" />
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-3.5 w-24 mb-1.5" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
        <Skeleton className="h-10 w-full rounded-lg mt-2" />
      </div>
    </div>
  )
}
