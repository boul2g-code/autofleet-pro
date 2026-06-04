import type { VehicleStatus } from './types'

const PUBLIC_VEHICLE_STATUSES = new Set<VehicleStatus>(['for_sale'])

export function isPublicVehicleStatus(status?: string | null): status is VehicleStatus {
  return Boolean(status && PUBLIC_VEHICLE_STATUSES.has(status as VehicleStatus))
}
