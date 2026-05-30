'use client'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import type { PurchaseData, VatRegime } from '@/lib/types'

export default function PurchaseTab({ id }: { id: string }) {
  const { vehicles, updateVehicle, settings } = useFleetStore()
  const lang = settings.lang
  const v = vehicles.find(x => x.id === id)
  if (!v) return null
  const p = v.purchase || {}
  const up = (patch: Partial<PurchaseData>) => updateVehicle(id, { purchase: { ...p, ...patch } })

  return (
    <div>
      <div className="field-row">
        <div className="field-group">
          <label>{t(lang, 'field.date')}</label>
          <input type="date" value={p.date || ''} onChange={e => up({ date: e.target.value })} />
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.invoiceNumber')}</label>
          <input value={p.invoiceNumber || ''} onChange={e => up({ invoiceNumber: e.target.value })} placeholder="INV-001" />
        </div>
      </div>
      <div className="field-row">
        <div className="field-group">
          <label>{t(lang, 'field.price')} (€)</label>
          <input type="number" value={p.price || ''} onChange={e => up({ price: +e.target.value })} placeholder="0" />
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.vatRegime')}</label>
          <select value={p.vatRegime || 'margin'} onChange={e => up({ vatRegime: e.target.value as VatRegime })}>
            <option value="margin">Margin Scheme</option>
            <option value="standard">Standard VAT</option>
            <option value="exempt">VAT Exempt</option>
          </select>
        </div>
      </div>
      <div className="field-row">
        <div className="field-group">
          <label>{t(lang, 'field.vatAmount')} (€)</label>
          <input type="number" value={p.vatAmount || ''} onChange={e => up({ vatAmount: +e.target.value })} placeholder="0" />
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.cost')} + extras (€)</label>
          <input type="number" value={p.additionalCosts || ''} onChange={e => up({ additionalCosts: +e.target.value })} placeholder="0" />
        </div>
      </div>
      <div className="field-row">
        <div className="field-group">
          <label>{t(lang, 'field.seller')}</label>
          <input value={p.sellerName || ''} onChange={e => up({ sellerName: e.target.value })} placeholder="Seller name / company" />
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.country')}</label>
          <input value={p.sellerCountry || ''} onChange={e => up({ sellerCountry: e.target.value })} placeholder="DE" maxLength={2} />
        </div>
      </div>
      <div className="field-group">
        <label>{t(lang, 'field.notes')}</label>
        <textarea value={p.notes || ''} onChange={e => up({ notes: e.target.value })} rows={3} />
      </div>
    </div>
  )
}
