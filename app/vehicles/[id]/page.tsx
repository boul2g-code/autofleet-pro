'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { catIcon, fmtCur, ALL_STATUSES } from '@/lib/utils'
import { computeFin } from '@/lib/financials'
import { generateVehiclePDF } from '@/lib/pdf'
import StatusBadge from '@/components/vehicles/StatusBadge'
import InfoTab from '@/components/tabs/InfoTab'
import PurchaseTab from '@/components/tabs/PurchaseTab'
import TransportTab from '@/components/tabs/TransportTab'
import StorageTab from '@/components/tabs/StorageTab'
import SaleTab from '@/components/tabs/SaleTab'
import DocumentsTab from '@/components/tabs/DocumentsTab'
import FinancialsTab from '@/components/tabs/FinancialsTab'
import ListingsTab from '@/components/tabs/ListingsTab'
import InspectionTab from '@/components/tabs/InspectionTab'
import type { TabKey, VehicleStatus } from '@/lib/types'

// Next.js 14: params is a plain object, not a Promise (that's Next.js 15+)
interface Props { params: { id: string } }

export default function VehicleDetailPage({ params }: Props) {
  const { id } = params
  const { lang, activeTab, setActiveTab, vehicles, updateVehicle, deleteVehicle, showToast, settings } = useFleetStore()
  const router = useRouter()

  // Reset to info tab whenever the vehicle id changes
  useEffect(() => { setActiveTab('info') }, [id, setActiveTab])

  // Derive vehicle reactively from store so updates re-render this page
  const v = vehicles.find(x => x.id === id)
  const T = (k: string) => t(lang, k)

  if (!v) {
    return (
      <AppShell>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, opacity: 0.4, marginBottom: 16 }}>🚗</div>
          <div style={{ color: 'var(--muted)', marginBottom: 20 }}>Vehicle not found</div>
          <button className="af-btn af-btn-primary" onClick={() => router.push('/vehicles')}>← {T('actions.back')}</button>
        </div>
      </AppShell>
    )
  }

  const fin = computeFin(v)

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'info', label: T('tabs.info') },
    { key: 'purchase', label: T('tabs.purchase') },
    { key: 'importT', label: T('tabs.importT') },
    { key: 'storage', label: T('tabs.storage') },
    { key: 'sale', label: T('tabs.sale') },
    { key: 'exportT', label: T('tabs.exportT') },
    { key: 'documents', label: T('tabs.documents') },
    { key: 'financials', label: T('tabs.financials') },
    { key: 'inspection', label: lang === 'el' ? '🔍 Επιθεώρηση' : lang === 'de' ? '🔍 Inspektion' : '🔍 Inspection' },
    { key: 'listings', label: lang === 'el' ? '🌍 Αγγελίες & QR' : lang === 'de' ? '🌍 Inserate & QR' : '🌍 Listings & QR' },
  ]

  const handleDelete = async () => {
    // First confirmation
    const confirmed1 = confirm(T('msg.confirmDel'))
    if (!confirmed1) return
    // Second confirmation — with vehicle name
    const vName = `${v.make || ''} ${v.model || ''} ${v.plate ? `(${v.plate})` : ''}`.trim()
    const confirmed2 = confirm(
      lang === 'el'
        ? `⚠️ ΤΕΛΙΚΗ ΕΠΙΒΕΒΑΙΩΣΗ\n\nΔιαγραφή: ${vName}\n\nΌλα τα δεδομένα θα χαθούν οριστικά. Είστε σίγουροι;`
        : lang === 'de'
        ? `⚠️ ENDGÜLTIGE BESTÄTIGUNG\n\nLöschen: ${vName}\n\nAlle Daten werden unwiderruflich gelöscht. Sicher?`
        : `⚠️ FINAL CONFIRMATION\n\nDelete: ${vName}\n\nAll data will be permanently lost. Are you sure?`
    )
    if (!confirmed2) return
    await deleteVehicle(v.id)
    showToast(T('msg.deleted'))
    router.push('/vehicles')
  }

  const handleFlyer = () => {
    const a = document.createElement('a')
    a.href = `/api/flyer?vehicleId=${encodeURIComponent(v.id)}`
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handlePDF = () => generateVehiclePDF(v, fin, lang, settings)

  const currentTab = activeTab || 'info'

  return (
    <AppShell>
      {/* Vehicle header */}
      <div className="af-card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ fontSize: 36, flexShrink: 0 }}>
          {v.photo
            ? <Image src={v.photo} alt={`${v.make} ${v.model}`} width={64} height={48} unoptimized style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
            : <span>{catIcon(v.category)}</span>
          }
        </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{v.make || 'New Vehicle'} {v.model} {v.year}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontFamily: 'IBM Plex Mono', color: 'var(--accent)', fontWeight: 600 }}>{v.businessId}</span>
              {v.vin && <span style={{ fontFamily: 'IBM Plex Mono' }}>{v.vin}</span>}
              {v.plate && <span style={{ fontFamily: 'IBM Plex Mono', background: 'var(--surface)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border)', fontSize: 12 }}>{v.plate}</span>}
              <StatusBadge status={v.status} label={T(`status.${v.status}`)} />
              {fin.profit !== null && (
                <span style={{ fontFamily: 'IBM Plex Mono', color: fin.profit >= 0 ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>
                  P&L: {fmtCur(fin.profit)}
                </span>
              )}
            </div>
            {/* Quick status change */}
            <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
              <label style={{ fontSize: 11, color: 'var(--muted)' }}>{T('vehicle.status')}:</label>
              <select
                className="af-input"
                style={{ width: 'auto', padding: '4px 8px', fontSize: 12 }}
                value={v.status}
                onChange={e => updateVehicle(v.id, { status: e.target.value as VehicleStatus })}
              >
                {ALL_STATUSES.map(s => <option key={s} value={s}>{T(`status.${s}`)}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="af-btn af-btn-secondary af-btn-sm" onClick={handleFlyer}
              style={{ background: 'rgba(74,144,226,0.1)', border: '1px solid rgba(74,144,226,0.3)', color: 'var(--blue)' }}>
              🖼️ {lang === 'el' ? 'Φυλλάδιο' : lang === 'de' ? 'Flyer' : 'Flyer'}
            </button>
            <button className="af-btn af-btn-secondary af-btn-sm" onClick={handlePDF}
              style={{ background: 'rgba(240,165,0,0.1)', border: '1px solid rgba(240,165,0,0.3)', color: 'var(--accent)' }}>
              📄 {T('actions.pdf')}
            </button>
            <button className="af-btn af-btn-danger af-btn-sm" onClick={handleDelete}>🗑 {T('actions.delete')}</button>
            <button className="af-btn af-btn-ghost af-btn-sm" onClick={() => router.push('/vehicles')}>← {T('actions.back')}</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--border)', marginBottom: 20, overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 16px',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              color: currentTab === tab.key ? 'var(--accent)' : 'var(--muted)',
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${currentTab === tab.key ? 'var(--accent)' : 'transparent'}`,
              whiteSpace: 'nowrap' as const,
              letterSpacing: 0.3,
              transition: 'all 0.15s',
              borderRadius: '6px 6px 0 0',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {currentTab === 'info' && <InfoTab vehicle={v} />}
      {currentTab === 'purchase' && <PurchaseTab vehicle={v} />}
      {currentTab === 'importT' && <TransportTab vehicle={v} mode="import" />}
      {currentTab === 'storage' && <StorageTab vehicle={v} />}
      {currentTab === 'sale' && <SaleTab vehicle={v} />}
      {currentTab === 'exportT' && <TransportTab vehicle={v} mode="export" />}
      {currentTab === 'documents' && <DocumentsTab vehicle={v} />}
      {currentTab === 'financials' && <FinancialsTab vehicle={v} />}
      {currentTab === 'inspection' && <InspectionTab vehicle={v} />}
      {currentTab === 'listings' && <ListingsTab vehicle={v} />}
    </AppShell>
  )
}
