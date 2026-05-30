import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AutoFleet Pro',
  description: 'Fleet Management System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
