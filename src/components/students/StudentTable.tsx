import Link from 'next/link'
import { FeeStatusBadge } from './FeeStatusBadge'
import { cn, getInitials } from '@/lib/utils'
import type { Student } from '@/types/database'

export function StudentTable({ students }: { students: Student[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Batch</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Grade</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Attendance</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Fee</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className={cn(
              'border-b border-gray-50 transition-colors',
              student.fee_status === 'Overdue'
                ? 'bg-red-50 hover:bg-red-100 border-l-4 border-l-red-400'
                : 'hover:bg-gray-50'
            )}>
              <td className="px-4 py-3">
                <Link href={`/students/${student.id}`} className="flex items-center gap-3 hover:text-brand-800">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-800 font-bold text-xs">
                      {getInitials(student.first_name, student.last_name)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {student.first_name} {student.last_name}
                    </p>
                    {student.phone && <p className="text-xs text-gray-400">{student.phone}</p>}
                  </div>
                </Link>
              </td>
              <td className="px-4 py-3 text-gray-600">{student.batches?.name ?? '—'}</td>
              <td className="px-4 py-3 text-gray-600">{student.grade ?? '—'}</td>
              <td className="px-4 py-3 text-gray-600">{student.attendance_pct ?? 0}%</td>
              <td className="px-4 py-3">
                <FeeStatusBadge status={student.fee_status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {students.length === 0 && (
        <div className="text-center py-10 text-gray-400">No students found.</div>
      )}
    </div>
  )
}
