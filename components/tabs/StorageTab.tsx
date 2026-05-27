'use client'

import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { FormInput, FormSelect, FormTextarea, FormGrid } from '@/components/ui/FormField'
import { CURRENCIES, LOC_TYPES, fmtCur } from '@/lib/utils'
import { computeFin } from '@/lib/financials'
import type { Vehicle, StorageData, WorkItem } from '@/lib/types'

interface Props { vehicle: Vehicle }

export default function StorageTab({ vehicle: v }: Props) {
  const { lang, updateVehicleSection, showToast } = useFleetStore()
  const st = v.storage ?? {} as import('@/lib/types').StorageData
  const fin = computeFin(v)
  const T = (k: string) => t(lang, `storage.${k}`)

  const up = (field: keyof StorageData, val: unknown) => {
    updateVehicleSection(v.id, 'storage', { ...st, [field]: val })
  }

  const addWork = () => {
    up('workDone', [...(st.workDone || []), { desc: '', cost: '', date: '', by: '' }])
  }

  const updateWork = (i: number, field: keyof WorkItem, val: string) => {
    const items = [...(st.workDone || [])]
    items[i] = { ...items[i], [field]: val }
    up('workDone', items)
  }

  const removeWork = (i: number) => {
    up('workDone', (st.workDone || []).filter((_, idx) => idx !== i))
  }

  const save = () => showToast(t(lang, 'msg.saved'))

  return (
    <div className="af-card">
      <div className="af-section-title">{T('title')}</div>
      <FormGrid>
        <FormSelect label={T('location')} value={st.location} onChange={e => up('location', e.target.value)}
          options={LOC_TYPES.map(l => ({ value: l, label: t(lang, `loc.${l}`) }))} />
        <FormInput label={T('locDetails')} value={st.locDetails} placeholder="Lager A, Halle 3..." onChange={e => up('locDetails', e.target.value)} />
        <FormInput label={T('entryDate')} type="date" value={st.entryDate} onChange={e => up('entryDate', e.target.value)} />
        <FormInput label={T('exitDate')} type="date" value={st.exitDate} onChange={e => up('exitDate', e.target.value)} />
        <FormInput label={T('cpd')} mono type="number" step="0.01" value={st.cpd} placeholder="5.00" onChange={e => up('cpd', e.target.value)} />
        <FormSelect label={T('currency')} value={st.currency} onChange={e => up('currency', e.target.value)}
          options={CURRENCIES.map(c => ({ value: c, label: c }))} />
      </FormGrid>

      {/* Storage summary */}
      {st.entryDate && st.cpd && (
        <div style={{ margin: '14px 0', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{T('days')}</div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 20, color: 'var(--accent)' }}>{fin.storageDays}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{T('totalSC')}</div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 20, color: 'var(--accent)' }}>{fmtCur(fin.sc, st.currency)}</div>
          </div>
        </div>
      )}

      {/* Work items */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div className="af-section-title" style={{ marginBottom: 0 }}>{T('workTitle')}</div>
          <button className="af-btn af-btn-secondary af-btn-sm" onClick={addWork}>{T('addWork')}</button>
        </div>
        {(st.workDone || []).length === 0
          ? <div style={{ color: 'var(--muted)', fontSize: 12, padding: '8px 0' }}>—</div>
          : (st.workDone || []).map((w, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, marginBottom: 8, display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <input className="af-input" type="text" value={w.desc} placeholder={T('wDesc')} style={{ marginBottom: 6 }} onChange={e => updateWork(i, 'desc', e.target.value)} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="af-input" type="date" value={w.date} style={{ flex: 1 }} onChange={e => updateWork(i, 'date', e.target.value)} />
                  <input className="af-input" type="text" value={w.by} placeholder={T('wBy')} style={{ flex: 1 }} onChange={e => updateWork(i, 'by', e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                <input className="af-input af-input-mono" type="number" step="0.01" value={w.cost} placeholder="0.00" style={{ width: 110, textAlign: 'right' }} onChange={e => updateWork(i, 'cost', e.target.value)} />
                <button className="af-btn af-btn-danger af-btn-xs" onClick={() => removeWork(i)}>✕ {t(lang, 'actions.remove')}</button>
              </div>
            </div>
          ))
        }
      </div>

      <div style={{ marginTop: 14 }}>
        <FormTextarea label={T('notes')} value={st.notes} onChange={e => up('notes', e.target.value)} />
      </div>
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <button className="af-btn af-btn-primary" onClick={save}>{t(lang, 'actions.save')}</button>
      </div>
    </div>
  )
}
