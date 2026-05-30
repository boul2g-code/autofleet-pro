'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useFleetStore } from '@/store/useFleetStore'
import { t, LANGUAGES } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { key: 'nav.dashboard', href: '/dashboard', icon: '📊' },
  { key: 'nav.vehicles', href: '/vehicles', icon: '🚗' },
  { key: 'nav.manifest', href: '/manifest', icon: '📋' },
  { key: 'nav.analytics', href: '/analytics', icon: '📈' },
  { key: 'nav.import', href: '/import', icon: '📥' },
  { key: 'nav.settings', href: '/settings', icon: '⚙️' },
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
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 39 }} />
      )}
      <nav className={`sidebar${open ? ' open' : ''}`}>
        <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 24 }}>🚗</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4 }}>AutoFleet Pro</div>
          <div style={{ fontSize: 11, color: 'var(--text2)' }}>{t(lang, 'app.tagline')}</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {NAV.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link key={item.href} href={item.href} onClick={onClose}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 16px', fontSize: 14, textDecoration: 'none',
                  color: active ? 'var(--primary)' : 'var(--text2)',
                  background: active ? 'rgba(59,130,246,0.1)' : 'transparent',
                  borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent',
                  transition: 'all 0.15s',
                }}>
                <span>{item.icon}</span>
                <span>{t(lang, item.key)}</span>
                {item.href === '/vehicles' && vehicles.length > 0 && (
                  <span style={{ marginLeft: 'auto', background: 'var(--surface2)', color: 'var(--text2)', borderRadius: 999, fontSize: 11, padding: '1px 7px' }}>
                    {vehicles.length}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Language switcher */}
        <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
            {LANGUAGES.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)}
                style={{
                  background: lang === l.code ? 'var(--primary)' : 'var(--surface2)',
                  border: 'none', borderRadius: 4, padding: '3px 7px',
                  cursor: 'pointer', fontSize: 13, color: 'var(--text)',
                }}>
                {l.flag}
              </button>
            ))}
          </div>
          <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}
            onClick={logout}>
            🚪 {t(lang, 'nav.logout')}
          </button>
        </div>
      </nav>
    </>
  )
}
