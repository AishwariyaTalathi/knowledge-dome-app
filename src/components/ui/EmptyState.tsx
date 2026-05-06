import { type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from './Button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  message: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

export function EmptyState({ icon: Icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon size={28} className="text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-sm text-gray-400 max-w-xs mb-6">{message}</p>
      {action && (
        action.href ? (
          <Link href={action.href}>
            <Button size="sm">{action.label}</Button>
          </Link>
        ) : (
          <Button size="sm" onClick={action.onClick}>{action.label}</Button>
        )
      )}
    </div>
  )
}