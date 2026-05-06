interface Stat {
  label: string
  value: string | number
}

interface StatsRowProps {
  activeStudents: number
  batchCount: number
  avgAttendance: number
  newEnrollments: number
}

function StatCard({ label, value }: Stat) {
  return (
    <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
      <p className="text-3xl font-bold text-brand-800">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  )
}

export function StatsRow({ activeStudents, batchCount, avgAttendance, newEnrollments }: StatsRowProps) {
  return (
    <section className="max-w-4xl mx-auto px-4 -mt-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Active Students" value={activeStudents} />
        <StatCard label="Batches Running" value={batchCount} />
        <StatCard label="Avg Attendance" value={`${avgAttendance}%`} />
        <StatCard label="New This Month" value={newEnrollments} />
      </div>
    </section>
  )
}
