'use client'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import type { TransportData } from '@/lib/types'

export default function TransportInTab({ id }: { id: string }) {
  const { vehicles, updateVehicle, settings } = useFleetStore()
  const lang = settings.lang
  const v = vehicles.find(x => x.id === id)
  if (!v) return null
  const tr = v.transportIn || {}
  const up = (patch: Partial<TransportData>) => updateVehicle(id, { transportIn: { ...tr, ...patch } })

  const printCMR = () => {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html><head><title>CMR - ${v.plate || ''}</title>
      <style>
        body{font-family:Arial,sans-serif;font-size:12px;padding:20px}
        h2{text-align:center;font-size:16px;margin-bottom:16px}
        table{width:100%;border-collapse:collapse;margin-bottom:12px}
        td,th{border:1px solid #000;padding:6px 8px;vertical-align:top}
        th{background:#eee;font-weight:bold;font-size:11px}
        .row2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        @media print{body{padding:10px}}
      </style></head><body>
      <h2>CMR INTERNATIONAL CONSIGNMENT NOTE</h2>
      <table>
        <tr><th colspan="4">1. SENDER</th></tr>
        <tr><td colspan="4" style="height:40px">${v.purchase?.sellerName || ''}<br>${tr.origin || ''}</td></tr>
        <tr><th colspan="4">2. CONSIGNEE</th></tr>
        <tr><td colspan="4" style="height:40px">${settings.org?.name || 'AutoFleet Pro'}<br>${tr.destination || ''}</td></tr>
        <tr><th>3. CMR No.</th><td>${tr.cmrNumber || ''}</td><th>4. Date</th><td>${tr.departureDate || ''}</td></tr>
        <tr><th>5. CARRIER</th><td colspan="3">${tr.carrier || ''}</td></tr>
        <tr><th>6. DRIVER</th><td>${tr.driver || ''}</td><th>7. TRUCK PLATE</th><td>${tr.truckPlate || ''} / ${tr.trailerPlate || ''}</td></tr>
        <tr><th>8. VEHICLE</th><td>${v.make || ''} ${v.model || ''} ${v.year || ''}</td><th>9. VIN</th><td>${v.vin || ''}</td></tr>
        <tr><th>10. PLATE</th><td>${v.plate || ''}</td><th>11. COLOR</th><td>${v.color || ''}</td></tr>
        <tr><th>12. KM</th><td>${v.mileage ? v.mileage.toLocaleString() + ' km' : ''}</td><th>13. COST</th><td>€${tr.cost || ''}</td></tr>
        <tr><th>14. ARRIVAL</th><td colspan="3">${tr.arrivalDate || ''}</td></tr>
        <tr><th colspan="4">15. NOTES</th></tr>
        <tr><td colspan="4" style="height:40px">${tr.notes || ''}</td></tr>
      </table>
      <div class="row2">
        <div><strong>SENDER SIGNATURE</strong><div style="border:1px solid #000;height:60px;margin-top:4px"></div></div>
        <div><strong>CARRIER SIGNATURE</strong><div style="border:1px solid #000;height:60px;margin-top:4px"></div></div>
      </div>
      <script>window.onload=()=>{window.print()}</script>
      </body></html>
    `)
    win.document.close()
  }

  return (
    <div>
      <div className="field-row">
        <div className="field-group">
          <label>{t(lang, 'field.cmr')} Number</label>
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
          <input value={tr.origin || ''} onChange={e => up({ origin: e.target.value })} placeholder="City, Country" />
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.destination')}</label>
          <input value={tr.destination || ''} onChange={e => up({ destination: e.target.value })} placeholder="City, Country" />
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
      <button className="btn btn-ghost" onClick={printCMR} style={{ marginTop: 8 }}>
        🖨️ Print CMR
      </button>
    </div>
  )
}
