'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import GlobalSearch from './GlobalSearch'
import BackupReminder from './BackupReminder'
import { useFleetStore } from '@/store/useFleetStore'
import { createClient } from '@/lib/supabase/client'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { loadAll, saving, loading, flushSave, flushAll, savedId, settings, vehicles } = useFleetStore()
  const pathname = usePathname()
  const [justSaved, setJustSaved] = useState(false)

  const lang = settings?.lang ?? 'en'
  const SL: Record<string,string> = { el:'Αποθήκευση', en:'Save', de:'Speichern', fr:'Enregistrer', it:'Salva', es:'Guardar' }
  const SV: Record<string,string> = { el:'✓ Αποθηκεύτηκε!', en:'✓ Saved!', de:'✓ Gespeichert!', fr:'✓ Enregistré!', it:'✓ Salvato!', es:'✓ Guardado!' }
  const SG: Record<string,string> = { el:'Αποθήκευση...', en:'Saving...', de:'Speichern...', fr:'Sauvegarde...', it:'Salvataggio...', es:'Guardando...' }

  // Extract vehicle id from path /vehicles/[id]
  const vehicleMatch = pathname?.match(/^\/vehicles\/([^/]+)$/)
  const vehicleId = vehicleMatch?.[1] ?? null

  const lastUserId = useRef<string | null>(null)
  useEffect(() => {
    const supabase = createClient()
    // Initial load
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id ?? null
      lastUserId.current = uid
      if (uid) loadAll()
    })
    // Re-load / reset on user change (logout → login with different account)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id ?? null
      if (uid !== lastUserId.current) {
        lastUserId.current = uid
        if (uid) {
          useFleetStore.getState().reset()
          loadAll()
        } else {
          useFleetStore.getState().reset()
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [loadAll])

  // Show ✓ after save
  useEffect(() => {
    if (savedId) {
      setJustSaved(true)
      const t = setTimeout(() => setJustSaved(false), 2500)
      return () => clearTimeout(t)
    }
  }, [savedId])

  // Handle save button click
  const handleSave = useCallback(async () => {
    if (vehicleId) {
      await flushSave(vehicleId)
    } else {
      await flushAll()
    }
  }, [vehicleId, flushSave, flushAll])

  // Warn before closing tab/browser if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saving) {
        const msg = lang === 'el' ? 'Υπάρχουν αλλαγές που δεν αποθηκεύτηκαν. Θέλεις να αποθηκεύσεις πριν φύγεις;'
          : lang === 'it' ? 'Ci sono modifiche non salvate. Vuoi salvare prima di uscire?'
          : lang === 'de' ? 'Es gibt nicht gespeicherte Änderungen. Möchten Sie speichern?'
          : lang === 'fr' ? 'Il y a des modifications non sauvegardées. Voulez-vous sauvegarder?'
          : lang === 'es' ? '¿Hay cambios sin guardar. ¿Desea guardar antes de salir?'
          : 'There are unsaved changes. Save before leaving?'
        e.preventDefault()
        e.returnValue = msg
        // Try to flush in background
        flushAll()
        return msg
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [saving, lang, flushAll])

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content" style={{ flex: 1 }}>

        {/* ── Top bar ── */}
        <div style={{
          height: 52,
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          gap: 10,
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}>
          {/* Hamburger mobile */}
          <button onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 20, display: 'none', flexShrink: 0 }}
            className="mobile-menu-btn">
            ☰
          </button>
          <style>{`@media(max-width:768px){.mobile-menu-btn{display:block!important}}`}</style>

          {/* ══ SAVE BUTTON — always visible ══ */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: justSaved ? '#16a34a' : saving ? '#6b7280' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: 7,
              padding: '6px 14px',
              fontSize: 14,
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              minWidth: 80,
            }}
          >
            {saving
              ? `⏳ ${SG[lang] || 'Saving...'}`
              : justSaved
                ? (SV[lang] || '✓ Saved!')
                : `💾 ${SL[lang] || 'Save'}`
            }
          </button>

          {/* Search */}
          <GlobalSearch />

          <div style={{ flex: 1 }} />

          {loading && <span style={{ fontSize: 12, color: 'var(--text2)', flexShrink: 0 }}>⏳</span>}
        </div>

        <div style={{ padding: '20px' }}>
          {children}
        </div>
      </div>

      <BackupReminder />
    </div>
  )
}
