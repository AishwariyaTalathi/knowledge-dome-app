'use client'

import { useState, useTransition } from 'react'
import { cn } from '@/lib/utils'
import { updateFeeStatus } from '@/app/(protected)/students/actions'
import { FEE_STATUSES } from '@/lib/constants'
import type { FeeStatus } from '@/types/database'

const styles: Record<FeeStatus, string> = {
  Paid: 'bg-green-100 text-green-800',
  Pending: 'bg-amber-100 text-amber-800',
  Overdue: 'bg-red-100 text-red-800',
}

export function FeeStatusButton({ studentId, status }: { studentId: string; status: FeeStatus }) {
  const [current, setCurrent] = useState<FeeStatus>(status)
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const select = (next: FeeStatus) => {
    setOpen(false)
    if (next === current) return
    const prev = current
    setCurrent(next)
    startTransition(async () => {
      const result = await updateFeeStatus(studentId, next)
      if (result.error) setCurrent(prev)
    })
  }

  return (
    <div className="relative" onClick={(e) => e.preventDefault()}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o) }}
        className={cn(
          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium transition-opacity',
          styles[current],
          isPending && 'opacity-50 cursor-not-allowed'
        )}
        disabled={isPending}
      >
        {current}
        <svg className="w-2.5 h-2.5 opacity-60" viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-lg shadow-lg border border-gray-100 py-1 min-w-[100px]">
            {FEE_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => select(s)}
                className={cn(
                  'w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-gray-50 transition-colors',
                  s === current && 'opacity-50 cursor-default'
                )}
              >
                <span className={cn('inline-flex px-2 py-0.5 rounded-full', styles[s])}>{s}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
