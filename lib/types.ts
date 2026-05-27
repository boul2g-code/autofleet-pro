export type Lang = 'el' | 'en' | 'de' | 'fr' | 'it' | 'es'
export type Currency = 'EUR' | 'USD' | 'GBP' | 'CHF'
export type VehicleCategory = 'car' | 'truck' | 'van' | 'bus' | 'moto' | 'construction'
export type FuelType = 'diesel' | 'petrol' | 'electric' | 'hybrid' | 'lpg'
export type GearboxType = 'manual' | 'automatic'
export type ConditionType = 'excellent' | 'good' | 'fair' | 'poor'
export type VatType = 'standard' | 'margin' | 'no_vat'
export type LocationKey = 'de' | 'gr' | 'other'
export type DocType = 'invoice' | 'registration' | 'coc' | 'kteo' | 'cmr' | 'insurance' | 'other'

export type VehicleStatus =
  | 'purchased'
  | 'transit_in'
  | 'at_depot'
  | 'for_sale'
  | 'sold'
  | 'transit_out'
  | 'delivered'

export interface ExtraCost {
  desc: string
  amt: string
}

export interface WorkItem {
  desc: string
  cost: string
  date: string
  by: string
}

export interface VehicleDocument {
  id: string
  name: string
  mimeType: string
  docType: DocType
  storagePath: string
  metadata?: Record<string, string | number | boolean | null>
  uploadDate: string
}

export interface CreateUploadUrlInput {
  vehicleId: string
  documentType: DocType
  mimeType: string
  sizeBytes: number
}

export interface CreateUploadUrlResponse {
  documentId: string
  path: string
  token: string
}

export interface PurchaseData {
  date?: string
  sellerName?: string
  sellerCountry?: string
  sellerContact?: string
  priceNet?: string
  vatRate?: string
  priceGross?: string
  currency?: Currency
  vatType?: VatType
  invoiceNum?: string
  extraCosts?: ExtraCost[]
  notes?: string
}

export interface TransportData {
  cmr?: string
  carrier?: string
  carrierContact?: string
  origin?: string
  dest?: string
  depDate?: string
  arrDate?: string
  cost?: string
  currency?: Currency
  truckPlate?: string
  driver?: string
  notes?: string
}

export interface StorageData {
  location?: LocationKey
  locDetails?: string
  entryDate?: string
  exitDate?: string
  cpd?: string
  currency?: Currency
  days?: string
  workDone?: WorkItem[]
  notes?: string
}

export interface SaleData {
  date?: string
  buyerName?: string
  buyerCountry?: string
  buyerContact?: string
  priceNet?: string
  vatRate?: string
  priceGross?: string
  currency?: Currency
  vatType?: VatType
  invoiceNum?: string
  notes?: string
}

export interface Vehicle {
  id: string
  businessId: string
  createdAt: string
  updatedAt: string
  status: VehicleStatus
  category: VehicleCategory
  vin?: string
  make?: string
  model?: string
  year?: string
  color?: string
  engine?: string
  fuel?: FuelType
  gearbox?: GearboxType
  mileage?: string
  firstReg?: string
  regCountry?: string
  plate?: string
  seats?: string
  payload?: string
  cocNum?: string
  condition?: ConditionType
  notes?: string
  photo?: string
  inspection?: Record<string, unknown>
  purchase?: PurchaseData
  importTransport?: TransportData
  storage?: StorageData
  sale?: SaleData
  exportTransport?: TransportData
  documents?: VehicleDocument[]
}

export interface FinancialSummary {
  pp: number   // purchase price gross
  ic: number   // import transport cost
  sc: number   // storage cost
  wc: number   // work cost
  xc: number   // export transport cost
  ec: number   // extra purchase costs
  total: number
  sp: number   // sale price gross
  profit: number | null
  margin: number | null
  storageDays: number
}

export interface AppSettings {
  companyName: string
  companyDE: string
  companyGR: string
  apiKey: string
  defaultCurrency: Currency
}

export type SubscriptionPlan = 'trial' | 'starter' | 'professional' | 'enterprise'
export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired'
  | 'paused'

export interface SubscriptionRecord {
  user_id: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  stripe_customer_id?: string | null
  stripe_subscription_id?: string | null
  trial_ends_at?: string | null
  current_period_end?: string | null
}

export type TabKey = 'info' | 'purchase' | 'importT' | 'storage' | 'sale' | 'exportT' | 'documents' | 'financials' | 'listings' | 'inspection'
