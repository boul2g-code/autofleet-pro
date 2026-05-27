import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AutoFleet Pro',
  description: 'Vehicle Fleet Management System — EL / EN / DE',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'AutoFleet Pro' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0f0f18',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el" className="dark">
      <body style={{ background: '#0f0f18', color: '#e2e2f0', height: '100vh', overflow: 'hidden', margin: 0 }}>
        {children}
      </body>
    </html>
  )
}
