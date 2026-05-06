'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleStudentActive(
  studentId: string,
  isActive: boolean
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('students')
    .update({ is_active: !isActive })
    .eq('id', studentId)

  if (error) return { error: error.message }
  revalidatePath('/students')
  return {}
}
