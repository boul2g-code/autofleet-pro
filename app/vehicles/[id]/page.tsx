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

  useEffect(() => {
    if (savedId === id) {
      setLocalSaved(true)
      const t2 = setTimeout(() => setLocalSaved(false), 2500)
      return () => clearTimeout(t2)
    }
  }, [savedId, id])

  const handleTabChange = useCallback(async (tabKey: string) => {
    if (id) await flushSave(id)
    setActiveTab(tabKey)
  }, [id, flushSave])

  const handleSave = async () => { await flushSave(id) }

  const handleBack = async () => {
    await flushSave(id)
    router.push('/vehicles')
  }

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saving) { e.preventDefault(); e.returnValue = ''; flushAll() }
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
      const ok = window.confirm(`Delete ${v.make || ''} ${v.model || ''} ${v.plate || ''}?`)
      if (!ok) { setConfirmDel(0); return }
      setDeleting(true)
      await deleteVehicle(id)
      router.push('/vehicles')
    }
  }

  return (
    <AppShell>
      <style>{`
        @keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
      `}</style>

      {/* ── ROW 1: Back + Title + Delete ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
        <button className="btn btn-ghost" onClick={handleBack} style={{ padding: '5px 10px', fontSize: 13, flexShrink: 0 }}>
          ← {t(lang, 'action.backToList')}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {v.make || '— New Vehicle —'} {v.model || ''} {v.year ? `(${v.year})` : ''}
          </h1>
          <div style={{ display: 'flex', gap: 6, marginTop: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            {v.plate && <span style={{ color: 'var(--text2)', fontSize: 12 }}>📋 {v.plate}</span>}
            {v.vin && <span style={{ color: 'var(--text2)', fontSize: 12 }}>🔢 {v.vin}</span>}
            <span className={`badge status-${v.status}`}>{t(lang, `status.${v.status}`)}</span>
          </div>
        </div>

        <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}
          style={{ fontSize: 12, padding: '5px 10px', flexShrink: 0 }}>
          {confirmDel === 1 ? '⚠️ OK?' : '🗑️'}
        </button>
      </div>

      {/* ── ROW 2: SAVE BAR — full width, always visible ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--surface2)', borderRadius: 8,
        padding: '8px 12px', marginBottom: 12,
        border: '1px solid var(--border)',
      }}>
        {/* Big visible Save button */}
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
          style={{ fontSize: 14, padding: '8px 20px', fontWeight: 600, minWidth: 120 }}
        >
          {saving
            ? `⏳ ${SAVING_LABELS[lang] || 'Saving...'}`
            : `💾 ${SAVE_LABELS[lang] || 'Save'}`
          }
        </button>

        {/* Status text */}
        {!saving && localSaved && (
          <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 600 }}>
            {SAVED_LABELS[lang] || '✓ Saved'}
          </span>
        )}
        {saving && (
          <span style={{ fontSize: 12, color: 'var(--text2)' }}>
            {lang === 'el' ? 'Αποθηκεύεται αυτόματα μετά από 1.5 δευτερόλεπτα παύσης' :
             lang === 'it' ? 'Salvataggio automatico dopo 1.5 secondi' :
             lang === 'de' ? 'Auto-Speicherung nach 1.5 Sek.' :
             'Auto-saves 1.5s after last change'}
          </span>
        )}
        {!saving && !localSaved && (
          <span style={{ fontSize: 12, color: 'var(--text2)' }}>
            {lang === 'el' ? 'Πάτα για άμεση αποθήκευση ή αποθηκεύεται αυτόματα' :
             lang === 'it' ? 'Premi per salvare subito o si salva automaticamente' :
             lang === 'de' ? 'Drücken zum sofortigen Speichern oder auto-speichern' :
             lang === 'fr' ? 'Appuyer pour sauvegarder ou sauvegarde automatique' :
             lang === 'es' ? 'Pulsar para guardar o guardado automático' :
             'Press to save now, or auto-saves after typing stops'}
          </span>
        )}
      </div>

      {/* ── TABS ── */}
      <div style={{
        display: 'flex', gap: 0, marginBottom: 12, overflowX: 'auto',
        borderBottom: '1px solid var(--border)', WebkitOverflowScrolling: 'touch',
      }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => handleTabChange(tab.key)}
            style={{
              padding: '8px 12px', fontSize: 13, border: 'none', cursor: 'pointer',
              background: 'transparent', whiteSpace: 'nowrap', flexShrink: 0,
              color: activeTab === tab.key ? 'var(--primary)' : 'var(--text2)',
              borderBottom: activeTab === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
              fontWeight: activeTab === tab.key ? 600 : 400,
            }}>
            {t(lang, tab.label)}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
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
