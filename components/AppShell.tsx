'use client'
import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { useFleetStore } from '@/store/useFleetStore'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { loadAll, saving, loading } = useFleetStore()

  useEffect(() => { loadAll() }, [])

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content" style={{ flex: 1 }}>
        {/* Top bar */}
        <div style={{
          height: 52, background: 'var(--surface)', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12,
          position: 'sticky', top: 0, zIndex: 30,
        }}>
          <button onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 20, display: 'none' }}
            className="mobile-menu-btn">
            ☰
          </button>
          <div style={{ flex: 1 }} />
          {saving && <span style={{ fontSize: 12, color: 'var(--text2)' }}>💾 Saving...</span>}
          {loading && <span style={{ fontSize: 12, color: 'var(--text2)' }}>⏳</span>}
        </div>
        <style>{`@media(max-width:768px){.mobile-menu-btn{display:block!important}}`}</style>
        <div style={{ padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
