'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <AlertTriangle size={26} className="text-red-500" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Something went wrong</h2>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">
        An unexpected error occurred. This is usually temporary — try again.
      </p>
      <button
        onClick={reset}
        className="px-5 py-2.5 bg-brand-800 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
