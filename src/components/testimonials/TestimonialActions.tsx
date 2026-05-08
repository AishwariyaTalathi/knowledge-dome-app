'use client'

import { useState } from 'react'
import { Plus, Star, Quote } from 'lucide-react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { testimonialSchema, type TestimonialFormData } from '@/lib/validations'
import {
  createTestimonial,
  updateTestimonial,
  toggleTestimonialVisibility,
} from '@/app/(protected)/testimonials/actions'
import type { Testimonial } from '@/types/database'

const starOptions = [
  { value: '5', label: '★★★★★  (5 stars)' },
  { value: '4', label: '★★★★☆  (4 stars)' },
  { value: '3', label: '★★★☆☆  (3 stars)' },
  { value: '2', label: '★★☆☆☆  (2 stars)' },
  { value: '1', label: '★☆☆☆☆  (1 star)' },
]

function TestimonialModal({
  open,
  onClose,
  testimonial,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  testimonial?: Testimonial
  onSubmit: (data: TestimonialFormData) => Promise<{ error?: string }>
}) {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema) as Resolver<TestimonialFormData>,
    defaultValues: testimonial
      ? {
          name: testimonial.name,
          role: testimonial.role,
          quote: testimonial.quote,
          stars: testimonial.stars,
          is_active: testimonial.is_active,
        }
      : { role: 'Parent', stars: 5, is_active: true },
  })

  const submit = async (data: TestimonialFormData) => {
    setLoading(true)
    const result = await onSubmit(data)
    setLoading(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(testimonial ? 'Testimonial updated!' : 'Testimonial added!')
      reset()
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={testimonial ? 'Edit Testimonial' : 'Add Testimonial'}>
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <Input label="Parent / Student Name *" {...register('name')} error={errors.name?.message} autoFocus />
        <Input label="Role" hint='e.g. "Parent", "Student"' {...register('role')} error={errors.role?.message} />
        <Textarea
          label="What they said *"
          hint="Type exactly what they said — it will appear in quotes on the website"
          rows={4}
          {...register('quote')}
          error={errors.quote?.message}
        />
        <Select label="Star Rating *" options={starOptions} {...register('stars')} error={errors.stars?.message} />
        <div className="flex items-center gap-3">
          <input type="checkbox" id="t_is_active" {...register('is_active')} className="w-4 h-4 text-brand-800" />
          <label htmlFor="t_is_active" className="text-sm font-medium text-gray-700">
            Show on public page
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading} className="flex-1">
            {testimonial ? 'Save Changes' : 'Add Testimonial'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
        </div>
      </form>
    </Modal>
  )
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

export function TestimonialActions({ testimonials }: { testimonials: Testimonial[] }) {
  const [addOpen, setAddOpen] = useState(false)
  const [editItem, setEditItem] = useState<Testimonial | null>(null)
  const [hideTarget, setHideTarget] = useState<Testimonial | null>(null)

  const confirmHide = async () => {
    if (!hideTarget) return
    await toggleTestimonialVisibility(hideTarget.id, hideTarget.is_active)
    setHideTarget(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add Testimonial
        </Button>
      </div>

      <div className="space-y-3">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <span className="text-xs text-gray-400">{t.role}</span>
                  {!t.is_active && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Hidden</span>
                  )}
                </div>
                <StarRating count={t.stars} />
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">"{t.quote}"</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => t.is_active ? setHideTarget(t) : toggleTestimonialVisibility(t.id, t.is_active)}
                >
                  {t.is_active ? 'Hide' : 'Show'}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setEditItem(t)}>
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <EmptyState
            icon={Quote}
            title="No testimonials yet"
            message="Add a testimonial when a parent or student shares their experience."
            action={{ label: 'Add your first testimonial', onClick: () => setAddOpen(true) }}
          />
        )}
      </div>

      <TestimonialModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={(data) => createTestimonial(data)} />
      {editItem && (
        <TestimonialModal
          open={true}
          testimonial={editItem}
          onClose={() => setEditItem(null)}
          onSubmit={(data) => updateTestimonial(editItem.id, data)}
        />
      )}
      <ConfirmDialog
        open={!!hideTarget}
        title="Hide this testimonial?"
        message={`${hideTarget?.name}'s testimonial will no longer appear on the public page. You can show it again anytime.`}
        confirmLabel="Yes, hide it"
        cancelLabel="Cancel"
        variant="warning"
        onConfirm={confirmHide}
        onCancel={() => setHideTarget(null)}
      />
    </div>
  )
}
