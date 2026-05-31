'use client'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import type { PurchaseData, VatRegime } from '@/lib/types'

// EU VAT rates (standard rate per country)
const VAT_RATES: Record<string, number> = {
  DE: 19, FR: 20, IT: 22, ES: 21, GR: 24, PT: 23, NL: 21,
  BE: 21, AT: 20, PL: 23, CZ: 21, HU: 27, RO: 19, BG: 20,
  HR: 25, SK: 20, SI: 22, LT: 21, LV: 21, EE: 20, FI: 25,
  SE: 25, DK: 25, IE: 23, LU: 17, MT: 18, CY: 19,
  CH: 8, GB: 20, NO: 25, TR: 20, UA: 20,
}

function calcVAT(price: number, countryCode: string): number {
  const rate = VAT_RATES[countryCode.toUpperCase()]
  if (!rate) return 0
  return Math.round(price * rate / (100 + rate))
}

export default function PurchaseTab({ id }: { id: string }) {
  const { vehicles, updateVehicle, settings } = useFleetStore()
  const lang = settings.lang
  const v = vehicles.find(x => x.id === id)
  if (!v) return null
  const p = v.purchase || {}
  const up = (patch: Partial<PurchaseData>) => updateVehicle(id, { purchase: { ...p, ...patch } })

  const country = (p.sellerCountry || '').toUpperCase()
  const vatRate = VAT_RATES[country]
  const isStandard = p.vatRegime === 'standard'

  const handlePrice = (price: number) => {
    if (isStandard && country && vatRate) {
      up({ price, vatAmount: calcVAT(price, country) })
    } else {
      up({ price })
    }
  }

  const handleCountry = (c: string) => {
    const rate = VAT_RATES[c.toUpperCase()]
    if (isStandard && rate && p.price) {
      up({ sellerCountry: c, vatAmount: calcVAT(p.price, c) })
    } else {
      up({ sellerCountry: c })
    }
  }

  const handleRegime = (regime: VatRegime) => {
    if (regime === 'standard' && country && vatRate && p.price) {
      up({ vatRegime: regime, vatAmount: calcVAT(p.price, country) })
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
          <input type="number" value={p.price || ''} onChange={e => handlePrice(+e.target.value)} placeholder="0" />
        </div>
        <div className="field-group">
          <label>{t(lang, 'field.vatRegime')}</label>
          <select value={p.vatRegime || 'margin'} onChange={e => handleRegime(e.target.value as VatRegime)}>
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
            value={p.vatAmount || ''}
            onChange={e => up({ vatAmount: +e.target.value })}
            placeholder="0"
            style={{ borderColor: isStandard && vatRate ? 'var(--success)' : undefined }}
          />
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
          <label>
            {t(lang, 'field.country')}
            {vatRate && <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text2)' }}>VAT {vatRate}%</span>}
          </label>
          <select value={p.sellerCountry || ''} onChange={e => handleCountry(e.target.value)}>
            <option value="">— Select country —</option>
            {Object.entries(VAT_RATES).map(([code, rate]) => (
              <option key={code} value={code}>{code} — {rate}% VAT</option>
            ))}
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      {isStandard && p.price && vatRate && (
        <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid var(--success)', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 13 }}>
          💡 Net price (excl. VAT): <strong>€{(p.price - (p.vatAmount || 0)).toLocaleString()}</strong>
          {' · '}VAT ({vatRate}%): <strong>€{(p.vatAmount || 0).toLocaleString()}</strong>
          {' · '}Gross: <strong>€{p.price.toLocaleString()}</strong>
        </div>
      )}

      <div className="field-group">
        <label>{t(lang, 'field.notes')}</label>
        <textarea value={p.notes || ''} onChange={e => up({ notes: e.target.value })} rows={3} />
      </div>
    </div>
  )
}
