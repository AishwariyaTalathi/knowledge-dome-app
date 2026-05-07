import Link from 'next/link'
import { FeeStatusButton } from './FeeStatusButton'
import { cn, getInitials } from '@/lib/utils'
import type { Student } from '@/types/database'

export function StudentCard({ student }: { student: Student }) {
  const name = `${student.first_name} ${student.last_name}`
  return (
    <div className={cn(
      'rounded-xl px-4 py-3 min-h-[72px] border shadow-sm flex items-center gap-4 bg-white border-gray-100',
      student.fee_status === 'Overdue' && 'bg-red-50 border-l-4 border-l-red-400'
    )}>
      <Link href={`/students/${student.id}`} className="flex items-center gap-4 flex-1 min-w-0 hover:opacity-80 transition-opacity">
        <div className="w-11 h-11 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
          <span className="text-brand-800 font-bold text-sm">
            {getInitials(student.first_name, student.last_name)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{name}</p>
          <p className="text-sm text-gray-500 truncate">
            {student.batches?.name ?? 'No batch'}
            {student.grade ? ` · ${student.grade}` : ''}
          </p>
        </div>
      </Link>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <FeeStatusButton studentId={student.id} status={student.fee_status} />
        <span className="text-xs text-gray-400">{student.attendance_pct ?? 0}% att.</span>
      </div>
    </div>
  )
}
