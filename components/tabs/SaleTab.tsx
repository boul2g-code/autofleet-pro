'use client'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import type { SaleData, VatRegime } from '@/lib/types'

const VAT_RATES: Record<string, number> = {
  DE: 19, FR: 20, IT: 22, ES: 21, GR: 24, PT: 23, NL: 21,
  BE: 21, AT: 20, PL: 23, CZ: 21, HU: 27, RO: 19, BG: 20,
  HR: 25, SK: 20, SI: 22, LT: 21, LV: 21, EE: 20, FI: 25,
  SE: 25, DK: 25, IE: 23, LU: 17, MT: 18, CY: 19,
  CH: 8, GB: 20, NO: 25, TR: 20, UA: 20,
}

function calcVAT(price: number, code: string): number {
  const rate = VAT_RATES[code.toUpperCase()]
  if (!rate) return 0
  return Math.round(price * rate / (100 + rate))
}

export default function SaleTab({ id }: { id: string }) {
  const { vehicles, updateVehicle, settings } = useFleetStore()
  const lang = settings.lang
  const v = vehicles.find(x => x.id === id)
  if (!v) return null
  const s = v.sale || {}
  const up = (patch: Partial<SaleData>) => updateVehicle(id, { sale: { ...s, ...patch } })

  const country = (s.buyerCountry || '').toUpperCase()
  const vatRate = VAT_RATES[country]
  const isStandard = s.vatRegime === 'standard'

  const handlePrice = (price: number) => {
    if (isStandard && country && vatRate) {
      up({ price, vatAmount: calcVAT(price, country) })
    } else {
      up({ price })
    }
  }

  const handleCountry = (c: string) => {
    const rate = VAT_RATES[c.toUpperCase()]
    if (isStandard && rate && s.price) {
      up({ buyerCountry: c, vatAmount: calcVAT(s.price, c) })
    } else {
      up({ buyerCountry: c })
    }
  }

  const handleRegime = (regime: VatRegime) => {
    if (regime === 'standard' && country && vatRate && s.price) {
      up({ vatRegime: regime, vatAmount: calcVAT(s.price, country) })
    } else if (regime !== 'standard') {
      up({ vatRegime: regime, vatAmount: 0 })
    } else {
      up({ vatRegime: regime })
    }
  }

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
          <input type="number" value={s.price || ''} onChange={e => handlePrice(+e.target.value)} placeholder="0" />
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.vatRegime')}</label>
          <select value={s.vatRegime || 'margin'} onChange={e => handleRegime(e.target.value as VatRegime)}>
            <option value="margin">Margin Scheme</option>
            <option value="standard">Standard VAT</option>
            <option value="exempt">VAT Exempt</option>
          </select>
        </div>
      </div>

      <div className="field-row">
        <div className="field-group">
          <label>
            {t(lang, 'field.vatAmount')} (€)
            {isStandard && vatRate && (
              <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--success)', fontWeight: 600 }}>
                auto {vatRate}% {country}
              </span>
            )}
          </label>
          <input
            type="number"
            value={s.vatAmount || ''}
            onChange={e => up({ vatAmount: +e.target.value })}
            placeholder="0"
            style={{ borderColor: isStandard && vatRate ? 'var(--success)' : undefined }}
          />
        </div>
        <div className="field-group">
          <label>
            {t(lang, 'field.country')}
            {vatRate && <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text2)' }}>VAT {vatRate}%</span>}
          </label>
          <select value={s.buyerCountry || ''} onChange={e => handleCountry(e.target.value)}>
            <option value="">— Select country —</option>
            {Object.entries(VAT_RATES).map(([code, rate]) => (
              <option key={code} value={code}>{code} — {rate}% VAT</option>
            ))}
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      {isStandard && s.price && vatRate && (
        <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid var(--success)', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 13 }}>
          💡 Net price (excl. VAT): <strong>€{(s.price - (s.vatAmount || 0)).toLocaleString()}</strong>
          {' · '}VAT ({vatRate}%): <strong>€{(s.vatAmount || 0).toLocaleString()}</strong>
          {' · '}Gross: <strong>€{s.price.toLocaleString()}</strong>
        </div>
      )}

      <div className="field-row">
        <div className="field-group">
          <label>{t(lang, 'field.buyer')}</label>
          <input value={s.buyerName || ''} onChange={e => up({ buyerName: e.target.value })} placeholder="Buyer name / company" />
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.phone')}</label>
          <input value={s.buyerPhone || ''} onChange={e => up({ buyerPhone: e.target.value })} placeholder="+39..." type="tel" />
        </div>
      </div>

      <div className="field-group">
        <label>{t(lang, 'field.notes')}</label>
        <textarea value={s.notes || ''} onChange={e => up({ notes: e.target.value })} rows={3} />
      </div>
    </div>
  )
}
