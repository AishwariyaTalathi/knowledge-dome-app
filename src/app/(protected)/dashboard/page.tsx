import Link from 'next/link'
import { Users, BookOpen, TrendingUp, UserPlus, AlertTriangle, ClipboardList, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getInitials } from '@/lib/utils'

const LOW_ATTENDANCE_THRESHOLD = 75

async function getDashboardData() {
  const supabase = await createClient()
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })

  const [{ data: students }, { data: batches }, { data: todayRecords }] = await Promise.all([
    supabase
      .from('students')
      .select('id, first_name, last_name, attendance_pct, enrollment_date, fee_status')
      .eq('is_active', true),
    supabase.from('batches').select('id').eq('is_active', true),
    supabase.from('attendance_records').select('student_id').eq('class_date', today),
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

  const lowAttendance = (students ?? [])
    .filter((s) => (s.attendance_pct ?? 0) < LOW_ATTENDANCE_THRESHOLD && (s.attendance_pct ?? 0) > 0)
    .sort((a, b) => (a.attendance_pct ?? 0) - (b.attendance_pct ?? 0))
    .slice(0, 5)

  const feeIssues = (students ?? [])
    .filter((s) => s.fee_status === 'Overdue' || s.fee_status === 'Pending')
    .sort((a, b) => (a.fee_status === 'Overdue' ? -1 : 1) - (b.fee_status === 'Overdue' ? -1 : 1))
    .slice(0, 5)

  const overdueCount = (students ?? []).filter((s) => s.fee_status === 'Overdue').length
  const pendingCount = (students ?? []).filter((s) => s.fee_status === 'Pending').length
  const markedToday = todayRecords?.length ?? 0

  return {
    activeStudents, batchCount, avgAttendance, newEnrollments,
    lowAttendance, feeIssues, overdueCount, pendingCount, markedToday,
  }
}

export default async function DashboardPage() {
  const {
    activeStudents, batchCount, avgAttendance, newEnrollments,
    lowAttendance, feeIssues, overdueCount, pendingCount, markedToday,
  } = await getDashboardData()

  const stats = [
    { label: 'Active Students', value: activeStudents, icon: Users, href: '/students', color: 'text-brand-800 bg-brand-50' },
    { label: 'Active Batches', value: batchCount, icon: BookOpen, href: '/batches', color: 'text-green-700 bg-green-50' },
    { label: 'Avg Attendance', value: `${avgAttendance}%`, icon: TrendingUp, href: '/attendance', color: 'text-purple-700 bg-purple-50' },
    { label: 'New This Month', value: newEnrollments, icon: UserPlus, href: '/students', color: 'text-orange-700 bg-orange-50' },
  ]

  const hasAttention = lowAttendance.length > 0 || feeIssues.length > 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      {/* Today's attendance strip */}
      <Link
        href="/attendance"
        className="flex items-center justify-between bg-brand-800 text-white rounded-xl px-5 py-4 hover:bg-brand-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <ClipboardList size={20} className="opacity-80" />
          <div>
            <p className="font-semibold">Mark Today's Attendance</p>
            <p className="text-sm opacity-70">
              {markedToday > 0 ? `${markedToday} student${markedToday !== 1 ? 's' : ''} marked so far today` : 'No attendance marked yet today'}
            </p>
          </div>
        </div>
        <ChevronRight size={18} className="opacity-60" />
      </Link>

      {/* Needs attention */}
      {hasAttention && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-amber-500" />
            <h2 className="text-sm font-semibold text-gray-700">Needs Attention</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Low attendance */}
            {lowAttendance.length > 0 && (
              <div className="bg-white rounded-xl border border-amber-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
                  <p className="text-sm font-semibold text-amber-800">Low Attendance (below {LOW_ATTENDANCE_THRESHOLD}%)</p>
                  <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{lowAttendance.length}</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {lowAttendance.map((s) => (
                    <Link
                      key={s.id}
                      href={`/students/${s.id}`}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-800 font-bold text-xs">{getInitials(s.first_name, s.last_name)}</span>
                      </div>
                      <p className="flex-1 text-sm font-medium text-gray-800 truncate">{s.first_name} {s.last_name}</p>
                      <span className="text-sm font-semibold text-amber-600">{s.attendance_pct}%</span>
                    </Link>
                  ))}
                </div>
                {activeStudents > 5 && (
                  <Link href="/students" className="block px-4 py-2.5 text-xs text-center text-amber-600 hover:bg-amber-50 border-t border-amber-50 font-medium">
                    View all students →
                  </Link>
                )}
              </div>
            )}

            {/* Fee issues */}
            {feeIssues.length > 0 && (
              <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-red-50 border-b border-red-100 flex items-center justify-between">
                  <p className="text-sm font-semibold text-red-800">Fee Issues</p>
                  <div className="flex gap-1.5">
                    {overdueCount > 0 && <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{overdueCount} overdue</span>}
                    {pendingCount > 0 && <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{pendingCount} pending</span>}
                  </div>
                </div>
                <div className="divide-y divide-gray-50">
                  {feeIssues.map((s) => (
                    <Link
                      key={s.id}
                      href={`/students/${s.id}`}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-800 font-bold text-xs">{getInitials(s.first_name, s.last_name)}</span>
                      </div>
                      <p className="flex-1 text-sm font-medium text-gray-800 truncate">{s.first_name} {s.last_name}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.fee_status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        {s.fee_status}
                      </span>
                    </Link>
                  ))}
                </div>
                <Link href="/students" className="block px-4 py-2.5 text-xs text-center text-red-600 hover:bg-red-50 border-t border-red-50 font-medium">
                  View all students →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/students/new" className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
            <UserPlus size={20} className="text-brand-800" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Add Student</p>
            <p className="text-sm text-gray-500">Enroll a new student</p>
          </div>
        </Link>
        <Link href="/batches" className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
            <BookOpen size={20} className="text-green-700" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Manage Batches</p>
            <p className="text-sm text-gray-500">Add or edit batches</p>
          </div>
        </Link>
        <Link href="/announcements" className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
            <ClipboardList size={20} className="text-purple-700" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Announcements</p>
            <p className="text-sm text-gray-500">Post to public page</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
