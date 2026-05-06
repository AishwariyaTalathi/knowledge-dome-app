'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Check, X, CalendarDays } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { CLASS_TYPES, CLASS_TYPE_COLORS } from '@/lib/constants'
import { markSingleAttendance } from '@/app/(protected)/attendance/actions'
import type { ClassType } from '@/types/database'

interface Student {
  id: string
  first_name: string
  last_name: string
  grade: string | null
  batch_id: string | null
  batches: { id: string; name: string; class_type: string } | null
}

interface AttendanceMarkerProps {
  students: Student[]
  existingRecords: Record<string, boolean>
  selectedDate: string
  today: string
}

function getYesterday(today: string) {
  const d = new Date(today + 'T00:00:00')
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

export function AttendanceMarker({
  students,
  existingRecords,
  selectedDate,
  today,
}: AttendanceMarkerProps) {
  const router = useRouter()
  const yesterday = getYesterday(today)

  const [attendance, setAttendance] = useState<Record<string, boolean | null>>(
    () => Object.fromEntries(students.map((s) => [s.id, s.id in existingRecords ? existingRecords[s.id] : null]))
  )
  const [saving, setSaving] = useState<Set<string>>(new Set())
  const [classFilter, setClassFilter] = useState('')

  const setDate = (date: string) => {
    router.push(`/attendance?date=${date}`)
  }

  const handleToggle = async (student_id: string) => {
    const current = attendance[student_id]
    // null → true, true → false, false → true
    const next = current === true ? false : true
    setAttendance((prev) => ({ ...prev, [student_id]: next }))
    setSaving((prev) => new Set(prev).add(student_id))

    const result = await markSingleAttendance(student_id, selectedDate, next)

    setSaving((prev) => {
      const s = new Set(prev)
      s.delete(student_id)
      return s
    })
    if (result.error) {
      toast.error(result.error)
      setAttendance((prev) => ({ ...prev, [student_id]: current }))
    }
  }

  // Group students by batch
  const groups: { batchId: string; batchName: string; classType: string; students: Student[] }[] = []
  for (const student of students) {
    if (classFilter && student.batches?.class_type !== classFilter) continue
    const batchName = student.batches?.name ?? 'No Batch'
    const batchId = student.batch_id ?? 'none'
    const classType = student.batches?.class_type ?? ''
    const existing = groups.find((g) => g.batchId === batchId)
    if (existing) existing.students.push(student)
    else groups.push({ batchId, batchName, classType, students: [student] })
  }

  const markedCount = Object.values(attendance).filter((v) => v !== null).length
  const presentCount = Object.values(attendance).filter((v) => v === true).length

  return (
    <div className="space-y-4 pb-6">
      {/* Date selector */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays size={15} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Class Date</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setDate(today)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              selectedDate === today
                ? 'bg-brand-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            Today
          </button>
          <button
            onClick={() => setDate(yesterday)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              selectedDate === yesterday
                ? 'bg-brand-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            Yesterday
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 rounded-full text-sm border border-gray-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-800"
          />
        </div>
        {markedCount > 0 && (
          <p className="text-xs text-gray-400 mt-3">
            {presentCount} present · {markedCount - presentCount} absent · {students.length - markedCount} not marked
          </p>
        )}
      </div>

      {/* Class type filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setClassFilter('')}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0',
            classFilter === '' ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          )}
        >
          All Programs
        </button>
        {CLASS_TYPES.map((ct) => (
          <button
            key={ct}
            onClick={() => setClassFilter(ct)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0',
              classFilter === ct
                ? 'bg-gray-800 text-white'
                : `${CLASS_TYPE_COLORS[ct as ClassType]} border border-transparent hover:opacity-80`
            )}
          >
            {ct}
          </button>
        ))}
      </div>

      {/* Student groups */}
      {groups.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-400 text-sm">
          No students found.
        </div>
      ) : (
        groups.map(({ batchId, batchName, classType, students: batchStudents }) => (
          <div key={batchId} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Group header */}
            <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2 bg-gray-50/60">
              <span className="text-sm font-semibold text-gray-800">{batchName}</span>
              {classType && (
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', CLASS_TYPE_COLORS[classType as ClassType])}>
                  {classType}
                </span>
              )}
              <span className="ml-auto text-xs text-gray-400">
                {batchStudents.filter((s) => attendance[s.id] === true).length}/{batchStudents.length} present
              </span>
            </div>

            {/* Students */}
            <div className="divide-y divide-gray-50">
              {batchStudents.map((student) => {
                const status = attendance[student.id]
                const isSaving = saving.has(student.id)
                return (
                  <div
                    key={student.id}
                    className={cn(
                      'flex items-center px-4 py-3 gap-3 transition-colors',
                      status === true && 'bg-green-50/40',
                      status === false && 'bg-red-50/40',
                    )}
                  >
                    <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-800 font-bold text-xs">
                        {getInitials(student.first_name, student.last_name)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {student.first_name} {student.last_name}
                      </p>
                      {student.grade && (
                        <p className="text-xs text-gray-400">{student.grade}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleToggle(student.id)}
                      disabled={isSaving}
                      className={cn(
                        'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 min-w-[108px] justify-center',
                        status === true && 'bg-green-100 text-green-700 hover:bg-green-200',
                        status === false && 'bg-red-100 text-red-600 hover:bg-red-200',
                        status === null && 'bg-gray-100 text-gray-500 hover:bg-gray-200',
                        isSaving && 'opacity-60 cursor-not-allowed'
                      )}
                    >
                      {isSaving ? (
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : status === true ? (
                        <><Check size={13} /> Present</>
                      ) : status === false ? (
                        <><X size={13} /> Absent</>
                      ) : (
                        '— Mark'
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
