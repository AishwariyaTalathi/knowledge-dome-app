'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import type { Student } from '@/types/database'

export function InactiveStudentsSection({ students }: { students: Student[] }) {
  const [open, setOpen] = useState(false)

  if (students.length === 0) return null

  return (
    <div className="mt-8">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-3 px-1"
      >
        {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        <span className="font-medium">Inactive Students</span>
        <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{students.length}</span>
      </button>

      {open && (
        <div className="space-y-2">
          {students.map((student) => (
            <Link
              key={student.id}
              href={`/students/${student.id}`}
              className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-xl opacity-60 hover:opacity-80 transition-opacity"
            >
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-500 font-bold text-xs">
                  {getInitials(student.first_name, student.last_name)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {student.first_name} {student.last_name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {student.batches?.name ?? 'No batch'}
                  {student.grade ? ` · ${student.grade}` : ''}
                </p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">Inactive</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
