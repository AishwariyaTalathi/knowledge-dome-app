'use client'

import { useState } from 'react'
import { Phone } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

interface PhoneButtonProps {
  number: string
  name: string
}

export function PhoneButton({ number, name }: PhoneButtonProps) {
  const [open, setOpen] = useState(false)

  const call = () => {
    window.location.href = `tel:${number}`
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-brand-800 hover:underline text-sm font-medium"
      >
        <Phone size={13} />
        {number}
      </button>
      <ConfirmDialog
        open={open}
        title={`Call ${name}?`}
        message={`This will start a phone call to ${name} at ${number}.`}
        confirmLabel="Call now"
        cancelLabel="Cancel"
        variant="warning"
        onConfirm={call}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
