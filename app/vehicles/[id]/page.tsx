'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AppShell from '@/components/AppShell'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import InfoTab from '@/components/tabs/InfoTab'
import PurchaseTab from '@/components/tabs/PurchaseTab'
import TransportInTab from '@/components/tabs/TransportInTab'
import StorageTab from '@/components/tabs/StorageTab'
import SaleTab from '@/components/tabs/SaleTab'
import TransportOutTab from '@/components/tabs/TransportOutTab'
import DocumentsTab from '@/components/tabs/DocumentsTab'
import FinancialsTab from '@/components/tabs/FinancialsTab'
import InspectionTab from '@/components/tabs/InspectionTab'
import ListingsTab from '@/components/tabs/ListingsTab'
import FlyerTab from '@/components/tabs/FlyerTab'
import ScoreTab from '@/components/tabs/ScoreTab'

const TABS = [
  { key: 'info',         label: 'tab.info' },
  { key: 'purchase',     label: 'tab.purchase' },
  { key: 'transportIn',  label: 'tab.transportIn' },
  { key: 'storage',      label: 'tab.storage' },
  { key: 'sale',         label: 'tab.sale' },
  { key: 'transportOut', label: 'tab.transportOut' },
  { key: 'documents',    label: 'tab.documents' },
  { key: 'financials',   label: 'tab.financials' },
  { key: 'inspection',   label: 'tab.inspection' },
  { key: 'score',        label: 'tab.score' },
  { key: 'listings',     label: 'tab.listings' },
  { key: 'flyer',        label: 'tab.flyer' },
]

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { vehicles, deleteVehicle, flushSave, flushAll, settings, loading, saving, savedId } = useFleetStore()
  const lang = settings.lang
  const [activeTab, setActiveTab] = useState('info')
  const [deleting, setDeleting] = useState(false)
  const [confirmDel, setConfirmDel] = useState(0)
  const [waited, setWaited] = useState(false)

  const v = vehicles.find(x => x.id === id)

  useEffect(() => { setActiveTab('info') }, [id])

  // Wait up to 3s for vehicle to appear after creation
  useEffect(() => {
    if (v) return
    const timer = setTimeout(() => setWaited(true), 3000)
    return () => clearTimeout(timer)
  }, [v])

  // Flush save when changing tabs (so data is never lost on tab switch)
  const handleTabChange = useCallback(async (tabKey: string) => {
    if (id) await flushSave(id)
    setActiveTab(tabKey)
  }, [id, flushSave])

  // Flush all on page leave / back button
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saving) {
        e.preventDefault()
        e.returnValue = ''
        flushAll()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [saving, flushAll])

  if (!v && (loading || !waited)) {
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

  const handleBack = async () => {
    await flushSave(id)
    router.push('/vehicles')
  }

  return (
    <AppShell>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <button className="btn btn-ghost" onClick={handleBack} style={{ padding: '6px 12px' }}>
          ← {t(lang, 'action.backToList')}
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
            {v.make || '— New Vehicle —'} {v.model || ''} {v.year ? `(${v.year})` : ''}
          </h1>
          <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
            {v.plate && <span style={{ color: 'var(--text2)', fontSize: 13 }}>📋 {v.plate}</span>}
            {v.vin && <span style={{ color: 'var(--text2)', fontSize: 13 }}>🔢 {v.vin}</span>}
            <span className={`badge status-${v.status}`}>{t(lang, `status.${v.status}`)}</span>
          </div>
        </div>

        {/* Save status indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {saving && (
            <span style={{ fontSize: 12, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
              {lang === 'el' ? 'Αποθήκευση...' : lang === 'de' ? 'Speichern...' : lang === 'fr' ? 'Sauvegarde...' : lang === 'it' ? 'Salvataggio...' : lang === 'es' ? 'Guardando...' : 'Saving...'}
            </span>
          )}
          {!saving && savedId === id && (
            <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>
              ✓ {lang === 'el' ? 'Αποθηκεύτηκε' : lang === 'de' ? 'Gespeichert' : lang === 'fr' ? 'Enregistré' : lang === 'it' ? 'Salvato' : lang === 'es' ? 'Guardado' : 'Saved'}
            </span>
          )}
          {/* Manual Save button - always visible */}
          <button
            className="btn btn-primary"
            onClick={() => flushSave(id)}
            disabled={saving}
            style={{ fontSize: 12, padding: '6px 14px' }}
          >
            💾 {lang === 'el' ? 'Αποθήκευση' : lang === 'de' ? 'Speichern' : lang === 'fr' ? 'Enregistrer' : lang === 'it' ? 'Salva' : lang === 'es' ? 'Guardar' : 'Save'}
          </button>
        </div>

        <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}
          style={{ fontSize: 13 }}>
          {confirmDel === 1 ? '⚠️ Confirm Delete' : `🗑️ ${t(lang, 'action.delete')}`}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, overflowX: 'auto', borderBottom: '1px solid var(--border)' }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => handleTabChange(tab.key)}
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

      {/* Tab content */}
      <div className="card">
        {activeTab === 'info'         && <InfoTab id={id} />}
        {activeTab === 'purchase'     && <PurchaseTab id={id} />}
        {activeTab === 'transportIn'  && <TransportInTab id={id} />}
        {activeTab === 'storage'      && <StorageTab id={id} />}
        {activeTab === 'sale'         && <SaleTab id={id} />}
        {activeTab === 'transportOut' && <TransportOutTab id={id} />}
        {activeTab === 'documents'    && <DocumentsTab id={id} />}
        {activeTab === 'financials'   && <FinancialsTab id={id} />}
        {activeTab === 'inspection'   && <InspectionTab id={id} />}
        {activeTab === 'score'        && <ScoreTab id={id} />}
        {activeTab === 'listings'     && <ListingsTab id={id} />}
        {activeTab === 'flyer'        && <FlyerTab id={id} />}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </AppShell>
  )
}
