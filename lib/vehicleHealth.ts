import { calcFinancials } from './financials'
import type { Organization, Vehicle, VehicleStatus } from './types'

export const REQUIRED_DOC_TYPES = ['invoice', 'registration', 'coc', 'cmr'] as const

export type RequiredDocType = (typeof REQUIRED_DOC_TYPES)[number]
export type VehicleHealthFilter = 'attention' | 'dead-stock' | 'missing-docs' | 'low-margin' | 'no-sale-price'

const IN_STOCK_STATUSES: VehicleStatus[] = ['purchased', 'transit_in', 'stored', 'for_sale']

export function isInStockStatus(status?: VehicleStatus): boolean {
  return !!status && IN_STOCK_STATUSES.includes(status)
}

export function getEffectiveTargetProfit(
  org?: Pick<Organization, 'targetProfit' | 'marginTarget'> | null,
): number {
  if (typeof org?.targetProfit === 'number' && org.targetProfit > 0) {
    return org.targetProfit
  }
  if (typeof org?.marginTarget === 'number' && org.marginTarget > 100) {
    return org.marginTarget
  }
  return 2000
}

export function getMissingDocTypes(vehicle: Vehicle): RequiredDocType[] {
  if (!isInStockStatus(vehicle.status)) return []

  const present = new Set((vehicle.documents || []).map(doc => doc.type))
  return REQUIRED_DOC_TYPES.filter(type => !present.has(type))
}

export function hasMissingRequiredDocs(vehicle: Vehicle): boolean {
  return getMissingDocTypes(vehicle).length > 0
}

export function hasLowMargin(vehicle: Vehicle, targetProfit: number): boolean {
  if (!isInStockStatus(vehicle.status) || !vehicle.sale?.price) return false
  const profit = calcFinancials(vehicle).grossProfit
  return profit > 0 && profit < targetProfit
}

export function hasNoSalePrice(vehicle: Vehicle): boolean {
  return vehicle.status === 'for_sale' && !vehicle.sale?.price
}

export function matchesVehicleHealthFilter(
  vehicle: Vehicle,
  filter: VehicleHealthFilter,
  targetProfit: number,
  ageInDays?: number,
): boolean {
  const heldDays = ageInDays ?? 0

  switch (filter) {
    case 'attention':
      return heldDays > 90
        || hasMissingRequiredDocs(vehicle)
        || hasLowMargin(vehicle, targetProfit)
        || hasNoSalePrice(vehicle)
    case 'dead-stock':
      return heldDays > 90
    case 'missing-docs':
      return hasMissingRequiredDocs(vehicle)
    case 'low-margin':
      return hasLowMargin(vehicle, targetProfit)
    case 'no-sale-price':
      return hasNoSalePrice(vehicle)
    default:
      return false
  }
}
