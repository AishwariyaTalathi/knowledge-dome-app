import { createClient } from '@/lib/supabase/server'
import { AttendanceMarker } from '@/components/attendance/AttendanceMarker'

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ batch_id?: string; date?: string }>
}) {
  const { batch_id, date } = await searchParams
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]
  const selectedDate = date ?? today

  const { data: batches } = await supabase
    .from('batches')
    .select('id, name, class_type')
    .eq('is_active', true)
    .order('name')

  let students = null
  let existingRecords: Record<string, boolean> = {}

  if (batch_id) {
    const { data: studentData } = await supabase
      .from('students')
      .select('id, first_name, last_name, grade')
      .eq('batch_id', batch_id)
      .eq('is_active', true)
      .order('first_name')

    students = studentData

    if (students && students.length > 0) {
      const { data: records } = await supabase
        .from('attendance_records')
        .select('student_id, present')
        .eq('class_date', selectedDate)
        .in('student_id', students.map((s) => s.id))

      existingRecords = Object.fromEntries(
        (records ?? []).map((r) => [r.student_id, r.present])
      )
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="text-sm text-gray-500 mt-1">Select a batch and date, then mark each student.</p>
      </div>
      <AttendanceMarker
        batches={batches ?? []}
        students={students}
        existingRecords={existingRecords}
        selectedBatchId={batch_id ?? ''}
        selectedDate={selectedDate}
      />
    </div>
  )
}
