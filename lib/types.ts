export type Lang = 'el' | 'en' | 'de' | 'fr' | 'it' | 'es' | 'sq' | 'sr' | 'bg' | 'mk'
export type VehicleStatus = 'purchased' | 'transit_in' | 'stored' | 'for_sale' | 'sold' | 'transit_out' | 'delivered'
export type VehicleCategory = 'car' | 'truck' | 'van' | 'bus' | 'moto' | 'construction'
export type FuelType = 'diesel' | 'petrol' | 'hybrid' | 'electric' | 'lpg' | 'cng' | 'other'
export type GearType = 'manual' | 'automatic' | 'semi'
export type VatRegime = 'margin' | 'standard' | 'exempt'

export interface PurchaseData {
  date?: string
  price?: number
  currency?: string
  vatRegime?: VatRegime
  vatAmount?: number
  sellerName?: string
  sellerCountry?: string
  invoiceNumber?: string
  invoiceDate?: string
  additionalCosts?: number
  notes?: string
}

export interface TransportData {
  cmrNumber?: string
  carrier?: string
  driver?: string
  truckPlate?: string
  trailerPlate?: string
  departureDate?: string
  arrivalDate?: string
  origin?: string
  destination?: string
  distanceKm?: number
  cost?: number
  notes?: string
}

export interface StorageData {
  location?: 'DE' | 'GR' | 'IT' | 'other'
  address?: string
  arrivalDate?: string
  costPerDay?: number
  workDone?: string
  workCost?: number
  notes?: string
}

export interface SaleData {
  date?: string
  price?: number
  currency?: string
  vatRegime?: VatRegime
  vatAmount?: number
  buyerName?: string
  buyerCountry?: string
  buyerPhone?: string
  invoiceNumber?: string
  notes?: string
}

export interface TransportOutData {
  cmrNumber?: string
  carrier?: string
  driver?: string
  truckPlate?: string
  trailerPlate?: string
  departureDate?: string
  arrivalDate?: string
  origin?: string
  destination?: string
  distanceKm?: number
  cost?: number
  notes?: string
}

export interface VehicleDocument {
  id: string
  name: string
  type: 'invoice' | 'registration' | 'coc' | 'inspection' | 'cmr' | 'other'
  url?: string
  uploadedAt: string
}

export interface InspectionItem {
  area: string
  condition: 'good' | 'fair' | 'poor' | 'na'
  notes?: string
}

export interface Vehicle {
  id: string
  org_id?: string
  created_at?: string
  updated_at?: string

  // Basic Info
  category?: VehicleCategory
  make?: string
  model?: string
  year?: number
  vin?: string
  plate?: string
  color?: string
  fuelType?: FuelType
  gearType?: GearType
  engineCC?: number
  powerKW?: number
  mileage?: number
  seats?: number
  doors?: number
  weightKg?: number
  payloadKg?: number
  status?: VehicleStatus
  photo?: string
  notes?: string

  // Data sections
  purchase?: PurchaseData
  transportIn?: TransportData
  storage?: StorageData
  sale?: SaleData
  transportOut?: TransportOutData
  documents?: VehicleDocument[]
  inspection?: InspectionItem[]
}

export interface Organization {
  id: string
  name?: string
  // Company
  vat?: string
  taxOffice?: string
  country?: string
  address?: string
  city?: string
  zip?: string
  phone?: string
  email?: string
  website?: string
  // Legacy
  address_de?: string
  address_gr?: string
  vat_number?: string
  // Branding
  logo?: string
  logo_url?: string
  primaryColor?: string
  secondaryColor?: string
  // Documents
  responsible?: string
  stamp?: string
  // Marketplace
  autoscout?: string
  mobilede?: string
  cargr?: string
  facebook?: string
  // Financials
  defaultStoreCost?: number
  defaultTransportCostPerKm?: number
  marginTarget?: number
  targetProfit?: number
  // Plan
  plan?: string
  status?: string
  trial_ends_at?: string
}

export interface AppSettings {
  lang: Lang
  org?: Organization
  anthropicKey?: string
}
