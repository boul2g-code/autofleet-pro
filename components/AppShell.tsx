'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import GlobalSearch from './GlobalSearch'
import BackupReminder from './BackupReminder'
import { useFleetStore } from '@/store/useFleetStore'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { loadAll, saving, loading, flushSave, savedId, settings } = useFleetStore()
  const pathname = usePathname()
  const [justSaved, setJustSaved] = useState(false)

  // Extract vehicle id from path /vehicles/[id]
  const vehicleMatch = pathname?.match(/^\/vehicles\/([^/]+)$/)
  const vehicleId = vehicleMatch?.[1] ?? null

  const lang = settings?.lang ?? 'en'
  const SL: Record<string,string> = { el:'Αποθήκευση', en:'Save', de:'Speichern', fr:'Enregistrer', it:'Salva', es:'Guardar' }
  const SV: Record<string,string> = { el:'✓ Αποθηκεύτηκε!', en:'✓ Saved!', de:'✓ Gespeichert!', fr:'✓ Enregistré!', it:'✓ Salvato!', es:'✓ Guardado!' }

  useEffect(() => { loadAll() }, []) // eslint-disable-line

  useEffect(() => {
    if (savedId && savedId === vehicleId) {
      setJustSaved(true)
      const t = setTimeout(() => setJustSaved(false), 2500)
      return () => clearTimeout(t)
    }
  }, [savedId, vehicleId])

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content" style={{ flex: 1 }}>

        {/* ── Top bar ── */}
        <div style={{
          height: 52, background: 'var(--surface)', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10,
          position: 'sticky', top: 0, zIndex: 30,
        }}>
          {/* Hamburger */}
          <button onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 20, display: 'none' }}
            className="mobile-menu-btn">
            ☰
          </button>
          <style>{`@media(max-width:768px){.mobile-menu-btn{display:block!important}}`}</style>

          {/* ══ SAVE BUTTON — visible ONLY on vehicle detail page ══ */}
          {vehicleId && (
            <button
              onClick={async () => {
                if (vehicleId) await flushSave(vehicleId)
              }}
              disabled={saving}
              style={{
                background: justSaved ? '#16a34a' : saving ? '#6b7280' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: 7,
                padding: '6px 16px',
                fontSize: 14,
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'background 0.3s',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {saving ? '⏳' : justSaved ? (SV[lang]||'✓ Saved!') : `💾 ${SL[lang]||'Save'}`}
            </button>
          )}

          {/* Search */}
          <GlobalSearch />

          <div style={{ flex: 1 }} />

          {loading && <span style={{ fontSize: 12, color: 'var(--text2)' }}>⏳</span>}
        </div>

        <div style={{ padding: '20px' }}>
          {children}
        </div>
      </div>

      <BackupReminder />
    </div>
  )
}
