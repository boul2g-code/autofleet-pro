import type { Currency, DocType, VehicleCategory, VehicleStatus } from './types'

export function genBusinessId(): string {
  return 'VH-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase()
}

export function genUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export function fileExtensionFromMimeType(mimeType: string): string {
  const normalized = mimeType.toLowerCase()

  if (normalized === 'application/pdf') return 'pdf'
  if (normalized === 'image/jpeg') return 'jpg'
  if (normalized === 'image/png') return 'png'
  if (normalized === 'image/webp') return 'webp'
  if (normalized === 'image/heic') return 'heic'
  if (normalized === 'image/heif') return 'heif'

  const slashIndex = normalized.indexOf('/')
  return slashIndex >= 0 ? normalized.slice(slashIndex + 1).replace(/[^a-z0-9]/g, '') || 'bin' : 'bin'
}

export function deriveBusinessId(rawId: string): string {
  if (rawId.startsWith('VH-')) return rawId

  const compact = rawId.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 12)
  return `VH-${compact.padEnd(12, '0')}`
}

export function fmtCur(n: number | string | undefined | null, cur: Currency = 'EUR'): string {
  if (n === undefined || n === null || n === '') return '—'
  const val = parseFloat(String(n))
  if (isNaN(val)) return '—'
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: cur }).format(val)
}

export function fmtDate(d: string | undefined | null): string {
  if (!d) return '—'
  try { return new Date(d).toLocaleDateString('el-GR') } catch { return d }
}

export function fmtNum(n: string | number | undefined): string {
  if (!n) return '—'
  return new Intl.NumberFormat('el-GR').format(Number(n))
}

export function catIcon(cat: VehicleCategory): string {
  return { car: '🚗', truck: '🚛', van: '🚐', bus: '🚌', moto: '🏍️', construction: '🚜' }[cat] ?? '🚗'
}

export function statusIcon(s: VehicleStatus): string {
  return { purchased: '🔵', transit_in: '🚛', at_depot: '🏭', for_sale: '🏷️', sold: '✅', transit_out: '🚚', delivered: '📦' }[s] ?? '❓'
}

export function docIcon(mimeType: string): string {
  if (mimeType.includes('pdf')) return '📋'
  if (mimeType.includes('image')) return '🖼️'
  return '📄'
}

export function guessDoctType(name: string): DocType {
  const n = name.toLowerCase()
  if (n.includes('invoice') || n.includes('rechnung') || n.includes('τιμολ')) return 'invoice'
  if (n.includes('coc') || n.includes('conformity')) return 'coc'
  if (n.includes('cmr')) return 'cmr'
  if (n.includes('kteo') || n.includes('hu') || n.includes('inspection')) return 'kteo'
  if (n.includes('insurance') || n.includes('versich') || n.includes('ασφ')) return 'insurance'
  if (n.includes('zulassung') || n.includes('registration') || n.includes('αδεια') || n.includes('ταξιν')) return 'registration'
  return 'other'
}

export function statusBadgeClass(status: VehicleStatus): string {
  const map: Record<VehicleStatus, string> = {
    purchased: 'badge-purchased',
    transit_in: 'badge-transit_in',
    at_depot: 'badge-at_depot',
    for_sale: 'badge-for_sale',
    sold: 'badge-sold',
    transit_out: 'badge-transit_out',
    delivered: 'badge-delivered',
  }
  return map[status] ?? ''
}

export const ALL_STATUSES: VehicleStatus[] = [
  'purchased', 'transit_in', 'at_depot', 'for_sale', 'sold', 'transit_out', 'delivered'
]
export const CURRENCIES: Currency[] = ['EUR', 'USD', 'GBP', 'CHF']
export const VAT_TYPES = ['standard', 'margin', 'no_vat'] as const
export const FUEL_TYPES = ['diesel', 'petrol', 'electric', 'hybrid', 'lpg'] as const
export const GEAR_TYPES = ['manual', 'automatic'] as const
export const COND_TYPES = ['excellent', 'good', 'fair', 'poor'] as const
export const CAT_TYPES = ['car', 'truck', 'van', 'bus', 'moto'] as const
export const LOC_TYPES = ['de', 'gr', 'other'] as const
export const DOC_TYPES = ['invoice', 'registration', 'coc', 'kteo', 'cmr', 'insurance', 'other'] as const
