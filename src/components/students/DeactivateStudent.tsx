'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { toggleStudentActive } from '@/app/(protected)/students/actions'

interface DeactivateStudentProps {
  studentId: string
  studentName: string
  isActive: boolean
}

export function DeactivateStudent({ studentId, studentName, isActive }: DeactivateStudentProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = async () => {
    const result = await toggleStudentActive(studentId, isActive)
    setOpen(false)
    if (result.error) {
      toast.error('Something went wrong')
    } else {
      toast.success(isActive ? `${studentName} has been deactivated` : `${studentName} is now active`)
    }
  }

  return (
    <>
      <Button
        variant={isActive ? 'danger' : 'secondary'}
        size="sm"
        onClick={() => setOpen(true)}
      >
        {isActive ? 'Deactivate Student' : 'Reactivate Student'}
      </Button>

      <ConfirmDialog
        open={open}
        title={isActive ? 'Deactivate this student?' : 'Reactivate this student?'}
        message={
          isActive
            ? `${studentName} will be removed from all student lists and batch counts. You can reactivate them at any time.`
            : `${studentName} will be added back to active student lists.`
        }
        confirmLabel={isActive ? 'Yes, deactivate' : 'Yes, reactivate'}
        cancelLabel="Cancel"
        variant={isActive ? 'danger' : 'warning'}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
