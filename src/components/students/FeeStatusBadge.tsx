import { Badge } from '@/components/ui/Badge'
import type { FeeStatus } from '@/types/database'

const variantMap: Record<FeeStatus, 'success' | 'warning' | 'danger'> = {
  Paid: 'success',
  Pending: 'warning',
  Overdue: 'danger',
}

export function FeeStatusBadge({ status }: { status: FeeStatus }) {
  return <Badge variant={variantMap[status]}>{status}</Badge>
}
