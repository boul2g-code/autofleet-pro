'use client'
import { useState, useRef } from 'react'
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
  const printFrameRef = useRef<HTMLIFrameElement>(null)

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = vehicles.filter(v => v.status === s).length
    return acc
  }, {} as Record<string, number>)

  const filtered = filter === 'all' ? vehicles : vehicles.filter(v => v.status === filter)

  // Print using hidden iframe — works on ALL browsers including PC Chrome/Firefox
  const printPDF = () => {
    const rows = filtered.map(v => {
      const fin = calcFinancials(v)
      const profitColor = fin.saleRevenue > 0 ? (fin.grossProfit >= 0 ? '#16a34a' : '#dc2626') : '#666'
      const profitText = fin.saleRevenue > 0
        ? (fin.grossProfit >= 0 ? '+' : '') + '€' + fin.grossProfit.toLocaleString()
        : '—'
      return `<tr>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb"><b>${v.make || ''} ${v.model || ''}</b></td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;color:#555">${v.plate || '—'}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;color:#555">${v.year || '—'}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;color:#555">${v.mileage ? v.mileage.toLocaleString() + ' km' : '—'}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb">${t(lang, `status.${v.status}`)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;color:#555">${v.purchase?.price ? '€' + v.purchase.price.toLocaleString() : '—'}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;color:${profitColor};font-weight:600">${profitText}</td>
      </tr>`
    }).join('')

    const filterLabel = filter === 'all'
      ? t(lang, 'manifest.filterAll')
      : t(lang, `status.${filter}`)

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Fleet Manifest</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 11px; padding: 20px; color: #1f2937; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; border-bottom: 2px solid #1e293b; padding-bottom: 12px; }
  .header h1 { font-size: 18px; font-weight: 700; }
  .header .meta { color: #6b7280; font-size: 10px; margin-top: 4px; }
  .header .logo { font-size: 14px; font-weight: 700; color: #1e293b; text-align: right; }
  table { width: 100%; border-collapse: collapse; }
  thead tr { background: #1e293b; color: white; }
  th { padding: 7px 8px; text-align: left; font-size: 10px; font-weight: 600; }
  tbody tr:nth-child(even) { background: #f8fafc; }
  .footer { margin-top: 16px; padding-top: 8px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 9px; display: flex; justify-content: space-between; }
  @media print { body { padding: 10px; } }
</style>
</head><body>
<div class="header">
  <div>
    <h1>Fleet Manifest — ${filterLabel}</h1>
    <div class="meta">${new Date().toLocaleDateString('el-GR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })} &nbsp;·&nbsp; ${filtered.length} vehicles</div>
  </div>
  <div class="logo">AutoFleet Pro<br><span style="font-size:10px;font-weight:400;color:#6b7280">${(settings as unknown as { org?: { name?: string } })?.org?.name || ''}</span></div>
</div>
<table>
  <thead>
    <tr>
      <th>Vehicle</th>
      <th>Plate</th>
      <th>Year</th>
      <th>Mileage</th>
      <th>Status</th>
      <th>Purchase</th>
      <th>Profit</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
<div class="footer">
  <span>AutoFleet Pro — Fleet Management System</span>
  <span>Page 1</span>
</div>
<script>window.onload = function() { window.focus(); window.print(); }</script>
</body></html>`

    // Method: hidden iframe — no popup blocker on PC
    const iframe = printFrameRef.current
    if (!iframe) return
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (!doc) return
    doc.open()
    doc.write(html)
    doc.close()
    // Give iframe time to render, then print
    setTimeout(() => {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    }, 500)
  }

  return (
    <AppShell>
      {/* Hidden iframe for printing — never visible, never blocked */}
      <iframe
        ref={printFrameRef}
        style={{ position: 'fixed', top: -9999, left: -9999, width: 1, height: 1, border: 'none' }}
        title="print-frame"
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, flex: 1 }}>{t(lang, 'manifest.title')}</h1>
        <button className="btn btn-primary" onClick={printPDF} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          🖨️ {t(lang, 'manifest.printPdf')}
        </button>
      </div>

      {/* Status counters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button onClick={() => setFilter('all')}
          style={{ padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontWeight: filter === 'all' ? 700 : 400,
            background: filter === 'all' ? 'var(--primary)' : 'var(--surface2)',
            color: filter === 'all' ? 'white' : 'var(--text)' }}>
          {t(lang, 'manifest.filterAll')} ({vehicles.length})
        </button>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: filter === s ? 700 : 400,
              background: filter === s ? 'var(--primary)' : 'var(--surface2)',
              color: filter === s ? 'white' : 'var(--text)' }}>
            {t(lang, `status.${s}`)} ({counts[s] || 0})
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text2)' }}>
          {t(lang, 'manifest.empty') || 'No vehicles in this status'}
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
                      <td style={{ padding: '9px 12px', fontWeight: 500,
                        color: fin.saleRevenue > 0 ? (fin.grossProfit >= 0 ? 'var(--success)' : 'var(--danger)') : 'var(--text2)' }}>
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
