import { createHash } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { escapeHtml } from '@/lib/html'
import { applyRateLimit, htmlNoStore, jsonNoStore, reportHtmlContentSecurityPolicy } from '@/lib/security'
import { getAuthorizedVehicleReportData } from '@/lib/server/reportData'
import { createClient } from '@/lib/supabase/server'

type CmrMode = 'import' | 'export'

interface LegacyCmrPayload {
  arrDate?: string
  buyerContact?: string
  buyerCountry?: string
  buyerName?: string
  carrier?: string
  carrierContact?: string
  cmr?: string
  cocNum?: string
  companyDE?: string
  companyGR?: string
  companyName?: string
  condition?: string
  depDate?: string
  dest?: string
  driver?: string
  fuel?: string
  make?: string
  mileage?: string
  model?: string
  origin?: string
  payload?: string
  plate?: string
  sellerContact?: string
  sellerCountry?: string
  sellerName?: string
  transportCost?: string
  truckPlate?: string
  vin?: string
  year?: string
  category?: string
}

const CMR_PRINT_SCRIPT = "document.getElementById('print-button')?.addEventListener('click', () => window.print())"

function cmrContentSecurityPolicy(): string {
  const scriptHash = createHash('sha256').update(CMR_PRINT_SCRIPT).digest('base64')
  return reportHtmlContentSecurityPolicy({ scriptHashes: [scriptHash] })
}

function decodeLegacyPayload(raw: string | null): LegacyCmrPayload | null {
  if (!raw) return null
  if (raw.length > 24 * 1024) return null

  try {
    return JSON.parse(Buffer.from(decodeURIComponent(raw), 'base64').toString('utf-8')) as LegacyCmrPayload
  } catch {
    try {
      return JSON.parse(Buffer.from(raw, 'base64').toString('utf-8')) as LegacyCmrPayload
    } catch {
      return null
    }
  }
}

function fmtDate(value: string | undefined): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-GB')
}

function fmtNumber(value: string | undefined, suffix = ''): string {
  if (!value) return '—'

  const parsed = Number.parseInt(value, 10)
  if (Number.isNaN(parsed)) return escapeHtml(value)

  return `${parsed.toLocaleString('de-DE')}${suffix}`
}

function fmtMoney(value: string | undefined): string {
  if (!value) return '—'

  const parsed = Number.parseFloat(value)
  if (Number.isNaN(parsed)) return '—'

  return `€ ${parsed.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function renderCell(num: string, label: string, value: string) {
  return `
    <div class="cell">
      <div class="num">${escapeHtml(num)}</div>
      <div class="lbl">${escapeHtml(label)}</div>
      <div class="val">${value || '&nbsp;'}</div>
    </div>`
}

function renderCmrHtml(payload: LegacyCmrPayload) {
  const companyName = escapeHtml(payload.companyName || 'AutoFleet Pro')
  const companyDE = escapeHtml(payload.companyDE)
  const companyGR = escapeHtml(payload.companyGR)
  const cmr = escapeHtml(payload.cmr)
  const make = escapeHtml(payload.make)
  const model = escapeHtml(payload.model)
  const year = escapeHtml(payload.year)
  const origin = escapeHtml(payload.origin)
  const dest = escapeHtml(payload.dest)
  const carrier = escapeHtml(payload.carrier)
  const carrierContact = escapeHtml(payload.carrierContact)
  const driver = escapeHtml(payload.driver)
  const truckPlate = escapeHtml(payload.truckPlate)
  const sellerName = escapeHtml(payload.sellerName)
  const sellerCountry = escapeHtml(payload.sellerCountry)
  const sellerContact = escapeHtml(payload.sellerContact)
  const buyerName = escapeHtml(payload.buyerName)
  const buyerCountry = escapeHtml(payload.buyerCountry)
  const buyerContact = escapeHtml(payload.buyerContact)
  const vin = escapeHtml(payload.vin)
  const cocNum = escapeHtml(payload.cocNum)
  const plate = escapeHtml(payload.plate)
  const condition = escapeHtml((payload.condition || '').toUpperCase())
  const fuel = escapeHtml(payload.fuel)
  const mileage = fmtNumber(payload.mileage, ' km')
  const grossWeight = fmtNumber(payload.payload, ' kg')
  const transportCost = fmtMoney(payload.transportCost)
  const goodsText = escapeHtml([payload.make, payload.model, payload.year, payload.category?.toUpperCase()].filter(Boolean).join(' '))

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CMR ${cmr} - ${make} ${model}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
@page{size:A4;margin:10mm}
body{font-family:Arial,Helvetica,sans-serif;font-size:8pt;background:#fff;color:#000;padding:8mm}
h1{text-align:center;font-size:13pt;letter-spacing:2px;margin-bottom:1mm;font-weight:900}
.subtitle{text-align:center;font-size:7pt;color:#444;margin-bottom:4mm}
.grid{display:grid;grid-template-columns:1fr 1fr;border:2px solid #000;width:100%}
.cell{border:1px solid #888;padding:2mm 3mm;min-height:12mm;position:relative}
.num{position:absolute;top:1mm;left:2mm;font-size:6pt;color:#888;font-weight:bold}
.lbl{font-size:6.5pt;color:#444;margin-top:3mm;margin-bottom:1mm;text-transform:uppercase;letter-spacing:0.3px}
.val{font-size:9pt;font-weight:bold;word-break:break-word;line-height:1.3}
.section-header{background:#1a1a2e;color:#f0a500;padding:2mm 3mm;font-size:7.5pt;font-weight:900;letter-spacing:2px;text-transform:uppercase;grid-column:1/-1;text-align:center}
.sigs{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4mm;margin-top:4mm}
.sig{border:1px solid #000;height:22mm;padding:2mm;position:relative}
.sig-num{font-size:6.5pt;font-weight:bold;color:#888}
.sig-label{font-size:6.5pt;color:#444;margin-top:1mm}
.notice{font-size:6.5pt;color:#666;margin-top:3mm;text-align:center;line-height:1.5}
.accentbar{height:3px;background:linear-gradient(90deg,#f0a500,#e06c00,#f0a500);margin-bottom:2mm}
.logo-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:2mm}
.logo-text{font-size:9pt;font-weight:900;color:#f0a500;letter-spacing:1px}
.cmr-no{font-size:14pt;font-weight:900;color:#1a1a2e;font-family:monospace;letter-spacing:2px}
@media print{body{padding:0}.no-print{display:none!important}}
</style>
</head>
<body>

<div class="accentbar"></div>

<div class="logo-row">
  <div>
    <div class="logo-text">🚗 ${companyName}</div>
    <div style="font-size:6pt;color:#888">${companyDE}${companyGR ? ' · ' + companyGR : ''}</div>
  </div>
  <div class="cmr-no">CMR ${cmr || '—'}</div>
</div>

<h1>INTERNATIONAL CONSIGNMENT NOTE</h1>
<div class="subtitle">Convention on the Contract for the International Carriage of Goods by Road (CMR) · Geneva 1956</div>

<div class="grid">
  <div class="section-header">📦 PARTIES</div>

  ${renderCell('1', 'Sender / Expediteur / Absender', escapeHtml([payload.sellerName, payload.sellerCountry, payload.sellerContact].filter(Boolean).join(' · ')))}
  ${renderCell('2', 'Consignee / Destinataire / Empfänger', escapeHtml([payload.buyerName, payload.buyerCountry, payload.buyerContact].filter(Boolean).join(' · ')))}
  ${renderCell('3', 'Place of Delivery / Lieu de livraison', dest || '—')}
  ${renderCell('4', 'Place & Date of Loading / Lieu et date de chargement', `${origin || '—'}${payload.depDate ? ` · ${escapeHtml(fmtDate(payload.depDate))}` : ''}`)}

  <div class="section-header">🚗 GOODS</div>

  ${renderCell('5', 'Attached Documents / Documents annexés', 'Invoice · COC · Registration Certificate')}
  ${renderCell('6', 'Marks & Numbers / Marques et numéros', plate || '—')}
  ${renderCell('7', 'Number of Packages', '1 (one vehicle)')}
  ${renderCell('8', 'Method of Packing', 'Vehicle - own wheels / Fahrzeug - auf eigenen Rädern')}
  ${renderCell('9', 'Nature of Goods / Nature des marchandises', goodsText || '—')}
  ${renderCell('10', 'Gross Weight / Poids brut (kg)', grossWeight || 'See registration docs')}
  ${renderCell('11', 'VIN / Chassis Number / FIN', vin || '—')}
  ${renderCell('12', 'COC Number', cocNum || '—')}

  <div class="section-header">🚛 CARRIER</div>

  ${renderCell('16', 'Carrier / Transporteur / Spediteur', escapeHtml([payload.carrier, payload.carrierContact].filter(Boolean).join(' · ')))}
  ${renderCell('17', 'Truck / Trailer Plate / Kennzeichen LKW', truckPlate || '—')}
  ${renderCell('18', 'Driver / Fahrer / Conducteur', driver || '—')}
  ${renderCell('19', 'Departure Date / Abgangsdatum', escapeHtml(fmtDate(payload.depDate)))}
  ${renderCell('20', 'Arrival Date / Ankunftsdatum', escapeHtml(fmtDate(payload.arrDate)))}
  ${renderCell('21', 'Sender Instructions / Instructions particulières', sellerContact || '—')}

  <div class="section-header">💶 FREIGHT</div>

  ${renderCell('22', 'Transport Cost / Frais de transport', escapeHtml(transportCost))}
  ${renderCell('', 'Vehicle Condition / État du véhicule', condition || '—')}
  ${renderCell('', 'Mileage at Loading / Kilometerstand', escapeHtml(mileage))}
  ${renderCell('', 'Fuel Type / Carburant', fuel || '—')}
</div>

<div class="sigs">
  <div class="sig">
    <div class="sig-num">23.</div>
    <div class="sig-label">Sender - Expéditeur - Absender</div>
    <div style="font-size:7pt;color:#aaa;margin-top:1mm">Place, date, signature &amp; stamp</div>
  </div>
  <div class="sig">
    <div class="sig-num">24.</div>
    <div class="sig-label">Carrier - Transporteur - Spediteur</div>
    <div style="font-size:7pt;color:#aaa;margin-top:1mm">Place, date, signature &amp; stamp</div>
  </div>
  <div class="sig">
    <div class="sig-num">25.</div>
    <div class="sig-label">Consignee - Destinataire - Empfänger</div>
    <div style="font-size:7pt;color:#aaa;margin-top:1mm">Place, date, signature &amp; stamp</div>
  </div>
</div>

<div class="notice">
  Original · Copy 1 of 3 &nbsp;|&nbsp; Generated by AutoFleet Pro &nbsp;|&nbsp; ${companyName} &nbsp;|&nbsp; ${escapeHtml(new Date().toLocaleDateString('en-GB'))}
</div>

<div class="no-print" style="text-align:center;margin-top:8mm">
  <button id="print-button" style="background:#f0a500;color:#000;border:none;padding:10px 28px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:Arial">
    🖨️ Print / Save as PDF
  </button>
</div>

<script>${CMR_PRINT_SCRIPT}</script>

</body>
</html>`
}

function buildPayloadFromVehicle(
  mode: CmrMode,
  vehicle: Awaited<ReturnType<typeof getAuthorizedVehicleReportData>>['vehicle'],
  settings: Awaited<ReturnType<typeof getAuthorizedVehicleReportData>>['settings'],
): LegacyCmrPayload {
  if (!vehicle || !settings) return {}

  const transport = mode === 'import' ? vehicle.importTransport : vehicle.exportTransport

  return {
    arrDate: transport?.arrDate,
    buyerContact: vehicle.sale?.buyerContact,
    buyerCountry: vehicle.sale?.buyerCountry,
    buyerName: vehicle.sale?.buyerName,
    carrier: transport?.carrier,
    carrierContact: transport?.carrierContact,
    category: vehicle.category,
    cmr: transport?.cmr,
    cocNum: vehicle.cocNum,
    companyDE: settings.companyDE,
    companyGR: settings.companyGR,
    companyName: settings.companyName,
    condition: vehicle.condition,
    depDate: transport?.depDate,
    dest: transport?.dest,
    driver: transport?.driver,
    fuel: vehicle.fuel,
    make: vehicle.make,
    mileage: vehicle.mileage,
    model: vehicle.model,
    origin: transport?.origin,
    payload: vehicle.payload,
    plate: vehicle.plate,
    sellerContact: vehicle.purchase?.sellerContact,
    sellerCountry: vehicle.purchase?.sellerCountry,
    sellerName: vehicle.purchase?.sellerName,
    transportCost: transport?.cost,
    truckPlate: transport?.truckPlate,
    vin: vehicle.vin,
    year: vehicle.year,
  }
}

export async function GET(req: NextRequest) {
  const rateLimitError = applyRateLimit(req, 'cmr-report', { limit: 30, windowMs: 60_000 })
  if (rateLimitError) return rateLimitError

  const { searchParams } = new URL(req.url)
  const vehicleId = searchParams.get('vehicleId')
  const mode = searchParams.get('mode') === 'export' ? 'export' : 'import'

  if (vehicleId) {
    const result = await getAuthorizedVehicleReportData(vehicleId)
    if (!result.vehicle || !result.settings) {
      return jsonNoStore({ error: result.error }, { status: result.status })
    }

    return htmlNoStore(
      renderCmrHtml(buildPayloadFromVehicle(mode, result.vehicle, result.settings)),
      undefined,
      cmrContentSecurityPolicy(),
    )
  }

  const legacyPayload = decodeLegacyPayload(searchParams.get('data'))
  if (!legacyPayload) {
    return jsonNoStore({ error: 'Missing or invalid report payload' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return jsonNoStore({ error: 'Unauthorized' }, { status: 401 })
  }

  return htmlNoStore(renderCmrHtml(legacyPayload), undefined, cmrContentSecurityPolicy())
}
