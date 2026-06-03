'use client'
import React from 'react'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { VEHICLE_MAKES, VEHICLE_MODELS, COLORS } from '@/lib/vehicleData'
import { getVehicleSpecs } from '@/lib/vehicleSpecs'
import type { VehicleCategory, VehicleStatus, FuelType, GearType } from '@/lib/types'

const CATEGORIES: VehicleCategory[] = ['car','truck','van','bus','moto','construction']
const STATUSES: VehicleStatus[] = ['purchased','transit_in','stored','for_sale','sold','transit_out','delivered']
const FUELS: FuelType[] = ['diesel','petrol','hybrid','electric','lpg','cng','other']
const GEARS: GearType[] = ['manual','automatic','semi']

export default function InfoTab({ id }: { id: string }) {
  const { vehicles, updateVehicle, settings } = useFleetStore()
  const lang = settings.lang
  const v = vehicles.find(x => x.id === id)
  if (!v) return null

  const up = (patch: Parameters<typeof updateVehicle>[1]) => updateVehicle(id, patch)

  // Auto-fill specs when make+model+fuel are set
  const autoFill = (make: string, model: string, fuel: string) => {
    if (!make || !model || !fuel) return
    const specs = getVehicleSpecs(make, model, fuel)
    if (!specs) return
    const patch: Parameters<typeof updateVehicle>[1] = {}
    if (specs.engineCC && !v?.engineCC) patch.engineCC = specs.engineCC
    if (specs.powerKW && !v?.powerKW) patch.powerKW = specs.powerKW
    if (specs.doors && !v?.doors) patch.doors = specs.doors
    if (specs.seats && !v?.seats) patch.seats = specs.seats
    if (specs.gearType && !v?.gearType) patch.gearType = specs.gearType as typeof v.gearType
    if (Object.keys(patch).length > 0) updateVehicle(id, patch)
  }

  // VIN decode via NHTSA (free, no API key)
  const [vinLoading, setVinLoading] = React.useState(false)
  const [vinResult, setVinResult] = React.useState<string>('')
  const [scanLoading, setScanLoading] = React.useState(false)
  const [scanMsg, setScanMsg] = React.useState<string>('')

  const decodeVin = async (vin: string) => {
    if (!vin || vin.length < 11) return
    setVinLoading(true)
    setVinResult('')
    try {
      const res = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin.trim()}?format=json`
      )
      const data = await res.json()
      const get = (var_name: string) =>
        data.Results?.find((r: {Variable: string; Value: string}) =>
          r.Variable === var_name
        )?.Value || ''

      const make  = get('Make')
      const model = get('Model')
      const year  = parseInt(get('Model Year')) || undefined
      const fuel  = get('Fuel Type - Primary')
      const engine = parseFloat(get('Displacement (L)')) || undefined
      const doors = parseInt(get('Doors')) || undefined
      const seats = parseInt(get('Seat Rows')) || undefined

      const patch: Parameters<typeof updateVehicle>[1] = {}
      if (make  && !v?.make)  patch.make  = make.charAt(0)+make.slice(1).toLowerCase()
      if (model && !v?.model) patch.model = model
      if (year  && !v?.year)  patch.year  = year
      if (engine && !v?.engineCC) patch.engineCC = Math.round(engine * 1000)
      if (doors && !v?.doors) patch.doors = doors
      if (fuel) {
        const fuelLower = fuel.toLowerCase()
        if (!v?.fuelType) {
          if (fuelLower.includes('diesel')) patch.fuelType = 'diesel'
          else if (fuelLower.includes('electric')) patch.fuelType = 'electric'
          else if (fuelLower.includes('hybrid')) patch.fuelType = 'hybrid'
          else if (fuelLower.includes('gas') || fuelLower.includes('petrol')) patch.fuelType = 'petrol'
        }
      }

      if (Object.keys(patch).length > 0) {
        updateVehicle(id, patch)
        const filled = Object.keys(patch).join(', ')
        setVinResult(`✅ ${lang==='el'?'Βρέθηκε':lang==='it'?'Trovato':lang==='de'?'Gefunden':lang==='fr'?'Trouvé':'Found'}: ${make} ${model} ${year||''} — ${lang==='el'?'συμπληρώθηκαν':lang==='it'?'compilati':lang==='de'?'ausgefüllt':lang==='fr'?'remplis':'filled'}: ${filled}`)
      } else {
        setVinResult(`⚠️ ${lang==='el'?'Δεν βρέθηκαν νέα στοιχεία':lang==='it'?'Nessun dato nuovo trovato':lang==='de'?'Keine neuen Daten gefunden':lang==='fr'?'Aucune nouvelle donnée':'No new data found'}`)
      }
    } catch {
      setVinResult(`❌ ${lang==='el'?'Σφάλμα σύνδεσης':lang==='it'?'Errore di connessione':lang==='de'?'Verbindungsfehler':lang==='fr'?'Erreur de connexion':'Connection error'}`)
    }
    setVinLoading(false)
  }
  const makes = VEHICLE_MAKES[v.category || 'car'] || []
  const models = v.make ? (VEHICLE_MODELS[v.make] || []) : []

  return (
    <div>
      <div className="field-row">
        <div className="field-group">
          <label>{t(lang, 'field.category')}</label>
          <select value={v.category || 'car'} onChange={e => up({ category: e.target.value as VehicleCategory, make: '', model: '' })}>
            {CATEGORIES.map(c => <option key={c} value={c}>{t(lang, `cat.${c}`)}</option>)}
          </select>
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.status')}</label>
          <select value={v.status || 'purchased'} onChange={e => up({ status: e.target.value as VehicleStatus })}>
            {STATUSES.map(s => <option key={s} value={s}>{t(lang, `status.${s}`)}</option>)}
          </select>
        </div>
      </div>

      <div className="field-row">
        <div className="field-group">
          <label>{t(lang, 'field.make')}</label>
          <select value={v.make || ''} onChange={e => up({ make: e.target.value, model: '' })}>
            <option value="">—</option>
            {makes.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.model')}</label>
          {models.length > 0 ? (
            <select value={v.model || ''} onChange={e => { up({ model: e.target.value }); autoFill(v?.make||'', e.target.value, v?.fuelType||'') }}>
              <option value="">—</option>
              {models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          ) : (
            <input value={v.model || ''} onChange={e => { up({ model: e.target.value }); autoFill(v?.make||'', e.target.value, v?.fuelType||'') }} placeholder="Model" />
          )}
        </div>
      </div>

      <div className="field-row">
        <div className="field-group">
          <label>{t(lang, 'field.year')}</label>
          <input type="number" value={v.year || ''} onChange={e => up({ year: +e.target.value })} placeholder="2020" />
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.mileage')} (km)</label>
          <input type="number" value={v.mileage || ''} onChange={e => up({ mileage: +e.target.value })} placeholder="0" />
        </div>
      </div>

      <div className="field-row">
        <div className="field-group">
          <label>{t(lang, 'field.vin')}</label>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <input 
              value={v.vin || ''} 
              onChange={e => { up({ vin: e.target.value.toUpperCase() }); setVinResult('') }} 
              placeholder="WBA3B9C50FK123456" 
              maxLength={17}
              style={{ flex:1, fontFamily:'monospace', letterSpacing:'0.05em' }}
            />
            <button
              className="btn btn-ghost"
              style={{ fontSize:12, whiteSpace:'nowrap', flexShrink:0 }}
              onClick={() => decodeVin(v?.vin || '')}
              disabled={vinLoading || !v?.vin || v.vin.length < 11}
            >
              {vinLoading ? '⏳' : '🔍'} VIN
            </button>
          </div>
          {vinResult && (
            <div style={{ fontSize:12, marginTop:4, color: vinResult.startsWith('✅') ? 'var(--success)' : vinResult.startsWith('⚠️') ? 'var(--warning)' : 'var(--danger)' }}>
              {vinResult}
            </div>
          )}
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.plate')}</label>
          <input value={v.plate || ''} onChange={e => up({ plate: e.target.value.toUpperCase() })} placeholder="AB-123" />
        </div>
      </div>

      <div className="field-row">
        <div className="field-group">
          <label>{t(lang, 'field.fuel')}</label>
          <select value={v.fuelType || ''} onChange={e => { up({ fuelType: e.target.value as FuelType }); autoFill(v?.make||'', v?.model||'', e.target.value) }}>
            <option value="">—</option>
            {FUELS.map(f => <option key={f} value={f}>{t(lang, `fuel.${f}`)}</option>)}
          </select>
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.gear')}</label>
          <select value={v.gearType || ''} onChange={e => up({ gearType: e.target.value as GearType })}>
            <option value="">—</option>
            {GEARS.map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div className="field-row">
        <div className="field-group">
          <label>{t(lang, 'field.engineCC')}</label>
          <input type="number" value={v.engineCC || ''} onChange={e => up({ engineCC: +e.target.value })} placeholder="2000" />
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.powerKW')}</label>
          <input type="number" value={v.powerKW || ''} onChange={e => up({ powerKW: +e.target.value })} placeholder="110" />
        </div>
      </div>

      <div className="field-row">
        <div className="field-group">
          <label>{t(lang, 'field.color')}</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{
              width: 20, height: 20, borderRadius: 4, border: '1px solid var(--border)', flexShrink: 0,
              background: COLORS.find(c => c.code === v.color)?.hex || '#6b7280',
            }} />
            <select value={v.color || ''} onChange={e => up({ color: e.target.value })} style={{ flex: 1 }}>
              <option value="">—</option>
              {COLORS.map(c => <option key={c.code} value={c.code}>{(c as Record<string, string>)[lang] || c.en}</option>)}
            </select>
          </div>
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.seats')}</label>
          <input type="number" value={v.seats || ''} onChange={e => up({ seats: +e.target.value })} placeholder="5" />
        </div>
      </div>

      {(v.category === 'truck' || v.category === 'van' || v.category === 'construction') && (
        <div className="field-row">
          <div className="field-group">
            <label>{t(lang, 'field.weightKg')}</label>
            <input type="number" value={v.weightKg || ''} onChange={e => up({ weightKg: +e.target.value })} placeholder="3500" />
          </div>
          <div className="field-group">
            <label>{t(lang, 'field.payloadKg')}</label>
            <input type="number" value={v.payloadKg || ''} onChange={e => up({ payloadKg: +e.target.value })} placeholder="1000" />
          </div>
        </div>
      )}

      {/* Photo upload */}
      <div className="field-group" style={{ marginTop: 8 }}>
        <label>{t(lang, 'misc.noPhoto')} / Photo</label>
        {v.photo ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img src={v.photo} alt="vehicle" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, border: '1px solid var(--border)' }} />
            <button onClick={() => up({ photo: undefined })}
              style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: 4, color: 'white', cursor: 'pointer', padding: '2px 6px', fontSize: 12 }}>
              ✕
            </button>
          </div>
        ) : (
          <label style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px dashed var(--border)', borderRadius: 8, padding: 24,
            cursor: 'pointer', color: 'var(--text2)', fontSize: 14,
          }}>
            📷 {t(lang, 'misc.clickToUpload')}
            <input type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = ev => up({ photo: ev.target?.result as string })
                reader.readAsDataURL(file)
              }} />
          </label>
        )}
      </div>

      <div className="field-group" style={{ marginTop: 8 }}>
        <label>{t(lang, 'field.notes')}</label>
        <textarea value={v.notes || ''} onChange={e => up({ notes: e.target.value })} rows={3} placeholder="..." />
      </div>
    </div>
  )
}


// VIN Photo Scan component - separate file to avoid turbopack issues
// This is added inline but kept simple for compatibility
