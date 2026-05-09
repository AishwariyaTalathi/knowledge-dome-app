import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { HeroSection } from '@/components/landing/HeroSection'
import { StatsRow } from '@/components/landing/StatsRow'
import { StickyNav } from '@/components/landing/StickyNav'
import { AboutSection } from '@/components/landing/AboutSection'
import { BatchList } from '@/components/landing/BatchList'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { AnnouncementsSection } from '@/components/landing/AnnouncementsSection'
import { ContactSection } from '@/components/landing/ContactSection'

export const revalidate = 60

export default async function LandingPage() {
  const supabase = await createClient()

  const [{ data: batches }, { data: announcements }, { data: students }, { data: testimonials }] = await Promise.all([
    supabase.from('batches').select('*').eq('is_active', true).order('created_at'),
    supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .order('date', { ascending: false })
      .limit(5),
    supabase.from('students').select('id, attendance_pct, enrollment_date').eq('is_active', true),
    supabase.from('testimonials').select('*').eq('is_active', true).order('created_at'),
  ])

  const activeStudents = students?.length ?? 0
  const batchCount = batches?.length ?? 0

  const avgAttendance =
    activeStudents > 0
      ? Math.round(
          (students ?? []).reduce((sum, s) => sum + (s.attendance_pct ?? 0), 0) / activeStudents
        )
      : 0

  const now = new Date()
  const newEnrollments = (students ?? []).filter((s) => {
    const d = new Date(s.enrollment_date)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }).length

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />

      <StatsRow
        activeStudents={activeStudents}
        batchCount={batchCount}
        avgAttendance={avgAttendance}
        newEnrollments={newEnrollments}
      />

      <StickyNav />

      <div id="about"><AboutSection /></div>
      <div id="classes"><BatchList batches={batches ?? []} /></div>
      <div id="reviews"><TestimonialsSection testimonials={testimonials ?? []} /></div>
      <div id="announcements"><AnnouncementsSection announcements={announcements ?? []} /></div>
      <div id="contact"><ContactSection /></div>

      <footer className="text-center py-8 text-sm text-gray-400 border-t border-gray-200">
        <p>© {new Date().getFullYear()} Minakshi&apos;s Knowledge Dome · Pune</p>
        <Link href="/login" className="text-brand-800 hover:underline mt-1 inline-block text-xs">
          Admin Login
        </Link>
      </footer>
    </div>
  )
}
