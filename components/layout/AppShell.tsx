'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import BackupReminder from './BackupReminder'
import { useFleetStore } from '@/store/useFleetStore'
import Sidebar from './Sidebar'
import Header from './Header'
import Toast from './Toast'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { init, setUser, loading } = useFleetStore()
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) { setUser({ id: user.id, email: user.email ?? '' }); init() }
      else router.push('/login')
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) { setUser(null); router.push('/login') }
      else if (session?.user) setUser({ id: session.user.id, email: session.user.email ?? '' })
    })

    return () => subscription.unsubscribe()
  }, [init, setUser, router])

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0f0f18', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 40 }}>🚗</div>
        <div style={{ width: 40, height: 40, border: '3px solid #2a2a3e', borderTopColor: '#f0a500', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ color: '#6a6a8a', fontSize: 13 }}>Φόρτωση δεδομένων...</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div className="main-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Header />
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>{children}</main>
      </div>
      <Toast />
      <BackupReminder />
      <style>{`@media(max-width:768px){.main-area{width:100%!important;}}`}</style>
    </div>
  )
}
