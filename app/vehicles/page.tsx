/* eslint-disable react/no-unescaped-entities */
'use client'
import { useState, useMemo, useRef } from 'react'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { calcFinancials, fmtCur } from '@/lib/financials'
import type { VehicleStatus } from '@/lib/types'
import AppShell from '@/components/AppShell'
import InfoTab from '@/components/tabs/InfoTab'
import PurchaseTab from '@/components/tabs/PurchaseTab'
import TransportInTab from '@/components/tabs/TransportInTab'
import StorageTab from '@/components/tabs/StorageTab'
import SaleTab from '@/components/tabs/SaleTab'
import TransportOutTab from '@/components/tabs/TransportOutTab'
import DocumentsTab from '@/components/tabs/DocumentsTab'
import FinancialsTab from '@/components/tabs/FinancialsTab'
import ListingsTab from '@/components/tabs/ListingsTab'
import InspectionTab from '@/components/tabs/InspectionTab'
import FlyerTab from '@/components/tabs/FlyerTab'
import ScoreTab from '@/components/tabs/ScoreTab'
import TimelineTab from '@/components/tabs/TimelineTab'

const STATUS_FILTERS: (VehicleStatus | 'all')[] = [
  'all','purchased','transit_in','stored','for_sale','sold','transit_out','delivered'
]

const TABS = [
  { key: 'info', label: 'tab.info' },
  { key: 'purchase', label: 'tab.purchase' },
  { key: 'transportIn', label: 'tab.transportIn' },
  { key: 'storage', label: 'tab.storage' },
  { key: 'sale', label: 'tab.sale' },
  { key: 'transportOut', label: 'tab.transportOut' },
  { key: 'documents', label: 'tab.documents' },
  { key: 'financials', label: 'tab.financials' },
  { key: 'inspection', label: 'tab.inspection' },
  { key: 'listings', label: 'tab.listings' },
  { key: 'flyer', label: 'tab.flyer' },
  { key: 'score', label: 'tab.score' },
  { key: 'timeline', label: 'tab.timeline' },
]

type SortKey = 'make' | 'plate' | 'year' | 'mileage' | 'status' | 'purchase' | 'profit'
type SortDir = 'asc' | 'desc'

const COLS: { key: SortKey; label: string }[] = [
  { key: 'make',     label: 'Make / Model' },
  { key: 'plate',    label: 'Plate' },
  { key: 'year',     label: 'Year' },
  { key: 'mileage',  label: 'km' },
  { key: 'status',   label: 'Status' },
  { key: 'purchase', label: 'Purchase €' },
  { key: 'profit',   label: 'Profit €' },
]

export default function VehiclesPage() {
  const { vehicles, addVehicle, deleteVehicle, settings, loading } = useFleetStore()
  const lang = settings.lang
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('all')
  const [adding, setAdding] = useState(false)
  const addingRef = useRef(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('info')
  const [confirmDel, setConfirmDel] = useState(0)
  const [sortKey, setSortKey] = useState<SortKey>('make')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const v = selectedId ? vehicles.find(x => x.id === selectedId) || null : null

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const list = vehicles.filter(v => {
      if (statusFilter !== 'all' && v.status !== statusFilter) return false
      if (!q) return true
      return [v.make, v.model, v.plate, v.vin, v.color, String(v.year || ''), v.purchase?.sellerName, v.sale?.buyerName]
        .some(f => (f || '').toLowerCase().includes(q))
    })

    return [...list].sort((a, b) => {
      let valA: number | string = 0
      let valB: number | string = 0

      if (sortKey === 'make') {
        valA = `${a.make || ''} ${a.model || ''}`.trim().toLowerCase()
        valB = `${b.make || ''} ${b.model || ''}`.trim().toLowerCase()
      } else if (sortKey === 'plate') {
        valA = (a.plate || '').toLowerCase()
        valB = (b.plate || '').toLowerCase()
      } else if (sortKey === 'year') {
        valA = a.year || 0
        valB = b.year || 0
      } else if (sortKey === 'mileage') {
        valA = a.mileage || 0
        valB = b.mileage || 0
      } else if (sortKey === 'status') {
        valA = a.status || ''
        valB = b.status || ''
      } else if (sortKey === 'purchase') {
        valA = a.purchase?.price || 0
        valB = b.purchase?.price || 0
      } else if (sortKey === 'profit') {
        valA = calcFinancials(a).grossProfit
        valB = calcFinancials(b).grossProfit
      }

      if (typeof valA === 'string') {
        return sortDir === 'asc' ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA)
      }
      return sortDir === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number)
    })
  }, [vehicles, search, statusFilter, sortKey, sortDir])

  const handleAdd = async () => {
    if (adding || addingRef.current) return
    addingRef.current = true
    setAdding(true)
    try {
      const created = await addVehicle()
      if (created) {
        setSelectedId(created.id)
        setActiveTab('info')
        setConfirmDel(0)
      }
    } finally {
      setAdding(false)
      setTimeout(() => { addingRef.current = false }, 2000)
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return
    if (confirmDel === 0) { setConfirmDel(1); return }
    const veh = vehicles.find(x => x.id === selectedId)
    const ok = window.confirm(`⚠️ Delete ${veh?.make || ''} ${veh?.model || ''} ${veh?.plate || ''}?\n\nThis cannot be undone.`)
    if (!ok) { setConfirmDel(0); return }
    await deleteVehicle(selectedId)
    setSelectedId(null)
    setConfirmDel(0)
  }

  // ── VEHICLE DETAIL VIEW ────────────────────────────────────
  if (selectedId) {
    return (
      <AppShell>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost" onClick={() => { setSelectedId(null); setConfirmDel(0) }} style={{ padding: '6px 12px' }}>
            ← {t(lang, 'action.backToList')}
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
              {v?.make || '— New Vehicle —'} {v?.model || ''} {v?.year ? `(${v.year})` : ''}
            </h1>
            <div style={{ display: 'flex', gap: 8, marginTop: 3, flexWrap: 'wrap', alignItems: 'center' }}>
              {v?.plate && <span style={{ color: 'var(--text2)', fontSize: 13 }}>📋 {v.plate}</span>}
              {v?.vin && <span style={{ color: 'var(--text2)', fontSize: 12 }}>🔢 {v.vin}</span>}
              {v?.status && <span className={`badge status-${v.status}`}>{t(lang, `status.${v.status}`)}</span>}
              {v?.mileage && <span style={{ color: 'var(--text2)', fontSize: 12 }}>📍 {v.mileage.toLocaleString()} km</span>}
            </div>
          </div>
          <button className="btn btn-danger" onClick={handleDelete} style={{ fontSize: 13 }}>
            {confirmDel === 1 ? '⚠️ Confirm?' : `🗑️ ${t(lang, 'action.delete')}`}
          </button>
        </div>

        <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '8px 13px', fontSize: 13, border: 'none', cursor: 'pointer',
                background: 'transparent', whiteSpace: 'nowrap', flexShrink: 0,
                color: activeTab === tab.key ? 'var(--primary)' : 'var(--text2)',
                borderBottom: activeTab === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
                fontWeight: activeTab === tab.key ? 600 : 400,
              }}>
              {t(lang, tab.label)}
            </button>
          ))}
        </div>

        <div className="card">
          {activeTab === 'info' && <InfoTab id={selectedId} />}
          {activeTab === 'purchase' && <PurchaseTab id={selectedId} />}
          {activeTab === 'transportIn' && <TransportInTab id={selectedId} />}
          {activeTab === 'storage' && <StorageTab id={selectedId} />}
          {activeTab === 'sale' && <SaleTab id={selectedId} />}
          {activeTab === 'transportOut' && <TransportOutTab id={selectedId} />}
          {activeTab === 'documents' && <DocumentsTab id={selectedId} />}
          {activeTab === 'financials' && <FinancialsTab id={selectedId} />}
          {activeTab === 'inspection' && <InspectionTab id={selectedId} />}
          {activeTab === 'listings' && <ListingsTab id={selectedId} />}
          {activeTab === 'flyer' && <FlyerTab id={selectedId} />}
          {activeTab === 'score' && <ScoreTab id={selectedId} />}
              {activeTab === 'timeline' && selectedId && <TimelineTab id={selectedId} />}
        </div>
      </AppShell>
    )
  }

  // ── VEHICLE LIST VIEW ──────────────────────────────────────
  return (
    <AppShell>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, flex: 1 }}>{t(lang, 'nav.vehicles')}</h1>
        <button className="btn btn-primary" onClick={handleAdd} disabled={adding}>
          {adding ? '⏳ ...' : `+ ${t(lang, 'veh.new')}`}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          placeholder={`🔍 ${t(lang, 'veh.search')}`}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 300 }}
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
              {s === 'all' ? `${t(lang, 'veh.all')} (${vehicles.length})` : `${t(lang, `status.${s}`)} (${vehicles.filter(v => v.status === s).length})`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text2)' }}>⏳</div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text2)' }}>
          <div style={{ fontSize: 40 }}>🚗</div>
          <p style={{ marginTop: 8 }}>{vehicles.length === 0 ? t(lang, 'dash.addFirst') : t(lang, 'veh.noResults')}</p>
          {vehicles.length === 0 && (
            <button className="btn btn-primary" onClick={handleAdd} disabled={adding} style={{ marginTop: 12 }}>
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
                  {COLS.map(col => (
                    <th key={col.key}
                      onClick={() => handleSort(col.key)}
                      style={{
                        padding: '10px 12px', textAlign: 'left', fontWeight: 500, fontSize: 12,
                        whiteSpace: 'nowrap', cursor: 'pointer', userSelect: 'none',
                        color: sortKey === col.key ? 'var(--primary)' : 'var(--text2)',
                        transition: 'color 0.15s',
                      }}>
                      {col.label}
                      {sortKey === col.key
                        ? (sortDir === 'asc' ? ' ↑' : ' ↓')
                        : ' ↕'}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => {
                  const fin = calcFinancials(v)
                  const catIcon: Record<string, string> = { car:'🚗', truck:'🚛', van:'🚐', bus:'🚌', moto:'🏍️', construction:'🏗️' }
                  return (
                    <tr key={v.id}
                      onClick={() => { setSelectedId(v.id); setActiveTab('info'); setConfirmDel(0) }}
                      style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.1s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '10px 12px', fontWeight: 500 }}>
                        <span style={{ marginRight: 6 }}>{catIcon[v.category || 'car'] || '🚗'}</span>
                        {v.photo && <img src={v.photo} alt="" style={{ width: 32, height: 24, objectFit: 'cover', borderRadius: 4, marginRight: 8, verticalAlign: 'middle' }} />}
                        {v.make || '— New —'} {v.model || ''}
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--text2)' }}>{v.plate || '—'}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--text2)' }}>{v.year || '—'}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--text2)' }}>{v.mileage ? v.mileage.toLocaleString() : '—'}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span className={`badge status-${v.status}`}>{t(lang, `status.${v.status}`)}</span>
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--text2)' }}>{v.purchase?.price ? fmtCur(v.purchase.price) : '—'}</td>
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
            {filtered.length} {t(lang, 'manifest.vehicles')}
            {sortKey && <span style={{ marginLeft: 8 }}>· {t(lang, 'veh.sortedBy') || 'sorted by'} {COLS.find(c => c.key === sortKey)?.label} {sortDir === 'asc' ? '↑' : '↓'}</span>}
          </div>
        </div>
      )}
    </AppShell>
  )
}
