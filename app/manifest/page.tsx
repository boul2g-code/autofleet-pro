'use client'
import { useState, useMemo, useRef } from 'react'
import AppShell from '@/components/AppShell'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { calcFinancials, fmtCur } from '@/lib/financials'
import type { VehicleStatus } from '@/lib/types'
import Link from 'next/link'

const STATUSES: VehicleStatus[] = ['purchased','transit_in','stored','for_sale','sold','transit_out','delivered']
type SortKey = 'make' | 'plate' | 'year' | 'mileage' | 'status' | 'purchase' | 'profit' | 'days'
type SortDir = 'asc' | 'desc'

const COLS: { key: SortKey; label: string }[] = [
  { key: 'make',     label: 'Make / Model' },
  { key: 'plate',    label: 'Plate' },
  { key: 'year',     label: 'Year' },
  { key: 'mileage',  label: 'km' },
  { key: 'status',   label: 'Status' },
  { key: 'days',     label: 'Days' },
  { key: 'purchase', label: 'Purchase €' },
  { key: 'profit',   label: 'Profit €' },
]

function daysSince(date?: string) {
  if (!date) return 0
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000)
}

export default function ManifestPage() {
  const { vehicles, settings } = useFleetStore()
  const lang = settings.lang
  const printFrameRef = useRef<HTMLIFrameElement>(null)

  // Multi-select status filter
  const [selectedStatuses, setSelectedStatuses] = useState<Set<VehicleStatus>>(new Set(STATUSES))
  const [sortKey, setSortKey] = useState<SortKey>('make')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const toggleStatus = (s: VehicleStatus) => {
    setSelectedStatuses(prev => {
      const next = new Set(prev)
      if (next.has(s)) { next.delete(s) } else { next.add(s) }
      return next
    })
  }
  const toggleAll = () => {
    if (selectedStatuses.size === STATUSES.length) {
      setSelectedStatuses(new Set())
    } else {
      setSelectedStatuses(new Set(STATUSES))
    }
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const filtered = useMemo(() => {
    const list = vehicles.filter(v => selectedStatuses.has(v.status as VehicleStatus))
    return [...list].sort((a, b) => {
      let va: number | string = 0, vb: number | string = 0
      if (sortKey === 'make') { va = `${a.make||''} ${a.model||''}`.toLowerCase(); vb = `${b.make||''} ${b.model||''}`.toLowerCase() }
      else if (sortKey === 'plate') { va = (a.plate||'').toLowerCase(); vb = (b.plate||'').toLowerCase() }
      else if (sortKey === 'year') { va = a.year||0; vb = b.year||0 }
      else if (sortKey === 'mileage') { va = a.mileage||0; vb = b.mileage||0 }
      else if (sortKey === 'status') { va = a.status||''; vb = b.status||'' }
      else if (sortKey === 'days') { va = daysSince(a.purchase?.date||a.created_at); vb = daysSince(b.purchase?.date||b.created_at) }
      else if (sortKey === 'purchase') { va = a.purchase?.price||0; vb = b.purchase?.price||0 }
      else if (sortKey === 'profit') { va = calcFinancials(a).grossProfit; vb = calcFinancials(b).grossProfit }
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb as string) : (vb as string).localeCompare(va)
      return sortDir === 'asc' ? (va as number)-(vb as number) : (vb as number)-(va as number)
    })
  }, [vehicles, selectedStatuses, sortKey, sortDir])

  const printPDF = () => {
    const sortLabel = COLS.find(c => c.key === sortKey)?.label || sortKey
    const filterLabel = selectedStatuses.size === STATUSES.length
      ? 'All statuses'
      : Array.from(selectedStatuses).join(', ')

    const rows = filtered.map(v => {
      const fin = calcFinancials(v)
      const days = daysSince(v.purchase?.date || v.created_at)
      const profitColor = fin.saleRevenue > 0 ? (fin.grossProfit >= 0 ? '#16a34a' : '#dc2626') : '#666'
      const daysColor = days > 90 ? '#dc2626' : days > 45 ? '#d97706' : '#666'
      return `<tr>
        <td><b>${v.make||''} ${v.model||''}</b>${v.year ? ` <span style="color:#888">(${v.year})</span>` : ''}</td>
        <td>${v.plate||'—'}</td>
        <td style="color:#555">${v.year||'—'}</td>
        <td style="color:#555">${v.mileage ? v.mileage.toLocaleString()+' km' : '—'}</td>
        <td><span style="background:${statusColor(v.status)};color:white;padding:2px 6px;border-radius:4px;font-size:10px">${t(lang,`status.${v.status}`)}</span></td>
        <td style="color:${daysColor};font-weight:${days>60?'600':'400'}">${days}d</td>
        <td style="color:#555">${v.purchase?.price ? '€'+v.purchase.price.toLocaleString() : '—'}</td>
        <td style="color:${profitColor};font-weight:600">${fin.saleRevenue>0 ? (fin.grossProfit>=0?'+':'')+fmtCur(fin.grossProfit) : '—'}</td>
      </tr>`
    }).join('')

    const totalPurchase = filtered.reduce((s, v) => s + (v.purchase?.price || 0), 0)
    const totalProfit = filtered.filter(v => calcFinancials(v).saleRevenue > 0).reduce((s, v) => s + calcFinancials(v).grossProfit, 0)

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Fleet Manifest</title>
<style>
* { box-sizing:border-box; margin:0; padding:0; }
body { font-family:Arial,sans-serif; font-size:11px; padding:16px; color:#1f2937; }
.header { display:flex; justify-content:space-between; border-bottom:2px solid #1e293b; padding-bottom:10px; margin-bottom:12px; }
.header h1 { font-size:17px; font-weight:700; }
.header .meta { font-size:10px; color:#6b7280; margin-top:3px; }
table { width:100%; border-collapse:collapse; }
thead tr { background:#1e293b; color:white; }
th { padding:6px 8px; text-align:left; font-size:10px; }
tbody tr:nth-child(even) { background:#f8fafc; }
td { padding:5px 8px; border-bottom:1px solid #e5e7eb; }
tfoot tr { background:#f1f5f9; font-weight:700; }
.footer { margin-top:12px; color:#9ca3af; font-size:9px; display:flex; justify-content:space-between; border-top:1px solid #e5e7eb; padding-top:6px; }
@media print { body { padding:8px } }
</style></head><body>
<div class="header">
  <div>
    <h1>Fleet Manifest</h1>
    <div class="meta">
      ${new Date().toLocaleDateString('el-GR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})}
      &nbsp;·&nbsp; ${filtered.length} vehicles
      &nbsp;·&nbsp; Filter: ${filterLabel}
      &nbsp;·&nbsp; Sorted by: ${sortLabel} ${sortDir==='asc'?'↑':'↓'}
    </div>
  </div>
  <div style="text-align:right;font-weight:700;font-size:13px">AutoFleet Pro</div>
</div>
<table>
  <thead><tr>
    <th>Vehicle</th><th>Plate</th><th>Year</th><th>km</th><th>Status</th><th>Days</th><th>Purchase €</th><th>Profit €</th>
  </tr></thead>
  <tbody>${rows}</tbody>
  <tfoot><tr>
    <td colspan="6">TOTAL (${filtered.length} vehicles)</td>
    <td>€${totalPurchase.toLocaleString()}</td>
    <td style="color:${totalProfit>=0?'#16a34a':'#dc2626'}">${totalProfit>=0?'+':''}€${Math.abs(totalProfit).toLocaleString()}</td>
  </tr></tfoot>
</table>
<div class="footer">
  <span>AutoFleet Pro — Fleet Management System</span>
  <span>Page 1</span>
</div>
<script>window.onload=function(){window.focus();window.print()}</script>
</body></html>`

    const iframe = printFrameRef.current
    if (!iframe) return
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (!doc) return
    doc.open(); doc.write(html); doc.close()
    setTimeout(() => { iframe.contentWindow?.focus(); iframe.contentWindow?.print() }, 500)
  }

  return (
    <AppShell>
      <iframe ref={printFrameRef}
        style={{ position:'fixed', top:-9999, left:-9999, width:1, height:1, border:'none' }}
        title="print-frame" />

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16, flexWrap:'wrap' }}>
        <h1 style={{ fontSize:22, fontWeight:700, margin:0, flex:1 }}>{t(lang,'manifest.title')}</h1>
        <button className="btn btn-primary" onClick={printPDF} style={{ gap:6 }}>
          🖨️ {t(lang,'manifest.printPdf')}
        </button>
      </div>

      {/* ── CONTROLS ── */}
      <div className="card" style={{ marginBottom:16, padding:16 }}>

        {/* Status multi-select */}
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:12, fontWeight:600, color:'var(--text2)', marginBottom:8 }}>
            {lang==='el'?'Φίλτρο Κατάστασης':lang==='de'?'Status-Filter':lang==='fr'?'Filtre Statut':lang==='it'?'Filtro Stato':lang==='es'?'Filtro Estado':'Status Filter'}
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {/* Select All */}
            <button onClick={toggleAll}
              style={{
                padding:'5px 10px', borderRadius:6, border:'2px solid var(--primary)',
                fontSize:12, cursor:'pointer', fontWeight:600,
                background: selectedStatuses.size===STATUSES.length ? 'var(--primary)' : 'transparent',
                color: selectedStatuses.size===STATUSES.length ? 'white' : 'var(--primary)',
              }}>
              {selectedStatuses.size===STATUSES.length
                ? (lang==='el'?'✓ Όλα':lang==='it'?'✓ Tutti':lang==='de'?'✓ Alle':lang==='fr'?'✓ Tous':lang==='es'?'✓ Todos':'✓ All')
                : (lang==='el'?'Επιλογή Όλων':lang==='it'?'Seleziona tutti':lang==='de'?'Alle wählen':lang==='fr'?'Tout sélectionner':lang==='es'?'Seleccionar todos':'Select All')
              }
            </button>
            {STATUSES.map(s => {
              const count = vehicles.filter(v => v.status === s).length
              const active = selectedStatuses.has(s)
              return (
                <button key={s} onClick={() => toggleStatus(s)}
                  style={{
                    padding:'5px 10px', borderRadius:6, fontSize:12, cursor:'pointer',
                    border:`2px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                    background: active ? 'var(--primary)' : 'transparent',
                    color: active ? 'white' : 'var(--text2)',
                    fontWeight: active ? 600 : 400,
                    opacity: count === 0 ? 0.4 : 1,
                  }}>
                  {t(lang, `status.${s}`)} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {/* Sort controls */}
        <div>
          <div style={{ fontSize:12, fontWeight:600, color:'var(--text2)', marginBottom:8 }}>
            {lang==='el'?'Ταξινόμηση':lang==='de'?'Sortierung':lang==='fr'?'Tri':lang==='it'?'Ordinamento':lang==='es'?'Ordenar':'Sort by'}
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {COLS.map(col => (
              <button key={col.key} onClick={() => handleSort(col.key)}
                style={{
                  padding:'5px 10px', borderRadius:6, fontSize:12, cursor:'pointer',
                  border:`2px solid ${sortKey===col.key ? 'var(--primary)' : 'var(--border)'}`,
                  background: sortKey===col.key ? 'var(--primary)' : 'transparent',
                  color: sortKey===col.key ? 'white' : 'var(--text2)',
                  fontWeight: sortKey===col.key ? 600 : 400,
                }}>
                {col.label} {sortKey===col.key ? (sortDir==='asc'?'↑':'↓') : '↕'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display:'flex', gap:12, marginBottom:12, flexWrap:'wrap' }}>
        {[
          { label: lang==='el'?'Οχήματα':lang==='it'?'Veicoli':'Vehicles', value: filtered.length, color:'#3b82f6' },
          { label: lang==='el'?'Αξία Αγοράς':lang==='it'?'Valore acquisto':'Purchase Value', value: fmtCur(filtered.reduce((s,v)=>s+(v.purchase?.price||0),0)), color:'#f59e0b' },
          { label: lang==='el'?'Συνολικό Κέρδος':lang==='it'?'Profitto totale':'Total Profit',
            value: fmtCur(filtered.filter(v=>calcFinancials(v).saleRevenue>0).reduce((s,v)=>s+calcFinancials(v).grossProfit,0)),
            color:'#22c55e' },
        ].map(kpi => (
          <div key={kpi.label} className="card" style={{ padding:'10px 16px', flex:1, minWidth:120 }}>
            <div style={{ fontSize:11, color:'var(--text2)' }}>{kpi.label}</div>
            <div style={{ fontSize:18, fontWeight:700, color:kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:'32px 0', color:'var(--text2)' }}>
          {lang==='el'?'Δεν υπάρχουν οχήματα με αυτά τα φίλτρα':
           lang==='it'?'Nessun veicolo con questi filtri':
           lang==='de'?'Keine Fahrzeuge mit diesen Filtern':
           'No vehicles match the selected filters'}
        </div>
      ) : (
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ background:'var(--surface2)', borderBottom:'1px solid var(--border)' }}>
                  {COLS.map(col => (
                    <th key={col.key} onClick={() => handleSort(col.key)}
                      style={{
                        padding:'9px 10px', textAlign:'left', fontWeight:500, fontSize:11,
                        whiteSpace:'nowrap', cursor:'pointer', userSelect:'none',
                        color: sortKey===col.key ? 'var(--primary)' : 'var(--text2)',
                      }}>
                      {col.label}{sortKey===col.key?(sortDir==='asc'?' ↑':' ↓'):' ↕'}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => {
                  const fin = calcFinancials(v)
                  const days = daysSince(v.purchase?.date || v.created_at)
                  const catIcon: Record<string,string> = { car:'🚗', truck:'🚛', van:'🚐', bus:'🚌', moto:'🏍️', construction:'🏗️' }
                  return (
                    <tr key={v.id} style={{ borderBottom:'1px solid var(--border)' }}>
                      <td style={{ padding:'8px 10px' }}>
                        <Link href={`/vehicles/${v.id}`} style={{ color:'var(--text)', textDecoration:'none', fontWeight:500 }}>
                          <span style={{ marginRight:4 }}>{catIcon[v.category||'car']||'🚗'}</span>
                          {v.make} {v.model}
                        </Link>
                      </td>
                      <td style={{ padding:'8px 10px', color:'var(--text2)' }}>{v.plate||'—'}</td>
                      <td style={{ padding:'8px 10px', color:'var(--text2)' }}>{v.year||'—'}</td>
                      <td style={{ padding:'8px 10px', color:'var(--text2)' }}>{v.mileage?.toLocaleString()||'—'}</td>
                      <td style={{ padding:'8px 10px' }}>
                        <span className={`badge status-${v.status}`}>{t(lang,`status.${v.status}`)}</span>
                      </td>
                      <td style={{ padding:'8px 10px', fontWeight: days>60?600:400,
                        color: days>90?'var(--danger)':days>45?'#d97706':'var(--text2)' }}>
                        {days}d {days>90?'🔴':days>45?'🟡':''}
                      </td>
                      <td style={{ padding:'8px 10px', color:'var(--text2)' }}>
                        {v.purchase?.price ? fmtCur(v.purchase.price) : '—'}
                      </td>
                      <td style={{ padding:'8px 10px', fontWeight:500,
                        color: fin.saleRevenue>0?(fin.grossProfit>=0?'var(--success)':'var(--danger)'):'var(--text2)' }}>
                        {fin.saleRevenue>0 ? fmtCur(fin.grossProfit) : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              {/* Totals row */}
              <tfoot>
                <tr style={{ background:'var(--surface2)', borderTop:'2px solid var(--border)', fontWeight:700 }}>
                  <td colSpan={6} style={{ padding:'8px 10px', fontSize:12 }}>
                    TOTAL — {filtered.length} {t(lang,'manifest.vehicles')}
                  </td>
                  <td style={{ padding:'8px 10px' }}>
                    {fmtCur(filtered.reduce((s,v)=>s+(v.purchase?.price||0),0))}
                  </td>
                  <td style={{ padding:'8px 10px',
                    color: filtered.filter(v=>calcFinancials(v).saleRevenue>0).reduce((s,v)=>s+calcFinancials(v).grossProfit,0)>=0
                      ? 'var(--success)' : 'var(--danger)' }}>
                    {fmtCur(filtered.filter(v=>calcFinancials(v).saleRevenue>0).reduce((s,v)=>s+calcFinancials(v).grossProfit,0))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </AppShell>
  )
}

function statusColor(s?: string) {
  const map: Record<string,string> = {
    purchased:'#6366f1', transit_in:'#3b82f6', stored:'#f59e0b',
    for_sale:'#8b5cf6', sold:'#22c55e', transit_out:'#0ea5e9', delivered:'#10b981'
  }
  return map[s||''] || '#9ca3af'
}
