'use client'

import { useEffect, useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { studentSchema, type StudentFormData } from '@/lib/validations'
import { FEE_STATUSES, GRADES, GRADE_CLASS_TYPES } from '@/lib/constants'
import type { Batch, Student } from '@/types/database'

interface StudentFormProps {
  student?: Student
  batches: Batch[]
  onSubmit: (data: StudentFormData) => Promise<{ error?: string }>
}

export function StudentForm({ student, batches, onSubmit }: StudentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showGrade, setShowGrade] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema) as Resolver<StudentFormData>,
    defaultValues: student
      ? {
          first_name: student.first_name,
          last_name: student.last_name,
          age: student.age ?? undefined,
          batch_id: student.batch_id ?? '',
          grade: student.grade ?? '',
          guardian_name: student.guardian_name ?? '',
          phone: student.phone ?? '',
          email: student.email ?? '',
          whatsapp_number: student.whatsapp_number ?? '',
          enrollment_date: student.enrollment_date,
          fee_status: student.fee_status,
          fee_amount: student.fee_amount ?? undefined,
          notes: student.notes ?? '',
          is_active: student.is_active,
        }
      : {
          enrollment_date: new Date().toISOString().split('T')[0],
          fee_status: 'Pending',
          is_active: true,
        },
  })

  const selectedBatchId = watch('batch_id')

  useEffect(() => {
    const batch = batches.find((b) => b.id === selectedBatchId)
    if (batch) {
      setShowGrade(GRADE_CLASS_TYPES.includes(batch.class_type))
    } else {
      setShowGrade(false)
    }
  }, [selectedBatchId, batches])

  const submit = async (data: StudentFormData) => {
    setLoading(true)
    const result = await onSubmit(data)
    setLoading(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(student ? 'Student updated!' : 'Student added!')
      router.push('/students')
      router.refresh()
    }
  }

  const batchOptions = [
    { value: '', label: '— Select a batch —' },
    ...batches.map((b) => ({ value: b.id, label: b.name })),
  ]

  const gradeOptions = [
    { value: '', label: '— Select grade —' },
    ...GRADES.map((g) => ({ value: g, label: g })),
  ]

  const feeStatusOptions = FEE_STATUSES.map((s) => ({ value: s, label: s }))

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      {/* Personal */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Personal</h2>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name *"
            {...register('first_name')}
            error={errors.first_name?.message}
            autoFocus
          />
          <Input
            label="Last Name *"
            {...register('last_name')}
            error={errors.last_name?.message}
          />
        </div>
        <div className="mt-3">
          <Input label="Age" type="number" {...register('age')} error={errors.age?.message} />
        </div>
      </section>

      {/* Class */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Class</h2>
        <div className="space-y-3">
          <Select
            label="Batch"
            options={batchOptions}
            {...register('batch_id')}
            error={errors.batch_id?.message}
          />
          {showGrade && (
            <Select
              label="Grade"
              options={gradeOptions}
              {...register('grade')}
              error={errors.grade?.message}
            />
          )}
          <Input
            label="Enrollment Date *"
            type="date"
            {...register('enrollment_date')}
            error={errors.enrollment_date?.message}
          />
        </div>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Contact</h2>
        <div className="space-y-3">
          <Input label="Phone" type="tel" {...register('phone')} error={errors.phone?.message} />
          <Input
            label="WhatsApp Number"
            type="tel"
            hint="Leave blank if same as phone"
            {...register('whatsapp_number')}
            error={errors.whatsapp_number?.message}
          />
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Input label="Guardian Name" hint="For kids" {...register('guardian_name')} error={errors.guardian_name?.message} />
        </div>
      </section>

      {/* Fees */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Fees</h2>
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Fee Status *"
            options={feeStatusOptions}
            {...register('fee_status')}
            error={errors.fee_status?.message}
          />
          <Input
            label="Fee Amount (₹)"
            type="number"
            {...register('fee_amount')}
            error={errors.fee_amount?.message}
          />
        </div>
      </section>

      {/* Notes */}
      <section>
        <Textarea
          label="Notes (private)"
          hint="Only visible to admin"
          {...register('notes')}
          error={errors.notes?.message}
        />
      </section>

      {student && (
        <section className="flex items-center gap-3">
          <input type="checkbox" id="is_active" {...register('is_active')} className="w-4 h-4 text-brand-800" />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
            Student is active
          </label>
        </section>
      )}

      {/* Spacer so content isn't hidden behind the sticky bar on mobile */}
      <div className="h-20 md:hidden" />

      {/* Sticky footer on mobile, normal flow on desktop */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 px-4 py-3 flex gap-3 md:static md:border-0 md:bg-transparent md:p-0 md:pt-2">
        <Button type="submit" loading={loading} className="flex-1">
          {student ? 'Save Changes' : 'Add Student'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
