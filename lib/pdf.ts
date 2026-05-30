import type { Vehicle } from './types'
import { calcFinancials } from './financials'

export async function generateVehiclePDF(v: Vehicle, orgName = 'AutoFleet Pro') {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()
  const fin = calcFinancials(v)

  const BLUE = [30, 64, 175] as [number, number, number]
  const DARK = [15, 23, 42] as [number, number, number]
  const GRAY = [100, 116, 139] as [number, number, number]

  // Header
  doc.setFillColor(...BLUE)
  doc.rect(0, 0, 210, 30, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('AutoFleet Pro', 14, 12)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(orgName, 14, 20)
  doc.text(`Report: ${new Date().toLocaleDateString('en-GB')}`, 140, 12)

  // Vehicle title
  doc.setTextColor(...DARK)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(`${v.make || ''} ${v.model || ''} ${v.year || ''}`, 14, 42)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...GRAY)
  doc.text(`Plate: ${v.plate || '—'}  |  VIN: ${v.vin || '—'}  |  Status: ${v.status || '—'}`, 14, 50)

  let y = 62

  const section = (title: string) => {
    doc.setFillColor(241, 245, 249)
    doc.rect(14, y - 4, 182, 8, 'F')
    doc.setTextColor(...BLUE)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(title, 16, y + 1)
    doc.setTextColor(...DARK)
    doc.setFont('helvetica', 'normal')
    y += 10
  }

  const row = (label: string, value: string, col = 0) => {
    const x = col === 0 ? 14 : 110
    doc.setFontSize(9)
    doc.setTextColor(...GRAY)
    doc.text(label, x, y)
    doc.setTextColor(...DARK)
    doc.text(value || '—', x + 40, y)
    if (col === 1 || col === 0) y += 6
  }

  const rowPair = (l1: string, v1: string, l2: string, v2: string) => {
    doc.setFontSize(9)
    doc.setTextColor(...GRAY)
    doc.text(l1, 14, y)
    doc.setTextColor(...DARK)
    doc.text(v1 || '—', 54, y)
    doc.setTextColor(...GRAY)
    doc.text(l2, 110, y)
    doc.setTextColor(...DARK)
    doc.text(v2 || '—', 150, y)
    y += 6
  }

  // Vehicle Info
  section('VEHICLE INFORMATION')
  rowPair('Category', v.category || '', 'Color', v.color || '')
  rowPair('Fuel', v.fuelType || '', 'Gearbox', v.gearType || '')
  rowPair('Engine CC', v.engineCC ? `${v.engineCC} cc` : '', 'Power', v.powerKW ? `${v.powerKW} kW` : '')
  rowPair('Mileage', v.mileage ? `${v.mileage.toLocaleString()} km` : '', 'Seats', String(v.seats || ''))
  if (v.weightKg) rowPair('Weight', `${v.weightKg} kg`, 'Payload', v.payloadKg ? `${v.payloadKg} kg` : '')
  y += 4

  // Purchase
  if (v.purchase) {
    section('PURCHASE')
    rowPair('Date', v.purchase.date || '', 'Invoice', v.purchase.invoiceNumber || '')
    rowPair('Seller', v.purchase.sellerName || '', 'Country', v.purchase.sellerCountry || '')
    rowPair('Price', v.purchase.price ? `EUR ${v.purchase.price.toLocaleString()}` : '', 'VAT Regime', v.purchase.vatRegime || '')
    if (v.purchase.additionalCosts) rowPair('Extra costs', `EUR ${v.purchase.additionalCosts}`, '', '')
    y += 4
  }

  // Transport In
  if (v.transportIn) {
    section('TRANSPORT IN (CMR)')
    rowPair('CMR No.', v.transportIn.cmrNumber || '', 'Carrier', v.transportIn.carrier || '')
    rowPair('Driver', v.transportIn.driver || '', 'Truck plate', v.transportIn.truckPlate || '')
    rowPair('From', v.transportIn.origin || '', 'To', v.transportIn.destination || '')
    rowPair('Departure', v.transportIn.departureDate || '', 'Arrival', v.transportIn.arrivalDate || '')
    rowPair('Cost', v.transportIn.cost ? `EUR ${v.transportIn.cost}` : '', '', '')
    y += 4
  }

  // Check page break
  if (y > 230) { doc.addPage(); y = 20 }

  // Storage
  if (v.storage) {
    section('STORAGE')
    rowPair('Location', v.storage.location || '', 'Address', v.storage.address || '')
    rowPair('Arrival', v.storage.arrivalDate || '', 'Cost/day', v.storage.costPerDay ? `EUR ${v.storage.costPerDay}` : '')
    if (v.storage.workDone) {
      doc.setFontSize(9); doc.setTextColor(...GRAY)
      doc.text('Work done:', 14, y)
      doc.setTextColor(...DARK)
      const lines = doc.splitTextToSize(v.storage.workDone, 140)
      doc.text(lines, 54, y)
      y += lines.length * 5
    }
    y += 4
  }

  // Sale
  if (v.sale?.price) {
    section('SALE')
    rowPair('Date', v.sale.date || '', 'Invoice', v.sale.invoiceNumber || '')
    rowPair('Buyer', v.sale.buyerName || '', 'Country', v.sale.buyerCountry || '')
    rowPair('Price', `EUR ${v.sale.price.toLocaleString()}`, 'VAT Regime', v.sale.vatRegime || '')
    y += 4
  }

  // Transport Out
  if (v.transportOut?.cmrNumber) {
    section('TRANSPORT OUT (CMR)')
    rowPair('CMR No.', v.transportOut.cmrNumber || '', 'Carrier', v.transportOut.carrier || '')
    rowPair('From', v.transportOut.origin || '', 'To', v.transportOut.destination || '')
    rowPair('Cost', v.transportOut.cost ? `EUR ${v.transportOut.cost}` : '', '', '')
    y += 4
  }

  // Check page break
  if (y > 230) { doc.addPage(); y = 20 }

  // Financials
  section('FINANCIAL SUMMARY')
  rowPair('Purchase cost', `EUR ${fin.purchaseCost.toLocaleString()}`, 'Transport in', `EUR ${fin.transportInCost.toLocaleString()}`)
  rowPair('Storage cost', `EUR ${fin.storageCost.toLocaleString()} (${fin.storageDays}d)`, 'Work cost', `EUR ${fin.workCost.toLocaleString()}`)
  rowPair('Transport out', `EUR ${fin.transportOutCost.toLocaleString()}`, 'TOTAL COST', `EUR ${fin.totalCost.toLocaleString()}`)
  y += 4

  if (fin.saleRevenue > 0) {
    rowPair('Sale revenue', `EUR ${fin.saleRevenue.toLocaleString()}`, '', '')
    // Profit highlight
    doc.setFillColor(fin.grossProfit >= 0 ? 220 : 254, fin.grossProfit >= 0 ? 252 : 202, fin.grossProfit >= 0 ? 231 : 202)
    doc.rect(14, y, 182, 12, 'F')
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(fin.grossProfit >= 0 ? 22 : 185, fin.grossProfit >= 0 ? 101 : 28, fin.grossProfit >= 0 ? 52 : 26)
    doc.text(`GROSS PROFIT: EUR ${fin.grossProfit.toLocaleString()}  |  MARGIN: ${fin.margin.toFixed(1)}%`, 18, y + 8)
    y += 18
  }

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(...GRAY)
    doc.text(`AutoFleet Pro — ${v.make || ''} ${v.model || ''} ${v.plate || ''} — Page ${i}/${pageCount}`, 14, 290)
  }

  doc.save(`AutoFleet_${v.make || ''}_${v.model || ''}_${v.plate || v.id}.pdf`)
}
