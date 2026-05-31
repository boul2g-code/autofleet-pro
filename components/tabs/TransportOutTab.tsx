'use client'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import type { TransportOutData } from '@/lib/types'

export default function TransportOutTab({ id }: { id: string }) {
  const { vehicles, updateVehicle, settings } = useFleetStore()
  const lang = settings.lang
  const v = vehicles.find(x => x.id === id)
  if (!v) return null
  const tr = v.transportOut || {}
  const up = (patch: Partial<TransportOutData>) => updateVehicle(id, { transportOut: { ...tr, ...patch } })

  const printCMR = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>CMR Export - ${v.plate || ''}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;font-size:11px;padding:15px;color:#000}
  h2{text-align:center;font-size:14px;font-weight:bold;margin-bottom:4px;border-bottom:2px solid #000;padding-bottom:4px}
  .subtitle{text-align:center;font-size:10px;margin-bottom:12px}
  table{width:100%;border-collapse:collapse;margin-bottom:8px}
  td,th{border:1px solid #000;padding:5px 7px;vertical-align:top;font-size:10px}
  th{background:#f0f0f0;font-weight:bold;font-size:9px;text-transform:uppercase;width:35%}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .section-title{background:#ddd;font-weight:bold;padding:4px 7px;font-size:10px;border:1px solid #000;border-bottom:none}
  .sig-box{height:60px;border:1px solid #000;margin-top:4px}
  @media print{body{padding:8px}@page{margin:1cm}}
</style></head><body>
<h2>CMR — INTERNATIONAL CONSIGNMENT NOTE (EXPORT)</h2>
<p class="subtitle">Convention relative au contrat de transport international de marchandises par route</p>

<div class="grid2">
<table>
  <tr><th>1. Sender / Expéditeur</th></tr>
  <tr><td style="height:50px">${settings.org?.name || 'AutoFleet Pro'}<br>${tr.origin || ''}</td></tr>
</table>
<table>
  <tr><th>2. Consignee / Destinataire</th></tr>
  <tr><td style="height:50px">${v.sale?.buyerName || ''}<br>${tr.destination || ''}</td></tr>
</table>
</div>

<table>
  <tr><th>3. CMR Number</th><td>${tr.cmrNumber || ''}</td><th>4. Date</th><td>${tr.departureDate || ''}</td></tr>
</table>
<table>
  <tr><th>5. Carrier / Transporteur</th><td colspan="3">${tr.carrier || ''}</td></tr>
  <tr><th>6. Driver / Conducteur</th><td>${tr.driver || ''}</td><th>Truck plate</th><td>${tr.truckPlate || ''} ${tr.trailerPlate ? '/ ' + tr.trailerPlate : ''}</td></tr>
</table>
<table>
  <tr><th>7. Goods / Marchandise</th><td colspan="3">
    <strong>${v.make || ''} ${v.model || ''} ${v.year || ''}</strong><br>
    VIN: ${v.vin || '—'} | Plate: ${v.plate || '—'} | Color: ${v.color || '—'}<br>
    Mileage: ${v.mileage ? v.mileage.toLocaleString() + ' km' : '—'}
  </td></tr>
  <tr><th>8. Transport cost</th><td>EUR ${tr.cost || '—'}</td><th>9. Arrival</th><td>${tr.arrivalDate || ''}</td></tr>
</table>
${tr.notes ? `<table><tr><th>10. Notes</th><td>${tr.notes}</td></tr></table>` : ''}

<div class="grid2" style="margin-top:16px">
  <div><div class="section-title">Sender / Expéditeur</div><div class="sig-box"></div><p style="font-size:9px;margin-top:3px">Place & date: _______________</p></div>
  <div><div class="section-title">Carrier / Transporteur</div><div class="sig-box"></div><p style="font-size:9px;margin-top:3px">Place & date: _______________</p></div>
</div>
<div style="margin-top:8px"><div class="section-title">Consignee / Destinataire</div><div class="sig-box"></div><p style="font-size:9px;margin-top:3px">Place, date & signature: _______________</p></div>

<script>window.onload=function(){window.print()}</script>
</body></html>`

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const win = window.open(url, '_blank')
    if (!win) {
      const a = document.createElement('a')
      a.href = url
      a.download = `CMR_Export_${v.plate || id}.html`
      a.click()
    }
    setTimeout(() => URL.revokeObjectURL(url), 10000)
  }

  return (
    <div>
      <div className="field-row">
        <div className="field-group">
          <label>CMR Number</label>
          <input value={tr.cmrNumber || ''} onChange={e => up({ cmrNumber: e.target.value })} placeholder="CMR-001" />
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.departure')}</label>
          <input type="date" value={tr.departureDate || ''} onChange={e => up({ departureDate: e.target.value })} />
        </div>
      </div>
      <div className="field-row">
        <div className="field-group">
          <label>{t(lang, 'field.carrier')}</label>
          <input value={tr.carrier || ''} onChange={e => up({ carrier: e.target.value })} />
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.driver')}</label>
          <input value={tr.driver || ''} onChange={e => up({ driver: e.target.value })} />
        </div>
      </div>
      <div className="field-row">
        <div className="field-group">
          <label>{t(lang, 'field.truckPlate')}</label>
          <input value={tr.truckPlate || ''} onChange={e => up({ truckPlate: e.target.value.toUpperCase() })} />
        </div>
        <div className="field-group">
          <label>Trailer Plate</label>
          <input value={tr.trailerPlate || ''} onChange={e => up({ trailerPlate: e.target.value.toUpperCase() })} />
        </div>
      </div>
      <div className="field-row">
        <div className="field-group">
          <label>{t(lang, 'field.origin')}</label>
          <input value={tr.origin || ''} onChange={e => up({ origin: e.target.value })} />
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.destination')}</label>
          <input value={tr.destination || ''} onChange={e => up({ destination: e.target.value })} />
        </div>
      </div>
      <div className="field-row">
        <div className="field-group">
          <label>{t(lang, 'field.arrival')}</label>
          <input type="date" value={tr.arrivalDate || ''} onChange={e => up({ arrivalDate: e.target.value })} />
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.cost')} (€)</label>
          <input type="number" value={tr.cost || ''} onChange={e => up({ cost: +e.target.value })} placeholder="0" />
        </div>
      </div>
      <div className="field-group">
        <label>{t(lang, 'field.notes')}</label>
        <textarea value={tr.notes || ''} onChange={e => up({ notes: e.target.value })} rows={3} />
      </div>
      <button className="btn btn-primary" onClick={printCMR} style={{ marginTop: 8 }}>
        🖨️ Print CMR Export
      </button>
    </div>
  )
}
