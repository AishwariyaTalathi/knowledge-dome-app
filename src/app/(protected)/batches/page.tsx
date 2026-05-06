import { createClient } from '@/lib/supabase/server'
import { BatchActions } from '@/components/batches/BatchActions'

export default async function BatchesPage() {
  const supabase = await createClient()
  const { data: batches } = await supabase
    .from('batches')
    .select('*')
    .order('class_type')
    .order('name')

  return <BatchActions batches={batches ?? []} />
}
