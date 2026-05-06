import Link from 'next/link'
import { Users, BookOpen, TrendingUp, UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

async function getStats() {
  const supabase = await createClient()
  const [{ data: students }, { data: batches }] = await Promise.all([
    supabase.from('students').select('id, attendance_pct, enrollment_date, fee_status').eq('is_active', true),
    supabase.from('batches').select('id').eq('is_active', true),
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
  const overdueCount = (students ?? []).filter((s) => s.fee_status === 'Overdue').length

  return { activeStudents, batchCount, avgAttendance, newEnrollments, overdueCount }
}

export default async function DashboardPage() {
  const { activeStudents, batchCount, avgAttendance, newEnrollments, overdueCount } = await getStats()

  const stats = [
    { label: 'Active Students', value: activeStudents, icon: Users, href: '/students', color: 'text-brand-800 bg-brand-50' },
    { label: 'Active Batches', value: batchCount, icon: BookOpen, href: '/batches', color: 'text-green-700 bg-green-50' },
    { label: 'Avg Attendance', value: `${avgAttendance}%`, icon: TrendingUp, href: '/students', color: 'text-purple-700 bg-purple-50' },
    { label: 'New This Month', value: newEnrollments, icon: UserPlus, href: '/students', color: 'text-orange-700 bg-orange-50' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`inline-flex p-2 rounded-lg mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {overdueCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-red-800">{overdueCount} student{overdueCount > 1 ? 's' : ''} with overdue fees</p>
            <p className="text-sm text-red-600">Please follow up with them.</p>
          </div>
          <Link href="/students?fee_status=Overdue" className="text-sm font-medium text-red-700 hover:underline">
            View →
          </Link>
        </div>
      )}

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <Link href="/students/new" className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center">
            <UserPlus size={22} className="text-brand-800" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Add New Student</p>
            <p className="text-sm text-gray-500">Enroll a new student</p>
          </div>
        </Link>
        <Link href="/batches" className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
            <BookOpen size={22} className="text-green-700" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Manage Batches</p>
            <p className="text-sm text-gray-500">Add or edit class batches</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
