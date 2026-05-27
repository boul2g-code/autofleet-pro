'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { useFleetStore } from '@/store/useFleetStore'
import { getConnectedForCategory, getQuickLinksForCategory } from '@/lib/marketplaces'
import { escapeHtml } from '@/lib/html'
import { fmtCur } from '@/lib/utils'
import type { Vehicle } from '@/lib/types'

interface Props { vehicle: Vehicle }

export default function ListingsTab({ vehicle: v }: Props) {
  const { lang, settings } = useFleetStore()
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [copied, setCopied] = useState('')
  const [activeMarket, setActiveMarket] = useState<string | null>(null)

  const appUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/vehicles/${v.id}`
    : `/vehicles/${v.id}`

  useEffect(() => {
    QRCode.toDataURL(appUrl, {
      width: 200,
      margin: 2,
      color: { dark: '#000', light: '#fff' },
      errorCorrectionLevel: 'M',
    }).then(setQrDataUrl).catch(console.error)
  }, [appUrl])

  const connected = getConnectedForCategory(v.category)
  const quickLinks = getQuickLinksForCategory(v.category)
  const price = v.sale?.priceGross || v.purchase?.priceGross || ''
  const currency = (v.sale?.currency || v.purchase?.currency || 'EUR') as 'EUR'

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(''), 2500)
    })
  }

  const openLink = (url: string) => {
    const a = document.createElement('a')
    a.href = url
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const downloadQR = () => {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = `QR_${v.plate || v.businessId}.png`
    a.click()
  }

  const printQR = () => {
    if (!qrDataUrl) return

    const html = `<!DOCTYPE html>
<html><head><title>QR ${escapeHtml(v.plate || '')}</title>
  <style>body{font-family:Arial;text-align:center;padding:30px}img{border:4px solid #f0a500;border-radius:8px;padding:4px}h2{margin:10px 0}p{color:#666;font-size:12px;margin:4px}</style>
</head><body>
  <img src="${qrDataUrl}" width="180" alt="QR code">
  <h2>${escapeHtml(`${v.make || ''} ${v.model || ''} ${v.year || ''}`.trim())}</h2>
  ${v.plate ? `<p><strong>${escapeHtml(v.plate)}</strong></p>` : ''}
  ${price ? `<p>${escapeHtml(fmtCur(price, currency))}</p>` : ''}
  <p>${escapeHtml(settings.companyName || 'AutoFleet Pro')}</p>
  <p style="font-size:10px;color:#aaa">${escapeHtml(appUrl)}</p>
  <script>window.print()<\/script>
</body></html>`

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 5000)
  }

  const listingText = [
    `${v.make || ''} ${v.model || ''} ${v.year || ''}`.trim(),
    [v.mileage && `${parseInt(v.mileage, 10).toLocaleString()} km`, v.fuel, v.gearbox, v.engine && `${v.engine} cc`].filter(Boolean).join(' · '),
    v.color ? `Color: ${v.color}` : '',
    v.vin ? `VIN: ${v.vin}` : '',
    v.plate ? `Plate: ${v.plate}` : '',
    v.firstReg ? `First reg: ${v.firstReg}` : '',
    v.payload ? `Payload: ${parseInt(v.payload, 10).toLocaleString()} kg` : '',
    price ? `Price: ${fmtCur(price, currency)}` : '',
    '',
    v.notes || '',
    '',
    `📋 ${appUrl}`,
    `📞 ${settings.companyName || ''}`,
    settings.companyDE || '',
    settings.companyGR || '',
  ].filter(Boolean).join('\n').replace(/\n{3,}/g, '\n\n').trim()

  const L = {
    el: { qr: 'QR Code', connected: 'Κύριες Αγγελίες', quick: 'Άλλες Αγορές', copy: 'Αντιγραφή Κειμένου', copied: 'Αντιγράφηκε!', post: '🚀 Δημοσίευση' },
    en: { qr: 'QR Code', connected: 'Main Marketplaces', quick: 'Other Sites', copy: 'Copy Listing Text', copied: 'Copied!', post: '🚀 Post Ad' },
    de: { qr: 'QR Code', connected: 'Hauptplattformen', quick: 'Weitere Plattformen', copy: 'Text kopieren', copied: 'Kopiert!', post: '🚀 Inserat aufgeben' },
    fr: { qr: 'QR Code', connected: 'Plateformes Principales', quick: 'Autres Sites', copy: 'Copier le texte', copied: 'Copié!', post: '🚀 Publier' },
    it: { qr: 'Codice QR', connected: 'Piattaforme Principali', quick: 'Altri Siti', copy: 'Copia Testo', copied: 'Copiato!', post: '🚀 Pubblica' },
    es: { qr: 'Código QR', connected: 'Plataformas Principales', quick: 'Otros Sitios', copy: 'Copiar Texto', copied: '¡Copiado!', post: '🚀 Publicar' },
  }[lang] || { qr: 'QR Code', connected: 'Marketplaces', quick: 'Other', copy: 'Copy', copied: 'Copied!', post: '🚀 Post' }

  const instructions = {
    el: `1. Κλικ στο ${L.post} και το κείμενο αντιγράφεται αυτόματα.\n2. Ανοίγει το marketplace και κάνεις επικόλληση στη φόρμα.\n3. Προσθέτεις φωτογραφίες και δημοσιεύεις.`,
    en: `1. Click ${L.post} and the text is copied automatically.\n2. The marketplace opens and you paste it into the form.\n3. Add photos and publish.`,
    de: `1. Klicke auf ${L.post} und der Text wird automatisch kopiert.\n2. Der Marktplatz öffnet sich und du fügst ihn ins Formular ein.\n3. Fotos hinzufügen und veröffentlichen.`,
    fr: `1. Clique sur ${L.post} et le texte est copié automatiquement.\n2. La plateforme s'ouvre et tu le colles dans le formulaire.\n3. Ajoute les photos et publie.`,
    it: `1. Clicca ${L.post} e il testo viene copiato automaticamente.\n2. Si apre il marketplace e lo incolli nel modulo.\n3. Aggiungi foto e pubblica.`,
    es: `1. Haz clic en ${L.post} y el texto se copia automáticamente.\n2. Se abre el marketplace y lo pegas en el formulario.\n3. Añade fotos y publica.`,
  }[lang] || `1. Click ${L.post} and the text is copied automatically.\n2. The marketplace opens and you paste it into the form.\n3. Add photos and publish.`

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div className="af-card">
        <div className="af-section-title">📱 {L.qr}</div>
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          {qrDataUrl
            ? <Image src={qrDataUrl} alt="QR" width={170} height={170} unoptimized style={{ width: 170, height: 170, border: '4px solid var(--accent)', borderRadius: 10, padding: 4, background: '#fff' }} />
            : <div style={{ width: 170, height: 170, background: 'var(--surface)', borderRadius: 10, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>⏳</div>
          }
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 6, fontFamily: 'monospace', wordBreak: 'break-all' }}>{appUrl}</div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button className="af-btn af-btn-primary af-btn-sm" onClick={downloadQR}>⬇ PNG</button>
          <button className="af-btn af-btn-secondary af-btn-sm" onClick={printQR}>🖨️ Print</button>
          <button className="af-btn af-btn-secondary af-btn-sm" onClick={() => copy(appUrl, 'url')}>
            {copied === 'url' ? '✓' : '📋'} URL
          </button>
        </div>
        <div style={{ marginTop: 12, padding: 10, background: 'var(--surface)', borderRadius: 8, fontSize: 12 }}>
          <div style={{ fontWeight: 700 }}>{v.make} {v.model} {v.year}</div>
          <div style={{ color: 'var(--muted)', display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
            {v.plate && <span style={{ fontFamily: 'monospace', background: 'var(--card)', padding: '1px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>{v.plate}</span>}
            {v.mileage && <span>📍 {parseInt(v.mileage, 10).toLocaleString()} km</span>}
            {price && <span style={{ color: 'var(--success)', fontWeight: 700 }}>{fmtCur(price, currency)}</span>}
          </div>
        </div>
      </div>

      <div>
        <div className="af-card" style={{ marginBottom: 12 }}>
          <div className="af-section-title">{L.connected}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {connected.map(market => (
              <div key={market.id}>
                <div
                  onClick={() => setActiveMarket(activeMarket === market.id ? null : market.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: activeMarket === market.id ? `${market.color}12` : 'var(--surface)', border: `1px solid ${activeMarket === market.id ? market.color : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s' }}
                >
                  <span style={{ fontSize: 18 }}>{market.flag}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{market.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)' }}>{market.country}</div>
                  </div>
                  <button
                    style={{ background: market.color, color: '#fff', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                    onClick={e => {
                      e.stopPropagation()
                      copy(listingText, `copied_${market.id}`)
                      setTimeout(() => openLink(market.submitUrl), 300)
                    }}
                  >
                    {copied === `copied_${market.id}` ? '✓ Copied!' : L.post}
                  </button>
                </div>

                {activeMarket === market.id && (
                  <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: 12 }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8, whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                      {instructions.replaceAll('marketplace', market.name)}
                    </div>
                    <pre style={{ background: 'var(--surface)', padding: 10, borderRadius: 8, fontSize: 11, fontFamily: 'monospace', color: 'var(--text)', overflow: 'auto', whiteSpace: 'pre-wrap', maxHeight: 160, border: '1px solid var(--border)' }}>
                      {listingText}
                    </pre>
                    <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                      <button className="af-btn af-btn-primary af-btn-sm" onClick={() => copy(listingText, market.id)}>
                        {copied === market.id ? `✓ ${L.copied}` : `📋 ${L.copy}`}
                      </button>
                      <button className="af-btn af-btn-secondary af-btn-sm" onClick={() => openLink(market.submitUrl)}>
                        🌐 {market.name} →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="af-card">
          <div className="af-section-title" style={{ marginBottom: 10 }}>{L.quick}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {quickLinks.map(link => (
              <button
                key={link.name}
                onClick={() => openLink(link.url)}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, cursor: 'pointer', fontSize: 11, color: 'var(--text)', transition: 'all 0.15s' }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--accent)'
                  e.currentTarget.style.color = 'var(--accent)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--text)'
                }}
              >
                {link.flag} {link.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
