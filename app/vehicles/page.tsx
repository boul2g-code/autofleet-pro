'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { computeFin } from '@/lib/financials'
import { fmtCur, fmtNum, catIcon, ALL_STATUSES } from '@/lib/utils'
import { exportVehiclesCSV } from '@/lib/csvExport'
import StatusBadge from '@/components/vehicles/StatusBadge'
import type { VehicleStatus } from '@/lib/types'

export default function VehiclesPage() {
  const { vehicles, lang, searchQuery, filterStatus, setSearchQuery, setFilterStatus, addVehicle, deleteVehicle, showToast } = useFleetStore()
  const router = useRouter()
  const T = (k: string) => t(lang, k)

  const filtered = vehicles.filter(v => {
    const q = searchQuery.toLowerCase()
    const matchSearch = !q || [v.businessId, v.vin, v.make, v.model, v.plate, v.purchase?.sellerName, v.sale?.buyerName].some(f => (f || '').toLowerCase().includes(q))
    const matchFilter = filterStatus === 'all' || v.status === filterStatus
    return matchSearch && matchFilter
  })

  const handleNew = async () => {
    const id = await addVehicle()
    showToast(T('msg.saved'))
    router.push(`/vehicles/${id}`)
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); e.stopPropagation()
    if (!confirm(T('msg.confirmDel'))) return
    await deleteVehicle(id)
    showToast(T('msg.deleted'))
  }

  return (
    <AppShell>
      {/* Search bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="af-input"
          type="text"
          placeholder={T('msg.search')}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
        />
        <select
          className="af-input"
          style={{ width: 'auto', cursor: 'pointer' }}
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as 'all' | VehicleStatus)}
        >
          <option value="all">{T('actions.all')}</option>
          {ALL_STATUSES.map(s => <option key={s} value={s}>{T(`status.${s}`)}</option>)}
        </select>
        <button className="af-btn af-btn-primary af-btn-sm" onClick={handleNew}>+ {T('nav.newVehicle')}</button>
        <button className="af-btn af-btn-secondary af-btn-sm" onClick={() => exportVehiclesCSV(filtered)} title="Export current list to CSV">📊 CSV</button>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>🚗</div>
          <div style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 20 }}>{T('msg.noVeh')}</div>
          <button className="af-btn af-btn-primary" onClick={handleNew}>+ {T('nav.newVehicle')}</button>
        </div>
      )}

      {/* Desktop table */}
      {filtered.length > 0 && (
        <div style={{ overflowX: 'auto' }} className="desktop-table">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {[`${T('vehicle.make')} / ${T('vehicle.model')}`, T('vehicle.vin'), T('vehicle.plate'), T('vehicle.year'), T('vehicle.mileage'), T('vehicle.status'), T('purchase.priceGross'), T('sale.priceGross'), 'P&L', ''].map((h, i) => (
                  <th key={i} style={{ textAlign: 'left', padding: '10px 12px', fontSize: 11, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => {
                const fin = computeFin(v)
                return (
                  <tr
                    key={v.id}
                    onClick={() => router.push(`/vehicles/${v.id}`)}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).querySelectorAll('td').forEach(td => (td.style.background = 'rgba(240,165,0,0.03)'))}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).querySelectorAll('td').forEach(td => (td.style.background = ''))}
                  >
                    <td style={{ padding: '12px', borderBottom: '1px solid rgba(42,42,62,0.5)' }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{catIcon(v.category)} {v.make || '—'} {v.model}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{v.businessId} · {T(`cat.${v.category}`)} {v.color ? `· ${v.color}` : ''}</div>
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid rgba(42,42,62,0.5)', fontFamily: 'IBM Plex Mono', fontSize: 11, color: 'var(--muted)' }}>{v.vin || '—'}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid rgba(42,42,62,0.5)' }}>
                      {v.plate ? <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, background: 'var(--surface)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>{v.plate}</span> : '—'}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid rgba(42,42,62,0.5)' }}>{v.year || '—'}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid rgba(42,42,62,0.5)' }}>{v.mileage ? fmtNum(v.mileage) + ' km' : '—'}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid rgba(42,42,62,0.5)' }}><StatusBadge status={v.status} label={T(`status.${v.status}`)} /></td>
                    <td style={{ padding: '12px', borderBottom: '1px solid rgba(42,42,62,0.5)', fontFamily: 'IBM Plex Mono', fontSize: 13 }}>{v.purchase?.priceGross ? fmtCur(v.purchase.priceGross, v.purchase.currency) : '—'}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid rgba(42,42,62,0.5)', fontFamily: 'IBM Plex Mono', fontSize: 13 }}>{v.sale?.priceGross ? fmtCur(v.sale.priceGross, v.sale.currency) : '—'}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid rgba(42,42,62,0.5)', fontFamily: 'IBM Plex Mono', fontSize: 13, color: fin.profit === null ? 'var(--muted)' : fin.profit >= 0 ? 'var(--success)' : 'var(--error)' }}>
                      {fin.profit !== null ? fmtCur(fin.profit) : '—'}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid rgba(42,42,62,0.5)' }} onClick={e => handleDelete(e, v.id)}>
                      <button className="af-btn af-btn-danger af-btn-xs">✕</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile cards */}
      {filtered.length > 0 && (
        <div className="mobile-cards">
          {filtered.map(v => {
            const fin = computeFin(v)
            return (
              <Link key={v.id} href={`/vehicles/${v.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="af-card" style={{ marginBottom: 10, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{catIcon(v.category)} {v.make || '—'} {v.model} {v.year}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'IBM Plex Mono' }}>{v.businessId}{v.vin ? ` · VIN: ${v.vin}` : ''}</div>
                    </div>
                    <StatusBadge status={v.status} label={''} />
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {v.plate && <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, background: 'var(--surface)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>{v.plate}</span>}
                    <span style={{ flex: 1, fontSize: 11, color: 'var(--muted)' }}>{v.mileage ? fmtNum(v.mileage) + ' km' : ''}</span>
                    <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, color: fin.profit !== null ? (fin.profit >= 0 ? 'var(--success)' : 'var(--error)') : 'var(--muted)' }}>
                      {fin.profit !== null ? fmtCur(fin.profit) : '—'}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      <style>{`
        .desktop-table { display: block; }
        .mobile-cards { display: none; }
        @media(max-width: 768px) {
          .desktop-table { display: none !important; }
          .mobile-cards { display: block !important; }
        }
      `}</style>
    </AppShell>
  )
}
