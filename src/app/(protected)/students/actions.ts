'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { FeeStatus } from '@/types/database'

export async function updateFeeStatus(
  studentId: string,
  feeStatus: FeeStatus
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('students')
    .update({ fee_status: feeStatus })
    .eq('id', studentId)

  if (error) return { error: error.message }
  revalidatePath('/students')
  return {}
}

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
