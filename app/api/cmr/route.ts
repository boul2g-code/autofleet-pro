import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { vehicle, mode } = await req.json()
    if (!vehicle) return NextResponse.json({ error: 'No vehicle' }, { status: 400 })

    const transport = mode === 'import' ? vehicle.transportIn : vehicle.transportOut

    const html = `<!DOCTYPE html>
<html><head><title>CMR - ${vehicle.plate || ''}</title>
<style>
body{font-family:Arial,sans-serif;font-size:12px;padding:20px}
h2{text-align:center;font-size:16px}
table{width:100%;border-collapse:collapse;margin-bottom:12px}
td,th{border:1px solid #000;padding:6px 8px;vertical-align:top}
th{background:#eee;font-weight:bold;font-size:11px}
.sig{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
</style></head><body>
<h2>CMR INTERNATIONAL CONSIGNMENT NOTE${mode === 'export' ? ' — EXPORT' : ''}</h2>
<table>
  <tr><th colspan="4">1. SENDER</th></tr>
  <tr><td colspan="4" style="height:40px">${mode === 'import' ? (vehicle.purchase?.sellerName || '') : ''}<br>${transport?.origin || ''}</td></tr>
  <tr><th colspan="4">2. CONSIGNEE</th></tr>
  <tr><td colspan="4" style="height:40px">${mode === 'export' ? (vehicle.sale?.buyerName || '') : ''}<br>${transport?.destination || ''}</td></tr>
  <tr><th>CMR No.</th><td>${transport?.cmrNumber || ''}</td><th>Date</th><td>${transport?.departureDate || ''}</td></tr>
  <tr><th>CARRIER</th><td colspan="3">${transport?.carrier || ''}</td></tr>
  <tr><th>DRIVER</th><td>${transport?.driver || ''}</td><th>TRUCK PLATE</th><td>${transport?.truckPlate || ''} / ${transport?.trailerPlate || ''}</td></tr>
  <tr><th>VEHICLE</th><td>${vehicle.make || ''} ${vehicle.model || ''} ${vehicle.year || ''}</td><th>VIN</th><td>${vehicle.vin || ''}</td></tr>
  <tr><th>PLATE</th><td>${vehicle.plate || ''}</td><th>COST</th><td>€${transport?.cost || ''}</td></tr>
  <tr><th>ARRIVAL</th><td colspan="3">${transport?.arrivalDate || ''}</td></tr>
  <tr><th colspan="4">NOTES</th></tr>
  <tr><td colspan="4" style="height:40px">${transport?.notes || ''}</td></tr>
</table>
<div class="sig">
  <div><strong>SENDER SIGNATURE</strong><div style="border:1px solid #000;height:60px;margin-top:4px"></div></div>
  <div><strong>CARRIER SIGNATURE</strong><div style="border:1px solid #000;height:60px;margin-top:4px"></div></div>
</div>
<script>window.onload=()=>window.print()</script>
</body></html>`

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' }
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
