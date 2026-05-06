'use client'

import { useState } from 'react'
import { Plus, BookOpen } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { BatchModal } from './BatchModal'
import type { Batch } from '@/types/database'
import type { BatchFormData } from '@/lib/validations'

export function BatchActions({ batches }: { batches: Batch[] }) {
  const router = useRouter()
  const [addOpen, setAddOpen] = useState(false)
  const [editBatch, setEditBatch] = useState<Batch | null>(null)

  const handleAdd = async (data: BatchFormData) => {
    const supabase = createClient()
    const { error } = await supabase.from('batches').insert(data)
    if (!error) router.refresh()
    return { error: error?.message }
  }

  const handleEdit = async (data: BatchFormData) => {
    if (!editBatch) return { error: 'No batch selected' }
    const supabase = createClient()
    const { error } = await supabase.from('batches').update(data).eq('id', editBatch.id)
    if (!error) router.refresh()
    return { error: error?.message }
  }

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
            <Button variant="secondary" size="sm" onClick={() => setEditBatch(batch)}>
              Edit
            </Button>
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
    </div>
  )
}
