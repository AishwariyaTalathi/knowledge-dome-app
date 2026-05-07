import Link from 'next/link'
import { Suspense } from 'react'
import { UserPlus, Users, SearchX } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { StudentTable } from '@/components/students/StudentTable'
import { StudentCard } from '@/components/students/StudentCard'
import { StudentFilters } from '@/components/students/StudentFilters'
import { InactiveStudentsSection } from '@/components/students/InactiveStudentsSection'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { CLASS_TYPE_COLORS } from '@/lib/constants'
import type { Student, ClassType } from '@/types/database'

interface SearchParams {
  search?: string
  class_type?: string
  fee_status?: string
}

async function getStudents(params: SearchParams): Promise<{ active: Student[]; inactive: Student[] }> {
  const supabase = await createClient()
  let query = supabase
    .from('students')
    .select('*, batches(id, name, class_type)')
    .eq('is_active', true)

  if (params.search) {
    query = query.or(
      `first_name.ilike.%${params.search}%,last_name.ilike.%${params.search}%,phone.ilike.%${params.search}%`
    )
  }
  if (params.class_type) {
    query = query.eq('batches.class_type', params.class_type)
  }
  if (params.fee_status) query = query.eq('fee_status', params.fee_status)

  const { data: activeData } = await query
  const active = ((activeData as Student[]) ?? []).sort((a, b) => {
    const batchA = a.batches?.name ?? 'zzz'
    const batchB = b.batches?.name ?? 'zzz'
    if (batchA !== batchB) return batchA.localeCompare(batchB)
    return a.first_name.localeCompare(b.first_name)
  })

  // Inactive students — not affected by filters
  const { data: inactiveData } = await supabase
    .from('students')
    .select('*, batches(id, name, class_type)')
    .eq('is_active', false)
    .order('first_name')

  const inactive = (inactiveData as Student[]) ?? []

  return { active, inactive }
}

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const { active: students, inactive: inactiveStudents } = await getStudents(params)
  const hasFilters = !!(params.search || params.class_type || params.fee_status)

  // Group students by batch
  const groups: { batchName: string; classType: string; students: Student[] }[] = []
  for (const student of students) {
    const batchName = student.batches?.name ?? 'No Batch'
    const classType = student.batches?.class_type ?? ''
    const existing = groups.find((g) => g.batchName === batchName)
    if (existing) {
      existing.students.push(student)
    } else {
      groups.push({ batchName, classType, students: [student] })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Students
          {students.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">{students.length}</span>
          )}
        </h1>
        <Link href="/students/new">
          <Button size="sm">
            <UserPlus size={16} className="mr-2" />
            Add Student
          </Button>
        </Link>
      </div>

      <Suspense fallback={<Spinner />}>
        <StudentFilters />
      </Suspense>

      {students.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          {hasFilters ? (
            <EmptyState
              icon={SearchX}
              title="No students match your search"
              message="Try adjusting the filters or search term."
              action={{ label: 'Clear filters', href: '/students' }}
            />
          ) : (
            <EmptyState
              icon={Users}
              title="No students yet"
              message="Start building your class by adding your first student."
              action={{ label: 'Add your first student', href: '/students/new' }}
            />
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(({ batchName, classType, students: batchStudents }) => (
            <div key={batchName}>
              {/* Batch header */}
              <div className="flex items-center gap-2 mb-2 px-1">
                <h2 className="text-sm font-semibold text-gray-800">{batchName}</h2>
                {classType && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CLASS_TYPE_COLORS[classType as ClassType]}`}>
                    {classType}
                  </span>
                )}
                <span className="text-xs text-gray-400 ml-auto">{batchStudents.length} student{batchStudents.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Desktop table */}
              <div className="hidden md:block">
                <StudentTable students={batchStudents} />
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-2">
                {batchStudents.map((s) => <StudentCard key={s.id} student={s} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      <InactiveStudentsSection students={inactiveStudents} />
    </div>
  )
}
