import { createHash } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { escapeHtml, escapeHtmlWithBreaks, sanitizeImageSrc } from '@/lib/html'
import { applyRateLimit, htmlNoStore, jsonNoStore, reportHtmlContentSecurityPolicy } from '@/lib/security'
import { getAuthorizedVehicleReportData } from '@/lib/server/reportData'
import { createClient } from '@/lib/supabase/server'

interface LegacyFlyerPayload {
  businessId?: string
  category?: string
  cocNum?: string
  color?: string
  companyDE?: string
  companyGR?: string
  companyName?: string
  condition?: string
  currency?: string
  engine?: string
  firstReg?: string
  fuel?: string
  gearbox?: string
  make?: string
  mileage?: string
  model?: string
  notes?: string
  payload?: string
  photo?: string
  plate?: string
  regCountry?: string
  salePrice?: string
  seats?: string
  vin?: string
  year?: string
}

const FLYER_PRINT_SCRIPT = "window.addEventListener('load', () => { setTimeout(() => window.print(), 500) })"

function flyerContentSecurityPolicy(): string {
  const scriptHash = createHash('sha256').update(FLYER_PRINT_SCRIPT).digest('base64')
  return reportHtmlContentSecurityPolicy({ scriptHashes: [scriptHash] })
}

function decodeLegacyPayload(raw: string | null): LegacyFlyerPayload | null {
  if (!raw) return null
  if (raw.length > 24 * 1024) return null

  try {
    return JSON.parse(Buffer.from(raw, 'base64url').toString('utf-8')) as LegacyFlyerPayload
  } catch {
    try {
      return JSON.parse(Buffer.from(decodeURIComponent(raw), 'base64').toString('utf-8')) as LegacyFlyerPayload
    } catch {
      return null
    }
  }
}

function formatNumber(value: string | undefined, suffix = ''): string {
  if (!value) return ''

  const parsed = Number.parseInt(value, 10)
  if (Number.isNaN(parsed)) return escapeHtml(value)

  return `${parsed.toLocaleString('de-DE')}${suffix}`
}

function formatPrice(amount: string | undefined, currency = 'EUR'): string {
  if (!amount) return ''

  const parsed = Number.parseFloat(amount)
  if (Number.isNaN(parsed)) return ''

  return new Intl.NumberFormat('de-DE', { style: 'currency', currency }).format(parsed)
}

function renderFlyerHtml(payload: LegacyFlyerPayload) {
  const photoSrc = sanitizeImageSrc(payload.photo)
  const price = formatPrice(payload.salePrice, payload.currency || 'EUR')
  const year = escapeHtml(payload.year)
  const make = escapeHtml(payload.make)
  const model = escapeHtml(payload.model)
  const category = escapeHtml((payload.category || '').toUpperCase())
  const color = escapeHtml(payload.color)
  const fuel = escapeHtml(payload.fuel)
  const gearbox = escapeHtml(payload.gearbox)
  const engine = escapeHtml(payload.engine)
  const firstReg = escapeHtml(payload.firstReg)
  const cocNum = escapeHtml(payload.cocNum)
  const vin = escapeHtml(payload.vin)
  const plate = escapeHtml(payload.plate)
  const condition = escapeHtml((payload.condition || '').toUpperCase())
  const notes = escapeHtmlWithBreaks(payload.notes)
  const companyName = escapeHtml(payload.companyName || 'AutoFleet Pro')
  const companyDE = escapeHtml(payload.companyDE)
  const companyGR = escapeHtml(payload.companyGR)
  const businessId = escapeHtml(payload.businessId)
  const mileage = formatNumber(payload.mileage)
  const payloadKg = formatNumber(payload.payload)
  const seats = escapeHtml(payload.seats)
  const regCountry = escapeHtml(payload.regCountry)

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${make} ${model} - ${companyName}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'IBM Plex Sans', sans-serif; background: #f0f0f0; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
  .flyer { width: 210mm; min-height: 297mm; background: #fff; position: relative; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
  .header { background: #0f0f18; color: #fff; padding: 28px 32px 24px; position: relative; }
  .header::after { content: ''; position: absolute; bottom: -20px; left: 0; right: 0; height: 40px; background: #0f0f18; clip-path: ellipse(55% 40px at 50% 0); }
  .company { font-size: 11px; color: #f0a500; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 6px; }
  .vehicle-title { font-size: 32px; font-weight: 700; letter-spacing: -1px; margin-bottom: 4px; }
  .vehicle-sub { font-size: 14px; color: #aaa; }
  .price-badge { position: absolute; top: 28px; right: 32px; background: #f0a500; color: #000; padding: 12px 20px; border-radius: 12px; text-align: center; }
  .price-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
  .price-value { font-size: 24px; font-weight: 700; font-family: 'IBM Plex Mono'; display: block; margin-top: 2px; }
  .photo-section { height: 220px; background: linear-gradient(135deg, #1e1e2a 0%, #2a2a3e 100%); display: flex; align-items: center; justify-content: center; margin-top: 20px; position: relative; overflow: hidden; }
  .photo-section img { width: 100%; height: 100%; object-fit: cover; }
  .photo-placeholder { font-size: 80px; opacity: 0.2; }
  .plate-overlay { position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.8); color: #fff; padding: 6px 14px; border-radius: 6px; font-family: 'IBM Plex Mono'; font-size: 16px; font-weight: 600; letter-spacing: 2px; border: 1px solid rgba(255,255,255,0.2); }
  .specs-section { padding: 32px 32px 20px; }
  .specs-title { font-size: 11px; color: #f0a500; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 16px; font-weight: 700; }
  .specs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .spec-item { background: #f8f8f8; border-radius: 10px; padding: 14px; text-align: center; border: 1px solid #eee; }
  .spec-icon { font-size: 22px; margin-bottom: 6px; }
  .spec-value { font-size: 13px; font-weight: 700; color: #0f0f18; }
  .spec-label { font-size: 10px; color: #888; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
  .details-section { padding: 0 32px 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .detail-label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .detail-value { font-size: 13px; font-weight: 600; color: #0f0f18; font-family: 'IBM Plex Mono'; }
  .desc-section { padding: 0 32px 24px; }
  .desc-text { font-size: 12px; color: #555; line-height: 1.7; }
  .footer { background: #0f0f18; color: #fff; padding: 20px 32px; display: flex; justify-content: space-between; align-items: center; position: absolute; bottom: 0; left: 0; right: 0; }
  .footer-name { font-size: 14px; font-weight: 700; color: #f0a500; }
  .footer-address { font-size: 10px; color: #888; margin-top: 3px; }
  .footer-id { font-family: 'IBM Plex Mono'; font-size: 11px; color: #555; }
  .footer-badge { background: #f0a500; color: #000; padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: 700; letter-spacing: 1px; display: inline-block; margin-top: 4px; }
  .accent-bar { height: 4px; background: linear-gradient(90deg, #f0a500, #e06c00, #f0a500); }
  @media print { body { background: none; padding: 0; } .flyer { box-shadow: none; width: 100%; } }
</style>
</head>
<body>
<div class="flyer">
  <div class="accent-bar"></div>
  <div class="header">
    <div class="company">${companyName}</div>
    <div class="vehicle-title">${make} ${model}</div>
    <div class="vehicle-sub">${category}${year ? ` · ${year}` : ''}${regCountry ? ` · ${regCountry}` : ''}</div>
    ${price ? `<div class="price-badge"><div class="price-label">Price</div><span class="price-value">${escapeHtml(price)}</span></div>` : ''}
  </div>

  <div class="photo-section">
    ${photoSrc
      ? `<img src="${photoSrc}" alt="${make} ${model}">`
      : `<div class="photo-placeholder">${payload.category === 'truck' ? '🚛' : payload.category === 'van' ? '🚐' : payload.category === 'moto' ? '🏍️' : payload.category === 'bus' ? '🚌' : payload.category === 'construction' ? '🚜' : '🚗'}</div>`
    }
    ${plate ? `<div class="plate-overlay">${plate}</div>` : ''}
  </div>

  <div class="specs-section">
    <div class="specs-title">Specifications</div>
    <div class="specs-grid">
      ${year ? `<div class="spec-item"><div class="spec-icon">📅</div><div class="spec-value">${year}</div><div class="spec-label">Year</div></div>` : ''}
      ${mileage ? `<div class="spec-item"><div class="spec-icon">📍</div><div class="spec-value">${escapeHtml(mileage)}</div><div class="spec-label">km</div></div>` : ''}
      ${fuel ? `<div class="spec-item"><div class="spec-icon">⛽</div><div class="spec-value">${fuel}</div><div class="spec-label">Fuel</div></div>` : ''}
      ${gearbox ? `<div class="spec-item"><div class="spec-icon">⚙️</div><div class="spec-value">${gearbox}</div><div class="spec-label">Gearbox</div></div>` : ''}
      ${engine ? `<div class="spec-item"><div class="spec-icon">🔧</div><div class="spec-value">${engine}</div><div class="spec-label">cc</div></div>` : ''}
      ${color ? `<div class="spec-item"><div class="spec-icon">🎨</div><div class="spec-value">${color}</div><div class="spec-label">Color</div></div>` : ''}
      ${payloadKg ? `<div class="spec-item"><div class="spec-icon">🏋️</div><div class="spec-value">${escapeHtml(payloadKg)}</div><div class="spec-label">kg payload</div></div>` : ''}
      ${seats ? `<div class="spec-item"><div class="spec-icon">💺</div><div class="spec-value">${seats}</div><div class="spec-label">Seats</div></div>` : ''}
      ${firstReg ? `<div class="spec-item"><div class="spec-icon">📋</div><div class="spec-value">${firstReg}</div><div class="spec-label">1st Reg.</div></div>` : ''}
      ${cocNum ? `<div class="spec-item"><div class="spec-icon">📄</div><div class="spec-value">${cocNum}</div><div class="spec-label">COC</div></div>` : ''}
    </div>
  </div>

  ${(vin || condition) ? `
  <div class="details-section">
    ${vin ? `<div><div class="detail-label">VIN / Chassis Number</div><div class="detail-value">${vin}</div></div>` : ''}
    ${condition ? `<div><div class="detail-label">Condition</div><div class="detail-value">${condition}</div></div>` : ''}
  </div>` : ''}

  ${notes ? `
  <div class="desc-section">
    <div class="specs-title">Notes</div>
    <div class="desc-text">${notes}</div>
  </div>` : ''}

  <div class="footer">
    <div>
      <div class="footer-name">${companyName}</div>
      <div class="footer-address">${companyDE}</div>
      <div class="footer-address">${companyGR}</div>
    </div>
    <div style="text-align: right;">
      <div class="footer-id">Ref: ${businessId}</div>
      <div class="footer-badge">AutoFleet Pro</div>
    </div>
  </div>
</div>

<script>${FLYER_PRINT_SCRIPT}</script>
</body>
</html>`
}

export async function GET(req: NextRequest) {
  const rateLimitError = applyRateLimit(req, 'flyer-report', { limit: 30, windowMs: 60_000 })
  if (rateLimitError) return rateLimitError

  const { searchParams } = new URL(req.url)
  const vehicleId = searchParams.get('vehicleId')

  if (vehicleId) {
    const result = await getAuthorizedVehicleReportData(vehicleId)
    if (!result.vehicle || !result.settings) {
      return jsonNoStore({ error: result.error }, { status: result.status })
    }

    const payload: LegacyFlyerPayload = {
      businessId: result.vehicle.businessId,
      category: result.vehicle.category,
      cocNum: result.vehicle.cocNum,
      color: result.vehicle.color,
      companyDE: result.settings.companyDE,
      companyGR: result.settings.companyGR,
      companyName: result.settings.companyName,
      condition: result.vehicle.condition,
      currency: result.vehicle.sale?.currency || result.vehicle.purchase?.currency || result.settings.defaultCurrency,
      engine: result.vehicle.engine,
      firstReg: result.vehicle.firstReg,
      fuel: result.vehicle.fuel,
      gearbox: result.vehicle.gearbox,
      make: result.vehicle.make,
      mileage: result.vehicle.mileage,
      model: result.vehicle.model,
      notes: result.vehicle.notes,
      payload: result.vehicle.payload,
      photo: result.vehicle.photo,
      plate: result.vehicle.plate,
      regCountry: result.vehicle.regCountry,
      salePrice: result.vehicle.sale?.priceGross || result.vehicle.purchase?.priceGross,
      seats: result.vehicle.seats,
      vin: result.vehicle.vin,
      year: result.vehicle.year,
    }

    return htmlNoStore(renderFlyerHtml(payload), undefined, flyerContentSecurityPolicy())
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

  return htmlNoStore(renderFlyerHtml(legacyPayload), undefined, flyerContentSecurityPolicy())
}
