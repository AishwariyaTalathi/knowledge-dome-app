import { cn, formatDate } from '@/lib/utils'
import { CalendarX } from 'lucide-react'
import type { AttendanceRecord } from '@/types/database'

interface AttendanceDotsProps {
  records: Pick<AttendanceRecord, 'class_date' | 'present'>[]
  attendancePct: number
}

function AttendanceBar({ pct }: { pct: number }) {
  const color =
    pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400'

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">Overall attendance</span>
        <span className={cn('text-sm font-bold', pct >= 75 ? 'text-green-600' : pct >= 50 ? 'text-amber-600' : 'text-red-500')}>
          {pct}%
        </span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', color)}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  )
}

export function AttendanceDots({ records, attendancePct }: AttendanceDotsProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <CalendarX size={22} className="text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-600 mb-1">No attendance recorded yet</p>
        <p className="text-xs text-gray-400">Attendance records will appear here once classes are marked.</p>
      </div>
    )
  }

  const dots = Array.from({ length: 20 }, (_, i) => records[i] ?? null)

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-3">Last 20 Classes</h3>
      <div className="flex flex-wrap gap-2">
        {dots.map((record, i) => (
          <div
            key={i}
            title={
              record
                ? `${formatDate(record.class_date)}: ${record.present ? 'Present' : 'Absent'}`
                : 'No record'
            }
            className={cn(
              'w-7 h-7 rounded-full flex-shrink-0',
              record === null
                ? 'bg-gray-200'
                : record.present
                ? 'bg-green-500'
                : 'bg-red-400'
            )}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2">Most recent first (left to right)</p>
      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Present</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-400 inline-block" /> Absent</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gray-200 inline-block" /> No record</span>
      </div>
      <AttendanceBar pct={attendancePct} />
    </div>
  )
}