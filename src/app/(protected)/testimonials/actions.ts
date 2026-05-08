'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { TestimonialFormData } from '@/lib/validations'

export async function createTestimonial(data: TestimonialFormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('testimonials').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/testimonials')
  revalidatePath('/')
  return {}
}

export async function updateTestimonial(id: string, data: TestimonialFormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('testimonials').update(data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/testimonials')
  revalidatePath('/')
  return {}
}

export async function toggleTestimonialVisibility(id: string, isActive: boolean): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('testimonials').update({ is_active: !isActive }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/testimonials')
  revalidatePath('/')
  return {}
}
