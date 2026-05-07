import Link from 'next/link'
import { cn, getInitials } from '@/lib/utils'
import { CLASS_TYPES, CLASS_TYPE_COLORS } from '@/lib/constants'
import type { ClassType } from '@/types/database'

type SummaryStudent = {
  id: string
  first_name: string
  last_name: string
  grade: string | null
  attendance_pct: number
  batches: { name: string; class_type: string } | null
}

interface AttendanceSummaryProps {
  students: SummaryStudent[]
  classFilter: string
}

function pctColor(pct: number) {
  if (pct < 75) return { bar: 'bg-red-400', text: 'text-red-600', bg: 'bg-red-50' }
  if (pct < 90) return { bar: 'bg-amber-400', text: 'text-amber-600', bg: 'bg-amber-50' }
  return { bar: 'bg-green-400', text: 'text-green-600', bg: 'bg-green-50' }
}

export function AttendanceSummary({ students, classFilter }: AttendanceSummaryProps) {
  const filtered = classFilter
    ? students.filter((s) => s.batches?.class_type === classFilter)
    : students

  const sorted = [...filtered].sort((a, b) => a.attendance_pct - b.attendance_pct)

  return (
    <div className="space-y-4 pb-6">
      {/* Class type filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Link
          href="/attendance?view=summary"
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0',
            !classFilter ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          )}
        >
          All Programs
        </Link>
        {CLASS_TYPES.map((ct) => (
          <Link
            key={ct}
            href={`/attendance?view=summary&class_type=${encodeURIComponent(ct)}`}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0',
              classFilter === ct
                ? 'bg-gray-800 text-white'
                : `${CLASS_TYPE_COLORS[ct as ClassType]} border border-transparent hover:opacity-80`
            )}
          >
            {ct}
          </Link>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-400 px-1">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />Below 75%</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />75–90%</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />90%+</span>
      </div>

      {/* Student list */}
      {sorted.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-400 text-sm">
          No students found.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
          {sorted.map((student) => {
            const pct = student.attendance_pct ?? 0
            const colors = pctColor(pct)
            return (
              <Link
                key={student.id}
                href={`/students/${student.id}`}
                className="flex items-center px-4 py-3 gap-3 hover:bg-gray-50 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-800 font-bold text-xs">
                    {getInitials(student.first_name, student.last_name)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {student.first_name} {student.last_name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {student.batches?.name ?? 'No batch'}
                    {student.grade ? ` · ${student.grade}` : ''}
                  </p>
                  {/* Progress bar */}
                  <div className="mt-1.5 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', colors.bar)}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
                <span className={cn('text-sm font-semibold flex-shrink-0 w-10 text-right', colors.text)}>
                  {pct}%
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
