'use client'
import { useEffect, useState } from 'react'
import { useFleetStore } from '@/store/useFleetStore'
import { exportVehiclesToExcel } from '@/lib/xlsxExport'

const BACKUP_KEY = 'autofleet_last_backup'
const DAYS = 7

export default function BackupReminder() {
  const { vehicles } = useFleetStore()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const last = localStorage.getItem(BACKUP_KEY)
    if (!last) { setShow(true); return }
    const days = (Date.now() - parseInt(last)) / 86400000
    if (days >= DAYS) setShow(true)
  }, [])

  const doBackup = async () => {
    // JSON backup
    const data = JSON.stringify({ vehicles, exportedAt: new Date().toISOString() }, null, 2)
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }))
    a.download = `AutoFleet_Backup_${new Date().toISOString().slice(0,10)}_${vehicles.length}v.json`
    a.click()
    localStorage.setItem(BACKUP_KEY, Date.now().toString())
    setShow(false)
  }

  const doExcel = async () => {
    await exportVehiclesToExcel(vehicles)
    localStorage.setItem(BACKUP_KEY, Date.now().toString())
    setShow(false)
  }

  if (!show || vehicles.length === 0) return null

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 100,
      background: 'var(--surface)', border: '1px solid var(--warning)',
      borderRadius: 12, padding: '14px 18px', maxWidth: 320,
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>💾 Weekly Backup</div>
        <button onClick={() => setShow(false)} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 16 }}>✕</button>
      </div>
      <p style={{ color: 'var(--text2)', fontSize: 12, marginBottom: 12, lineHeight: 1.5 }}>
        {vehicles.length} vehicles — last backup over {DAYS} days ago. Save a local copy?
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-primary" style={{ flex: 1, fontSize: 12, padding: '6px 10px' }} onClick={doBackup}>
          📥 JSON
        </button>
        <button className="btn btn-ghost" style={{ flex: 1, fontSize: 12, padding: '6px 10px' }} onClick={doExcel}>
          📊 Excel
        </button>
      </div>
    </div>
  )
}
