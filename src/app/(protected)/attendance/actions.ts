'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markSingleAttendance(
  student_id: string,
  class_date: string,
  present: boolean
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('attendance_records')
    .upsert({ student_id, class_date, present }, { onConflict: 'student_id,class_date' })

  if (error) return { error: error.message }

  // Recalculate attendance_pct for this student
  const { data } = await supabase
    .from('attendance_records')
    .select('present')
    .eq('student_id', student_id)

  const total = data?.length ?? 0
  const presentCount = data?.filter((r) => r.present).length ?? 0
  const pct = total > 0 ? Math.round((presentCount / total) * 100) : 0

  await supabase.from('students').update({ attendance_pct: pct }).eq('id', student_id)
  revalidatePath('/students')
  return {}
}
