'use client'

import { useEffect, useRef } from 'react'
import { Button } from './Button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) dialog.showModal()
    else dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      className="w-full max-w-sm rounded-2xl p-0 shadow-xl backdrop:bg-black/50"
    >
      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            className="flex-1"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            {cancelLabel}
          </Button>
        </div>
      </div>
    </dialog>
  )
}