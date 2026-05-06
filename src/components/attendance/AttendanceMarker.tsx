'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Check, X, Users } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { markAttendance } from '@/app/(protected)/attendance/actions'

interface Batch {
  id: string
  name: string
  class_type: string
}

interface Student {
  id: string
  first_name: string
  last_name: string
  grade: string | null
}

interface AttendanceMarkerProps {
  batches: Batch[]
  students: Student[] | null
  existingRecords: Record<string, boolean>
  selectedBatchId: string
  selectedDate: string
}

export function AttendanceMarker({
  batches,
  students,
  existingRecords,
  selectedBatchId,
  selectedDate,
}: AttendanceMarkerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [attendance, setAttendance] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      (students ?? []).map((s) => [
        s.id,
        s.id in existingRecords ? existingRecords[s.id] : true,
      ])
    )
  )

  const updateUrl = (batchId: string, date: string) => {
    const params = new URLSearchParams()
    if (batchId) params.set('batch_id', batchId)
    params.set('date', date)
    router.push(`/attendance?${params}`)
  }

  const presentCount = Object.values(attendance).filter(Boolean).length
  const totalCount = students?.length ?? 0

  const handleSave = () => {
    if (!students?.length) return
    const records = students.map((s) => ({
      student_id: s.id,
      class_date: selectedDate,
      present: attendance[s.id] ?? true,
    }))
    startTransition(async () => {
      const result = await markAttendance(records)
      if (result.error) toast.error(result.error)
      else toast.success('Attendance saved!')
    })
  }

  return (
    <div className="space-y-4">
      {/* Selectors */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
            <select
              value={selectedBatchId}
              onChange={(e) => updateUrl(e.target.value, selectedDate)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-800"
            >
              <option value="">— Select a batch —</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => updateUrl(selectedBatchId, e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-800"
            />
          </div>
        </div>
      </div>

      {/* Student list */}
      {students && students.length > 0 && (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users size={15} className="text-gray-400" />
                <span className="font-medium">{presentCount}</span>
                <span className="text-gray-400">/ {totalCount} present</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setAttendance(Object.fromEntries((students ?? []).map((s) => [s.id, true])))}
                  className="text-xs font-medium text-green-600 hover:text-green-700 px-3 py-1 rounded-full hover:bg-green-50 transition-colors"
                >
                  All Present
                </button>
                <button
                  onClick={() => setAttendance(Object.fromEntries((students ?? []).map((s) => [s.id, false])))}
                  className="text-xs font-medium text-red-500 hover:text-red-600 px-3 py-1 rounded-full hover:bg-red-50 transition-colors"
                >
                  All Absent
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {students.map((student) => {
                const isPresent = attendance[student.id] ?? true
                return (
                  <div key={student.id} className="px-5 py-3.5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-800 font-bold text-xs">
                        {getInitials(student.first_name, student.last_name)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">
                        {student.first_name} {student.last_name}
                      </p>
                      {student.grade && (
                        <p className="text-xs text-gray-400">{student.grade}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setAttendance((prev) => ({ ...prev, [student.id]: !prev[student.id] }))}
                      className={cn(
                        'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex-shrink-0',
                        isPresent
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      )}
                    >
                      {isPresent ? <Check size={13} /> : <X size={13} />}
                      {isPresent ? 'Present' : 'Absent'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="h-20 md:hidden" />
          <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 px-4 py-3 md:static md:border-0 md:bg-transparent md:p-0">
            <Button onClick={handleSave} loading={isPending} className="w-full">
              Save Attendance
            </Button>
          </div>
        </>
      )}

      {students && students.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-400 text-sm">
          No active students in this batch.
        </div>
      )}
    </div>
  )
}
