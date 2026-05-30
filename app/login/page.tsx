'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const sb = createClient()

  const handle = async () => {
    setError('')
    setLoading(true)
    if (isSignup) {
      const { error } = await sb.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setError('Check your email to confirm your account.')
    } else {
      const { error } = await sb.auth.signInWithPassword({ email, password })
      if (error) setError('Wrong email or password')
      else router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="card" style={{ width: 360, padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 32 }}>🚗</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '8px 0 4px' }}>AutoFleet Pro</h1>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>Fleet Management System</p>
        </div>

        <div className="field-group">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handle()} placeholder="you@example.com" />
        </div>
        <div className="field-group">
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handle()} placeholder="••••••••" />
        </div>

        {error && <p style={{ color: error.includes('Check') ? 'var(--success)' : 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
          onClick={handle} disabled={loading}>
          {loading ? '...' : isSignup ? 'Sign Up' : 'Sign In'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text2)' }}>
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <button onClick={() => setIsSignup(!isSignup)}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 13 }}>
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}
