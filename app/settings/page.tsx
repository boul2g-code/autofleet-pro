'use client'
import { useState } from 'react'
import AppShell from '@/components/AppShell'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'

export default function SettingsPage() {
  const { settings, saveSetting, vehicles } = useFleetStore()
  const lang = settings.lang
  const [saved, setSaved] = useState(false)

  const [companyName, setCompanyName] = useState(settings.org?.name || '')
  const save = () => {
    saveSetting({
      org: { ...settings.org, id: settings.org?.id || 'default', name: companyName },
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const exportJSON = () => {
    const data = JSON.stringify({ vehicles, settings, exportedAt: new Date().toISOString() }, null, 2)
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }))
    a.download = `AutoFleet_Backup_${new Date().toISOString().slice(0,10)}_${vehicles.length}vehicles.json`
    a.click()
  }

  return (
    <AppShell>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>{t(lang, 'settings.title')}</h1>

      <div className="card" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginTop: 0, marginBottom: 16 }}>{t(lang, 'settings.company')}</h2>
        <div className="field-group">
          <label>{t(lang, 'settings.companyName')}</label>
          <input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Your Company Name" />
        </div>
      </div>



      <div className="card" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginTop: 0, marginBottom: 12 }}>{t(lang, 'settings.backup')}</h2>
        <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 12 }}>
          {vehicles.length} vehicles in database
        </p>
        <button className="btn btn-ghost" onClick={exportJSON}>
          📥 {t(lang, 'settings.exportAll')} (JSON)
        </button>
        <button className="btn btn-ghost" style={{ marginLeft: 8 }}
          onClick={async () => {
            const { exportVehiclesToExcel } = await import('@/lib/xlsxExport')
            await exportVehiclesToExcel(vehicles, 'AutoFleet_Export')
          }}>
          📊 Export Excel (.xlsx)
        </button>
      </div>

      <button className="btn btn-primary" onClick={save}>
        {saved ? '✅ Saved!' : `💾 ${t(lang, 'action.save')}`}
      </button>
    </AppShell>
  )
}
