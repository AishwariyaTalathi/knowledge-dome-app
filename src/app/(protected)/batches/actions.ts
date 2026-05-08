'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { BatchFormData } from '@/lib/validations'

export async function createBatch(data: BatchFormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('batches').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/batches')
  return {}
}

export async function updateBatch(id: string, data: BatchFormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('batches').update(data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/batches')
  return {}
}

export async function deleteBatch(id: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('batches').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/batches')
  revalidatePath('/students')
  return {}
}
