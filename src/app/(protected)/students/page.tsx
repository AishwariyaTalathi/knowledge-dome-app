import Link from 'next/link'
import { Suspense } from 'react'
import { UserPlus, Users, SearchX } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { StudentTable } from '@/components/students/StudentTable'
import { StudentCard } from '@/components/students/StudentCard'
import { StudentFilters } from '@/components/students/StudentFilters'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import type { Student } from '@/types/database'

interface SearchParams {
  search?: string
  batch?: string
  class_type?: string
  fee_status?: string
}

async function getStudents(params: SearchParams): Promise<Student[]> {
  const supabase = await createClient()
  let query = supabase
    .from('students')
    .select('*, batches(id, name, class_type)')
    .eq('is_active', true)
    .order('first_name')

  if (params.search) {
    query = query.or(
      `first_name.ilike.%${params.search}%,last_name.ilike.%${params.search}%,phone.ilike.%${params.search}%`
    )
  }
  if (params.batch) query = query.eq('batch_id', params.batch)
  if (params.class_type) {
    query = query.eq('batches.class_type', params.class_type)
  }
  if (params.fee_status) query = query.eq('fee_status', params.fee_status)

  const { data } = await query
  return (data as Student[]) ?? []
}

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const [students, { data: batches }] = await Promise.all([
    getStudents(params),
    supabase.from('batches').select('*').eq('is_active', true).order('name'),
  ])

  const hasFilters = !!(params.search || params.batch || params.class_type || params.fee_status)

  const emptyContent =
    students.length === 0 ? (
      hasFilters ? (
        <EmptyState
          icon={SearchX}
          title="No students match your search"
          message="Try adjusting the filters or search term to find who you're looking for."
          action={{ label: 'Clear filters', href: '/students' }}
        />
      ) : (
        <EmptyState
          icon={Users}
          title="No students yet"
          message="Start building your class by adding your first student."
          action={{ label: 'Add your first student', href: '/students/new' }}
        />
      )
    ) : null

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        <Link href="/students/new">
          <Button size="sm">
            <UserPlus size={16} className="mr-2" />
            Add Student
          </Button>
        </Link>
      </div>

      <Suspense fallback={<Spinner />}>
        <StudentFilters batches={batches ?? []} />
      </Suspense>

      {students.length > 0 && (
        <p className="text-sm text-gray-500 mb-3">
          {students.length} student{students.length !== 1 ? 's' : ''} found
        </p>
      )}

      {emptyContent ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          {emptyContent}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block">
            <StudentTable students={students} />
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {students.map((s) => <StudentCard key={s.id} student={s} />)}
          </div>
        </>
      )}
    </div>
  )
}