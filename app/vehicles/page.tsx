'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import AppShell from '@/components/AppShell'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { calcFinancials, fmtCur } from '@/lib/financials'
import type { VehicleStatus } from '@/lib/types'

const STATUS_FILTERS: (VehicleStatus | 'all')[] = [
  'all','purchased','transit_in','stored','for_sale','sold','transit_out','delivered'
]

export default function VehiclesPage() {
  const router = useRouter()
  const { vehicles, addVehicle, settings, loading } = useFleetStore()
  const lang = settings.lang
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('all')
  const [adding, setAdding] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return vehicles.filter(v => {
      if (statusFilter !== 'all' && v.status !== statusFilter) return false
      if (!q) return true
      return [v.make, v.model, v.plate, v.vin, v.color, String(v.year || '')]
        .some(f => (f || '').toLowerCase().includes(q))
    })
  }, [vehicles, search, statusFilter])

  const handleAdd = async () => {
    if (adding) return
    setAdding(true)
    try {
      const v = await addVehicle()
      if (v) router.push(`/vehicles/${v.id}`)
    } finally {
      setAdding(false)
    }
  }

  return (
    <AppShell>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, flex: 1 }}>{t(lang, 'nav.vehicles')}</h1>
        <button className="btn btn-primary" onClick={handleAdd} disabled={adding}>
          {adding ? '⏳ ...' : `+ ${t(lang, 'veh.new')}`}
        </button>
      </div>

      {/* Search + filter */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          placeholder={`🔍 ${t(lang, 'veh.search')}`}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 280 }}
        />
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{
                padding: '5px 10px', borderRadius: 6, border: 'none', fontSize: 12,
                cursor: 'pointer', fontWeight: statusFilter === s ? 700 : 400,
                background: statusFilter === s ? 'var(--primary)' : 'var(--surface2)',
                color: 'var(--text)',
              }}>
              {s === 'all' ? t(lang, 'veh.all') : t(lang, `status.${s}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text2)' }}>⏳</div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text2)' }}>
          <div style={{ fontSize: 40 }}>🚗</div>
          <p>{vehicles.length === 0 ? t(lang, 'dash.addFirst') : t(lang, 'veh.noResults')}</p>
          {vehicles.length === 0 && (
            <button className="btn btn-primary" onClick={handleAdd} disabled={adding} style={{ marginTop: 8 }}>
              {adding ? '⏳' : `+ ${t(lang, 'veh.new')}`}
            </button>
          )}
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface2)' }}>
                  {['Make / Model', 'Plate', 'Year', 'km', 'Status', 'Purchase', 'Profit'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text2)', fontWeight: 500, fontSize: 12, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => {
                  const fin = calcFinancials(v)
                  return (
                    <tr key={v.id}
                      onClick={() => router.push(`/vehicles/${v.id}`)}
                      style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.1s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '10px 12px', fontWeight: 500 }}>
                        {v.make || '—'} {v.model || ''}
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--text2)' }}>{v.plate || '—'}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--text2)' }}>{v.year || '—'}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--text2)' }}>
                        {v.mileage ? v.mileage.toLocaleString() : '—'}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span className={`badge status-${v.status}`}>{t(lang, `status.${v.status}`)}</span>
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--text2)' }}>
                        {v.purchase?.price ? fmtCur(v.purchase.price) : '—'}
                      </td>
                      <td style={{ padding: '10px 12px', fontWeight: 500, color: fin.saleRevenue > 0 ? (fin.grossProfit >= 0 ? 'var(--success)' : 'var(--danger)') : 'var(--text2)' }}>
                        {fin.saleRevenue > 0 ? fmtCur(fin.grossProfit) : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', color: 'var(--text2)', fontSize: 12 }}>
            {filtered.length} vehicles
          </div>
        </div>
      )}
    </AppShell>
  )
}
