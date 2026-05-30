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
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html><head><title>CMR Export - ${v.plate || ''}</title>
      <style>body{font-family:Arial,sans-serif;font-size:12px;padding:20px}h2{text-align:center}table{width:100%;border-collapse:collapse}td,th{border:1px solid #000;padding:6px 8px}th{background:#eee;font-size:11px}.sig{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}</style>
      </head><body>
      <h2>CMR INTERNATIONAL CONSIGNMENT NOTE — EXPORT</h2>
      <table>
        <tr><th colspan="4">1. SENDER</th></tr>
        <tr><td colspan="4" style="height:40px">${settings.org?.name || 'AutoFleet Pro'}<br>${tr.origin || ''}</td></tr>
        <tr><th colspan="4">2. CONSIGNEE</th></tr>
        <tr><td colspan="4" style="height:40px">${v.sale?.buyerName || ''}<br>${tr.destination || ''}</td></tr>
        <tr><th>CMR No.</th><td>${tr.cmrNumber || ''}</td><th>Date</th><td>${tr.departureDate || ''}</td></tr>
        <tr><th>CARRIER</th><td colspan="3">${tr.carrier || ''}</td></tr>
        <tr><th>DRIVER</th><td>${tr.driver || ''}</td><th>TRUCK PLATE</th><td>${tr.truckPlate || ''}</td></tr>
        <tr><th>VEHICLE</th><td>${v.make || ''} ${v.model || ''} ${v.year || ''}</td><th>VIN</th><td>${v.vin || ''}</td></tr>
        <tr><th>PLATE</th><td>${v.plate || ''}</td><th>COST</th><td>€${tr.cost || ''}</td></tr>
        <tr><th>ARRIVAL</th><td colspan="3">${tr.arrivalDate || ''}</td></tr>
        <tr><th colspan="4">NOTES</th></tr>
        <tr><td colspan="4" style="height:40px">${tr.notes || ''}</td></tr>
      </table>
      <div class="sig">
        <div><strong>SENDER</strong><div style="border:1px solid #000;height:60px;margin-top:4px"></div></div>
        <div><strong>CARRIER</strong><div style="border:1px solid #000;height:60px;margin-top:4px"></div></div>
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
      <button className="btn btn-ghost" onClick={printCMR} style={{ marginTop: 8 }}>
        🖨️ Print CMR Export
      </button>
    </div>
  )
}
