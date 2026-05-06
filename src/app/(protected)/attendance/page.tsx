import { createClient } from '@/lib/supabase/server'
import { AttendanceMarker } from '@/components/attendance/AttendanceMarker'

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { date } = await searchParams
  const supabase = await createClient()

  // Default to today in IST
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
  const selectedDate = date ?? today

  const [{ data: students }, { data: records }] = await Promise.all([
    supabase
      .from('students')
      .select('id, first_name, last_name, grade, batch_id, batches(id, name, class_type)')
      .eq('is_active', true)
      .order('first_name'),
    supabase
      .from('attendance_records')
      .select('student_id, present')
      .eq('class_date', selectedDate),
  ])

  const existingRecords: Record<string, boolean> = Object.fromEntries(
    (records ?? []).map((r) => [r.student_id, r.present])
  )

  // Sort by batch name then first name
  const sorted = (students ?? []).sort((a, b) => {
    const ba = (a.batches as unknown as { name: string } | null)?.name ?? 'zzz'
    const bb = (b.batches as unknown as { name: string } | null)?.name ?? 'zzz'
    return ba !== bb ? ba.localeCompare(bb) : a.first_name.localeCompare(b.first_name)
  })

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-sm text-gray-500 mt-1">Tap a student to mark — saves instantly.</p>
      </div>
      <AttendanceMarker
        students={sorted as any}
        existingRecords={existingRecords}
        selectedDate={selectedDate}
        today={today}
      />
    </div>
  )
}
