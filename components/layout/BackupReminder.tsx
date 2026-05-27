'use client'

import { useEffect, useState } from 'react'
import { useFleetStore } from '@/store/useFleetStore'
import { isBackupDue, downloadBackup, downloadBackupXLSX, getDaysSinceBackup } from '@/lib/autoBackup'

export default function BackupReminder() {
  const { vehicles, settings, lang } = useFleetStore()
  const [show, setShow] = useState(false)
  const [done, setDone] = useState(false)
  const [days, setDays] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => {
      if (vehicles.length > 0 && isBackupDue()) {
        setDays(getDaysSinceBackup())
        setShow(true)
      }
    }, 3000)
    return () => clearTimeout(t)
  }, [vehicles.length])

  const handleDownload = async (format: 'json' | 'xlsx') => {
    if (format === 'xlsx') {
      await downloadBackupXLSX(vehicles, settings)
    } else {
      downloadBackup(vehicles, settings)
    }

    setDone(true)
    setTimeout(() => setShow(false), 2500)
  }

  const L = {
    el: { title:'Backup Εβδομαδιαίο', msg:(d:number)=> d===999?'Δεν έχετε κάνει ποτέ backup':`${d} ημέρες από το τελευταίο backup`, later:'Αργότερα', done:'✅ Αποθηκεύτηκε!' },
    en: { title:'Weekly Backup Due', msg:(d:number)=> d===999?'Never backed up':`${d} days since last backup`, later:'Later', done:'✅ Saved!' },
    de: { title:'Wöchentliches Backup', msg:(d:number)=> d===999?'Noch kein Backup':`${d} Tage seit letztem Backup`, later:'Später', done:'✅ Gespeichert!' },
    fr: { title:'Sauvegarde Hebdomadaire', msg:(d:number)=> d===999?'Aucune sauvegarde':`${d} jours depuis sauvegarde`, later:'Plus tard', done:'✅ Sauvegardé!' },
    it: { title:'Backup Settimanale', msg:(d:number)=> d===999?'Nessun backup':`${d} giorni dall'ultimo backup`, later:'Dopo', done:'✅ Salvato!' },
    es: { title:'Copia de Seguridad', msg:(d:number)=> d===999?'Sin copia de seguridad':`${d} días desde el último backup`, later:'Después', done:'✅ ¡Guardado!' },
  }[lang] ?? { title:'Backup Due', msg:(d:number)=>`${d} days`, later:'Later', done:'✅ Saved!' }

  if (!show) return null

  return (
    <div style={{ position:'fixed', bottom:24, right:24, zIndex:1000, background:'var(--card)', border:'1px solid var(--accent)', borderRadius:12, padding:'14px 18px', maxWidth:320, boxShadow:'0 8px 32px rgba(0,0,0,0.5)' }}>
      {done ? (
        <div style={{ textAlign:'center', color:'var(--success)', fontWeight:700, fontSize:15, padding:'8px 0' }}>{L.done}</div>
      ) : (<>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <div style={{ fontWeight:700, fontSize:14, color:'var(--accent)' }}>💾 {L.title}</div>
          <button onClick={()=>setShow(false)} style={{ background:'none', border:'none', color:'var(--muted)', cursor:'pointer', fontSize:16 }}>✕</button>
        </div>
        <div style={{ fontSize:12, color:'var(--muted)', marginBottom:12, lineHeight:1.5 }}>
          {L.msg(days)}. {lang==='it'?'Scarica ora per sicurezza':lang==='de'?'Jetzt sichern':lang==='fr'?'Téléchargez maintenant':lang==='es'?'Descarga ahora':lang==='el'?'Κατεβάστε τώρα':'Download now for safety.'}
        </div>
        <div style={{ display:'flex', gap:8, marginBottom:8 }}>
          <button onClick={()=>{ void handleDownload('json') }} style={{ flex:1, background:'var(--accent)', color:'#000', border:'none', borderRadius:8, padding:'8px', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
            ⬇ JSON
          </button>
          <button onClick={()=>{ void handleDownload('xlsx') }} style={{ flex:1, background:'#1d6f42', color:'#fff', border:'none', borderRadius:8, padding:'8px', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
            ⬇ Excel
          </button>
          <button onClick={()=>setShow(false)} style={{ background:'var(--surface)', color:'var(--muted)', border:'1px solid var(--border)', borderRadius:8, padding:'8px 10px', fontSize:12, cursor:'pointer' }}>
            {L.later}
          </button>
        </div>
        <div style={{ fontSize:10, color:'var(--muted)', textAlign:'center' }}>
          {vehicles.length} {lang==='it'?'veicoli':lang==='de'?'Fahrzeuge':lang==='fr'?'véhicules':lang==='es'?'vehículos':lang==='el'?'οχήματα':'vehicles'} · {settings.companyName||'AutoFleet Pro'}
        </div>
      </>)}
    </div>
  )
}
