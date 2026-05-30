'use client'
import { useState, useEffect } from 'react'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'

const MARKETPLACES = [
  { name: 'AutoScout24', url: 'https://www.autoscout24.it/inserzioni', flag: '🇮🇹', connected: true },
  { name: 'Mobile.de', url: 'https://www.mobile.de/auto/inserieren', flag: '🇩🇪', connected: true },
  { name: 'Car.gr', url: 'https://www.car.gr/classifieds/cars/', flag: '🇬🇷', connected: true },
  { name: 'AutoTrader', url: 'https://www.autotrader.co.uk', flag: '🇬🇧', connected: false },
  { name: 'Mobile.bg', url: 'https://www.mobile.bg', flag: '🇧🇬', connected: false },
  { name: 'Subito.it', url: 'https://www.subito.it/annunci-italia/vendita/usato/', flag: '🇮🇹', connected: false },
  { name: 'Otomoto.pl', url: 'https://www.otomoto.pl', flag: '🇵🇱', connected: false },
  { name: 'Truck1.eu', url: 'https://www.truck1.eu', flag: '🇪🇺', connected: false },
  { name: 'Mascus.com', url: 'https://www.mascus.com', flag: '🌐', connected: false },
]

export default function ListingsTab({ id }: { id: string }) {
  const { vehicles, settings } = useFleetStore()
  const lang = settings.lang
  const v = vehicles.find(x => x.id === id)
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState('')
  const [siteUrl, setSiteUrl] = useState('')

  useEffect(() => {
    setSiteUrl(window.location.origin)
  }, [])

  useEffect(() => {
    if (!siteUrl) return
    const publicUrl = `${siteUrl}/v/${id}`
    // Generate QR via Google Charts API (no npm needed)
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicUrl)}`)
  }, [siteUrl, id])

  if (!v) return null

  const publicUrl = `${siteUrl}/v/${id}`

  const getListingText = (marketplace: string) => {
    const lines = [
      `${v.make || ''} ${v.model || ''} ${v.year || ''}`,
      v.mileage ? `Mileage: ${v.mileage.toLocaleString()} km` : '',
      v.fuelType ? `Fuel: ${v.fuelType}` : '',
      v.gearType ? `Gearbox: ${v.gearType}` : '',
      v.engineCC ? `Engine: ${v.engineCC} cc` : '',
      v.powerKW ? `Power: ${v.powerKW} kW` : '',
      v.color ? `Color: ${v.color}` : '',
      v.vin ? `VIN: ${v.vin}` : '',
      v.sale?.price ? `Price: €${v.sale.price.toLocaleString()}` : '',
      '',
      publicUrl,
    ]
    return lines.filter(Boolean).join('\n')
  }

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(publicUrl)
    setCopied('link')
    setTimeout(() => setCopied(''), 2000)
  }

  const printQR = () => {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html><head><title>QR - ${v.plate || v.make}</title>
      <style>body{font-family:Arial;text-align:center;padding:40px}h2{margin-bottom:8px}p{color:#666;font-size:12px}</style>
      </head><body>
      <h2>${v.make || ''} ${v.model || ''} ${v.year || ''}</h2>
      <p>${v.plate || ''}</p>
      <img src="${qrUrl}" width="200" height="200" />
      <p style="margin-top:12px;font-size:11px;word-break:break-all">${publicUrl}</p>
      <script>window.onload=()=>window.print()</script>
      </body></html>
    `)
    win.document.close()
  }

  return (
    <div>
      {/* Public Link + QR */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, marginTop: 0 }}>🔗 Public Vehicle Page</h3>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <code style={{ flex: 1, background: 'var(--surface2)', padding: '8px 12px', borderRadius: 6, fontSize: 12, wordBreak: 'break-all' }}>
            {publicUrl}
          </code>
          <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={copyLink}>
            {copied === 'link' ? '✅ Copied!' : '📋 Copy'}
          </button>
          <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontSize: 13 }}>
            👁️ Open
          </a>
        </div>

        {/* WhatsApp share */}
        <a href={`https://wa.me/?text=${encodeURIComponent(`🚗 ${v.make} ${v.model} ${v.year}\n${v.mileage?.toLocaleString()} km\n${v.sale?.price ? '€' + v.sale.price.toLocaleString() : ''}\n\n${publicUrl}`)}`}
          target="_blank" rel="noopener noreferrer"
          className="btn btn-success" style={{ fontSize: 13 }}>
          💬 Share on WhatsApp
        </a>
      </div>

      {/* QR Code */}
      {qrUrl && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, marginTop: 0 }}>📱 QR Code</h3>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <img src={qrUrl} alt="QR Code" style={{ width: 150, height: 150, border: '1px solid var(--border)', borderRadius: 8 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={printQR}>🖨️ Print QR</button>
              <a href={qrUrl} download={`QR-${v.plate || id}.png`} className="btn btn-ghost" style={{ fontSize: 13 }}>⬇️ Download PNG</a>
            </div>
          </div>
        </div>
      )}

      {/* Marketplaces */}
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, marginTop: 0 }}>🌐 Marketplace Listings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MARKETPLACES.map(m => (
            <div key={m.name} className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 20 }}>{m.flag}</span>
              <span style={{ fontWeight: 600, flex: 1 }}>{m.name}</span>
              {m.connected ? (
                <>
                  <button className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 10px' }}
                    onClick={() => copyText(getListingText(m.name), m.name)}>
                    {copied === m.name ? '✅' : '📋 Copy text'}
                  </button>
                  <a href={m.url} target="_blank" rel="noopener noreferrer"
                    className="btn btn-primary" style={{ fontSize: 12, padding: '4px 10px' }}>
                    🔗 Open site
                  </a>
                </>
              ) : (
                <a href={m.url} target="_blank" rel="noopener noreferrer"
                  className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 10px', color: 'var(--text2)' }}>
                  🔗 Visit
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
