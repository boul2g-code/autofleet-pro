'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useFleetStore } from '@/store/useFleetStore'
import { createClient } from '@/lib/supabase/client'
import { t } from '@/lib/i18n'
import type { Lang } from '@/lib/types'

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: 'el', label: 'ΕΛ', flag: '🇬🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'de', label: 'DE', flag: '🇩🇪' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'it', label: 'IT', flag: '🇮🇹' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
]

const NAV = [
  { href: '/dashboard',  icon: '📊', key: 'nav.dashboard' },
  { href: '/vehicles',   icon: '🚗', key: 'nav.vehicles' },
  { href: '/manifest',   icon: '📋', key: 'nav.manifest' },
  { href: '/analytics',  icon: '📈', key: 'nav.analytics' },
  { href: '/settings',   icon: '⚙️', key: 'nav.settings' },
]

export default function Sidebar() {
  const { lang, setLang, sidebarOpen, setSidebarOpen, addVehicle, showToast, user } = useFleetStore()
  const pathname = usePathname()
  const router = useRouter()
  const isRTL = false

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' || pathname === '/' : pathname.startsWith(href)

  const handleNew = async () => {
    const id = await addVehicle()
    showToast(t(lang, 'msg.saved'))
    router.push(`/vehicles/${id}`)
    setSidebarOpen(false)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? 'AF'

  return (
    <>
      <div
        onClick={() => setSidebarOpen(false)}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 90,
          pointerEvents: sidebarOpen ? 'auto' : 'none',
          opacity: sidebarOpen ? 1 : 0, transition: 'opacity 0.3s', display: 'none' }}
        className="sidebar-overlay"
      />

      <aside className="sidebar" style={{
        width: 230, minWidth: 230, background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: '18px 16px 12px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.5px' }}>🚗 AutoFleet Pro</div>
          <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 2 }}>{t(lang, 'tagline')}</div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '8px 0', flex: 1 }}>
          <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase', padding: '8px 16px 4px' }}>{t(lang, 'nav.main')}</div>
          {NAV.map(item => {
            const active = isActive(item.href)
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px',
                  fontSize: 13, fontWeight: 500,
                  color: active ? 'var(--accent)' : 'var(--muted)',
                  background: active ? 'rgba(240,165,0,0.08)' : 'transparent',
                  borderLeft: `3px solid ${active ? 'var(--accent)' : 'transparent'}`,
                  textDecoration: 'none', transition: 'all 0.15s',
                }}>
                <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>{item.icon}</span>
                <span>{t(lang, item.key)}</span>
              </Link>
            )
          })}

          {/* New vehicle button */}
          <button onClick={handleNew}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px',
              fontSize: 13, fontWeight: 500, color: 'var(--muted)', background: 'transparent',
              borderLeft: '3px solid transparent', width: '100%', cursor: 'pointer',
              border: 'none', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; (e.currentTarget as HTMLElement).style.background = 'var(--card)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>➕</span>
            <span>{t(lang, 'nav.newVehicle')}</span>
          </button>
        </nav>

        {/* User strip */}
        <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#000', flexShrink: 0 }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0, fontSize: 11, color: 'var(--text)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email ?? '—'}</div>
          <button onClick={handleLogout} title="Logout"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: 'var(--muted)', padding: 4, borderRadius: 6 }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--error)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>⏻</button>
        </div>

        {/* Language — 6 buttons in 2 rows of 3 */}
        <div style={{ padding: '8px 12px 12px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
            {LANGS.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)}
                style={{ padding: '5px 2px', textAlign: 'center', borderRadius: 6, cursor: 'pointer',
                  fontSize: 10, fontWeight: 700, border: '1px solid var(--border)',
                  background: lang === l.code ? 'var(--accent)' : 'transparent',
                  color: lang === l.code ? '#000' : 'var(--muted)',
                  transition: 'all 0.15s',
                }}>
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <style>{`
        @media(max-width:768px){
          .sidebar{position:fixed!important;top:0!important;left:0!important;height:100%!important;
            transform:translateX(${sidebarOpen ? '0' : '-100%'})!important;
            transition:transform 0.3s ease!important;}
          .sidebar-overlay{display:block!important;}
        }
      `}</style>
    </>
  )
}
