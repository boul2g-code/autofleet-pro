import type { Vehicle } from '@/lib/types'
import { deriveBusinessId } from '@/lib/utils'

export interface VehicleRow {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  status: string
  category: string
  data: Record<string, unknown>
}

export function vehicleToRow(v: Vehicle): Omit<VehicleRow, 'user_id'> {
  const { createdAt, updatedAt, status, category, ...rest } = v

  return {
    id: v.id,
    created_at: createdAt,
    updated_at: updatedAt,
    status,
    category,
    data: rest as Record<string, unknown>,
  }
}

export function rowToVehicle(row: VehicleRow): Vehicle {
  const data = { ...(row.data || {}) } as Record<string, unknown>

  if (Array.isArray(data.documents)) {
    data.documents = data.documents.filter(
      (doc): doc is Record<string, unknown> =>
        typeof doc === 'object' &&
        doc !== null &&
        typeof doc.storagePath === 'string' &&
        doc.storagePath.length > 0,
    )
  }

  return {
    ...data,
    id: row.id,
    businessId: deriveBusinessId(row.id),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status as Vehicle['status'],
    category: row.category as Vehicle['category'],
  } as Vehicle
}
