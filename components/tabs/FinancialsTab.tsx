'use client'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { calcFinancials, fmtCur } from '@/lib/financials'

export default function FinancialsTab({ id }: { id: string }) {
  const { vehicles, settings } = useFleetStore()
  const lang = settings.lang
  const v = vehicles.find(x => x.id === id)
  if (!v) return null
  const fin = calcFinancials(v)

  const Row = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 0', borderBottom: '1px solid var(--border)',
    }}>
      <span style={{ color: 'var(--text2)', fontSize: 14 }}>{label}</span>
      <span style={{ fontWeight: highlight ? 700 : 500, fontSize: highlight ? 16 : 14 }}>{value}</span>
    </div>
  )

  return (
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, marginTop: 0 }}>Cost Breakdown</h3>
      <Row label={t(lang, 'fin.purchaseCost')} value={fmtCur(fin.purchaseCost)} />
      <Row label={t(lang, 'fin.transportInCost')} value={fmtCur(fin.transportInCost)} />
      <Row label={`${t(lang, 'fin.storageCost')} (${fin.storageDays} ${t(lang, 'misc.daysInStorage')})`} value={fmtCur(fin.storageCost)} />
      <Row label={t(lang, 'fin.workCost')} value={fmtCur(fin.workCost)} />
      <Row label={t(lang, 'fin.transportOutCost')} value={fmtCur(fin.transportOutCost)} />

      <div style={{
        display: 'flex', justifyContent: 'space-between', padding: '10px 0',
        borderBottom: '2px solid var(--border)', fontWeight: 700,
      }}>
        <span>{t(lang, 'fin.totalCost')}</span>
        <span style={{ color: 'var(--danger)' }}>{fmtCur(fin.totalCost)}</span>
      </div>

      <div style={{ margin: '16px 0 8px', fontWeight: 600, fontSize: 15 }}>Revenue</div>
      <Row label={t(lang, 'fin.saleRevenue')} value={fmtCur(fin.saleRevenue)} />

      <div style={{
        marginTop: 16, padding: 16, borderRadius: 10,
        background: fin.grossProfit >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
        border: `1px solid ${fin.grossProfit >= 0 ? 'var(--success)' : 'var(--danger)'}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontWeight: 600 }}>{t(lang, 'fin.grossProfit')}</span>
          <span style={{
            fontWeight: 700, fontSize: 22,
            color: fin.grossProfit >= 0 ? 'var(--success)' : 'var(--danger)',
          }}>
            {fmtCur(fin.grossProfit)}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text2)', fontSize: 13 }}>{t(lang, 'fin.margin')}</span>
          <span style={{ fontWeight: 600, color: fin.margin >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {fin.margin.toFixed(1)}%
          </span>
        </div>
      </div>

      {fin.saleRevenue === 0 && (
        <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: 12, textAlign: 'center' }}>
          Add a sale price in the Sale tab to see profit.
        </p>
      )}
    </div>
  )
}
