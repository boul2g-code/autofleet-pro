'use client'
import AppShell from '@/components/AppShell'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { calcFinancials, fmtCur } from '@/lib/financials'

export default function AnalyticsPage() {
  const { vehicles, settings } = useFleetStore()
  const lang = settings.lang

  const sold = vehicles.filter(v => ['sold','delivered'].includes(v.status || ''))
  const totalRevenue = sold.reduce((s, v) => s + (v.sale?.price || 0), 0)
  const totalProfit = sold.reduce((s, v) => s + calcFinancials(v).grossProfit, 0)
  const avgMargin = sold.length > 0
    ? sold.reduce((s, v) => s + calcFinancials(v).margin, 0) / sold.length
    : 0

  const byMake = vehicles.reduce((acc, v) => {
    const make = v.make || t(lang,'analytics.unknown')
    acc[make] = (acc[make] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topMakes = Object.entries(byMake).sort((a, b) => b[1] - a[1]).slice(0, 8)
  const maxCount = topMakes[0]?.[1] || 1

  const byStatus = ['purchased','transit_in','stored','for_sale','sold','transit_out','delivered'].map(s => ({
    status: s,
    count: vehicles.filter(v => v.status === s).length,
  }))

  const topProfitable = [...sold]
    .sort((a, b) => calcFinancials(b).grossProfit - calcFinancials(a).grossProfit)
    .slice(0, 5)

  return (
    <AppShell>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>{t(lang, 'nav.analytics')}</h1>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: t(lang,'analytics.totalSold'), value: sold.length, color: '#22c55e' },
          { label: t(lang,'analytics.totalRevenue'), value: fmtCur(totalRevenue), color: '#3b82f6' },
          { label: t(lang,'analytics.totalProfit'), value: fmtCur(totalProfit), color: totalProfit >= 0 ? '#22c55e' : '#ef4444' },
          { label: t(lang,'analytics.avgMargin'), value: avgMargin.toFixed(1) + '%', color: '#8b5cf6' },
        ].map(k => (
          <div key={k.label} className="card" style={{ borderLeft: `3px solid ${k.color}` }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* By Make */}
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginTop: 0, marginBottom: 12 }}>{t(lang,'analytics.byMake')}</h3>
          {topMakes.map(([make, count]) => (
            <div key={make} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, fontSize: 13 }}>
                <span>{make}</span><span style={{ color: 'var(--text2)' }}>{count}</span>
              </div>
              <div style={{ background: 'var(--surface2)', borderRadius: 4, height: 6 }}>
                <div style={{ background: 'var(--primary)', borderRadius: 4, height: 6, width: `${(count / maxCount) * 100}%`, transition: 'width 0.3s' }} />
              </div>
            </div>
          ))}
          {topMakes.length === 0 && <p style={{ color: 'var(--text2)', fontSize: 13 }}>No data yet</p>}
        </div>

        {/* By Status */}
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginTop: 0, marginBottom: 12 }}>{t(lang,'analytics.byStatus')}</h3>
          {byStatus.filter(s => s.count > 0).map(s => (
            <div key={s.status} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
              <span className={`badge status-${s.status}`}>{t(lang, `status.${s.status}`)}</span>
              <span style={{ fontWeight: 600 }}>{s.count}</span>
            </div>
          ))}
          {byStatus.every(s => s.count === 0) && <p style={{ color: 'var(--text2)', fontSize: 13 }}>No data yet</p>}
        </div>
      </div>

      {/* Top profitable */}
      {topProfitable.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginTop: 0, marginBottom: 12 }}>{t(lang,'analytics.top5')}</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--text2)', fontWeight: 500 }}>{t(lang,'analytics.vehicle')}</th>
                <th style={{ padding: '6px 8px', textAlign: 'right', color: 'var(--text2)', fontWeight: 500 }}>{t(lang,'analytics.profit')}</th>
                <th style={{ padding: '6px 8px', textAlign: 'right', color: 'var(--text2)', fontWeight: 500 }}>{t(lang,'analytics.margin')}</th>
              </tr>
            </thead>
            <tbody>
              {topProfitable.map(v => {
                const fin = calcFinancials(v)
                return (
                  <tr key={v.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '7px 8px' }}>{v.make} {v.model} {v.plate ? `(${v.plate})` : ''}</td>
                    <td style={{ padding: '7px 8px', textAlign: 'right', color: 'var(--success)', fontWeight: 600 }}>{fmtCur(fin.grossProfit)}</td>
                    <td style={{ padding: '7px 8px', textAlign: 'right', color: 'var(--text2)' }}>{fin.margin.toFixed(1)}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  )
}
