'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import GlobalSearch from './GlobalSearch'

export default function Header() {
  const { lang, addVehicle, showToast, setSidebarOpen } = useFleetStore()
  const pathname = usePathname()
  const router = useRouter()

  const getTitle = () => {
    if (pathname === '/dashboard' || pathname === '/') return t(lang, 'nav.dashboard')
    if (pathname === '/vehicles') return t(lang, 'nav.vehicles')
    if (pathname === '/settings') return t(lang, 'nav.settings')
    if (pathname.startsWith('/vehicles/')) return t(lang, 'nav.vehicles')
    return 'AutoFleet Pro'
  }

  const handleNew = async () => {
    const id = await addVehicle()
    showToast(t(lang, 'msg.saved'))
    router.push(`/vehicles/${id}`)
  }

  return (
    <header style={{
      background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      padding: '0 16px', height: 56, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', flexShrink: 0, gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}
          style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: 20, padding: '4px 8px', display: 'none', alignItems: 'center', borderRadius: 6 }}>
          ☰
        </button>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' }}>{getTitle()}</span>
      </div>

      {/* Global Search — always visible */}
      <div style={{ flex: 1, maxWidth: 480 }}>
        <GlobalSearch />
      </div>

      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button className="af-btn af-btn-primary af-btn-sm" onClick={handleNew}>
          + {t(lang, 'nav.newVehicle')}
        </button>
      </div>

      <style>{`@media(max-width:768px){.mobile-menu-btn{display:flex!important;}}`}</style>
    </header>
  )
}
