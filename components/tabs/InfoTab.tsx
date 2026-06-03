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

  // VIN photo scan: Claude Vision first, Tesseract fallback
  const [scanLoading, setScanLoading] = React.useState(false)
  const [scanResult, setScanResult] = React.useState<string>('')
  const cameraRef = React.useRef<HTMLInputElement>(null)

  const extractVinFromText = (text: string): string | null => {
    // VIN is 17 chars, only A-H,J-N,P,R-Z,0-9 (no I,O,Q)
    const match = text.match(/\b([A-HJ-NPR-Z0-9]{17})\b/i)
    return match ? match[1].toUpperCase() : null
  }

  const scanVinPhoto = async (file: File) => {
    setScanLoading(true)
    setScanResult('')
    let vinFound: string | null = null

    // --- Step 1: Claude Vision ---
    try {
      const apiKey = settings?.anthropicKey
      if (apiKey) {
        const b64 = await new Promise<string>((res, rej) => {
          const r = new FileReader()
          r.onload = ev => res((ev.target?.result as string).split(',')[1])
          r.onerror = rej
          r.readAsDataURL(file)
        })
        const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/webp'
        const resp = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type':'application/json', 'x-api-key': apiKey, 'anthropic-version':'2023-06-01' },
          body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 100,
            messages: [{
              role: 'user',
              content: [
                { type:'image', source:{ type:'base64', media_type: mediaType, data: b64 } },
                { type:'text', text:'Extract ONLY the VIN number from this image. Reply with just the 17-character VIN, nothing else. If no VIN visible, reply: NOT_FOUND' }
              ]
            }]
          })
        })
        const data = await resp.json()
        const text = data?.content?.[0]?.text?.trim() || ''
        if (text && text !== 'NOT_FOUND') {
          vinFound = extractVinFromText(text) || (text.length === 17 ? text.toUpperCase() : null)
        }
      }
    } catch { /* fallthrough to Tesseract */ }

    // --- Step 2: Tesseract fallback ---
    if (!vinFound) {
      try {
        setScanResult(lang==='el'?'🔄 Tesseract OCR...':lang==='it'?'🔄 OCR in corso...':lang==='de'?'🔄 OCR läuft...':lang==='fr'?'🔄 OCR en cours...':'🔄 OCR running...')
        const Tesseract = (await import('tesseract.js')).default
        const { data: { text } } = await Tesseract.recognize(file, 'eng')
        vinFound = extractVinFromText(text)
      } catch { /* both failed */ }
    }

    if (vinFound) {
      up({ vin: vinFound })
      setScanResult(`✅ VIN: ${vinFound}`)
      // Auto-trigger NHTSA decode
      setTimeout(() => decodeVin(vinFound!), 300)
    } else {
      setScanResult(lang==='el'?'⚠️ Δεν βρέθηκε VIN — δοκίμασε πιο κοντά':
                   lang==='it'?'⚠️ VIN non trovato — riprova più vicino':
                   lang==='de'?'⚠️ VIN nicht gefunden — näher versuchen':
                   lang==='fr'?'⚠️ VIN non trouvé — essayez plus près':
                   '⚠️ VIN not found — try closer')
    }
    setScanLoading(false)
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
          {/* Camera / Upload button */}
          <label
            className="btn btn-ghost"
            style={{ fontSize:12, whiteSpace:'nowrap', flexShrink:0, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:4 }}
            title={lang==='el'?'Φωτογράφισε το VIN':lang==='it'?'Fotografa il VIN':lang==='de'?'VIN fotografieren':lang==='fr'?'Photographier le VIN':'Scan VIN photo'}
          >
            {scanLoading ? '⏳' : '📷'}
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display:'none' }}
              onChange={e => { const f=e.target.files?.[0]; if(f) scanVinPhoto(f) }}
            />
          </label>
          </div>
          {(vinResult||scanResult) && (() => {
            const msg = vinResult || scanResult
            const col = msg.startsWith('✅') ? 'var(--success)' : msg.startsWith('⚠️') ? 'var(--warning)' : 'var(--danger)'
            return <div style={{ fontSize:12, marginTop:4, color: col }}>{msg}</div>
          })()}
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
