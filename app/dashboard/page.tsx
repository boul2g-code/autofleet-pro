'use client'
import AppShell from '@/components/AppShell'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { calcFinancials, fmtCur } from '@/lib/financials'
import Link from 'next/link'

export default function DashboardPage() {
  const { vehicles, settings } = useFleetStore()
  const lang = settings.lang

  const inStock = vehicles.filter(v => ['purchased','transit_in','stored','for_sale'].includes(v.status || ''))
  const sold = vehicles.filter(v => ['sold','transit_out','delivered'].includes(v.status || ''))
  const revenue = sold.reduce((s, v) => s + (v.sale?.price || 0), 0)
  const profit = sold.reduce((s, v) => {
    const f = calcFinancials(v)
    return s + f.grossProfit
  }, 0)

  const KPI = [
    { label: t(lang, 'dash.total'), value: vehicles.length, icon: '🚗', color: '#3b82f6' },
    { label: t(lang, 'dash.inStock'), value: inStock.length, icon: '📦', color: '#f59e0b' },
    { label: t(lang, 'dash.sold'), value: sold.length, icon: '✅', color: '#22c55e' },
    { label: t(lang, 'dash.revenue'), value: fmtCur(revenue), icon: '💶', color: '#8b5cf6' },
    { label: t(lang, 'dash.profit'), value: fmtCur(profit), icon: '📈', color: profit >= 0 ? '#22c55e' : '#ef4444' },
  ]

  return (
    <AppShell>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>
        {t(lang, 'nav.dashboard')}
      </h1>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        {KPI.map(k => (
          <div key={k.label} className="card" style={{ borderLeft: `3px solid ${k.color}` }}>
            <div style={{ fontSize: 22 }}>{k.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Recent vehicles */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{t(lang, 'dash.recentVehicles')}</h2>
          <Link href="/vehicles" style={{ color: 'var(--primary)', fontSize: 13, textDecoration: 'none' }}>
            {t(lang, 'action.viewAll')} →
          </Link>
        </div>
        {vehicles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text2)' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🚗</div>
            <p>{t(lang, 'dash.noVehicles')}</p>
            <Link href="/vehicles">
              <button className="btn btn-primary" style={{ marginTop: 8 }}>
                + {t(lang, 'veh.new')}
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Make/Model','Plate','Year','Status','Profit'].map(h => (
                    <th key={h} style={{ padding: '6px 10px', textAlign: 'left', color: 'var(--text2)', fontWeight: 500, fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vehicles.slice(0, 10).map(v => {
                  const fin = calcFinancials(v)
                  return (
                    <tr key={v.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '8px 10px' }}>
                        <Link href={`/vehicles/${v.id}`} style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 500 }}>
                          {v.make} {v.model}
                        </Link>
                      </td>
                      <td style={{ padding: '8px 10px', color: 'var(--text2)' }}>{v.plate || '—'}</td>
                      <td style={{ padding: '8px 10px', color: 'var(--text2)' }}>{v.year || '—'}</td>
                      <td style={{ padding: '8px 10px' }}>
                        <span className={`badge status-${v.status}`}>{t(lang, `status.${v.status}`)}</span>
                      </td>
                      <td style={{ padding: '8px 10px', color: fin.grossProfit >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 500 }}>
                        {fin.saleRevenue > 0 ? fmtCur(fin.grossProfit) : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  )
}
