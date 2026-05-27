import type { Vehicle } from './types'
import { computeFin } from './financials'

export function exportVehiclesCSV(vehicles: Vehicle[]): void {
  const headers = [
    'Business ID', 'Status', 'Category', 'Make', 'Model', 'Year', 'Color',
    'VIN', 'Plate', 'Fuel', 'Gearbox', 'Mileage (km)', 'Engine (cc)',
    'First Reg', 'Reg Country', 'COC No', 'Condition',
    // Purchase
    'Purchase Date', 'Seller', 'Seller Country', 'Purchase Price Net',
    'Purchase Price Gross', 'Purchase Currency', 'VAT Type', 'Invoice No (Buy)',
    // Import transport
    'CMR Import', 'Carrier Import', 'Origin', 'Destination',
    'Departure Date', 'Arrival Date', 'Truck Plate', 'Transport Cost Import',
    // Storage
    'Storage Location', 'Entry Date', 'Exit Date', 'Storage Days',
    'Cost/Day', 'Total Storage Cost',
    // Work
    'Work Cost Total',
    // Sale
    'Sale Date', 'Buyer', 'Buyer Country', 'Sale Price Net',
    'Sale Price Gross', 'Sale Currency', 'Invoice No (Sell)',
    // Export transport
    'CMR Export', 'Carrier Export', 'Export Cost',
    // Financials
    'Total Costs', 'Profit / Loss', 'Margin %',
    // Meta
    'Created At', 'Updated At',
  ]

  const rows = vehicles.map(v => {
    const fin = computeFin(v)
    return [
      v.businessId, v.status, v.category, v.make, v.model, v.year, v.color,
      v.vin, v.plate, v.fuel, v.gearbox, v.mileage, v.engine,
      v.firstReg, v.regCountry, v.cocNum, v.condition,
      // Purchase
      v.purchase?.date, v.purchase?.sellerName, v.purchase?.sellerCountry,
      v.purchase?.priceNet, v.purchase?.priceGross, v.purchase?.currency,
      v.purchase?.vatType, v.purchase?.invoiceNum,
      // Import transport
      v.importTransport?.cmr, v.importTransport?.carrier,
      v.importTransport?.origin, v.importTransport?.dest,
      v.importTransport?.depDate, v.importTransport?.arrDate,
      v.importTransport?.truckPlate, v.importTransport?.cost,
      // Storage
      v.storage?.location, v.storage?.entryDate, v.storage?.exitDate,
      fin.storageDays, v.storage?.cpd, fin.sc.toFixed(2),
      // Work
      fin.wc.toFixed(2),
      // Sale
      v.sale?.date, v.sale?.buyerName, v.sale?.buyerCountry,
      v.sale?.priceNet, v.sale?.priceGross, v.sale?.currency,
      v.sale?.invoiceNum,
      // Export transport
      v.exportTransport?.cmr, v.exportTransport?.carrier, v.exportTransport?.cost,
      // Financials
      fin.total.toFixed(2),
      fin.profit !== null ? fin.profit.toFixed(2) : '',
      fin.margin !== null ? fin.margin.toFixed(1) + '%' : '',
      // Meta
      v.createdAt ? new Date(v.createdAt).toLocaleDateString() : '',
      v.updatedAt ? new Date(v.updatedAt).toLocaleDateString() : '',
    ]
  })

  const escape = (val: unknown): string => {
    if (val === undefined || val === null) return ''
    const s = String(val)
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }

  const csv = [
    headers.map(escape).join(','),
    ...rows.map(row => row.map(escape).join(',')),
  ].join('\r\n')

  const BOM = '\uFEFF' // UTF-8 BOM — ensures Excel opens Greek characters correctly
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `autofleet-export-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
