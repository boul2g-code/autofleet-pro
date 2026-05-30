'use client'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import type { SaleData, VatRegime } from '@/lib/types'

export default function SaleTab({ id }: { id: string }) {
  const { vehicles, updateVehicle, settings } = useFleetStore()
  const lang = settings.lang
  const v = vehicles.find(x => x.id === id)
  if (!v) return null
  const s = v.sale || {}
  const up = (patch: Partial<SaleData>) => updateVehicle(id, { sale: { ...s, ...patch } })

  return (
    <div>
      <div className="field-row">
        <div className="field-group">
          <label>{t(lang, 'field.date')}</label>
          <input type="date" value={s.date || ''} onChange={e => up({ date: e.target.value })} />
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.invoiceNumber')}</label>
          <input value={s.invoiceNumber || ''} onChange={e => up({ invoiceNumber: e.target.value })} placeholder="INV-001" />
        </div>
      </div>
      <div className="field-row">
        <div className="field-group">
          <label>{t(lang, 'field.price')} (€)</label>
          <input type="number" value={s.price || ''} onChange={e => up({ price: +e.target.value })} placeholder="0" />
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.vatRegime')}</label>
          <select value={s.vatRegime || 'margin'} onChange={e => up({ vatRegime: e.target.value as VatRegime })}>
            <option value="margin">Margin Scheme</option>
            <option value="standard">Standard VAT</option>
            <option value="exempt">VAT Exempt</option>
          </select>
        </div>
      </div>
      <div className="field-row">
        <div className="field-group">
          <label>{t(lang, 'field.buyer')}</label>
          <input value={s.buyerName || ''} onChange={e => up({ buyerName: e.target.value })} placeholder="Buyer name / company" />
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.country')}</label>
          <input value={s.buyerCountry || ''} onChange={e => up({ buyerCountry: e.target.value })} placeholder="GR" maxLength={2} />
        </div>
      </div>
      <div className="field-group">
        <label>{t(lang, 'field.phone')}</label>
        <input value={s.buyerPhone || ''} onChange={e => up({ buyerPhone: e.target.value })} placeholder="+30..." type="tel" />
      </div>
      <div className="field-group">
        <label>{t(lang, 'field.notes')}</label>
        <textarea value={s.notes || ''} onChange={e => up({ notes: e.target.value })} rows={3} />
      </div>
    </div>
  )
}
