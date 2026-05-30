import type { Vehicle } from './types'

export interface FinancialSummary {
  purchaseCost: number
  transportInCost: number
  storageCost: number
  workCost: number
  transportOutCost: number
  totalCost: number
  saleRevenue: number
  grossProfit: number
  margin: number
  storageDays: number
}

export function calcFinancials(v: Vehicle): FinancialSummary {
  const purchaseCost = (v.purchase?.price || 0) + (v.purchase?.additionalCosts || 0)
  const transportInCost = v.transportIn?.cost || 0
  const workCost = v.storage?.workCost || 0

  // Storage cost: days × cost/day
  let storageDays = 0
  let storageCost = 0
  if (v.storage?.arrivalDate) {
    const arrival = new Date(v.storage.arrivalDate)
    const end = v.sale?.date ? new Date(v.sale.date) : new Date()
    storageDays = Math.max(0, Math.floor((end.getTime() - arrival.getTime()) / 86400000))
    storageCost = storageDays * (v.storage?.costPerDay || 0)
  }

  const transportOutCost = v.transportOut?.cost || 0
  const totalCost = purchaseCost + transportInCost + storageCost + workCost + transportOutCost
  const saleRevenue = v.sale?.price || 0
  const grossProfit = saleRevenue - totalCost
  const margin = saleRevenue > 0 ? (grossProfit / saleRevenue) * 100 : 0

  return {
    purchaseCost,
    transportInCost,
    storageCost,
    workCost,
    transportOutCost,
    totalCost,
    saleRevenue,
    grossProfit,
    margin,
    storageDays,
  }
}

export function fmtCur(n: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)
}
