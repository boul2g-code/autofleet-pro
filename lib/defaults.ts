import type { Vehicle, PurchaseData, TransportData, StorageData, SaleData } from './types'
import { genBusinessId, genUuid } from './utils'

export const defaultPurchase = (): PurchaseData => ({
  date: '', sellerName: '', sellerCountry: '', sellerContact: '',
  priceNet: '', vatRate: '19', priceGross: '', currency: 'EUR',
  vatType: 'standard', invoiceNum: '', extraCosts: [], notes: '',
})

export const defaultTransport = (): TransportData => ({
  cmr: '', carrier: '', carrierContact: '', origin: '', dest: '',
  depDate: '', arrDate: '', cost: '', currency: 'EUR',
  truckPlate: '', driver: '', notes: '',
})

export const defaultStorage = (): StorageData => ({
  location: 'de', locDetails: '', entryDate: '', exitDate: '',
  cpd: '', currency: 'EUR', days: '', workDone: [], notes: '',
})

export const defaultSale = (): SaleData => ({
  date: '', buyerName: '', buyerCountry: '', buyerContact: '',
  priceNet: '', vatRate: '19', priceGross: '', currency: 'EUR',
  vatType: 'standard', invoiceNum: '', notes: '',
})

export function createVehicle(): Vehicle {
  const id = genUuid()
  return {
    id,
    businessId: genBusinessId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'purchased',
    category: 'car',
    vin: '', make: '', model: '', year: '', color: '',
    engine: '', fuel: 'diesel', gearbox: 'manual',
    mileage: '', firstReg: '', regCountry: '', plate: '',
    seats: '', payload: '', cocNum: '', condition: 'good', notes: '',
    purchase: defaultPurchase(),
    importTransport: defaultTransport(),
    storage: defaultStorage(),
    sale: defaultSale(),
    exportTransport: defaultTransport(),
    documents: [],
  }
}
