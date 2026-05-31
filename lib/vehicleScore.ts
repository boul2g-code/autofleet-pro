import type { Vehicle } from './types'
import { calcFinancials } from './financials'

export interface VehicleScore {
  total: number          // 0-100
  saleability: number   // probability of quick sale
  profitRisk: number    // margin risk
  exportReady: boolean
  exportChecks: Record<string, boolean>
  reasons: { positive: string[]; negative: string[] }
  recommendation: 'high' | 'medium' | 'low'
}

// Popular makes in EU used car market
const POPULAR_MAKES = ['BMW','Mercedes-Benz','Volkswagen','Audi','Toyota','Ford','Opel','Renault','Peugeot','Fiat','Volvo','Skoda','Hyundai','Kia','Seat']
const PREMIUM_MAKES = ['BMW','Mercedes-Benz','Audi','Porsche','Volvo','Lexus','Land Rover','Jaguar']

export function scoreVehicle(v: Vehicle): VehicleScore {
  let score = 50
  const positive: string[] = []
  const negative: string[] = []

  // --- Saleability factors ---
  
  // Popular make (+10)
  if (v.make && POPULAR_MAKES.includes(v.make)) { score += 10; positive.push('Popular make') }
  if (v.make && PREMIUM_MAKES.includes(v.make)) { score += 5; positive.push('Premium brand') }

  // Mileage sweet spot (50k-120k = best market)
  if (v.mileage) {
    if (v.mileage < 50000) { score += 12; positive.push('Low mileage') }
    else if (v.mileage < 120000) { score += 8; positive.push('Good mileage') }
    else if (v.mileage < 180000) { score += 2 }
    else { score -= 10; negative.push('High mileage (>180k)') }
  } else { score -= 5; negative.push('Mileage not recorded') }

  // Age factor
  const year = v.year || 2015
  const age = new Date().getFullYear() - year
  if (age <= 3) { score += 15; positive.push('Recent vehicle (≤3 years)') }
  else if (age <= 6) { score += 8; positive.push('Good age (≤6 years)') }
  else if (age <= 10) { score += 2 }
  else { score -= 8; negative.push(`Older vehicle (${age} years)`) }

  // Fuel type market demand
  if (v.fuelType === 'diesel') { score += 5; positive.push('Diesel — high demand DE/IT') }
  else if (v.fuelType === 'hybrid') { score += 8; positive.push('Hybrid — growing demand') }
  else if (v.fuelType === 'electric') { score += 10; positive.push('Electric — premium segment') }
  else if (v.fuelType === 'petrol') { score += 3 }

  // Photo present
  if (v.photo) { score += 5; positive.push('Photo available') }
  else { score -= 8; negative.push('No photo — reduces visibility') }

  // Has sale price set
  if (v.sale?.price) { score += 5; positive.push('Sale price set') }
  else { score -= 5; negative.push('No sale price set') }

  // Days in stock (penalty)
  const startDate = v.storage?.arrivalDate || v.purchase?.date || v.created_at
  if (startDate) {
    const days = Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000)
    if (days > 90) { score -= 20; negative.push(`${days} days in stock — urgent`) }
    else if (days > 60) { score -= 10; negative.push(`${days} days in stock`) }
    else if (days > 30) { score -= 5 }
    else if (days < 15) { score += 3; positive.push('Recently acquired') }
  }

  // Inspection done
  if (v.inspection && v.inspection.length > 0) {
    const poor = v.inspection.filter(i => i.condition === 'poor').length
    const good = v.inspection.filter(i => i.condition === 'good').length
    if (poor === 0 && good > 5) { score += 8; positive.push('Good inspection result') }
    else if (poor > 3) { score -= 10; negative.push(`${poor} poor condition areas`) }
  }

  // VIN present
  if (v.vin) { score += 3; positive.push('VIN recorded') }

  // --- Export readiness ---
  const exportChecks = {
    'VIN': !!v.vin,
    'COC/Documents': !!(v.documents && v.documents.length > 0),
    'CMR Transport': !!(v.transportIn?.cmrNumber || v.transportOut?.cmrNumber),
    'Purchase Invoice': !!v.purchase?.invoiceNumber,
    'Mileage': !!v.mileage,
    'Year': !!v.year,
  }
  const exportReady = Object.values(exportChecks).filter(Boolean).length >= 4

  // Clamp score
  score = Math.max(10, Math.min(98, score))

  const recommendation = score >= 70 ? 'high' : score >= 45 ? 'medium' : 'low'

  return {
    total: Math.round(score),
    saleability: Math.round(score),
    profitRisk: 0,
    exportReady,
    exportChecks,
    reasons: { positive, negative },
    recommendation,
  }
}
