import Link from 'next/link'

export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ background: '#0f0f18', color: '#e2e2f0', fontFamily: 'IBM Plex Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', margin: 0 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 72, marginBottom: 16, opacity: 0.3 }}>🚗</div>
          <div style={{ fontSize: 48, fontWeight: 700, color: '#f0a500', fontFamily: 'IBM Plex Mono, monospace', marginBottom: 8 }}>404</div>
          <div style={{ color: '#6a6a8a', fontSize: 16, marginBottom: 28 }}>This vehicle left the depot.</div>
          <Link href="/dashboard" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#f0a500', color: '#000', padding: '10px 20px',
            borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14,
          }}>
            ← Back to Dashboard
          </Link>
        </div>
      </body>
    </html>
  )
}
