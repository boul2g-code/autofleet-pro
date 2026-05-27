'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { FormInput, FormSelect, FormTextarea, FormGrid, FullSpan } from '@/components/ui/FormField'
import { FUEL_TYPES, GEAR_TYPES, COND_TYPES, ALL_STATUSES } from '@/lib/utils'
import { prepareVehiclePhoto, validateVehiclePhotoUpload } from '@/lib/uploads'
import { getMakesList, getModelsList, getAutoPayload } from '@/lib/vehicleData'
import { VEHICLE_COLORS } from '@/lib/colors'
import type { Vehicle } from '@/lib/types'

interface Props { vehicle: Vehicle }

const ALL_CAT_TYPES = ['car','truck','van','bus','moto','construction'] as const

export default function InfoTab({ vehicle: v }: Props) {
  const { lang, updateVehicle, showToast } = useFleetStore()
  const photoRef = useRef<HTMLInputElement>(null)
  const [makeSearch, setMakeSearch] = useState('')
  const [modelSearch, setModelSearch] = useState('')
  const [showMakeList, setShowMakeList] = useState(false)
  const [showModelList, setShowModelList] = useState(false)

  const T = (k: string) => t(lang, `vehicle.${k}`)
  const up = (field: keyof Vehicle, val: string) =>
    updateVehicle(v.id, { [field]: val } as Partial<Vehicle>)

  const handlePhotoUpload = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return

    const error = validateVehiclePhotoUpload(file)
    if (error) {
      showToast(error, 'error')
      if (photoRef.current) photoRef.current.value = ''
      return
    }

    try {
      const preparedPhoto = await prepareVehiclePhoto(file)
      await updateVehicle(v.id, { photo: preparedPhoto })
      showToast('Photo saved ✓')
    } catch {
      showToast('Could not process photo.', 'error')
    } finally {
      if (photoRef.current) photoRef.current.value = ''
    }
  }

  const handleMakeSelect = (make: string) => {
    updateVehicle(v.id, { make, model: '' })
    setMakeSearch(make)
    setShowMakeList(false)
  }

  const handleModelSelect = (model: string) => {
    const payload = getAutoPayload(v.category || 'car', v.make || '', model)
    const updates: Partial<Vehicle> = { model }
    if (payload) updates.payload = payload
    updateVehicle(v.id, updates)
    setModelSearch(model)
    setShowModelList(false)
    if (payload) showToast(`Auto-filled payload: ${payload} kg`)
  }

  const makes = getMakesList(v.category || 'car')
  const models = getModelsList(v.category || 'car', v.make || '')
  const filteredMakes = makes.filter(m => m.toLowerCase().includes(makeSearch.toLowerCase()))
  const filteredModels = models.filter(m => m.toLowerCase().includes(modelSearch.toLowerCase()))

  const save = () => showToast(t(lang, 'msg.saved'))

  const catOptions = ALL_CAT_TYPES.map(c => ({
    value: c,
    label: c === 'construction'
      ? (lang === 'el' ? 'Μηχανήματα Έργων' : lang === 'de' ? 'Baumaschinen' : 'Construction Equipment')
      : t(lang, `cat.${c}`)
  }))

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200,
    background: 'var(--card)', border: '1px solid var(--accent)',
    borderRadius: 8, maxHeight: 220, overflowY: 'auto',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  }
  const dropItem: React.CSSProperties = {
    padding: '8px 12px', cursor: 'pointer', fontSize: 13,
    borderBottom: '1px solid var(--border)',
  }

  return (
    <div className="af-card">
      {/* Photo + ID */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div onClick={() => photoRef.current?.click()} style={{ width: 140, height: 100, flexShrink: 0, background: 'var(--surface)', border: '2px dashed var(--border)', borderRadius: 10, cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
          {v.photo
            ? <Image src={v.photo} alt="Vehicle" width={140} height={100} unoptimized style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ textAlign: 'center', color: 'var(--muted)' }}><div style={{ fontSize: 28 }}>📷</div><div style={{ fontSize: 10, marginTop: 4 }}>Add photo</div></div>
          }
        </div>
        <input ref={photoRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={e => { void handlePhotoUpload(e.target.files) }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{T('id')}</div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 14, fontWeight: 600, color: 'var(--accent)', marginBottom: 10 }}>{v.businessId}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{T('status')}</div>
          <select className="af-input" style={{ width: 'auto', padding: '5px 10px', fontSize: 13 }} value={v.status} onChange={e => up('status', e.target.value)}>
            {ALL_STATUSES.map(s => <option key={s} value={s}>{t(lang, `status.${s}`)}</option>)}
          </select>
        </div>
      </div>

      <div className="af-section-title">{t(lang, 'tabs.info')}</div>

      <FormGrid>
        {/* Category */}
        <FormSelect label={T('category')} value={v.category} onChange={e => up('category', e.target.value)}
          options={catOptions} />

        {/* Make — searchable dropdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.5px', fontWeight: 600, textTransform: 'uppercase' }}>{T('make')}</label>
          <div style={{ position: 'relative' }}>
            <input
              className="af-input"
              type="text"
              value={makeSearch || v.make}
              placeholder={makes.length ? `Search ${makes.length} makes...` : 'Type make...'}
              onFocus={() => { setMakeSearch(''); setShowMakeList(true) }}
              onChange={e => { setMakeSearch(e.target.value); setShowMakeList(true) }}
              onBlur={() => setTimeout(() => setShowMakeList(false), 200)}
            />
            {showMakeList && filteredMakes.length > 0 && (
              <div style={dropdownStyle}>
                {filteredMakes.map(m => (
                  <div key={m} style={dropItem}
                    onMouseDown={() => handleMakeSelect(m)}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(240,165,0,0.1)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >{m}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Model — searchable dropdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.5px', fontWeight: 600, textTransform: 'uppercase' }}>{T('model')}</label>
          <div style={{ position: 'relative' }}>
            <input
              className="af-input"
              type="text"
              value={modelSearch || v.model}
              placeholder={models.length ? `Search ${models.length} models...` : 'Type model...'}
              onFocus={() => { setModelSearch(''); setShowModelList(true) }}
              onChange={e => { setModelSearch(e.target.value); setShowModelList(true); up('model', e.target.value) }}
              onBlur={() => setTimeout(() => setShowModelList(false), 200)}
            />
            {showModelList && filteredModels.length > 0 && (
              <div style={dropdownStyle}>
                {filteredModels.map(m => (
                  <div key={m} style={dropItem}
                    onMouseDown={() => handleModelSelect(m)}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(240,165,0,0.1)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >{m}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        <FormInput label={T('year')} type="number" value={v.year} placeholder="2020" min={1970} max={2030} onChange={e => up('year', e.target.value)} />

        {/* Color — dropdown with preview dot */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.5px', fontWeight: 600, textTransform: 'uppercase' }}>{T('color')}</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, border: '2px solid var(--border)', background: VEHICLE_COLORS.find(c => c.name === v.color || c.el === v.color || c.de === v.color)?.hex || '#888' }} />
            <select className="af-input" style={{ flex: 1 }} value={v.color}
              onChange={e => up('color', e.target.value)}>
              <option value="">— {lang === 'el' ? 'Επιλέξτε χρώμα' : lang === 'de' ? 'Farbe wählen' : 'Select color'} —</option>
              {VEHICLE_COLORS.map(c => {
                const name = lang === 'el' ? c.el : lang === 'de' ? c.de : c.name
                return <option key={c.name} value={c.name}>{name}</option>
              })}
            </select>
          </div>
        </div>
        <FormSelect label={T('fuel')} value={v.fuel} onChange={e => up('fuel', e.target.value)}
          options={FUEL_TYPES.map(f => ({ value: f, label: t(lang, `fuel.${f}`) }))} />
        <FormSelect label={T('gearbox')} value={v.gearbox} onChange={e => up('gearbox', e.target.value)}
          options={GEAR_TYPES.map(g => ({ value: g, label: t(lang, `gear.${g}`) }))} />
        <FormInput label={`${T('engine')} (cc)`} type="number" value={v.engine} placeholder="1995" onChange={e => up('engine', e.target.value)} />
        <FormInput label={`${T('mileage')} (km)`} type="number" value={v.mileage} placeholder="150000" onChange={e => up('mileage', e.target.value)} />
        <FormInput label={T('firstReg')} type="date" value={v.firstReg} onChange={e => up('firstReg', e.target.value)} />
        <FormInput label={T('regCountry')} value={v.regCountry} placeholder="DE / GR / IT..." onChange={e => up('regCountry', e.target.value)} />
        <FormInput label={T('plate')} mono value={v.plate} placeholder="M-AB 1234" onChange={e => up('plate', e.target.value.toUpperCase())} />
        {['car','moto'].includes(v.category)
          ? <FormInput label={T('seats')} type="number" value={v.seats} placeholder="5" onChange={e => up('seats', e.target.value)} />
          : <FormInput label={`${T('payload')} (kg)`} type="number" value={v.payload} placeholder="18000" onChange={e => up('payload', e.target.value)} />
        }
        <FormInput label={T('cocNum')} mono value={v.cocNum} onChange={e => up('cocNum', e.target.value)} />
        <FormSelect label={T('condition')} value={v.condition} onChange={e => up('condition', e.target.value)}
          options={COND_TYPES.map(c => ({ value: c, label: t(lang, `cond.${c}`) }))} />
        <FullSpan>
          <FormTextarea label={T('notes')} value={v.notes} placeholder="..." onChange={e => up('notes', e.target.value)} />
        </FullSpan>
      </FormGrid>

      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <button className="af-btn af-btn-primary" onClick={save}>{t(lang, 'actions.save')}</button>
      </div>
    </div>
  )
}
