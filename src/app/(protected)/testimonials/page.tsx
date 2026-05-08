import { createClient } from '@/lib/supabase/server'
import { TestimonialActions } from '@/components/testimonials/TestimonialActions'

export default async function TestimonialsPage() {
  const supabase = await createClient()
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })

  return <TestimonialActions testimonials={testimonials ?? []} />
}
