import type { VehicleStatus } from '@/lib/types'
import { statusIcon } from '@/lib/utils'

interface Props { status: VehicleStatus; label: string }

export default function StatusBadge({ status, label }: Props) {
  return (
    <span className={`badge badge-${status}`}>
      {statusIcon(status)} {label}
    </span>
  )
}
