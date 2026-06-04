import type { Vehicle } from './types'

export type ImportRow = Record<string, string>

type SupportedImportField =
  | 'make'
  | 'model'
  | 'year'
  | 'plate'
  | 'vin'
  | 'mileage'
  | 'color'
  | 'fuelType'
  | 'category'
  | 'notes'
  | 'purchase.price'

export const MAX_IMPORT_PREVIEW_ROWS = 20

export const IMPORT_COLUMN_MAP: Record<string, SupportedImportField> = {
  make: 'make', marca: 'make', marque: 'make', marke: 'make',
  model: 'model', modello: 'model', 'modèle': 'model', modell: 'model', modelo: 'model',
  year: 'year', anno: 'year', 'année': 'year', jahr: 'year', 'año': 'year', 'έτος': 'year', 'χρονολογία': 'year',
  plate: 'plate', targa: 'plate', immatriculation: 'plate', kennzeichen: 'plate', matricula: 'plate', 'πινακίδα': 'plate',
  vin: 'vin', telaio: 'vin',
  mileage: 'mileage', km: 'mileage', chilometri: 'mileage', 'kilomètre': 'mileage', kilometer: 'mileage', kilometraje: 'mileage', 'χιλιόμετρα': 'mileage',
  price: 'purchase.price', prezzo: 'purchase.price', prix: 'purchase.price', preis: 'purchase.price', precio: 'purchase.price', 'τιμή': 'purchase.price', 'αγορά': 'purchase.price',
  color: 'color', colore: 'color', couleur: 'color', farbe: 'color', 'χρώμα': 'color',
  fuel: 'fuelType', carburante: 'fuelType', combustible: 'fuelType', kraftstoff: 'fuelType', 'καύσιμο': 'fuelType',
  category: 'category', categoria: 'category', 'catégorie': 'category', kategorie: 'category', 'categoría': 'category', 'κατηγορία': 'category',
  notes: 'notes', note: 'notes', beschreibung: 'notes', 'σημειώσεις': 'notes',
}

export function getImportPreview(rows: ImportRow[], limit = MAX_IMPORT_PREVIEW_ROWS): ImportRow[] {
  return rows.slice(0, limit)
}

function parseImportAmount(value: string): number {
  const cleaned = value.replace(/[^\d.,-]/g, '').trim()
  if (!cleaned) return Number.NaN

  const hasComma = cleaned.includes(',')
  const hasDot = cleaned.includes('.')

  if (hasComma && hasDot) {
    return cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')
      ? parseFloat(cleaned.replace(/\./g, '').replace(',', '.'))
      : parseFloat(cleaned.replace(/,/g, ''))
  }

  if (hasComma) {
    return /,\d{1,2}$/.test(cleaned)
      ? parseFloat(cleaned.replace(/\./g, '').replace(',', '.'))
      : parseFloat(cleaned.replace(/,/g, ''))
  }

  if (hasDot && !/\.\d{1,2}$/.test(cleaned)) {
    return parseFloat(cleaned.replace(/\./g, ''))
  }

  return parseFloat(cleaned)
}

export function rowToVehiclePatch(row: ImportRow): Partial<Vehicle> {
  const patch: Partial<Vehicle> = {}
  const purchase: NonNullable<Vehicle['purchase']> = {}

  for (const [rawKey, rawValue] of Object.entries(row)) {
    const value = String(rawValue || '').trim()
    if (!value) continue

    const key = rawKey.toLowerCase().trim()
    const mapped = IMPORT_COLUMN_MAP[key]
    if (!mapped) continue

    if (mapped === 'purchase.price') {
      const amount = parseImportAmount(value)
      if (!Number.isNaN(amount)) purchase.price = amount
      continue
    }

    if (mapped === 'year' || mapped === 'mileage') {
      const numberValue = parseInt(value.replace(/[^\d]/g, ''), 10)
      if (!Number.isNaN(numberValue)) {
        patch[mapped] = numberValue as never
      }
      continue
    }

    patch[mapped] = value as never
  }

  if (Object.keys(purchase).length > 0) patch.purchase = purchase
  return patch
}
