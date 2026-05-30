'use client'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import type { StorageData } from '@/lib/types'

export default function StorageTab({ id }: { id: string }) {
  const { vehicles, updateVehicle, settings } = useFleetStore()
  const lang = settings.lang
  const v = vehicles.find(x => x.id === id)
  if (!v) return null
  const s = v.storage || {}
  const up = (patch: Partial<StorageData>) => updateVehicle(id, { storage: { ...s, ...patch } })

  const days = s.arrivalDate
    ? Math.max(0, Math.floor((new Date().getTime() - new Date(s.arrivalDate).getTime()) / 86400000))
    : 0
  const costSoFar = days * (s.costPerDay || 0)

  return (
    <div>
      <div className="field-row">
        <div className="field-group">
          <label>{t(lang, 'field.location')}</label>
          <select value={s.location || ''} onChange={e => up({ location: e.target.value as StorageData['location'] })}>
            <option value="">—</option>
            <option value="DE">Germany (DE)</option>
            <option value="GR">Greece (GR)</option>
            <option value="IT">Italy (IT)</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.address')}</label>
          <input value={s.address || ''} onChange={e => up({ address: e.target.value })} placeholder="Address / depot" />
        </div>
      </div>
      <div className="field-row">
        <div className="field-group">
          <label>Arrival Date</label>
          <input type="date" value={s.arrivalDate || ''} onChange={e => up({ arrivalDate: e.target.value })} />
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.costPerDay')} (€)</label>
          <input type="number" value={s.costPerDay || ''} onChange={e => up({ costPerDay: +e.target.value })} placeholder="0" />
        </div>
      </div>

      {s.arrivalDate && (
        <div className="card" style={{ background: 'var(--surface2)', marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <div>
              <div style={{ color: 'var(--text2)', fontSize: 12 }}>{t(lang, 'fin.storageDays')}</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{days}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text2)', fontSize: 12 }}>Cost so far</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>€{costSoFar.toFixed(0)}</div>
            </div>
          </div>
        </div>
      )}

      <div className="field-group">
        <label>{t(lang, 'field.workDone')}</label>
        <textarea value={s.workDone || ''} onChange={e => up({ workDone: e.target.value })} rows={3} placeholder="Repairs, cleaning, preparation..." />
      </div>
      <div className="field-group">
        <label>Work Cost (€)</label>
        <input type="number" value={s.workCost || ''} onChange={e => up({ workCost: +e.target.value })} placeholder="0" />
      </div>
      <div className="field-group">
        <label>{t(lang, 'field.notes')}</label>
        <textarea value={s.notes || ''} onChange={e => up({ notes: e.target.value })} rows={2} />
      </div>
    </div>
  )
}
