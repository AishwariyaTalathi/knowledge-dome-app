export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-4 w-64 bg-gray-100 rounded animate-pulse mb-6" />
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  )
}
