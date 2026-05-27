'use client'

import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { FormInput, FormSelect, FormTextarea, FormGrid, FullSpan } from '@/components/ui/FormField'
import { CURRENCIES, VAT_TYPES } from '@/lib/utils'
import type { Vehicle, PurchaseData, ExtraCost } from '@/lib/types'

interface Props { vehicle: Vehicle }

export default function PurchaseTab({ vehicle: v }: Props) {
  const { lang, updateVehicleSection, showToast } = useFleetStore()
  const p = v.purchase ?? {}
  const T = (k: string) => t(lang, `purchase.${k}`)

  const up = (field: keyof PurchaseData, val: unknown) => {
    updateVehicleSection(v.id, 'purchase', { ...p, [field]: val } as PurchaseData)
  }

  const autoCalcGross = (net: string, vat: string) => {
    if (net && vat) {
      const gross = parseFloat(net) * (1 + parseFloat(vat) / 100)
      up('priceGross', gross.toFixed(2))
    }
  }

  const addCost = () => {
    up('extraCosts', [...(p.extraCosts || []), { desc: '', amt: '' }])
  }

  const updateCost = (i: number, field: keyof ExtraCost, val: string) => {
    const costs = [...(p.extraCosts || [])]
    costs[i] = { ...costs[i], [field]: val }
    up('extraCosts', costs)
  }

  const removeCost = (i: number) => {
    up('extraCosts', (p.extraCosts || []).filter((_, idx) => idx !== i))
  }

  const save = () => showToast(t(lang, 'msg.saved'))

  return (
    <div className="af-card">
      <div className="af-section-title">{T('title')}</div>
      <FormGrid>
        <FormInput label={T('date')} type="date" value={p.date} onChange={e => up('date', e.target.value)} />
        <FormInput label={T('invoiceNum')} mono value={p.invoiceNum} placeholder="INV-2024-001" onChange={e => up('invoiceNum', e.target.value)} />
        <FormInput label={T('sellerName')} value={p.sellerName} placeholder="Auto Handel GmbH" onChange={e => up('sellerName', e.target.value)} />
        <FormInput label={T('sellerCountry')} value={p.sellerCountry} placeholder="DE / AT / IT..." onChange={e => up('sellerCountry', e.target.value)} />
        <FullSpan>
          <FormInput label={T('sellerContact')} value={p.sellerContact} placeholder="+49 ... / email" onChange={e => up('sellerContact', e.target.value)} />
        </FullSpan>
        <FormSelect label={T('vatType')} value={p.vatType} onChange={e => up('vatType', e.target.value)}
          options={VAT_TYPES.map(vt => ({ value: vt, label: t(lang, `vat.${vt}`) }))} />
        <FormSelect label={T('currency')} value={p.currency} onChange={e => up('currency', e.target.value)}
          options={CURRENCIES.map(c => ({ value: c, label: c }))} />
        <FormInput label={T('priceNet')} mono type="number" step="0.01" value={p.priceNet} placeholder="0.00"
          onChange={e => { up('priceNet', e.target.value); autoCalcGross(e.target.value, p.vatRate ?? '') }} />
        <FormInput label={`${T('vatRate')} %`} mono type="number" value={p.vatRate} placeholder="19"
          onChange={e => { up('vatRate', e.target.value); autoCalcGross(p.priceNet ?? '', e.target.value) }} />
        <FormInput label={T('priceGross')} mono type="number" step="0.01" value={p.priceGross} placeholder="0.00"
          onChange={e => up('priceGross', e.target.value)} />
      </FormGrid>

      {/* Extra Costs */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div className="af-section-title" style={{ marginBottom: 0 }}>{T('extraCosts')}</div>
          <button className="af-btn af-btn-secondary af-btn-sm" onClick={addCost}>{T('addCost')}</button>
        </div>
        {(p.extraCosts || []).length === 0
          ? <div style={{ color: 'var(--muted)', fontSize: 12, padding: '8px 0' }}>—</div>
          : (p.extraCosts || []).map((cost, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 130px auto', gap: 8, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <input className="af-input" type="text" value={cost.desc} placeholder={T('costDesc')} onChange={e => updateCost(i, 'desc', e.target.value)} />
              <input className="af-input af-input-mono" type="number" step="0.01" value={cost.amt} placeholder="0.00" onChange={e => updateCost(i, 'amt', e.target.value)} />
              <button className="af-btn af-btn-danger af-btn-xs" onClick={() => removeCost(i)}>✕</button>
            </div>
          ))
        }
      </div>

      <div style={{ marginTop: 14 }}>
        <FormTextarea label={T('notes')} value={p.notes} onChange={e => up('notes', e.target.value)} />
      </div>
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <button className="af-btn af-btn-primary" onClick={save}>{t(lang, 'actions.save')}</button>
      </div>
    </div>
  )
}
