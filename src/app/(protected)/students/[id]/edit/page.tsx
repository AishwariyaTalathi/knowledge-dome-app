import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { StudentForm } from '@/components/students/StudentForm'
import type { StudentFormData } from '@/lib/validations'

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: student }, { data: batches }] = await Promise.all([
    supabase.from('students').select('*').eq('id', id).single(),
    supabase.from('batches').select('*').eq('is_active', true).order('name'),
  ])

  if (!student) notFound()

  async function updateStudent(data: StudentFormData) {
    'use server'
    const supabase = await createClient()
    const payload = {
      ...data,
      age: data.age || null,
      batch_id: data.batch_id || null,
      grade: data.grade || null,
      guardian_name: data.guardian_name || null,
      phone: data.phone || null,
      email: data.email || null,
      whatsapp_number: data.whatsapp_number || null,
      fee_amount: data.fee_amount || null,
      notes: data.notes || null,
    }
    const { error } = await supabase.from('students').update(payload).eq('id', id)
    if (!error) revalidatePath('/students')
    return { error: error?.message }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Edit — {student.first_name} {student.last_name}
      </h1>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <StudentForm student={student} batches={batches ?? []} onSubmit={updateStudent} />
      </div>
    </div>
  )
}
