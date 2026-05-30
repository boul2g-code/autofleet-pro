'use client'
import { useState } from 'react'
import AppShell from '@/components/AppShell'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { calcFinancials, fmtCur } from '@/lib/financials'
import type { VehicleStatus } from '@/lib/types'
import Link from 'next/link'

const STATUSES: VehicleStatus[] = ['purchased','transit_in','stored','for_sale','sold','transit_out','delivered']

export default function ManifestPage() {
  const { vehicles, settings } = useFleetStore()
  const lang = settings.lang
  const [filter, setFilter] = useState<VehicleStatus | 'all'>('all')

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = vehicles.filter(v => v.status === s).length
    return acc
  }, {} as Record<string, number>)

  const filtered = filter === 'all' ? vehicles : vehicles.filter(v => v.status === filter)

  const printPDF = () => {
    const win = window.open('', '_blank')
    if (!win) return
    const rows = filtered.map(v => {
      const fin = calcFinancials(v)
      return `<tr>
        <td>${v.make || ''} ${v.model || ''}</td>
        <td>${v.plate || ''}</td>
        <td>${v.year || ''}</td>
        <td>${v.mileage?.toLocaleString() || ''}</td>
        <td>${t(lang, `status.${v.status}`)}</td>
        <td>${v.purchase?.price ? '€' + v.purchase.price.toLocaleString() : ''}</td>
        <td>${fin.saleRevenue > 0 ? (fin.grossProfit >= 0 ? '+' : '') + '€' + fin.grossProfit.toLocaleString() : ''}</td>
      </tr>`
    }).join('')
    win.document.write(`
      <html><head><title>Fleet Manifest</title>
      <style>body{font-family:Arial,sans-serif;font-size:11px;padding:16px}h1{font-size:16px;margin-bottom:4px}p{color:#666;font-size:11px;margin-bottom:12px}table{width:100%;border-collapse:collapse}th{background:#1e293b;color:white;padding:6px 8px;text-align:left;font-size:10px}td{padding:5px 8px;border-bottom:1px solid #ddd}tr:nth-child(even){background:#f8f9fa}@media print{body{padding:8px}}</style>
      </head><body>
      <h1>Fleet Manifest — ${filter === 'all' ? 'All Vehicles' : t(lang, `status.${filter}`)}</h1>
      <p>${new Date().toLocaleDateString()} · ${filtered.length} vehicles · ${settings.org?.name || 'AutoFleet Pro'}</p>
      <table>
        <tr><th>Vehicle</th><th>Plate</th><th>Year</th><th>km</th><th>Status</th><th>Purchase</th><th>Profit</th></tr>
        ${rows}
      </table>
      <script>window.onload=()=>{window.print()}</script>
      </body></html>
    `)
    win.document.close()
  }

  return (
    <AppShell>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, flex: 1 }}>{t(lang, 'manifest.title')}</h1>
        <button className="btn btn-ghost" onClick={printPDF}>🖨️ {t(lang, 'manifest.printPdf')}</button>
      </div>

      {/* Status counters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button onClick={() => setFilter('all')}
          style={{ padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: filter === 'all' ? 700 : 400, background: filter === 'all' ? 'var(--primary)' : 'var(--surface2)', color: 'var(--text)' }}>
          {t(lang, 'manifest.filterAll')} ({vehicles.length})
        </button>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: filter === s ? 700 : 400, background: filter === s ? 'var(--primary)' : 'var(--surface2)', color: 'var(--text)' }}>
            {t(lang, `status.${s}`)} ({counts[s] || 0})
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text2)' }}>
          No vehicles in this status
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                  {['Vehicle','Plate','Year','km','Status','Purchase','Profit'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text2)', fontWeight: 500, fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => {
                  const fin = calcFinancials(v)
                  return (
                    <tr key={v.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '9px 12px' }}>
                        <Link href={`/vehicles/${v.id}`} style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 500 }}>
                          {v.make} {v.model}
                        </Link>
                      </td>
                      <td style={{ padding: '9px 12px', color: 'var(--text2)' }}>{v.plate || '—'}</td>
                      <td style={{ padding: '9px 12px', color: 'var(--text2)' }}>{v.year || '—'}</td>
                      <td style={{ padding: '9px 12px', color: 'var(--text2)' }}>{v.mileage?.toLocaleString() || '—'}</td>
                      <td style={{ padding: '9px 12px' }}>
                        <span className={`badge status-${v.status}`}>{t(lang, `status.${v.status}`)}</span>
                      </td>
                      <td style={{ padding: '9px 12px', color: 'var(--text2)' }}>{v.purchase?.price ? fmtCur(v.purchase.price) : '—'}</td>
                      <td style={{ padding: '9px 12px', fontWeight: 500, color: fin.saleRevenue > 0 ? (fin.grossProfit >= 0 ? 'var(--success)' : 'var(--danger)') : 'var(--text2)' }}>
                        {fin.saleRevenue > 0 ? fmtCur(fin.grossProfit) : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppShell>
  )
}
