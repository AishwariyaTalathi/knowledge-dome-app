'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { AnnouncementFormData } from '@/lib/validations'

export async function createAnnouncement(data: AnnouncementFormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('announcements').insert({
    ...data,
    description: data.description || null,
  })
  if (error) return { error: error.message }
  revalidatePath('/announcements')
  revalidatePath('/')
  return {}
}

export async function updateAnnouncement(id: string, data: AnnouncementFormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('announcements')
    .update({ ...data, description: data.description || null })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/announcements')
  revalidatePath('/')
  return {}
}

export async function toggleAnnouncementVisibility(id: string, isActive: boolean): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('announcements')
    .update({ is_active: !isActive })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/announcements')
  revalidatePath('/')
  return {}
}
