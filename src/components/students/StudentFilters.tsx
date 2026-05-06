'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { CLASS_TYPES } from '@/lib/constants'
import type { Batch } from '@/types/database'

interface StudentFiltersProps {
  batches: Batch[]
}

export function StudentFilters({ batches }: StudentFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const hasFilters =
    searchParams.get('search') || searchParams.get('batch') || searchParams.get('class_type')

  const clearFilters = () => {
    router.push(pathname)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            defaultValue={searchParams.get('search') ?? ''}
            onChange={(e) => updateParam('search', e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-800"
          />
        </div>

        {/* Class type filter */}
        <select
          defaultValue={searchParams.get('class_type') ?? ''}
          onChange={(e) => updateParam('class_type', e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-800 bg-white"
        >
          <option value="">All Programs</option>
          {CLASS_TYPES.map((ct) => (
            <option key={ct} value={ct}>{ct}</option>
          ))}
        </select>

        {/* Batch filter */}
        <select
          defaultValue={searchParams.get('batch') ?? ''}
          onChange={(e) => updateParam('batch', e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-800 bg-white"
        >
          <option value="">All Batches</option>
          {batches.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 px-3 py-2.5"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
