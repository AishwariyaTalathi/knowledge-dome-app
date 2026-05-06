'use client'

import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { batchSchema, type BatchFormData } from '@/lib/validations'
import { CLASS_TYPES } from '@/lib/constants'
import type { Batch } from '@/types/database'

interface BatchModalProps {
  open: boolean
  onClose: () => void
  batch?: Batch
  onSubmit: (data: BatchFormData) => Promise<{ error?: string }>
}

export function BatchModal({ open, onClose, batch, onSubmit }: BatchModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema) as Resolver<BatchFormData>,
    defaultValues: batch
      ? {
          name: batch.name,
          schedule: batch.schedule,
          class_type: batch.class_type,
          max_seats: batch.max_seats,
          is_active: batch.is_active,
        }
      : { is_active: true, max_seats: 20 },
  })

  const submit = async (data: BatchFormData) => {
    setLoading(true)
    const result = await onSubmit(data)
    setLoading(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(batch ? 'Batch updated!' : 'Batch added!')
      reset()
      onClose()
      router.refresh()
    }
  }

  const classTypeOptions = CLASS_TYPES.map((ct) => ({ value: ct, label: ct }))

  return (
    <Modal open={open} onClose={onClose} title={batch ? 'Edit Batch' : 'Add New Batch'}>
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <Input label="Batch Name *" {...register('name')} error={errors.name?.message} placeholder="e.g. Academic Grammar – Morning" autoFocus />
        <Input label="Schedule *" {...register('schedule')} error={errors.schedule?.message} placeholder="e.g. Mon/Wed/Fri 8:00 AM" />
        <Select
          label="Program Type *"
          options={classTypeOptions}
          placeholder="— Select program —"
          {...register('class_type')}
          error={errors.class_type?.message}
        />
        <Input label="Max Seats *" type="number" {...register('max_seats')} error={errors.max_seats?.message} />

        <div className="flex items-center gap-3">
          <input type="checkbox" id="batch_is_active" {...register('is_active')} className="w-4 h-4 text-brand-800" />
          <label htmlFor="batch_is_active" className="text-sm font-medium text-gray-700">Batch is active</label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading} className="flex-1">
            {batch ? 'Save Changes' : 'Add Batch'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}
