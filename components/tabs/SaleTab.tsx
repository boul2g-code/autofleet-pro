'use client'

import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { FormInput, FormSelect, FormTextarea, FormGrid, FullSpan } from '@/components/ui/FormField'
import { CURRENCIES, VAT_TYPES } from '@/lib/utils'
import type { Vehicle, SaleData } from '@/lib/types'

interface Props { vehicle: Vehicle }

export default function SaleTab({ vehicle: v }: Props) {
  const { lang, updateVehicleSection, showToast } = useFleetStore()
  const s = v.sale ?? {}
  const T = (k: string) => t(lang, `sale.${k}`)

  const up = (field: keyof SaleData, val: string) => {
    updateVehicleSection(v.id, 'sale', { ...s, [field]: val } as SaleData)
  }

  const autoCalcGross = (net: string, vat: string) => {
    if (net && vat) {
      const gross = parseFloat(net) * (1 + parseFloat(vat) / 100)
      up('priceGross', gross.toFixed(2))
    }
  }

  const save = () => showToast(t(lang, 'msg.saved'))

  return (
    <div className="af-card">
      <div className="af-section-title">{T('title')}</div>
      <FormGrid>
        <FormInput label={T('date')} type="date" value={s.date} onChange={e => up('date', e.target.value)} />
        <FormInput label={T('invoiceNum')} mono value={s.invoiceNum} placeholder="INV-S-2024-001" onChange={e => up('invoiceNum', e.target.value)} />
        <FormInput label={T('buyerName')} value={s.buyerName} placeholder="Auto Import SA" onChange={e => up('buyerName', e.target.value)} />
        <FormInput label={T('buyerCountry')} value={s.buyerCountry} placeholder="GR / IT / PL..." onChange={e => up('buyerCountry', e.target.value)} />
        <FullSpan>
          <FormInput label={T('buyerContact')} value={s.buyerContact} placeholder="+30 ..." onChange={e => up('buyerContact', e.target.value)} />
        </FullSpan>
        <FormSelect label={T('vatType')} value={s.vatType} onChange={e => up('vatType', e.target.value)}
          options={VAT_TYPES.map(vt => ({ value: vt, label: t(lang, `vat.${vt}`) }))} />
        <FormSelect label={T('currency')} value={s.currency} onChange={e => up('currency', e.target.value)}
          options={CURRENCIES.map(c => ({ value: c, label: c }))} />
        <FormInput label={T('priceNet')} mono type="number" step="0.01" value={s.priceNet} placeholder="0.00"
          onChange={e => { up('priceNet', e.target.value); autoCalcGross(e.target.value, s.vatRate ?? '') }} />
        <FormInput label={`${T('vatRate')} %`} mono type="number" value={s.vatRate} placeholder="19"
          onChange={e => { up('vatRate', e.target.value); autoCalcGross(s.priceNet ?? '', e.target.value) }} />
        <FormInput label={T('priceGross')} mono type="number" step="0.01" value={s.priceGross} placeholder="0.00"
          onChange={e => up('priceGross', e.target.value)} />
        <FullSpan>
          <FormTextarea label={T('notes')} value={s.notes} onChange={e => up('notes', e.target.value)} />
        </FullSpan>
      </FormGrid>
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <button className="af-btn af-btn-primary" onClick={save}>{t(lang, 'actions.save')}</button>
      </div>
    </div>
  )
}
