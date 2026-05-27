'use client'

import { useEffect } from 'react'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error('[AutoFleet Error]', error)
  }, [error])

  return (
    <html lang="en">
      <body style={{ background: '#0f0f18', color: '#e2e2f0', fontFamily: 'IBM Plex Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', margin: 0 }}>
        <div style={{ textAlign: 'center', maxWidth: 480, padding: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Something went wrong</div>
          <div style={{
            background: '#1e1e2a', border: '1px solid #2a2a3e', borderRadius: 8,
            padding: '12px 16px', fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 12, color: '#ff4444', textAlign: 'left',
            marginBottom: 24, wordBreak: 'break-all',
          }}>
            {error.message || 'Unknown error'}
            {error.digest && <div style={{ marginTop: 4, color: '#6a6a8a' }}>Digest: {error.digest}</div>}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={reset}
              style={{ background: '#f0a500', color: '#000', padding: '10px 20px', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}
            >
              Try again
            </button>
            <a href="/dashboard" style={{ background: '#1e1e2a', color: '#e2e2f0', padding: '10px 20px', border: '1px solid #2a2a3e', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              ← Dashboard
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
