'use client'

import Link from 'next/link'
import AppShell from '@/components/layout/AppShell'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { computeFin } from '@/lib/financials'
import { fmtCur, catIcon, statusIcon, ALL_STATUSES } from '@/lib/utils'
import StatusBadge from '@/components/vehicles/StatusBadge'
import type { VehicleStatus } from '@/lib/types'

export default function DashboardPage() {
  const { vehicles, lang } = useFleetStore()
  const T = (k: string) => t(lang, k)

  const total = vehicles.length
  const inStock = vehicles.filter(v => ['purchased', 'transit_in', 'at_depot', 'for_sale'].includes(v.status)).length
  const sold = vehicles.filter(v => ['sold', 'transit_out', 'delivered'].includes(v.status)).length
  const inTransit = vehicles.filter(v => ['transit_in', 'transit_out'].includes(v.status)).length
  const totalProfit = vehicles.filter(v => v.sale?.priceGross).reduce((s, v) => s + (computeFin(v).profit ?? 0), 0)
  const recent = vehicles.slice(0, 8)

  const statCard = (label: string, value: string | number, color: string) => (
    <div className="af-card" style={{ padding: '16px 20px' }}>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, letterSpacing: 0.5 }}>{label}</div>
    </div>
  )

  return (
    <AppShell>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: 12, marginBottom: 20 }}>
        {statCard(T('dashboard.total'), total, 'var(--text)')}
        {statCard(T('dashboard.inStock'), inStock, 'var(--blue)')}
        {statCard(T('dashboard.sold'), sold, 'var(--success)')}
        {statCard(T('dashboard.inTransit'), inTransit, '#ff7043')}
        {statCard(T('dashboard.profit'), `€${(totalProfit / 1000).toFixed(1)}k`, totalProfit >= 0 ? 'var(--success)' : 'var(--error)')}
      </div>

      <div className="dash-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
        {/* Recent */}
        <div className="af-card">
          <div className="af-section-title">{T('dashboard.recent')}</div>
          {recent.length === 0
            ? <div style={{ color: 'var(--muted)', textAlign: 'center', padding: 20 }}>{T('dashboard.noRecent')}</div>
            : recent.map(v => {
              const fin = computeFin(v)
              return (
                <Link key={v.id} href={`/vehicles/${v.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(42,42,62,0.5)', cursor: 'pointer' }}>
                    <div style={{ width: 40, height: 40, background: 'var(--surface)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, border: '1px solid var(--border)' }}>
                      {catIcon(v.category)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{v.make || '—'} {v.model} {v.year}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'IBM Plex Mono', color: 'var(--accent)' }}>{v.businessId}</span>
                        {v.plate && <span style={{ fontFamily: 'IBM Plex Mono', background: 'var(--surface)', padding: '1px 6px', borderRadius: 4, border: '1px solid var(--border)', fontSize: 11 }}>{v.plate}</span>}
                        <StatusBadge status={v.status} label={T(`status.${v.status}`)} />
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
                      {v.purchase?.priceGross ? fmtCur(v.purchase.priceGross, v.purchase.currency) : '—'}
                    </div>
                  </div>
                </Link>
              )
            })
          }
          <div style={{ marginTop: 12, textAlign: 'right' }}>
            <Link href="/vehicles"><button className="af-btn af-btn-ghost af-btn-sm">{T('actions.all')} →</button></Link>
          </div>
        </div>

        {/* Status overview */}
        <div className="af-card">
          <div className="af-section-title">{T('dashboard.statusOverview')}</div>
          {ALL_STATUSES.map(s => {
            const cnt = vehicles.filter(v => v.status === s).length
            return (
              <div key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(42,42,62,0.5)' }}>
                <StatusBadge status={s as VehicleStatus} label={T(`status.${s}`)} />
                <div style={{ fontFamily: 'IBM Plex Mono', fontWeight: 600, color: cnt > 0 ? 'var(--accent)' : 'var(--muted)' }}>{cnt}</div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`@media(max-width:640px){ .dash-grid { grid-template-columns: 1fr !important; } }`}</style>
    </AppShell>
  )
}
