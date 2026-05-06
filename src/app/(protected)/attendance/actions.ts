'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markAttendance(
  records: { student_id: string; class_date: string; present: boolean }[]
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('attendance_records')
    .upsert(records, { onConflict: 'student_id,class_date' })

  if (error) return { error: error.message }

  // Recalculate attendance_pct for each affected student
  const studentIds = [...new Set(records.map((r) => r.student_id))]

  for (const student_id of studentIds) {
    const { data } = await supabase
      .from('attendance_records')
      .select('present')
      .eq('student_id', student_id)

    const total = data?.length ?? 0
    const present = data?.filter((r) => r.present).length ?? 0
    const pct = total > 0 ? Math.round((present / total) * 100) : 0

    await supabase.from('students').update({ attendance_pct: pct }).eq('id', student_id)
  }

  revalidatePath('/attendance')
  revalidatePath('/students')
  return {}
}
