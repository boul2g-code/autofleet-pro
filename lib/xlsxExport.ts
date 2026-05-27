/**
 * AutoFleet Pro — Excel Export
 * Generates browser-side .xlsx files with JSZip to keep the export path lean
 * and avoid vulnerable spreadsheet writer dependencies.
 */
import JSZip from 'jszip'
import type { Vehicle } from './types'
import { computeFin } from './financials'

type PrimitiveCell = string | number

interface WorksheetSpec {
  name: string
  rows: PrimitiveCell[][]
  headerRow?: number
  noteRows?: number[]
  freezeRows?: number
  columnWidths?: number[]
}

const XLSX_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

// Column definitions
const COLS = [
  { key: 'businessId', label: 'Business ID' },
  { key: 'plate', label: 'Plate / Targa / Kennzeichen' },
  { key: 'vin', label: 'VIN' },
  { key: 'status', label: 'Status' },
  { key: 'category', label: 'Category / Categoria' },
  { key: 'make', label: 'Make / Marca' },
  { key: 'model', label: 'Model / Modello' },
  { key: 'year', label: 'Year / Anno' },
  { key: 'color', label: 'Color / Colore' },
  { key: 'fuel', label: 'Fuel / Carburante' },
  { key: 'gearbox', label: 'Gearbox / Cambio' },
  { key: 'engine', label: 'Engine cc' },
  { key: 'mileage', label: 'Mileage km' },
  { key: 'firstReg', label: 'First Reg / Prima Immat.' },
  { key: 'regCountry', label: 'Reg. Country' },
  { key: 'seats', label: 'Seats / Posti' },
  { key: 'payload', label: 'Payload kg' },
  { key: 'cocNum', label: 'COC No.' },
  { key: 'condition', label: 'Condition' },
  { key: 'purchaseDate', label: 'Purchase Date' },
  { key: 'sellerName', label: 'Seller / Venditore' },
  { key: 'sellerCountry', label: 'Seller Country' },
  { key: 'purchasePriceNet', label: 'Purchase Price Net (€)' },
  { key: 'purchaseVat', label: 'Purchase VAT %' },
  { key: 'purchasePriceGross', label: 'Purchase Price Gross (€)' },
  { key: 'purchaseVatType', label: 'Purchase VAT Type' },
  { key: 'purchaseInvoice', label: 'Purchase Invoice No.' },
  { key: 'importCmr', label: 'Import CMR No.' },
  { key: 'importCarrier', label: 'Import Carrier' },
  { key: 'importOrigin', label: 'Import Origin' },
  { key: 'importDest', label: 'Import Dest.' },
  { key: 'importDepDate', label: 'Import Departure' },
  { key: 'importArrDate', label: 'Import Arrival' },
  { key: 'importCost', label: 'Import Transport Cost (€)' },
  { key: 'importTruckPlate', label: 'Import Truck Plate' },
  { key: 'importDriver', label: 'Import Driver' },
  { key: 'storageLocation', label: 'Storage Location' },
  { key: 'storageEntryDate', label: 'Storage Entry Date' },
  { key: 'storageExitDate', label: 'Storage Exit Date' },
  { key: 'storageCpd', label: 'Storage Cost/Day (€)' },
  { key: 'storageDays', label: 'Storage Days' },
  { key: 'storageTotalCost', label: 'Storage Total Cost (€)' },
  { key: 'saleDate', label: 'Sale Date' },
  { key: 'buyerName', label: 'Buyer / Acquirente' },
  { key: 'buyerCountry', label: 'Buyer Country' },
  { key: 'salePriceNet', label: 'Sale Price Net (€)' },
  { key: 'saleVat', label: 'Sale VAT %' },
  { key: 'salePriceGross', label: 'Sale Price Gross (€)' },
  { key: 'saleVatType', label: 'Sale VAT Type' },
  { key: 'saleInvoice', label: 'Sale Invoice No.' },
  { key: 'exportCmr', label: 'Export CMR No.' },
  { key: 'exportCarrier', label: 'Export Carrier' },
  { key: 'exportOrigin', label: 'Export Origin' },
  { key: 'exportDest', label: 'Export Dest.' },
  { key: 'exportDepDate', label: 'Export Departure' },
  { key: 'exportArrDate', label: 'Export Arrival' },
  { key: 'exportCost', label: 'Export Transport Cost (€)' },
  { key: 'exportTruckPlate', label: 'Export Truck Plate' },
  { key: 'exportDriver', label: 'Export Driver' },
  { key: 'totalCosts', label: 'Total Costs (€) [AUTO]' },
  { key: 'profit', label: 'Profit/Loss (€) [AUTO]' },
  { key: 'margin', label: 'Margin % [AUTO]' },
  { key: 'notes', label: 'Notes / Note' },
] as const

function vehicleToRow(v: Vehicle): Record<string, PrimitiveCell> {
  const fin = computeFin(v)
  const n = (x: string | undefined) => x || ''

  return {
    businessId: n(v.businessId),
    plate: n(v.plate),
    vin: n(v.vin),
    status: n(v.status),
    category: n(v.category),
    make: n(v.make),
    model: n(v.model),
    year: n(v.year),
    color: n(v.color),
    fuel: n(v.fuel),
    gearbox: n(v.gearbox),
    engine: n(v.engine),
    mileage: v.mileage ? parseInt(v.mileage, 10) : '',
    firstReg: n(v.firstReg),
    regCountry: n(v.regCountry),
    seats: n(v.seats),
    payload: v.payload ? parseInt(v.payload, 10) : '',
    cocNum: n(v.cocNum),
    condition: n(v.condition),
    purchaseDate: n(v.purchase?.date),
    sellerName: n(v.purchase?.sellerName),
    sellerCountry: n(v.purchase?.sellerCountry),
    purchasePriceNet: v.purchase?.priceNet ? parseFloat(v.purchase.priceNet) : '',
    purchaseVat: v.purchase?.vatRate ? parseFloat(v.purchase.vatRate) : '',
    purchasePriceGross: v.purchase?.priceGross ? parseFloat(v.purchase.priceGross) : '',
    purchaseVatType: n(v.purchase?.vatType),
    purchaseInvoice: n(v.purchase?.invoiceNum),
    importCmr: n(v.importTransport?.cmr),
    importCarrier: n(v.importTransport?.carrier),
    importOrigin: n(v.importTransport?.origin),
    importDest: n(v.importTransport?.dest),
    importDepDate: n(v.importTransport?.depDate),
    importArrDate: n(v.importTransport?.arrDate),
    importCost: v.importTransport?.cost ? parseFloat(v.importTransport.cost) : '',
    importTruckPlate: n(v.importTransport?.truckPlate),
    importDriver: n(v.importTransport?.driver),
    storageLocation: n(v.storage?.location),
    storageEntryDate: n(v.storage?.entryDate),
    storageExitDate: n(v.storage?.exitDate),
    storageCpd: v.storage?.cpd ? parseFloat(v.storage.cpd) : '',
    storageDays: v.storage?.days ? parseInt(v.storage.days, 10) : '',
    storageTotalCost: fin.sc || '',
    saleDate: n(v.sale?.date),
    buyerName: n(v.sale?.buyerName),
    buyerCountry: n(v.sale?.buyerCountry),
    salePriceNet: v.sale?.priceNet ? parseFloat(v.sale.priceNet) : '',
    saleVat: v.sale?.vatRate ? parseFloat(v.sale.vatRate) : '',
    salePriceGross: v.sale?.priceGross ? parseFloat(v.sale.priceGross) : '',
    saleVatType: n(v.sale?.vatType),
    saleInvoice: n(v.sale?.invoiceNum),
    exportCmr: n(v.exportTransport?.cmr),
    exportCarrier: n(v.exportTransport?.carrier),
    exportOrigin: n(v.exportTransport?.origin),
    exportDest: n(v.exportTransport?.dest),
    exportDepDate: n(v.exportTransport?.depDate),
    exportArrDate: n(v.exportTransport?.arrDate),
    exportCost: v.exportTransport?.cost ? parseFloat(v.exportTransport.cost) : '',
    exportTruckPlate: n(v.exportTransport?.truckPlate),
    exportDriver: n(v.exportTransport?.driver),
    totalCosts: fin.total || '',
    profit: fin.profit ?? '',
    margin: fin.margin != null ? parseFloat(fin.margin.toFixed(2)) : '',
    notes: n(v.notes),
  }
}

function stripInvalidXmlChars(value: string): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
}

function escapeXml(value: string): string {
  return stripInvalidXmlChars(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function sanitizeWorksheetName(name: string): string {
  const normalized = name
    .replace(/[\[\]\:\*\?\/\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^'+|'+$/g, '')
    .trim()

  const safeName = normalized || 'Sheet'
  return safeName.slice(0, 31)
}

export function toExcelColumnName(columnIndex: number): string {
  let current = columnIndex
  let label = ''

  while (current > 0) {
    const remainder = (current - 1) % 26
    label = String.fromCharCode(65 + remainder) + label
    current = Math.floor((current - 1) / 26)
  }

  return label || 'A'
}

function buildColumnWidths(rows: PrimitiveCell[][]): number[] {
  const columnCount = rows.reduce((max, row) => Math.max(max, row.length), 0)
  return Array.from({ length: columnCount }, (_, index) => {
    const longest = rows.reduce((max, row) => {
      const raw = row[index]
      return Math.max(max, String(raw ?? '').length)
    }, 0)
    return Math.min(Math.max(longest + 2, 14), 32)
  })
}

function makeMainSheet(name: string, headers: string[], rows: PrimitiveCell[][]): WorksheetSpec {
  return {
    name,
    rows: [headers, ...rows],
    headerRow: 1,
    freezeRows: 1,
    columnWidths: buildColumnWidths([headers, ...rows]),
  }
}

function buildSummarySheet(vehicles: Vehicle[], companyName: string): WorksheetSpec {
  const totalPurchase = vehicles.reduce((sum, vehicle) => sum + (parseFloat(vehicle.purchase?.priceGross || '0') || 0), 0)
  const totalSale = vehicles.filter(vehicle => vehicle.sale?.priceGross).reduce((sum, vehicle) => sum + (parseFloat(vehicle.sale?.priceGross || '0') || 0), 0)
  const totalProfit = vehicles.filter(vehicle => vehicle.sale?.priceGross).reduce((sum, vehicle) => sum + (computeFin(vehicle).profit ?? 0), 0)
  const soldVehicles = vehicles.filter(vehicle => vehicle.sale?.priceGross).length

  return {
    name: 'Summary',
    rows: [
      [`${companyName} — Fleet Summary`, ''],
      ['Generated', new Date().toLocaleDateString('en-GB')],
      ['', ''],
      ['METRIC', 'VALUE'],
      ['Total Vehicles', vehicles.length],
      ['Purchased', vehicles.filter(vehicle => vehicle.status === 'purchased').length],
      ['In Transit (Import)', vehicles.filter(vehicle => vehicle.status === 'transit_in').length],
      ['At Depot', vehicles.filter(vehicle => vehicle.status === 'at_depot').length],
      ['For Sale', vehicles.filter(vehicle => vehicle.status === 'for_sale').length],
      ['Sold', vehicles.filter(vehicle => vehicle.status === 'sold').length],
      ['In Transit (Export)', vehicles.filter(vehicle => vehicle.status === 'transit_out').length],
      ['Delivered', vehicles.filter(vehicle => vehicle.status === 'delivered').length],
      ['', ''],
      ['Total Purchase Value (€)', totalPurchase],
      ['Total Sale Value (€)', totalSale],
      ['Total Profit/Loss (€)', totalProfit],
      ['Avg Margin %', soldVehicles ? parseFloat(((totalProfit / totalSale) * 100).toFixed(2)) : 0],
    ],
    headerRow: 4,
    columnWidths: [30, 20],
    noteRows: [1],
  }
}

function buildTemplateSheet(headers: string[]): WorksheetSpec {
  const templateHeaders = COLS.filter(col => !['totalCosts', 'profit', 'margin'].includes(col.key)).map(col => col.label)
  const exampleRow: PrimitiveCell[] = [
    'VH-EXAMPLE001',
    'M-AB 1234', 'WBA3A5C5XDF123456', 'purchased', 'car', 'BMW', '320d', '2021', 'White', 'diesel', 'manual',
    '1995', '85000', '2021-01-15', 'DE', '5', '', 'ABC-123', 'good',
    '2024-03-10', 'Max Müller GmbH', 'DE', '18000', '', '21800', 'standard', 'INV-2024-001',
    'CMR-001', 'Fast Transport GmbH', 'Berlin', 'Thessaloniki', '2024-03-11', '2024-03-13', '850', 'B-LK 9988', 'Hans Schmidt',
    'de', '2024-03-13', '', '12', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    'Clean car, one owner',
  ]

  return {
    name: 'IMPORT TEMPLATE',
    rows: [
      ['AutoFleet Pro — JSON import remains the supported restore path. This sheet is for manual Excel exports and reference.'],
      templateHeaders,
      exampleRow,
    ],
    headerRow: 2,
    noteRows: [1],
    freezeRows: 2,
    columnWidths: buildColumnWidths([templateHeaders, exampleRow]).map(width => Math.min(Math.max(width, 16), 34)),
  }
}

function buildStylesXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="3">
    <font><sz val="11"/><name val="Calibri"/><family val="2"/></font>
    <font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Calibri"/><family val="2"/></font>
    <font><i/><color rgb="FF666666"/><sz val="11"/><name val="Calibri"/><family val="2"/></font>
  </fonts>
  <fills count="3">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF0F0F18"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="1">
    <border><left/><right/><top/><bottom/><diagonal/></border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="3">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center"/>
    </xf>
    <xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>
  </cellXfs>
  <cellStyles count="1">
    <cellStyle name="Normal" xfId="0" builtinId="0"/>
  </cellStyles>
</styleSheet>`
}

function buildContentTypesXml(sheetCount: number): string {
  const worksheetOverrides = Array.from({ length: sheetCount }, (_, index) =>
    `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`,
  ).join('')

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  ${worksheetOverrides}
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`
}

function buildRootRelsXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`
}

function buildAppPropsXml(sheetNames: string[]): string {
  const titles = sheetNames.map(name => `<vt:lpstr>${escapeXml(name)}</vt:lpstr>`).join('')

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>AutoFleet Pro</Application>
  <HeadingPairs>
    <vt:vector size="2" baseType="variant">
      <vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant>
      <vt:variant><vt:i4>${sheetNames.length}</vt:i4></vt:variant>
    </vt:vector>
  </HeadingPairs>
  <TitlesOfParts>
    <vt:vector size="${sheetNames.length}" baseType="lpstr">${titles}</vt:vector>
  </TitlesOfParts>
</Properties>`
}

function buildCorePropsXml(): string {
  const now = new Date().toISOString()

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:creator>AutoFleet Pro</dc:creator>
  <cp:lastModifiedBy>AutoFleet Pro</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
</cp:coreProperties>`
}

function buildWorkbookXml(sheets: WorksheetSpec[]): string {
  const entries = sheets.map((sheet, index) =>
    `<sheet name="${escapeXml(sheet.name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`,
  ).join('')

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>${entries}</sheets>
</workbook>`
}

function buildWorkbookRelsXml(sheetCount: number): string {
  const sheetRels = Array.from({ length: sheetCount }, (_, index) =>
    `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`,
  ).join('')

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${sheetRels}
  <Relationship Id="rId${sheetCount + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`
}

function createCellXml(value: PrimitiveCell | undefined, rowIndex: number, columnIndex: number, styleId: number): string {
  const ref = `${toExcelColumnName(columnIndex)}${rowIndex}`
  const styleAttr = styleId > 0 ? ` s="${styleId}"` : ''

  if (value === '' || value === undefined) {
    return `<c r="${ref}"${styleAttr}/>`
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return `<c r="${ref}"${styleAttr}><v>${value}</v></c>`
  }

  return `<c r="${ref}" t="inlineStr"${styleAttr}><is><t xml:space="preserve">${escapeXml(String(value))}</t></is></c>`
}

function buildWorksheetXml(sheet: WorksheetSpec): string {
  const rowCount = Math.max(sheet.rows.length, 1)
  const columnCount = Math.max(sheet.columnWidths?.length || 0, sheet.rows.reduce((max, row) => Math.max(max, row.length), 0), 1)
  const lastCell = `${toExcelColumnName(columnCount)}${rowCount}`
  const headerRow = sheet.headerRow
  const noteRows = new Set(sheet.noteRows ?? [])

  const colsXml = (sheet.columnWidths && sheet.columnWidths.length > 0)
    ? `<cols>${sheet.columnWidths.map((width, index) => `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`).join('')}</cols>`
    : ''

  const rowsXml = sheet.rows.map((row, index) => {
    const rowNumber = index + 1
    const styleId = rowNumber === headerRow ? 1 : noteRows.has(rowNumber) ? 2 : 0
    const cells = Array.from({ length: Math.max(row.length, rowNumber === headerRow ? columnCount : row.length) }, (_, cellIndex) =>
      createCellXml(row[cellIndex], rowNumber, cellIndex + 1, styleId),
    ).join('')

    return `<row r="${rowNumber}">${cells}</row>`
  }).join('')

  const sheetViewXml = sheet.freezeRows && sheet.freezeRows > 0
    ? `<sheetViews><sheetView workbookViewId="0"><pane ySplit="${sheet.freezeRows}" topLeftCell="A${sheet.freezeRows + 1}" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft" activeCell="A${sheet.freezeRows + 1}" sqref="A${sheet.freezeRows + 1}"/></sheetView></sheetViews>`
    : '<sheetViews><sheetView workbookViewId="0"><selection activeCell="A1" sqref="A1"/></sheetView></sheetViews>'

  const autoFilterXml = headerRow
    ? `<autoFilter ref="A${headerRow}:${toExcelColumnName(columnCount)}${headerRow}"/>`
    : ''

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <dimension ref="A1:${lastCell}"/>
  ${sheetViewXml}
  <sheetFormatPr defaultRowHeight="15"/>
  ${colsXml}
  <sheetData>${rowsXml}</sheetData>
  ${autoFilterXml}
  <pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>
</worksheet>`
}

async function buildWorkbookBuffer(sheets: WorksheetSpec[]): Promise<ArrayBuffer> {
  const zip = new JSZip()
  const sanitizedSheets = sheets.map(sheet => ({ ...sheet, name: sanitizeWorksheetName(sheet.name) }))
  const xl = zip.folder('xl')

  if (!xl) {
    throw new Error('Could not create workbook container')
  }

  zip.file('[Content_Types].xml', buildContentTypesXml(sanitizedSheets.length))
  zip.folder('_rels')?.file('.rels', buildRootRelsXml())
  zip.folder('docProps')?.file('app.xml', buildAppPropsXml(sanitizedSheets.map(sheet => sheet.name)))
  zip.folder('docProps')?.file('core.xml', buildCorePropsXml())

  xl.file('workbook.xml', buildWorkbookXml(sanitizedSheets))
  xl.file('styles.xml', buildStylesXml())
  xl.folder('_rels')?.file('workbook.xml.rels', buildWorkbookRelsXml(sanitizedSheets.length))

  const worksheetFolder = xl.folder('worksheets')
  sanitizedSheets.forEach((sheet, index) => {
    worksheetFolder?.file(`sheet${index + 1}.xml`, buildWorksheetXml(sheet))
  })

  return zip.generateAsync({
    type: 'arraybuffer',
    compression: 'DEFLATE',
    mimeType: XLSX_MIME_TYPE,
  })
}

function downloadExcelFile(buffer: ArrayBuffer) {
  const blob = new Blob([buffer], { type: XLSX_MIME_TYPE })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `AutoFleet_Export_${new Date().toISOString().slice(0, 10)}.xlsx`
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export async function exportVehiclesXLSX(vehicles: Vehicle[], companyName = 'AutoFleet Pro'): Promise<void> {
  const headers = COLS.map(col => col.label)
  const allRows = vehicles.map(vehicle => COLS.map(col => vehicleToRow(vehicle)[col.key] ?? ''))

  const sheets: WorksheetSpec[] = [
    makeMainSheet('Vehicles', headers, allRows),
  ]

  const statuses = ['purchased', 'transit_in', 'at_depot', 'for_sale', 'sold', 'transit_out', 'delivered'] as const
  statuses.forEach(status => {
    const filtered = vehicles.filter(vehicle => vehicle.status === status)
    if (!filtered.length) return

    sheets.push(
      makeMainSheet(
        status.replace('_', ' ').toUpperCase().slice(0, 28),
        headers,
        filtered.map(vehicle => COLS.map(col => vehicleToRow(vehicle)[col.key] ?? '')),
      ),
    )
  })

  sheets.push(buildTemplateSheet(headers))
  sheets.push(buildSummarySheet(vehicles, companyName))

  const buffer = await buildWorkbookBuffer(sheets)
  downloadExcelFile(buffer)
}

export interface ImportResult {
  vehicles: Partial<Vehicle>[]
  errors: string[]
  warnings: string[]
}

export function importVehiclesFromXLSX(_file: File): Promise<ImportResult> {
  return Promise.reject(new Error('Excel import is not available. Use the JSON import flow instead.'))
}
