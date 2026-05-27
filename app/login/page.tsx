'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Mode = 'login' | 'signup' | 'reset'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')
        router.refresh()

      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        setMsg({ text: 'Ελέγξτε το email σας για επιβεβαίωση!', ok: true })

      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${location.origin}/auth/callback`,
        })
        if (error) throw error
        setMsg({ text: 'Στάλθηκε email επαναφοράς!', ok: true })
      }
    } catch (err) {
      const e = err as Error
      const map: Record<string, string> = {
        'Invalid login credentials': 'Λάθος email ή κωδικός',
        'Email not confirmed': 'Επιβεβαιώστε πρώτα το email σας',
        'User already registered': 'Αυτό το email υπάρχει ήδη',
      }
      setMsg({ text: map[e.message] || e.message, ok: false })
    } finally {
      setLoading(false)
    }
  }

  const inp = {
    background: '#17171f',
    border: '1px solid #2a2a3e',
    borderRadius: 8,
    padding: '11px 14px',
    color: '#e2e2f0',
    fontFamily: 'IBM Plex Sans, sans-serif',
    fontSize: 14,
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.15s',
  }

  const titles = { login: 'Σύνδεση', signup: 'Εγγραφή', reset: 'Επαναφορά κωδικού' }
  const btns   = { login: 'Σύνδεση →', signup: 'Δημιουργία λογαριασμού', reset: 'Αποστολή email' }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f18', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'IBM Plex Sans, sans-serif' }}>
      {/* Background glow */}
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(240,165,0,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🚗</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#f0a500', letterSpacing: '-0.5px' }}>AutoFleet Pro</div>
          <div style={{ fontSize: 12, color: '#6a6a8a', letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 }}>Διαχείριση Στόλου Οχημάτων</div>
        </div>

        {/* Card */}
        <div style={{ background: '#1e1e2a', border: '1px solid #2a2a3e', borderRadius: 16, padding: '32px 28px' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#e2e2f0', marginBottom: 24 }}>{titles[mode]}</div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'signup' && (
              <div>
                <label style={{ fontSize: 11, color: '#6a6a8a', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 5 }}>Ονοματεπώνυμο</label>
                <input style={inp} type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Γιάννης Παπαδόπουλος" required onFocus={e => (e.target.style.borderColor = '#f0a500')} onBlur={e => (e.target.style.borderColor = '#2a2a3e')} />
              </div>
            )}

            <div>
              <label style={{ fontSize: 11, color: '#6a6a8a', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 5 }}>Email</label>
              <input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required onFocus={e => (e.target.style.borderColor = '#f0a500')} onBlur={e => (e.target.style.borderColor = '#2a2a3e')} />
            </div>

            {mode !== 'reset' && (
              <div>
                <label style={{ fontSize: 11, color: '#6a6a8a', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 5 }}>Κωδικός</label>
                <input style={inp} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} onFocus={e => (e.target.style.borderColor = '#f0a500')} onBlur={e => (e.target.style.borderColor = '#2a2a3e')} />
              </div>
            )}

            {msg && (
              <div style={{ background: msg.ok ? 'rgba(46,213,115,0.1)' : 'rgba(255,68,68,0.1)', border: `1px solid ${msg.ok ? 'rgba(46,213,115,0.3)' : 'rgba(255,68,68,0.3)'}`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: msg.ok ? '#2ed573' : '#ff4444' }}>
                {msg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ background: loading ? '#b07800' : '#f0a500', color: '#000', border: 'none', borderRadius: 8, padding: '12px 20px', fontWeight: 700, fontSize: 14, cursor: loading ? 'wait' : 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', marginTop: 4, transition: 'background 0.15s' }}
            >
              {loading ? '⏳ Παρακαλώ περιμένετε...' : btns[mode]}
            </button>
          </form>

          {/* Switch modes */}
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'center' }}>
            {mode === 'login' && <>
              <button onClick={() => { setMode('signup'); setMsg(null) }} style={{ background: 'none', border: 'none', color: '#6a6a8a', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>Δεν έχω λογαριασμό — Εγγραφή</button>
              <button onClick={() => { setMode('reset'); setMsg(null) }} style={{ background: 'none', border: 'none', color: '#6a6a8a', fontSize: 12, cursor: 'pointer' }}>Ξέχασα τον κωδικό μου</button>
            </>}
            {mode !== 'login' && (
              <button onClick={() => { setMode('login'); setMsg(null) }} style={{ background: 'none', border: 'none', color: '#6a6a8a', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>← Πίσω στη σύνδεση</button>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: '#4a4a6a' }}>
          Τα δεδομένα σας αποθηκεύονται με ασφάλεια στο cloud
        </div>
      </div>


    </div>
  )
}
