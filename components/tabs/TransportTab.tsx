'use client'

import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { FormGrid, FormInput, FormSelect, FormTextarea } from '@/components/ui/FormField'
import { CURRENCIES } from '@/lib/utils'
import type { TransportData, Vehicle } from '@/lib/types'

interface Props {
  vehicle: Vehicle
  mode: 'import' | 'export'
}

export default function TransportTab({ vehicle: v, mode }: Props) {
  const { lang, updateVehicleSection, showToast } = useFleetStore()
  const section = mode === 'import' ? 'importTransport' : 'exportTransport'
  const tr: TransportData = v[section] ?? {}
  const T = (k: string) => t(lang, `transport.${k}`)

  const up = (field: keyof TransportData, val: string) => {
    updateVehicleSection(v.id, section, { ...tr, [field]: val })
  }

  const save = () => showToast(t(lang, 'msg.saved'))

  const printCMR = () => {
    const a = document.createElement('a')
    a.href = `/api/cmr?vehicleId=${encodeURIComponent(v.id)}&mode=${encodeURIComponent(mode)}`
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const modeLabel = mode === 'import' ? t(lang, 'tabs.importT') : t(lang, 'tabs.exportT')

  const cmrBtnLabel = lang === 'el' ? 'Εκτύπωση CMR'
    : lang === 'de' ? 'CMR drucken'
      : lang === 'it' ? 'Stampa CMR'
        : lang === 'fr' ? 'Imprimer CMR'
          : lang === 'es' ? 'Imprimir CMR'
            : 'Print CMR'

  return (
    <div className="af-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div className="af-section-title" style={{ marginBottom: 0 }}>
          {T('title')} - {modeLabel}
        </div>
        <button
          className="af-btn af-btn-sm"
          onClick={printCMR}
          style={{ background: 'rgba(74,144,226,0.12)', border: '1px solid rgba(74,144,226,0.35)', color: 'var(--blue)' }}
        >
          🖨️ {cmrBtnLabel}
        </button>
      </div>

      <FormGrid>
        <FormInput label={T('cmr')} mono value={tr.cmr} placeholder="CMR-001-2024" onChange={e => up('cmr', e.target.value)} />
        <FormInput label={T('carrier')} value={tr.carrier} placeholder="Transport GmbH" onChange={e => up('carrier', e.target.value)} />
        <FormInput label={T('carrierContact')} value={tr.carrierContact} placeholder="+49 ..." onChange={e => up('carrierContact', e.target.value)} />
        <FormInput label={T('driver')} value={tr.driver} onChange={e => up('driver', e.target.value)} />
        <FormInput label={T('truckPlate')} mono value={tr.truckPlate} placeholder="B-TL 1234" onChange={e => up('truckPlate', e.target.value.toUpperCase())} />
        <FormInput label={T('origin')} value={tr.origin} placeholder="Berlin, Deutschland" onChange={e => up('origin', e.target.value)} />
        <FormInput label={T('dest')} value={tr.dest} placeholder="Athen, Griechenland" onChange={e => up('dest', e.target.value)} />
        <FormInput label={T('depDate')} type="date" value={tr.depDate} onChange={e => up('depDate', e.target.value)} />
        <FormInput label={T('arrDate')} type="date" value={tr.arrDate} onChange={e => up('arrDate', e.target.value)} />
        <FormInput label={T('cost')} mono type="number" step="0.01" value={tr.cost} placeholder="0.00" onChange={e => up('cost', e.target.value)} />
        <FormSelect
          label={T('currency')}
          value={tr.currency}
          onChange={e => up('currency', e.target.value)}
          options={CURRENCIES.map(currency => ({ value: currency, label: currency }))}
        />
      </FormGrid>

      {tr.cmr && (
        <div style={{ marginTop: 14, background: 'rgba(74,144,226,0.07)', border: '1px solid rgba(74,144,226,0.2)', borderRadius: 8, padding: 12 }}>
          <div style={{ color: 'var(--blue)', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
            📋 CMR {tr.cmr}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', fontSize: 12, color: 'var(--muted)' }}>
            {tr.origin && <div>📍 {tr.origin}</div>}
            {tr.dest && <div>🏁 {tr.dest}</div>}
            {tr.depDate && <div>🗓 {tr.depDate}</div>}
            {tr.arrDate && <div>🗓 {tr.arrDate}</div>}
            {tr.carrier && <div>🚛 {tr.carrier}</div>}
            {tr.driver && <div>👤 {tr.driver}</div>}
            {tr.truckPlate && <div>🔢 {tr.truckPlate}</div>}
            {tr.cost && <div>💶 €{tr.cost}</div>}
          </div>
          <div style={{ marginTop: 10 }}>
            <button
              onClick={printCMR}
              style={{ background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}
            >
              🖨️ {cmrBtnLabel}
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: 14 }}>
        <FormTextarea label={T('notes')} value={tr.notes} onChange={e => up('notes', e.target.value)} />
      </div>
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <button className="af-btn af-btn-primary" onClick={save}>{t(lang, 'actions.save')}</button>
      </div>
    </div>
  )
}
