'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppShell from '@/components/AppShell'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { dbGetVehicle } from '@/lib/supabase/db'
import type { Vehicle } from '@/lib/types'
import InfoTab from '@/components/tabs/InfoTab'
import PurchaseTab from '@/components/tabs/PurchaseTab'
import TransportInTab from '@/components/tabs/TransportInTab'
import StorageTab from '@/components/tabs/StorageTab'
import SaleTab from '@/components/tabs/SaleTab'
import TransportOutTab from '@/components/tabs/TransportOutTab'
import DocumentsTab from '@/components/tabs/DocumentsTab'
import FinancialsTab from '@/components/tabs/FinancialsTab'

const TABS = [
  { key: 'info', label: 'tab.info' },
  { key: 'purchase', label: 'tab.purchase' },
  { key: 'transportIn', label: 'tab.transportIn' },
  { key: 'storage', label: 'tab.storage' },
  { key: 'sale', label: 'tab.sale' },
  { key: 'transportOut', label: 'tab.transportOut' },
  { key: 'documents', label: 'tab.documents' },
  { key: 'financials', label: 'tab.financials' },
]

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { vehicles, deleteVehicle, settings } = useFleetStore()
  const lang = settings.lang
  const [activeTab, setActiveTab] = useState('info')
  const [deleting, setDeleting] = useState(false)
  const [confirmDel, setConfirmDel] = useState(0)
  const [fetchedVehicle, setFetchedVehicle] = useState<Vehicle | null>(null)
  const [fetching, setFetching] = useState(true)

  // Try to get from store first, otherwise fetch directly from DB
  const storeVehicle = vehicles.find(x => x.id === id)

  useEffect(() => {
    setActiveTab('info')
    setFetching(true)
    
    if (storeVehicle) {
      setFetchedVehicle(null)
      setFetching(false)
      return
    }

    // Not in store yet — fetch directly from Supabase
    dbGetVehicle(id).then(v => {
      if (v) {
        setFetchedVehicle(v)
        // Also add to store so it's available
        useFleetStore.setState(s => {
          const exists = s.vehicles.find(x => x.id === id)
          if (exists) return s
          return { vehicles: [v, ...s.vehicles] }
        })
      }
      setFetching(false)
    })
  }, [id])

  const v = storeVehicle || fetchedVehicle

  if (fetching) {
    return (
      <AppShell>
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text2)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <p>Loading vehicle...</p>
        </div>
      </AppShell>
    )
  }

  if (!v) {
    return (
      <AppShell>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: 'var(--text2)' }}>{t(lang, 'err.notFound')}</p>
          <button className="btn btn-ghost" onClick={() => router.push('/vehicles')} style={{ marginTop: 12 }}>
            ← {t(lang, 'action.backToList')}
          </button>
        </div>
      </AppShell>
    )
  }

  const handleDelete = async () => {
    if (confirmDel === 0) { setConfirmDel(1); return }
    if (confirmDel === 1) {
      const ok = window.confirm(`Delete ${v.make || ''} ${v.model || ''} ${v.plate || ''}? This cannot be undone.`)
      if (!ok) { setConfirmDel(0); return }
      setDeleting(true)
      await deleteVehicle(id)
      router.push('/vehicles')
    }
  }

  return (
    <AppShell>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <button className="btn btn-ghost" onClick={() => router.push('/vehicles')} style={{ padding: '6px 12px' }}>
          ← {t(lang, 'action.backToList')}
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
            {v.make || '— New Vehicle —'} {v.model || ''} {v.year ? `(${v.year})` : ''}
          </h1>
          <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
            {v.plate && <span style={{ color: 'var(--text2)', fontSize: 13 }}>📋 {v.plate}</span>}
            {v.vin && <span style={{ color: 'var(--text2)', fontSize: 13 }}>🔢 {v.vin}</span>}
            <span className={`badge status-${v.status}`}>{t(lang, `status.${v.status}`)}</span>
          </div>
        </div>
        <button className="btn btn-danger" onClick={handleDelete} disabled={deleting} style={{ fontSize: 13 }}>
          {confirmDel === 1 ? '⚠️ Confirm Delete' : `🗑️ ${t(lang, 'action.delete')}`}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 0, marginBottom: 16, overflowX: 'auto', borderBottom: '1px solid var(--border)' }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '9px 14px', fontSize: 13, border: 'none', cursor: 'pointer',
              background: 'transparent', whiteSpace: 'nowrap',
              color: activeTab === tab.key ? 'var(--primary)' : 'var(--text2)',
              borderBottom: activeTab === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
              fontWeight: activeTab === tab.key ? 600 : 400,
            }}>
            {t(lang, tab.label)}
          </button>
        ))}
      </div>

      <div className="card">
        {activeTab === 'info' && <InfoTab id={id} />}
        {activeTab === 'purchase' && <PurchaseTab id={id} />}
        {activeTab === 'transportIn' && <TransportInTab id={id} />}
        {activeTab === 'storage' && <StorageTab id={id} />}
        {activeTab === 'sale' && <SaleTab id={id} />}
        {activeTab === 'transportOut' && <TransportOutTab id={id} />}
        {activeTab === 'documents' && <DocumentsTab id={id} />}
        {activeTab === 'financials' && <FinancialsTab id={id} />}
      </div>
    </AppShell>
  )
}
