import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AttendanceMarker } from '@/components/attendance/AttendanceMarker'
import { AttendanceSummary } from '@/components/attendance/AttendanceSummary'
import { cn } from '@/lib/utils'

type AttendanceStudent = {
  id: string
  first_name: string
  last_name: string
  grade: string | null
  batch_id: string | null
  attendance_pct: number
  batches: { id: string; name: string; class_type: string } | null
}

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; view?: string; class_type?: string }>
}) {
  const { date, view, class_type } = await searchParams
  const supabase = await createClient()

  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
  const selectedDate = date ?? today
  const isSummary = view === 'summary'

  const [{ data: students }, { data: records }] = await Promise.all([
    supabase
      .from('students')
      .select('id, first_name, last_name, grade, batch_id, attendance_pct, batches(id, name, class_type)')
      .eq('is_active', true)
      .order('first_name'),
    isSummary
      ? Promise.resolve({ data: [] })
      : supabase
          .from('attendance_records')
          .select('student_id, present')
          .eq('class_date', selectedDate),
  ])

  const typedStudents = students as unknown as AttendanceStudent[]

  const sortedForMark = [...(typedStudents ?? [])].sort((a, b) => {
    const ba = a.batches?.name ?? 'zzz'
    const bb = b.batches?.name ?? 'zzz'
    return ba !== bb ? ba.localeCompare(bb) : a.first_name.localeCompare(b.first_name)
  })

  const existingRecords: Record<string, boolean> = Object.fromEntries(
    (records ?? []).map((r) => [r.student_id, r.present])
  )

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-sm text-gray-500 mt-1">
          {isSummary ? 'Overall attendance by student, lowest first.' : 'Tap a student to mark — saves instantly.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4">
        <Link
          href="/attendance"
          className={cn(
            'flex-1 text-center text-sm font-medium py-2 rounded-lg transition-colors',
            !isSummary ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          )}
        >
          Mark Attendance
        </Link>
        <Link
          href="/attendance?view=summary"
          className={cn(
            'flex-1 text-center text-sm font-medium py-2 rounded-lg transition-colors',
            isSummary ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          )}
        >
          Summary
        </Link>
      </div>

      {isSummary ? (
        <AttendanceSummary students={typedStudents ?? []} classFilter={class_type ?? ''} />
      ) : (
        <AttendanceMarker
          students={sortedForMark}
          existingRecords={existingRecords}
          selectedDate={selectedDate}
          today={today}
        />
      )}
    </div>
  )
}
