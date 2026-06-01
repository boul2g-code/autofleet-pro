'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useFleetStore } from '@/store/useFleetStore'
import { t, LANGUAGES } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { key: 'nav.dashboard', href: '/dashboard',  icon: '▦' },
  { key: 'nav.vehicles',  href: '/vehicles',   icon: '◈' },
  { key: 'nav.manifest',  href: '/manifest',   icon: '≡' },
  { key: 'nav.analytics', href: '/analytics',  icon: '↗' },
  { key: 'nav.import',    href: '/import',     icon: '↓' },
  { key: 'nav.settings',  href: '/settings',   icon: '⚙' },
]

export default function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { settings, setLang, vehicles } = useFleetStore()
  const lang = settings.lang

  const logout = async () => {
    const sb = createClient()
    await sb.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      {open && (
        <div onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 39 }} />
      )}
      <nav className={`sidebar${open ? ' open' : ''}`}>

        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: '#2563EB', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 18, flexShrink: 0,
            }}>🚗</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#F8FAFC' }}>AutoFleet Pro</div>
              <div style={{ fontSize: 10, color: '#64748B', marginTop: 1 }}>{t(lang, 'app.tagline')}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px' }}>
          {NAV.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link key={item.href} href={item.href} onClick={onClose}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', fontSize: 13.5, textDecoration: 'none',
                  borderRadius: 7, marginBottom: 2,
                  color: active ? '#FFFFFF' : '#94A3B8',
                  background: active ? 'rgba(37,99,235,0.6)' : 'transparent',
                  fontWeight: active ? 600 : 400,
                  transition: 'all 0.12s',
                }}

              >
                <span style={{ fontSize: 16, width: 20, textAlign: 'center', opacity: active ? 1 : 0.7 }}>
                  {item.icon === '▦' ? '⊞' : item.icon === '◈' ? '🚗' : item.icon === '≡' ? '☰' : item.icon === '↗' ? '📈' : item.icon === '↓' ? '📥' : '⚙️'}
                </span>
                <span>{t(lang, item.key)}</span>
                {item.href === '/vehicles' && vehicles.length > 0 && (
                  <span style={{
                    marginLeft: 'auto',
                    background: active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                    color: active ? '#fff' : '#64748B',
                    borderRadius: 999, fontSize: 11, padding: '1px 7px', fontWeight: 600,
                  }}>
                    {vehicles.length}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Bottom */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Language flags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 10 }}>
            {LANGUAGES.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)}
                title={l.name}
                style={{
                  background: lang === l.code ? '#2563EB' : 'rgba(255,255,255,0.06)',
                  border: lang === l.code ? '1px solid rgba(37,99,235,0.5)' : '1px solid transparent',
                  borderRadius: 5, padding: '3px 7px',
                  cursor: 'pointer', fontSize: 14,
                  opacity: lang === l.code ? 1 : 0.6,
                  transition: 'all 0.12s',
                }}>
                {l.flag}
              </button>
            ))}
          </div>

          {/* Logout */}
          <button onClick={logout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, padding: '8px 12px', borderRadius: 7,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#64748B', fontSize: 13, cursor: 'pointer',
              transition: 'all 0.12s',
            }}

          >
            🚪 {t(lang, 'nav.logout')}
          </button>
        </div>
      </nav>
    </>
  )
}
