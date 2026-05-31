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

const SL: Record<string,string> = { el:'Αποθήκευση', en:'Save', de:'Speichern', fr:'Enregistrer', it:'Salva', es:'Guardar' }
const SV: Record<string,string> = { el:'✓ Αποθηκεύτηκε!', en:'✓ Saved!', de:'✓ Gespeichert!', fr:'✓ Enregistré!', it:'✓ Salvato!', es:'✓ Guardado!' }

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { vehicles, deleteVehicle, flushSave, flushAll, settings, loading, saving, savedId } = useFleetStore()
  const lang = settings.lang
  const [activeTab, setActiveTab] = useState('info')
  const [deleting, setDeleting] = useState(false)
  const [confirmDel, setConfirmDel] = useState(0)
  const [waited, setWaited] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  const v = vehicles.find(x => x.id === id)

  useEffect(() => { setActiveTab('info') }, [id])
  useEffect(() => {
    if (v) return
    const t2 = setTimeout(() => setWaited(true), 3000)
    return () => clearTimeout(t2)
  }, [v])
  useEffect(() => {
    if (savedId === id) {
      setJustSaved(true)
      const t2 = setTimeout(() => setJustSaved(false), 2500)
      return () => clearTimeout(t2)
    }
  }, [savedId, id])

  const handleTabChange = useCallback(async (k: string) => {
    await flushSave(id); setActiveTab(k)
  }, [id, flushSave])

  useEffect(() => {
    const fn = (e: BeforeUnloadEvent) => {
      if (saving) { e.preventDefault(); e.returnValue = ''; flushAll() }
    }
    window.addEventListener('beforeunload', fn)
    return () => window.removeEventListener('beforeunload', fn)
  }, [saving, flushAll])

  if (!v && (loading || !waited)) return (
    <AppShell><div style={{textAlign:'center',padding:60,color:'var(--text2)'}}>⏳ Loading...</div></AppShell>
  )
  if (!v) return (
    <AppShell>
      <div style={{textAlign:'center',padding:40}}>
        <p style={{color:'var(--text2)'}}>{t(lang,'err.notFound')}</p>
        <button className="btn btn-ghost" onClick={()=>router.push('/vehicles')} style={{marginTop:12}}>
          ← {t(lang,'action.backToList')}
        </button>
      </div>
    </AppShell>
  )

  const handleDelete = async () => {
    if (confirmDel===0){setConfirmDel(1);return}
    if(!window.confirm(`Delete ${v.make||''} ${v.model||''} ${v.plate||''}?`)){setConfirmDel(0);return}
    setDeleting(true); await deleteVehicle(id); router.push('/vehicles')
  }

  return (
    <AppShell>

      {/* ── ROW 1: back · title · delete ── */}
      <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:8, flexWrap:'nowrap'}}>
        <button className="btn btn-ghost"
          onClick={async()=>{await flushSave(id); router.push('/vehicles')}}
          style={{padding:'5px 10px', fontSize:13, flexShrink:0}}>
          ←
        </button>
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontWeight:700, fontSize:15, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
            {v.make||'New'} {v.model||'Vehicle'} {v.year?`(${v.year})`:''}
          </div>
          <div style={{display:'flex', gap:6, marginTop:2, alignItems:'center', flexWrap:'wrap'}}>
            {v.plate && <span style={{color:'var(--text2)',fontSize:11}}>📋 {v.plate}</span>}
            <span className={`badge status-${v.status}`}>{t(lang,`status.${v.status}`)}</span>
          </div>
        </div>
        <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}
          style={{fontSize:12, padding:'5px 10px', flexShrink:0}}>
          {confirmDel===1 ? '⚠️?' : '🗑️'}
        </button>
      </div>

      {/* ── ROW 2: SAVE BUTTON — full width, impossible to miss ── */}
      <button
        onClick={async()=>{ await flushSave(id) }}
        disabled={saving}
        style={{
          display: 'block',
          width: '100%',
          padding: '12px',
          marginBottom: 10,
          fontSize: 16,
          fontWeight: 700,
          border: 'none',
          borderRadius: 8,
          cursor: saving ? 'not-allowed' : 'pointer',
          background: justSaved ? '#16a34a' : saving ? '#6b7280' : '#2563eb',
          color: 'white',
          transition: 'background 0.3s',
          letterSpacing: 0.3,
        }}
      >
        {saving ? '⏳ ...' : justSaved ? (SV[lang]||'✓ Saved!') : `💾 ${SL[lang]||'Save'}`}
      </button>

      {/* ── TABS ── */}
      <div style={{
        display:'flex', overflowX:'auto', marginBottom:10,
        borderBottom:'1px solid var(--border)', WebkitOverflowScrolling:'touch',
      }}>
        {TABS.map(tab=>(
          <button key={tab.key} onClick={()=>handleTabChange(tab.key)} style={{
            padding:'8px 11px', fontSize:12, border:'none', cursor:'pointer',
            background:'transparent', whiteSpace:'nowrap', flexShrink:0,
            color: activeTab===tab.key ? 'var(--primary)' : 'var(--text2)',
            borderBottom: activeTab===tab.key ? '2px solid var(--primary)' : '2px solid transparent',
            fontWeight: activeTab===tab.key ? 600 : 400,
          }}>
            {t(lang, tab.label)}
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div className="card">
        {activeTab==='info'         && <InfoTab id={id}/>}
        {activeTab==='purchase'     && <PurchaseTab id={id}/>}
        {activeTab==='transportIn'  && <TransportInTab id={id}/>}
        {activeTab==='storage'      && <StorageTab id={id}/>}
        {activeTab==='sale'         && <SaleTab id={id}/>}
        {activeTab==='transportOut' && <TransportOutTab id={id}/>}
        {activeTab==='documents'    && <DocumentsTab id={id}/>}
        {activeTab==='financials'   && <FinancialsTab id={id}/>}
        {activeTab==='inspection'   && <InspectionTab id={id}/>}
        {activeTab==='score'        && <ScoreTab id={id}/>}
        {activeTab==='listings'     && <ListingsTab id={id}/>}
        {activeTab==='flyer'        && <FlyerTab id={id}/>}
      </div>

    </AppShell>
  )
}
