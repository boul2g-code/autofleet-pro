/* eslint-disable react/no-unescaped-entities */
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
  const inTransit = vehicles.filter(v => ['transit_in','transit_out'].includes(v.status || ''))
  const revenue = sold.reduce((s, v) => s + (v.sale?.price || 0), 0)
  const profit = sold.reduce((s, v) => s + calcFinancials(v).grossProfit, 0)
  const avgMargin = sold.length > 0 ? sold.reduce((s,v) => s + calcFinancials(v).margin, 0) / sold.length : 0

  // Vehicles with high storage cost (>30 days)
  const storageCostAlerts = inStock.filter(v => {
    if (!v.storage?.arrivalDate || !v.storage?.costPerDay) return false
    const days = Math.floor((Date.now() - new Date(v.storage.arrivalDate).getTime()) / 86400000)
    return days > 30
  }).sort((a, b) => {
    const daysA = Math.floor((Date.now() - new Date(a.storage!.arrivalDate!).getTime()) / 86400000)
    const daysB = Math.floor((Date.now() - new Date(b.storage!.arrivalDate!).getTime()) / 86400000)
    return daysB - daysA
  })

  // Recent activity
  const recent = [...vehicles].sort((a,b) => 
    new Date(b.updated_at || b.created_at || 0).getTime() - new Date(a.updated_at || a.created_at || 0).getTime()
  ).slice(0, 8)

  const KPI = [
    { label: t(lang, 'dash.total'), value: vehicles.length, icon: '🚗', color: '#3b82f6' },
    { label: t(lang, 'dash.inStock'), value: inStock.length, icon: '📦', color: '#f59e0b' },
    { label: 'In Transit', value: inTransit.length, icon: '🚚', color: '#8b5cf6' },
    { label: t(lang, 'dash.sold'), value: sold.length, icon: '✅', color: '#22c55e' },
    { label: t(lang, 'dash.revenue'), value: fmtCur(revenue), icon: '💶', color: '#06b6d4' },
    { label: t(lang, 'dash.profit'), value: fmtCur(profit), icon: '📈', color: profit >= 0 ? '#22c55e' : '#ef4444' },
    { label: 'Avg Margin', value: avgMargin.toFixed(1) + '%', icon: '🎯', color: '#f59e0b' },
  ]

  return (
    <AppShell>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
          {t(lang, 'nav.dashboard')}
        </h1>
        <Link href="/vehicles">
          <button className="btn btn-primary">+ {t(lang, 'veh.new')}</button>
        </Link>
      </div>

      {/* Storage cost alert */}
      {storageCostAlerts.length > 0 && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--danger)', marginBottom: 8 }}>
            ⚠️ {storageCostAlerts.length} vehicle{storageCostAlerts.length > 1 ? 's' : ''} with high storage cost (&gt;30 days)
          </div>
          {storageCostAlerts.slice(0,3).map(v => {
            const days = Math.floor((Date.now() - new Date(v.storage!.arrivalDate!).getTime()) / 86400000)
            const cost = days * (v.storage?.costPerDay || 0)
            return (
              <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '3px 0', color: 'var(--text)' }}>
                <span>{v.make} {v.model} {v.plate ? `(${v.plate})` : ''}</span>
                <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{days} days · €{cost.toFixed(0)}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>
        {KPI.map(k => (
          <div key={k.label} className="card" style={{ borderLeft: `3px solid ${k.color}`, padding: 14 }}>
            <div style={{ fontSize: 20 }}>{k.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Status breakdown bar */}
      {vehicles.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 10px' }}>Fleet Status</h3>
          <div style={{ display: 'flex', gap: 4, height: 20, borderRadius: 4, overflow: 'hidden' }}>
            {(['purchased','transit_in','stored','for_sale','sold','transit_out','delivered'] as const).map(s => {
              const count = vehicles.filter(v => v.status === s).length
              if (!count) return null
              const pct = (count / vehicles.length * 100).toFixed(1)
              const colors: Record<string, string> = {
                purchased: '#3b82f6', transit_in: '#22c55e', stored: '#f59e0b',
                for_sale: '#8b5cf6', sold: '#16a34a', transit_out: '#ef4444', delivered: '#06b6d4',
              }
              return (
                <div key={s} style={{ background: colors[s], flex: count, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', fontWeight: 600, minWidth: 20 }}
                  title={`${t(lang, `status.${s}`)}: ${count}`}>
                  {count > 1 ? count : ''}
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {(['purchased','transit_in','stored','for_sale','sold','transit_out','delivered'] as const).map(s => {
              const count = vehicles.filter(v => v.status === s).length
              if (!count) return null
              return (
                <span key={s} className={`badge status-${s}`} style={{ fontSize: 11 }}>
                  {t(lang, `status.${s}`)} {count}
                </span>
              )
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent vehicles */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{t(lang, 'dash.recentVehicles')}</h2>
            <Link href="/vehicles" style={{ color: 'var(--primary)', fontSize: 13, textDecoration: 'none' }}>
              {t(lang, 'action.viewAll')} →
            </Link>
          </div>
          {vehicles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text2)' }}>
              <div style={{ fontSize: 32 }}>🚗</div>
              <p style={{ marginTop: 8, fontSize: 14 }}>{t(lang, 'dash.addFirst')}</p>
              <Link href="/vehicles">
                <button className="btn btn-primary" style={{ marginTop: 8 }}>+ {t(lang, 'veh.new')}</button>
              </Link>
            </div>
          ) : (
            recent.map(v => {
              const fin = calcFinancials(v)
              return (
                <Link key={v.id} href="/vehicles" style={{ textDecoration: 'none', color: 'var(--text)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                    {v.photo
                      ? <img src={v.photo} alt="" style={{ width: 36, height: 26, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                      : <div style={{ width: 36, height: 26, background: 'var(--surface2)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🚗</div>
                    }
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {v.make} {v.model} {v.year ? `'${String(v.year).slice(-2)}` : ''}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text2)' }}>{v.plate || '—'}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span className={`badge status-${v.status}`} style={{ fontSize: 10 }}>{t(lang, `status.${v.status}`)}</span>
                      {fin.saleRevenue > 0 && (
                        <div style={{ fontSize: 11, color: fin.grossProfit >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600, marginTop: 2 }}>
                          {fin.grossProfit >= 0 ? '+' : ''}{fmtCur(fin.grossProfit)}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>

        {/* Quick stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 10px' }}>📊 Quick Links</h3>
            {[
              { href: '/manifest', icon: '📋', label: t(lang, 'manifest.title') },
              { href: '/analytics', icon: '📈', label: t(lang, 'nav.analytics') },
              { href: '/import', icon: '📥', label: t(lang, 'nav.import') },
              { href: '/settings', icon: '⚙️', label: t(lang, 'nav.settings') },
              { href: '/landing', icon: '🌐', label: 'Landing Page (public)' },
            ].map(item => (
              <Link key={item.href} href={item.href}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text)', fontSize: 13 }}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
                <span style={{ marginLeft: 'auto', color: 'var(--text2)' }}>→</span>
              </Link>
            ))}
          </div>

          {sold.length > 0 && (
            <div className="card" style={{ borderLeft: '3px solid var(--success)' }}>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>Total P&L (sold)</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: profit >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                {profit >= 0 ? '+' : ''}{fmtCur(profit)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>
                {sold.length} vehicles · avg {avgMargin.toFixed(1)}% margin
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
