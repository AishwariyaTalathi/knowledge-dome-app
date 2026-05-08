'use client'

import { useState } from 'react'
import { Plus, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { BatchModal } from './BatchModal'
import { createBatch, updateBatch, deleteBatch } from '@/app/(protected)/batches/actions'
import type { Batch } from '@/types/database'
import type { BatchFormData } from '@/lib/validations'

export function BatchActions({ batches }: { batches: Batch[] }) {
  const [addOpen, setAddOpen] = useState(false)
  const [editBatch, setEditBatch] = useState<Batch | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Batch | null>(null)

  const handleAdd = async (data: BatchFormData) => {
    const result = await createBatch(data)
    if (!result.error) setAddOpen(false)
    return result
  }

  const handleEdit = async (data: BatchFormData) => {
    if (!editBatch) return { error: 'No batch selected' }
    const result = await updateBatch(editBatch.id, data)
    if (!result.error) setEditBatch(null)
    return result
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const result = await deleteBatch(deleteTarget.id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`"${deleteTarget.name}" deleted`)
    }
    setDeleteTarget(null)
  }

  const deleteMessage = deleteTarget
    ? deleteTarget.current_count > 0
      ? `${deleteTarget.current_count} student${deleteTarget.current_count === 1 ? '' : 's'} will be unassigned but not deleted. You can reassign them afterwards.`
      : 'This batch has no students. It will be permanently removed.'
    : ''

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Batches</h1>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add Batch
        </Button>
      </div>

      {/* Batch list */}
      <div className="space-y-3">
        {batches.map((batch) => (
          <div
            key={batch.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-semibold text-gray-900">{batch.name}</p>
                {!batch.is_active && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    Inactive
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {batch.class_type} · {batch.schedule}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {batch.current_count}/{batch.max_seats} seats filled
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setEditBatch(batch)}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(batch)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
        {batches.length === 0 && (
          <EmptyState
            icon={BookOpen}
            title="No batches yet"
            message="Add your first batch to start organising students into classes."
            action={{ label: 'Add your first batch', onClick: () => setAddOpen(true) }}
          />
        )}
      </div>

      <BatchModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAdd} />
      {editBatch && (
        <BatchModal
          open={true}
          batch={editBatch}
          onClose={() => setEditBatch(null)}
          onSubmit={handleEdit}
        />
      )}
      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        message={deleteMessage}
        confirmLabel="Yes, delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
