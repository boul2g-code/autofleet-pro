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

const SAVE_LABELS: Record<string, string> = {
  el: 'Αποθήκευση', en: 'Save', de: 'Speichern',
  fr: 'Enregistrer', it: 'Salva', es: 'Guardar',
}
const SAVED_LABELS: Record<string, string> = {
  el: '✓ Αποθηκεύτηκε', en: '✓ Saved', de: '✓ Gespeichert',
  fr: '✓ Enregistré', it: '✓ Salvato', es: '✓ Guardado',
}
const SAVING_LABELS: Record<string, string> = {
  el: 'Αποθήκευση...', en: 'Saving...', de: 'Speichern...',
  fr: 'Sauvegarde...', it: 'Salvataggio...', es: 'Guardando...',
}

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { vehicles, deleteVehicle, flushSave, flushAll, settings, loading, saving, savedId } = useFleetStore()
  const lang = settings.lang
  const [activeTab, setActiveTab] = useState('info')
  const [deleting, setDeleting] = useState(false)
  const [confirmDel, setConfirmDel] = useState(0)
  const [waited, setWaited] = useState(false)
  const [localSaved, setLocalSaved] = useState(false)

  const v = vehicles.find(x => x.id === id)

  useEffect(() => { setActiveTab('info') }, [id])

  useEffect(() => {
    if (v) return
    const timer = setTimeout(() => setWaited(true), 3000)
    return () => clearTimeout(timer)
  }, [v])

  // Show local "saved" when savedId matches
  useEffect(() => {
    if (savedId === id) {
      setLocalSaved(true)
      const t = setTimeout(() => setLocalSaved(false), 2000)
      return () => clearTimeout(t)
    }
  }, [savedId, id])

  const handleTabChange = useCallback(async (tabKey: string) => {
    if (id) await flushSave(id)
    setActiveTab(tabKey)
  }, [id, flushSave])

  const handleSave = async () => {
    await flushSave(id)
  }

  const handleBack = async () => {
    await flushSave(id)
    router.push('/vehicles')
  }

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

  return (
    <AppShell>
      <style>{`
        @keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
        .save-btn-area { display:flex; align-items:center; gap:8px; flex-shrink:0; }
        .vehicle-header { display:flex; align-items:flex-start; gap:10px; margin-bottom:16px; flex-wrap:wrap; }
        .vehicle-title-block { flex:1; min-width:0; }
        .vehicle-actions { display:flex; align-items:center; gap:8px; flex-shrink:0; }
      `}</style>

      {/* ── Header row ── */}
      <div className="vehicle-header">
        <button className="btn btn-ghost" onClick={handleBack} style={{ padding: '6px 12px', flexShrink: 0 }}>
          ←
        </button>

        <div className="vehicle-title-block">
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {v.make || '— New Vehicle —'} {v.model || ''} {v.year ? `(${v.year})` : ''}
          </h1>
          <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
            {v.plate && <span style={{ color: 'var(--text2)', fontSize: 12 }}>📋 {v.plate}</span>}
            {v.vin && <span style={{ color: 'var(--text2)', fontSize: 12 }}>🔢 {v.vin}</span>}
            <span className={`badge status-${v.status}`}>{t(lang, `status.${v.status}`)}</span>
          </div>
        </div>

        {/* ── SAVE AREA — always visible ── */}
        <div className="vehicle-actions">
          {saving && (
            <span style={{ fontSize: 12, color: 'var(--text2)', whiteSpace: 'nowrap' }}>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>{' '}
              {SAVING_LABELS[lang] || 'Saving...'}
            </span>
          )}
          {!saving && localSaved && (
            <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600, whiteSpace: 'nowrap' }}>
              {SAVED_LABELS[lang] || '✓ Saved'}
            </span>
          )}
          {/* 💾 SAVE BUTTON — always visible */}
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
            style={{ fontSize: 13, padding: '7px 16px', minWidth: 80 }}
          >
            💾 {SAVE_LABELS[lang] || 'Save'}
          </button>

          <button
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={deleting}
            style={{ fontSize: 13, padding: '7px 12px' }}
          >
            {confirmDel === 1 ? '⚠️ OK?' : '🗑️'}
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, overflowX: 'auto',
        borderBottom: '1px solid var(--border)', WebkitOverflowScrolling: 'touch' }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => handleTabChange(tab.key)}
            style={{
              padding: '9px 12px', fontSize: 13, border: 'none', cursor: 'pointer',
              background: 'transparent', whiteSpace: 'nowrap', flexShrink: 0,
              color: activeTab === tab.key ? 'var(--primary)' : 'var(--text2)',
              borderBottom: activeTab === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
              fontWeight: activeTab === tab.key ? 600 : 400,
            }}>
            {t(lang, tab.label)}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
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
    </AppShell>
  )
}
