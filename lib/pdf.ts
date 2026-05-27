import type { Vehicle, FinancialSummary, AppSettings } from './types'
import { fmtCur, fmtDate, fmtNum } from './utils'
import { t } from './i18n'
import type { Lang } from './types'

export async function generateVehiclePDF(
  v: Vehicle,
  fin: FinancialSummary,
  lang: Lang,
  settings: AppSettings,
): Promise<void> {
  // jsPDF's built-in Helvetica only supports Latin characters.
  // Force English labels in the PDF regardless of UI language to avoid garbled Greek/German umlauts.
  const pdfLang: Lang = 'en'
  // jsPDF ships both ESM and CJS; handle both module shapes
  const jspdfMod = await import('jspdf')
  const moduleWithLegacyDefault = jspdfMod as typeof jspdfMod & { default?: { jsPDF?: typeof jspdfMod.jsPDF } }
  const jsPDFClass = moduleWithLegacyDefault.jsPDF ?? moduleWithLegacyDefault.default?.jsPDF

  if (!jsPDFClass) {
    throw new Error('jsPDF module did not expose a constructor')
  }

  const doc = new jsPDFClass({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const W = 210, margin = 14
  let y = 14

  const dark = [15, 15, 24] as [number, number, number]
  const gold = [240, 165, 0] as [number, number, number]
  const light = [240, 240, 240] as [number, number, number]
  const muted = [100, 100, 120] as [number, number, number]
  const black = [20, 20, 30] as [number, number, number]

  // Header
  doc.setFillColor(...dark)
  doc.rect(0, 0, W, 30, 'F')
  doc.setTextColor(...gold)
  doc.setFontSize(18); doc.setFont('helvetica', 'bold')
  doc.text('AutoFleet Pro', margin, 13)
  doc.setFontSize(9); doc.setFont('helvetica', 'normal')
  doc.setTextColor(...light)
  doc.text(settings.companyName || 'AutoFleet Trading', margin, 21)
  doc.text(`${t(pdfLang, 'report.genOn')}: ${new Date().toLocaleDateString('en-GB')}`, W - margin, 21, { align: 'right' })

  // Title bar
  y = 38
  doc.setFillColor(...gold)
  doc.rect(margin, y, W - margin * 2, 12, 'F')
  doc.setTextColor(...dark)
  doc.setFontSize(11); doc.setFont('helvetica', 'bold')
  doc.text(`${v.make || ''} ${v.model || ''} ${v.year || ''}  |  ${v.plate || '—'}  |  Ref: ${v.businessId}`, margin + 3, y + 8)

  y = 54

  // ── Vehicle photo (if available) ──────────────────────────────
  if (v.photo) {
    try {
      // Determine image format from data URL
      const mimeMatch = v.photo.match(/^data:image\/(\w+);base64,/)
      const imgFormat = mimeMatch ? mimeMatch[1].toUpperCase() as 'JPEG' | 'PNG' | 'WEBP' : 'JPEG'
      const imgData = v.photo.includes(',') ? v.photo : `data:image/jpeg;base64,${v.photo}`

      const photoW = W - margin * 2
      const photoH = 52  // ~5cm height
      doc.addImage(imgData, imgFormat === 'WEBP' ? 'JPEG' : imgFormat, margin, y, photoW, photoH)
      y += photoH + 4
    } catch (imgErr) {
      console.warn('PDF photo error:', imgErr)
      y += 4
    }
  } else {
    y += 4
  }

  const addSection = (title: string) => {
    if (y > 260) { doc.addPage(); y = 14 }
    doc.setFillColor(30, 30, 42)
    doc.rect(margin, y, W - margin * 2, 8, 'F')
    doc.setTextColor(...gold)
    doc.setFontSize(8); doc.setFont('helvetica', 'bold')
    doc.text(title, margin + 3, y + 5.5)
    y += 12
  }

  const addRow = (label: string, value: string | undefined | null) => {
    if (!value || value === '—') return
    if (y > 270) { doc.addPage(); y = 14 }
    doc.setTextColor(...muted); doc.setFontSize(8); doc.setFont('helvetica', 'normal')
    doc.text(label + ':', margin + 2, y)
    doc.setTextColor(...black); doc.setFont('helvetica', 'bold')
    doc.text(String(value), margin + 65, y)
    y += 5.5
  }

  const addRow2 = (l1: string, v1: string | undefined, l2: string, v2: string | undefined) => {
    if (y > 270) { doc.addPage(); y = 14 }
    const half = (W - margin * 2) / 2
    doc.setTextColor(...muted); doc.setFontSize(8); doc.setFont('helvetica', 'normal')
    doc.text(l1 + ':', margin + 2, y)
    if (v1) { doc.setTextColor(...black); doc.setFont('helvetica', 'bold'); doc.text(v1, margin + 52, y) }
    doc.setTextColor(...muted); doc.setFont('helvetica', 'normal')
    if (l2) doc.text(l2 + ':', margin + half + 2, y)
    if (v2) { doc.setTextColor(...black); doc.setFont('helvetica', 'bold'); doc.text(v2, margin + half + 52, y) }
    y += 5.5
  }

  const tr = (key: string) => t(pdfLang, key)

  // Vehicle info
  addSection(tr('report.vInfo'))
  addRow2(tr('vehicle.make'), v.make, tr('vehicle.model'), v.model)
  addRow2(tr('vehicle.year'), v.year, tr('vehicle.color'), v.color)
  addRow2(tr('vehicle.vin'), v.vin, tr('vehicle.plate'), v.plate)
  addRow2(tr('vehicle.fuel'), v.fuel ? tr('fuel.' + v.fuel) : '', tr('vehicle.gearbox'), v.gearbox ? tr('gear.' + v.gearbox) : '')
  addRow2(tr('vehicle.mileage'), v.mileage ? fmtNum(v.mileage) + ' km' : '', tr('vehicle.engine'), v.engine ? v.engine + ' cc' : '')
  addRow2(tr('vehicle.firstReg'), fmtDate(v.firstReg), tr('vehicle.regCountry'), v.regCountry)
  addRow2(tr('vehicle.cocNum'), v.cocNum, tr('vehicle.condition'), v.condition ? tr('cond.' + v.condition) : '')
  addRow(tr('vehicle.status'), v.status ? tr('status.' + v.status) : '')
  y += 3

  // Purchase
  addSection(tr('report.pInfo'))
  const p = v.purchase ?? {}
  addRow2(tr('purchase.date'), fmtDate(p.date ?? ''), tr('purchase.invoiceNum'), p.invoiceNum ?? '')
  addRow2(tr('purchase.sellerName'), p.sellerName ?? '', tr('purchase.sellerCountry'), p.sellerCountry ?? '')
  addRow2(tr('purchase.vatType'), p.vatType ? tr('vat.' + p.vatType) : '', tr('purchase.vatRate'), p.vatRate ? p.vatRate + '%' : '')
  addRow2(tr('purchase.priceNet'), p.priceNet ? fmtCur(p.priceNet, p.currency) : '', tr('purchase.priceGross'), p.priceGross ? fmtCur(p.priceGross, p.currency) : '')
  if (p.extraCosts?.length) {
    p.extraCosts.forEach(ec => { if (ec.desc) addRow('  ' + ec.desc, fmtCur(ec.amt ?? '')) })
  }
  if (p.notes) addRow(tr('purchase.notes'), p.notes)
  y += 3

  // Import Transport
  const it = v.importTransport ?? {}
  if (it.carrier || it.cmr) {
    addSection(tr('report.itInfo'))
    addRow2(tr('transport.cmr'), it.cmr ?? '', tr('transport.carrier'), it.carrier ?? '')
    addRow2(tr('transport.origin'), it.origin ?? '', tr('transport.dest'), it.dest ?? '')
    addRow2(tr('transport.depDate'), fmtDate(it.depDate ?? ''), tr('transport.arrDate'), fmtDate(it.arrDate ?? ''))
    addRow2(tr('transport.truckPlate'), it.truckPlate ?? '', tr('transport.driver'), it.driver ?? '')
    addRow(tr('transport.cost'), it.cost ? fmtCur(it.cost, it.currency) : '')
    y += 3
  }

  // Storage
  const st = v.storage ?? {}
  if (st.entryDate) {
    addSection(tr('report.stInfo'))
    addRow2(tr('storage.location'), st.location ? tr('loc.' + st.location) : '', tr('storage.locDetails'), st.locDetails ?? '')
    addRow2(tr('storage.entryDate'), fmtDate(st.entryDate ?? ''), tr('storage.exitDate'), fmtDate(st.exitDate ?? ''))
    addRow2(tr('storage.days'), String(fin.storageDays), tr('storage.totalSC'), fmtCur(fin.sc))
    st.workDone?.forEach(w => { if (w.desc) addRow('  🔧 ' + w.desc, fmtCur(w.cost ?? '')) })
    y += 3
  }

  // Sale
  const s = v.sale ?? {}
  if (s.buyerName || s.priceGross) {
    addSection(tr('report.sInfo'))
    addRow2(tr('sale.date'), fmtDate(s.date ?? ''), tr('sale.invoiceNum'), s.invoiceNum ?? '')
    addRow2(tr('sale.buyerName'), s.buyerName ?? '', tr('sale.buyerCountry'), s.buyerCountry ?? '')
    addRow2(tr('sale.priceNet'), s.priceNet ? fmtCur(s.priceNet, s.currency) : '', tr('sale.priceGross'), s.priceGross ? fmtCur(s.priceGross, s.currency) : '')
    y += 3
  }

  // Export Transport
  const et = v.exportTransport ?? {}
  if (et.carrier || et.cmr) {
    addSection(tr('report.etInfo'))
    addRow2(tr('transport.cmr'), et.cmr ?? '', tr('transport.carrier'), et.carrier ?? '')
    addRow2(tr('transport.origin'), et.origin ?? '', tr('transport.dest'), et.dest ?? '')
    addRow(tr('transport.cost'), et.cost ? fmtCur(et.cost, et.currency) : '')
    y += 3
  }

  // Financials
  if (y > 200) { doc.addPage(); y = 14 }
  addSection(tr('report.fInfo'))
  if (fin.pp) addRow(tr('financials.purchaseP'), fmtCur(fin.pp))
  if (fin.ic) addRow(tr('financials.importC'), fmtCur(fin.ic))
  if (fin.ec) addRow(tr('financials.extraC'), fmtCur(fin.ec))
  if (fin.sc) addRow(`${tr('financials.storageC')} (${fin.storageDays}d)`, fmtCur(fin.sc))
  if (fin.wc) addRow(tr('financials.workC'), fmtCur(fin.wc))
  if (fin.xc) addRow(tr('financials.exportC'), fmtCur(fin.xc))
  y += 2
  doc.setDrawColor(...muted); doc.setLineWidth(0.3)
  doc.line(margin, y, W - margin, y); y += 5
  doc.setFontSize(10); doc.setFont('helvetica', 'bold')
  doc.setTextColor(...dark); doc.text(tr('financials.totalC') + ': ' + fmtCur(fin.total), margin + 2, y); y += 7
  if (fin.sp) {
    doc.setTextColor(0, 100, 0); doc.text(tr('financials.saleP') + ': ' + fmtCur(fin.sp), margin + 2, y); y += 7
    const profColor: [number, number, number] = fin.profit !== null && fin.profit >= 0 ? [0, 120, 0] : [180, 0, 0]
    doc.setTextColor(...profColor)
    doc.text(tr('financials.profit') + ': ' + (fin.profit !== null ? fmtCur(fin.profit) : '—'), margin + 2, y); y += 6
    if (fin.margin !== null) doc.text(tr('financials.margin') + ': ' + fin.margin.toFixed(1) + '%', margin + 2, y)
  }

  // Footer on all pages
  const pageCount = doc.internal.pages.length - 1
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFillColor(...dark)
    doc.rect(0, 287, W, 10, 'F')
    doc.setFontSize(7); doc.setFont('helvetica', 'normal')
    doc.setTextColor(...muted)
    doc.text(tr('report.confid'), margin, 292)
    doc.text(`${settings.companyName || 'AutoFleet Pro'} | ${i}/${pageCount}`, W - margin, 292, { align: 'right' })
  }

  doc.save(`${v.make || 'Vehicle'}_${v.model || ''}_${v.businessId}.pdf`)
}
