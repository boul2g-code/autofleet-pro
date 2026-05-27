'use client'

import { useState, useRef } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { computeFin } from '@/lib/financials'
import { fmtCur, catIcon, ALL_STATUSES } from '@/lib/utils'
import { escapeHtml } from '@/lib/html'
import type { VehicleStatus } from '@/lib/types'
import { useRouter } from 'next/navigation'

const STATUS_COLORS: Record<VehicleStatus, string> = {
  purchased:   '#4a90e2',
  transit_in:  '#f0a500',
  at_depot:    '#9b59b6',
  for_sale:    '#2ed573',
  sold:        '#00c896',
  transit_out: '#e67e22',
  delivered:   '#95a5a6',
}

const STATUS_ICONS: Record<VehicleStatus, string> = {
  purchased:   '🛒',
  transit_in:  '🚛 →',
  at_depot:    '🏭',
  for_sale:    '🏷️',
  sold:        '✅',
  transit_out: '→ 🚛',
  delivered:   '📦',
}

export default function ManifestPage() {
  const { vehicles, lang, settings } = useFleetStore()
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState<VehicleStatus | 'all'>('all')
  const printRef = useRef<HTMLDivElement>(null)

  const T = (k: string) => t(lang, `manifest.${k}`)
  const now = new Date().toLocaleDateString(
    lang === 'el' ? 'el-GR' : lang === 'de' ? 'de-DE' : lang === 'fr' ? 'fr-FR' : lang === 'it' ? 'it-IT' : lang === 'es' ? 'es-ES' : 'en-GB',
    { day: '2-digit', month: '2-digit', year: 'numeric' }
  )

  // Group vehicles by status
  const grouped = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = vehicles.filter(v => v.status === s)
    return acc
  }, {} as Record<VehicleStatus, typeof vehicles>)

  const displayStatuses = selectedStatus === 'all'
    ? ALL_STATUSES.filter(s => grouped[s].length > 0)
    : [selectedStatus]

  const totalValue = vehicles.reduce((sum, v) => {
    const fin = computeFin(v)
    return sum + (v.status === 'sold' ? fin.sp : parseFloat(v.purchase?.priceGross || '0') || 0)
  }, 0)

  const totalProfit = vehicles
    .filter(v => v.sale?.priceGross)
    .reduce((sum, v) => sum + (computeFin(v).profit ?? 0), 0)

  const handlePrint = () => {
    const esc = (value: string | number | null | undefined) => escapeHtml(String(value ?? ''))
    const fmtMoney = (value: string | number | null | undefined) => escapeHtml(fmtCur(value ?? ''))
    const fmtInteger = (value: string | undefined, suffix = '') => {
      if (!value) return '—'
      const parsed = Number.parseInt(value, 10)
      return Number.isFinite(parsed) ? escapeHtml(`${parsed.toLocaleString()}${suffix}`) : esc(value)
    }

    const style = `
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @page { size: A4; margin: 12mm; }
        body { font-family: Arial, sans-serif; font-size: 9pt; color: #000; background: #fff; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6mm; padding-bottom: 4mm; border-bottom: 2px solid #f0a500; }
        .company { font-size: 14pt; font-weight: bold; color: #0f0f18; }
        .subtitle { font-size: 9pt; color: #666; margin-top: 2mm; }
        .date { font-size: 8pt; color: #888; text-align: right; }
        .status-group { margin-bottom: 6mm; }
        .status-header { display: flex; align-items: center; gap: 6pt; padding: 3mm 4mm; font-size: 10pt; font-weight: bold; margin-bottom: 2mm; border-radius: 4pt; }
        .status-count { background: rgba(255,255,255,0.3); border-radius: 10pt; padding: 1mm 3mm; font-size: 8pt; }
        table { width: 100%; border-collapse: collapse; font-size: 8pt; }
        th { background: #f5f5f5; padding: 2mm 3mm; text-align: left; font-weight: bold; border-bottom: 1px solid #ddd; font-size: 7.5pt; }
        td { padding: 2mm 3mm; border-bottom: 1px solid #eee; vertical-align: top; }
        tr:nth-child(even) td { background: #fafafa; }
        .mono { font-family: monospace; font-size: 7.5pt; }
        .price { font-weight: bold; }
        .profit-pos { color: #27ae60; font-weight: bold; }
        .profit-neg { color: #e74c3c; font-weight: bold; }
        .summary { margin-top: 4mm; padding: 3mm; background: #f8f8f8; border: 1px solid #ddd; border-radius: 4pt; display: flex; gap: 12mm; }
        .summary-item { }
        .summary-label { font-size: 7pt; color: #888; text-transform: uppercase; }
        .summary-value { font-size: 11pt; font-weight: bold; margin-top: 1mm; }
        .footer { position: fixed; bottom: 0; left: 0; right: 0; font-size: 7pt; color: #aaa; text-align: center; padding: 3mm; border-top: 1px solid #eee; }
        @media print { .no-print { display: none !important; } }
      </style>
    `

    const rows = (svehicles: typeof vehicles, status: VehicleStatus) =>
      svehicles.map(v => {
        const fin = computeFin(v)
        const profitVal = fin.profit ?? 0
        return `
          <tr>
            <td class="mono">${esc(v.plate || '—')}</td>
            <td>${esc(`${catIcon(v.category)} ${v.make || ''} ${v.model || ''}`.trim())}</td>
            <td>${esc(v.year || '—')}</td>
            <td class="mono">${esc(v.vin?.slice(-8) || '—')}</td>
            <td>${fmtInteger(v.mileage, ' km')}</td>
            <td>${esc(v.color || '—')}</td>
            <td class="price">${v.purchase?.priceGross ? fmtMoney(v.purchase.priceGross) : '—'}</td>
            ${status === 'sold' || status === 'delivered'
              ? `<td class="price">${v.sale?.priceGross ? fmtMoney(v.sale.priceGross) : '—'}</td>
                 <td class="${profitVal >= 0 ? 'profit-pos' : 'profit-neg'}">${v.sale?.priceGross ? fmtMoney(profitVal) : '—'}</td>`
              : `<td colspan="2">
                  ${status === 'transit_in' ? esc((v.importTransport?.carrier || '—') + (v.importTransport?.arrDate ? ' · ' + v.importTransport.arrDate : '')) : ''}
                  ${status === 'transit_out' ? esc((v.exportTransport?.carrier || '—') + (v.exportTransport?.arrDate ? ' · ' + v.exportTransport.arrDate : '')) : ''}
                  ${status === 'at_depot' ? esc(v.storage?.location ? t(lang, 'loc.' + v.storage.location) : '—') : ''}
                  ${status === 'for_sale' || status === 'purchased' ? '' : ''}
                 </td>`
            }
            <td class="mono" style="font-size:7pt;color:#999">${esc(v.businessId)}</td>
          </tr>`
      }).join('')

    const groups = displayStatuses.map(status => {
      const svehicles = grouped[status]
      if (!svehicles.length) return ''
      return `
        <div class="status-group">
          <div class="status-header" style="background:${STATUS_COLORS[status]}22;color:${STATUS_COLORS[status]};border-left:4px solid ${STATUS_COLORS[status]}">
            ${esc(`${STATUS_ICONS[status]} ${t(lang, 'status.' + status).toUpperCase()}`)}
            <span class="status-count">${svehicles.length}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>${esc(t(lang, 'vehicle.plate'))}</th>
                <th>${esc(`${t(lang, 'vehicle.make')} / ${t(lang, 'vehicle.model')}`)}</th>
                <th>${esc(t(lang, 'vehicle.year'))}</th>
                <th>VIN (last 8)</th>
                <th>${esc(t(lang, 'vehicle.mileage'))}</th>
                <th>${esc(t(lang, 'vehicle.color'))}</th>
                <th>${esc(t(lang, 'purchase.priceGross'))}</th>
                ${status === 'sold' || status === 'delivered'
                  ? `<th>${esc(t(lang, 'sale.priceGross'))}</th><th>${esc(t(lang, 'financials.profit'))}</th>`
                  : `<th colspan="2">${esc(`${t(lang, 'transport.carrier')} / ${t(lang, 'storage.location')}`)}</th>`}
                <th>ID</th>
              </tr>
            </thead>
            <tbody>${rows(svehicles, status)}</tbody>
          </table>
        </div>`
    }).join('')

    const html = `<!DOCTYPE html><html lang="${esc(lang)}"><head><meta charset="UTF-8"><title>${esc(T('title'))}</title>${style}</head>
    <body>
      <div class="header">
        <div>
          <div class="company">🚗 ${esc(settings.companyName || 'AutoFleet Pro')}</div>
          <div class="subtitle">${selectedStatus === 'all' ? esc(`${T('title')} — ${vehicles.length} ${T('totalVehicles')}`) : esc(`${T('title')} — ${t(lang, 'status.' + selectedStatus).toUpperCase()} · ${grouped[selectedStatus as VehicleStatus]?.length}`)}</div>
          ${settings.companyDE ? `<div class="subtitle" style="font-size:7.5pt;color:#999">🇩🇪 ${esc(settings.companyDE)}</div>` : ''}
          ${settings.companyGR ? `<div class="subtitle" style="font-size:7.5pt;color:#999">🇬🇷 ${esc(settings.companyGR)}</div>` : ''}
        </div>
        <div class="date">
          <div>${esc(`${T('generatedOn')} ${now}`)}</div>
          <div style="font-size:10pt;font-weight:bold;color:#f0a500;margin-top:2mm">${esc(T('title').toUpperCase())}</div>
        </div>
      </div>

      ${groups}

      <div class="summary">
        <div class="summary-item"><div class="summary-label">${esc(T('totalVehicles'))}</div><div class="summary-value">${vehicles.length}</div></div>
        ${totalValue > 0 ? `<div class="summary-item"><div class="summary-label">Portfolio</div><div class="summary-value">${fmtMoney(totalValue)}</div></div>` : ''}
        ${totalProfit !== 0 ? `<div class="summary-item"><div class="summary-label">${esc(t(lang, 'financials.profit'))}</div><div class="summary-value" style="color:${totalProfit >= 0 ? '#27ae60' : '#e74c3c'}">${fmtMoney(totalProfit)}</div></div>` : ''}
      </div>

      <div class="footer">${esc(`AutoFleet Pro — ${settings.companyName || ''} — ${now}`)}</div>
      <script>window.print()<\/script>
    </body></html>`

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'
    document.body.appendChild(a); a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 5000)
  }

  return (
    <AppShell>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>📋 {T('title')}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{T('subtitle')} — {now}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="af-btn af-btn-secondary af-btn-sm" onClick={handlePrint}>
            🖨️ {selectedStatus === 'all' ? T('printAll') : T('printStatus')}
          </button>
        </div>
      </div>

      {/* Summary KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px,1fr))', gap: 8, marginBottom: 16 }}>
        {/* All button */}
        <button
          onClick={() => setSelectedStatus('all')}
          style={{ background: selectedStatus === 'all' ? 'rgba(240,165,0,0.15)' : 'var(--surface)', border: `1px solid ${selectedStatus === 'all' ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 10, padding: '10px 12px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
        >
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>All</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)', fontFamily: 'monospace', marginTop: 2 }}>{vehicles.length}</div>
        </button>

        {ALL_STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setSelectedStatus(s)}
            style={{ background: selectedStatus === s ? `${STATUS_COLORS[s]}18` : 'var(--surface)', border: `1px solid ${selectedStatus === s ? STATUS_COLORS[s] : 'var(--border)'}`, borderRadius: 10, padding: '10px 12px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
          >
            <div style={{ fontSize: 10, color: STATUS_COLORS[s], textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, marginBottom: 2 }}>
              {STATUS_ICONS[s]} {t(lang, `status.${s}`)}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: grouped[s].length > 0 ? 'var(--text)' : 'var(--muted)', fontFamily: 'monospace' }}>
              {grouped[s].length}
            </div>
          </button>
        ))}
      </div>

      {/* Vehicle tables by status */}
      <div ref={printRef}>
        {displayStatuses.map(status => {
          const svehicles = grouped[status]
          if (!svehicles.length) return (
            <div key={status} className="af-card" style={{ marginBottom: 12, padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 4, height: 24, background: STATUS_COLORS[status], borderRadius: 2 }} />
                <span style={{ color: STATUS_COLORS[status], fontWeight: 700, fontSize: 13 }}>
                  {STATUS_ICONS[status]} {t(lang, `status.${status}`).toUpperCase()}
                </span>
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 12, padding: '8px 0' }}>{T('noVehicles')}</div>
            </div>
          )

          const groupTotal = svehicles.reduce((sum, v) => {
            return sum + (parseFloat(v.purchase?.priceGross || '0') || 0)
          }, 0)
          const groupProfit = status === 'sold' || status === 'delivered'
            ? svehicles.filter(v => v.sale?.priceGross).reduce((sum, v) => sum + (computeFin(v).profit ?? 0), 0)
            : null

          return (
            <div key={status} className="af-card" style={{ marginBottom: 12, padding: 0, overflow: 'hidden' }}>
              {/* Status header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: `${STATUS_COLORS[status]}12`, borderBottom: `2px solid ${STATUS_COLORS[status]}40` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 4, height: 28, background: STATUS_COLORS[status], borderRadius: 2 }} />
                  <div>
                    <div style={{ color: STATUS_COLORS[status], fontWeight: 700, fontSize: 13 }}>
                      {STATUS_ICONS[status]} {t(lang, `status.${status}`).toUpperCase()}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>
                      {svehicles.length} {t(lang, 'manifest.totalVehicles').toLowerCase()}
                      {groupTotal > 0 && ` · ${fmtCur(groupTotal)}`}
                      {groupProfit !== null && ` · ${t(lang, 'financials.profit')}: `}
                      {groupProfit !== null && <span style={{ color: groupProfit >= 0 ? 'var(--success)' : 'var(--error)', fontWeight: 700 }}>{fmtCur(groupProfit ?? 0)}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['', t(lang,'vehicle.plate'), t(lang,'vehicle.make')+' / '+t(lang,'vehicle.model'), t(lang,'vehicle.year'), t(lang,'vehicle.mileage'), t(lang,'vehicle.color'), t(lang,'purchase.priceGross'),
                        status === 'sold' || status === 'delivered' ? t(lang,'sale.priceGross') : t(lang,'transport.carrier'),
                        status === 'sold' || status === 'delivered' ? t(lang,'financials.profit') : t(lang,'transport.arrDate'),
                      ].map((h, i) => (
                        <th key={i} style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--muted)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {svehicles.map((v, i) => {
                      const fin = computeFin(v)
                      const profitVal = fin.profit ?? 0
                      const carrier = status === 'transit_in' ? v.importTransport?.carrier
                        : status === 'transit_out' ? v.exportTransport?.carrier
                        : status === 'at_depot' ? t(lang, 'loc.' + (v.storage?.location || 'other'))
                        : status === 'for_sale' ? (v.storage?.locDetails || '—')
                        : '—'
                      const eta = status === 'transit_in' ? v.importTransport?.arrDate
                        : status === 'transit_out' ? v.exportTransport?.arrDate
                        : v.purchase?.date || '—'

                      return (
                        <tr
                          key={v.id}
                          onClick={() => router.push(`/vehicles/${v.id}`)}
                          style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)', transition: 'background 0.1s' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(240,165,0,0.05)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'}
                        >
                          <td style={{ padding: '8px 10px', fontSize: 18 }}>{catIcon(v.category)}</td>
                          <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontWeight: 700, fontSize: 12 }}>{v.plate || '—'}</td>
                          <td style={{ padding: '8px 10px', fontWeight: 600 }}>{v.make || '—'} {v.model || ''}</td>
                          <td style={{ padding: '8px 10px', color: 'var(--muted)' }}>{v.year || '—'}</td>
                          <td style={{ padding: '8px 10px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{v.mileage ? parseInt(v.mileage).toLocaleString() + ' km' : '—'}</td>
                          <td style={{ padding: '8px 10px', color: 'var(--muted)' }}>{v.color || '—'}</td>
                          <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', whiteSpace: 'nowrap' }}>
                            {v.purchase?.priceGross ? fmtCur(v.purchase.priceGross, v.purchase.currency) : '—'}
                          </td>
                          {status === 'sold' || status === 'delivered' ? <>
                            <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--success)', whiteSpace: 'nowrap' }}>
                              {v.sale?.priceGross ? fmtCur(v.sale.priceGross, v.sale.currency) : '—'}
                            </td>
                            <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontWeight: 700, color: profitVal >= 0 ? 'var(--success)' : 'var(--error)', whiteSpace: 'nowrap' }}>
                              {v.sale?.priceGross ? fmtCur(profitVal) : '—'}
                            </td>
                          </> : <>
                            <td style={{ padding: '8px 10px', color: 'var(--muted)', fontSize: 11 }}>{carrier || '—'}</td>
                            <td style={{ padding: '8px 10px', color: 'var(--muted)', fontSize: 11, whiteSpace: 'nowrap' }}>{eta || '—'}</td>
                          </>}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </div>
    </AppShell>
  )
}
