'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { whatsappLink } from '@/lib/utils'

interface WhatsAppButtonProps {
  number: string
  name: string
  variant?: 'icon' | 'full'
}

export function WhatsAppButton({ number, name, variant = 'full' }: WhatsAppButtonProps) {
  const [open, setOpen] = useState(false)

  const openWhatsApp = () => {
    window.open(whatsappLink(number), '_blank', 'noopener,noreferrer')
    setOpen(false)
  }

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true) }}
          className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-700 hover:bg-green-200 transition-colors flex-shrink-0"
          title="WhatsApp"
        >
          <MessageCircle size={14} />
        </button>
        <ConfirmDialog
          open={open}
          title={`Message ${name} on WhatsApp?`}
          message={`This will open WhatsApp with ${name}'s number. Continue?`}
          confirmLabel="Open WhatsApp"
          cancelLabel="Cancel"
          variant="warning"
          onConfirm={openWhatsApp}
          onCancel={() => setOpen(false)}
        />
      </>
    )
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
      >
        <MessageCircle size={16} />
        WhatsApp
      </button>
      <ConfirmDialog
        open={open}
        title={`Message ${name} on WhatsApp?`}
        message={`This will open WhatsApp with ${name}'s number. Continue?`}
        confirmLabel="Open WhatsApp"
        cancelLabel="Cancel"
        variant="warning"
        onConfirm={openWhatsApp}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
