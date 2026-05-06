import { createClient } from '@/lib/supabase/server'
import { AnnouncementActions } from '@/components/announcements/AnnouncementActions'

export default async function AnnouncementsPage() {
  const supabase = await createClient()
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('date', { ascending: false })

  return <AnnouncementActions announcements={announcements ?? []} />
}
