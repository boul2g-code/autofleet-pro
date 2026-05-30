import type { Vehicle } from './types'
import { calcFinancials } from './financials'

export async function exportVehiclesToExcel(vehicles: Vehicle[], filename = 'AutoFleet_Export') {
  const XLSX = await import('xlsx')

  const rows = vehicles.map(v => {
    const fin = calcFinancials(v)
    return {
      // Basic
      'Make': v.make || '',
      'Model': v.model || '',
      'Year': v.year || '',
      'Plate': v.plate || '',
      'VIN': v.vin || '',
      'Color': v.color || '',
      'Category': v.category || '',
      'Fuel': v.fuelType || '',
      'Gearbox': v.gearType || '',
      'Engine CC': v.engineCC || '',
      'Power kW': v.powerKW || '',
      'Mileage km': v.mileage || '',
      'Seats': v.seats || '',
      'Weight kg': v.weightKg || '',
      'Payload kg': v.payloadKg || '',
      'Status': v.status || '',
      // Purchase
      'Purchase Date': v.purchase?.date || '',
      'Purchase Price EUR': v.purchase?.price || '',
      'Purchase Invoice': v.purchase?.invoiceNumber || '',
      'Seller': v.purchase?.sellerName || '',
      'Seller Country': v.purchase?.sellerCountry || '',
      'VAT Regime Purchase': v.purchase?.vatRegime || '',
      'Additional Costs EUR': v.purchase?.additionalCosts || '',
      // Transport In
      'CMR In': v.transportIn?.cmrNumber || '',
      'Carrier In': v.transportIn?.carrier || '',
      'Driver In': v.transportIn?.driver || '',
      'Truck Plate In': v.transportIn?.truckPlate || '',
      'Origin': v.transportIn?.origin || '',
      'Destination In': v.transportIn?.destination || '',
      'Departure Date': v.transportIn?.departureDate || '',
      'Arrival Date': v.transportIn?.arrivalDate || '',
      'Transport In Cost EUR': v.transportIn?.cost || '',
      // Storage
      'Storage Location': v.storage?.location || '',
      'Storage Address': v.storage?.address || '',
      'Storage Arrival': v.storage?.arrivalDate || '',
      'Cost per Day EUR': v.storage?.costPerDay || '',
      'Work Done': v.storage?.workDone || '',
      'Work Cost EUR': v.storage?.workCost || '',
      // Sale
      'Sale Date': v.sale?.date || '',
      'Sale Price EUR': v.sale?.price || '',
      'Sale Invoice': v.sale?.invoiceNumber || '',
      'Buyer': v.sale?.buyerName || '',
      'Buyer Country': v.sale?.buyerCountry || '',
      'Buyer Phone': v.sale?.buyerPhone || '',
      'VAT Regime Sale': v.sale?.vatRegime || '',
      // Transport Out
      'CMR Out': v.transportOut?.cmrNumber || '',
      'Carrier Out': v.transportOut?.carrier || '',
      'Transport Out Cost EUR': v.transportOut?.cost || '',
      'Delivery Destination': v.transportOut?.destination || '',
      // Financials
      'Total Cost EUR': fin.totalCost,
      'Sale Revenue EUR': fin.saleRevenue,
      'Gross Profit EUR': fin.grossProfit,
      'Margin %': fin.margin.toFixed(1),
      'Storage Days': fin.storageDays,
      // Meta
      'Created At': v.created_at ? new Date(v.created_at).toLocaleDateString('en-GB') : '',
    }
  })

  const wb = XLSX.utils.book_new()

  // Main sheet
  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = Object.keys(rows[0] || {}).map(() => ({ wch: 18 }))
  XLSX.utils.book_append_sheet(wb, ws, 'Vehicles')

  // Summary sheet
  const inStock = vehicles.filter(v => ['purchased','transit_in','stored','for_sale'].includes(v.status || ''))
  const sold = vehicles.filter(v => ['sold','transit_out','delivered'].includes(v.status || ''))
  const totalRevenue = sold.reduce((s, v) => s + (v.sale?.price || 0), 0)
  const totalProfit = sold.reduce((s, v) => s + calcFinancials(v).grossProfit, 0)

  const summary = [
    { 'Metric': 'Total Vehicles', 'Value': vehicles.length },
    { 'Metric': 'In Stock', 'Value': inStock.length },
    { 'Metric': 'Sold', 'Value': sold.length },
    { 'Metric': 'Total Revenue EUR', 'Value': totalRevenue },
    { 'Metric': 'Total Profit EUR', 'Value': totalProfit },
    { 'Metric': 'Avg Margin %', 'Value': sold.length > 0 ? (sold.reduce((s, v) => s + calcFinancials(v).margin, 0) / sold.length).toFixed(1) : 0 },
    { 'Metric': 'Export Date', 'Value': new Date().toLocaleDateString('en-GB') },
  ]
  const wsSummary = XLSX.utils.json_to_sheet(summary)
  wsSummary['!cols'] = [{ wch: 25 }, { wch: 20 }]
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary')

  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`)
}
