'use client'

import { useState } from 'react'
import { Plus, Bell } from 'lucide-react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { announcementSchema, type AnnouncementFormData } from '@/lib/validations'
import { formatDate } from '@/lib/utils'
import {
  createAnnouncement,
  updateAnnouncement,
  toggleAnnouncementVisibility,
} from '@/app/(protected)/announcements/actions'
import type { Announcement } from '@/types/database'

function AnnouncementModal({
  open,
  onClose,
  announcement,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  announcement?: Announcement
  onSubmit: (data: AnnouncementFormData) => Promise<{ error?: string }>
}) {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema) as Resolver<AnnouncementFormData>,
    defaultValues: announcement
      ? {
          title: announcement.title,
          description: announcement.description ?? '',
          date: announcement.date,
          is_active: announcement.is_active,
        }
      : {
          date: new Date().toISOString().split('T')[0],
          is_active: true,
        },
  })

  const submit = async (data: AnnouncementFormData) => {
    setLoading(true)
    const result = await onSubmit(data)
    setLoading(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(announcement ? 'Announcement updated!' : 'Announcement added!')
      reset()
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={announcement ? 'Edit Announcement' : 'Add Announcement'}>
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <Input label="Title *" {...register('title')} error={errors.title?.message} autoFocus />
        <Textarea label="Description" rows={3} {...register('description')} error={errors.description?.message} />
        <Input label="Date *" type="date" {...register('date')} error={errors.date?.message} />
        <div className="flex items-center gap-3">
          <input type="checkbox" id="ann_is_active" {...register('is_active')} className="w-4 h-4 text-brand-800" />
          <label htmlFor="ann_is_active" className="text-sm font-medium text-gray-700">
            Show on public page
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading} className="flex-1">
            {announcement ? 'Save Changes' : 'Add Announcement'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
        </div>
      </form>
    </Modal>
  )
}

export function AnnouncementActions({ announcements }: { announcements: Announcement[] }) {
  const [addOpen, setAddOpen] = useState(false)
  const [editItem, setEditItem] = useState<Announcement | null>(null)
  const [hideTarget, setHideTarget] = useState<Announcement | null>(null)

  const handleAdd = async (data: AnnouncementFormData) => {
    return createAnnouncement(data)
  }

  const handleEdit = async (data: AnnouncementFormData) => {
    if (!editItem) return { error: 'No announcement selected' }
    return updateAnnouncement(editItem.id, data)
  }

  const confirmHide = async () => {
    if (!hideTarget) return
    await toggleAnnouncementVisibility(hideTarget.id, hideTarget.is_active)
    setHideTarget(null)
  }

  const handleToggleShow = async (a: Announcement) => {
    await toggleAnnouncementVisibility(a.id, a.is_active)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add Announcement
        </Button>
      </div>

      <div className="space-y-3">
        {announcements.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900">{a.title}</p>
                  {!a.is_active && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Hidden</span>
                  )}
                </div>
                {a.description && (
                  <p className="text-sm text-gray-500 mb-2">{a.description}</p>
                )}
                <p className="text-xs text-gray-400">{formatDate(a.date)}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => a.is_active ? setHideTarget(a) : handleToggleShow(a)}
                >
                  {a.is_active ? 'Hide' : 'Show'}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setEditItem(a)}>
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <EmptyState
            icon={Bell}
            title="No announcements yet"
            message="Add an announcement to let students and parents know about upcoming events or holidays."
            action={{ label: 'Add your first announcement', onClick: () => setAddOpen(true) }}
          />
        )}
      </div>

      <AnnouncementModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAdd} />
      {editItem && (
        <AnnouncementModal
          open={true}
          announcement={editItem}
          onClose={() => setEditItem(null)}
          onSubmit={handleEdit}
        />
      )}
      <ConfirmDialog
        open={!!hideTarget}
        title="Hide this announcement?"
        message={`"${hideTarget?.title}" will no longer appear on the public page. You can show it again anytime.`}
        confirmLabel="Yes, hide it"
        cancelLabel="Cancel"
        variant="warning"
        onConfirm={confirmHide}
        onCancel={() => setHideTarget(null)}
      />
    </div>
  )
}
