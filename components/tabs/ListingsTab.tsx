/* eslint-disable react/no-unescaped-entities */
'use client'
import { useState, useEffect } from 'react'
import { useFleetStore } from '@/store/useFleetStore'
import { LANGUAGES, t } from '@/lib/i18n'
import type { Lang } from '@/lib/types'
import { isPublicVehicleStatus } from '@/lib/vehiclePublic'

const MARKETPLACES = [
  { name: 'AutoScout24', url: 'https://www.autoscout24.it/inserzioni', flag: '🇮🇹', connected: true },
  { name: 'Mobile.de', url: 'https://www.mobile.de/auto/inserieren', flag: '🇩🇪', connected: true },
  { name: 'Car.gr', url: 'https://www.car.gr/classifieds/cars/', flag: '🇬🇷', connected: true },
  { name: 'AutoTrader', url: 'https://www.autotrader.co.uk', flag: '🇬🇧', connected: false },
  { name: 'Mobile.bg', url: 'https://www.mobile.bg', flag: '🇧🇬', connected: false },
  { name: 'Subito.it', url: 'https://www.subito.it/annunci-italia/vendita/usato/', flag: '🇮🇹', connected: false },
  { name: 'Truck1.eu', url: 'https://www.truck1.eu', flag: '🇪🇺', connected: false },
  { name: 'Mascus.com', url: 'https://www.mascus.com', flag: '🌐', connected: false },
]

const AI_LABELS: Record<string, Partial<Record<Lang, string>>> = {
  aiTitle:    { el:'🤖 AI Δημιουργία Αγγελίας', en:'🤖 AI Generate Ad', de:'🤖 KI Anzeige erstellen', fr:'🤖 IA Générer annonce', it:'🤖 AI Genera annuncio', es:'🤖 IA Generar anuncio' },
  aiSub:      { el:'Δημιουργία επαγγελματικής αγγελίας με AI σε δευτερόλεπτα', en:'Generate professional listing with AI in seconds', de:'Professionelle Anzeige mit KI in Sekunden erstellen', fr:'Générer une annonce professionnelle avec IA en secondes', it:'Genera un annuncio professionale con AI in secondi', es:'Genera un anuncio profesional con IA en segundos' },
  forMarket:  { el:'Για marketplace', en:'For marketplace', de:'Für Marktplatz', fr:'Pour marketplace', it:'Per marketplace', es:'Para marketplace' },
  inLang:     { el:'Σε γλώσσα', en:'In language', de:'In Sprache', fr:'En langue', it:'In lingua', es:'En idioma' },
  generate:   { el:'Δημιουργία Αγγελίας', en:'Generate Listing', de:'Anzeige erstellen', fr:'Générer annonce', it:'Genera annuncio', es:'Generar anuncio' },
  generating: { el:'Δημιουργία...', en:'Generating...', de:'Erstelle...', fr:'Génération...', it:'Generazione...', es:'Generando...' },
  copy:       { el:'Αντιγραφή', en:'Copy', de:'Kopieren', fr:'Copier', it:'Copia', es:'Copiar' },
  copied:     { el:'Αντιγράφηκε!', en:'Copied!', de:'Kopiert!', fr:'Copié!', it:'Copiato!', es:'Copiado!' },
  openSite:   { el:'Άνοιγμα site', en:'Open site', de:'Site öffnen', fr:'Ouvrir site', it:'Apri sito', es:'Abrir sitio' },
  noKey:      { el:'Προσθέστε Anthropic API key στις Ρυθμίσεις', en:'Add Anthropic API key in Settings', de:'Fügen Sie den Anthropic API-Schlüssel in Einstellungen hinzu', fr:'Ajoutez la clé API Anthropic dans Paramètres', it:'Aggiungi la chiave API Anthropic nelle Impostazioni', es:'Añade la clave API Anthropic en Configuración' },
  publicLink: { el:'Δημόσιος Σύνδεσμος', en:'Public Link', de:'Öffentlicher Link', fr:'Lien public', it:'Link pubblico', es:'Enlace público' },
  qrCode:     { el:'QR Code', en:'QR Code', de:'QR-Code', fr:'Code QR', it:'Codice QR', es:'Código QR' },
  marketplaces:{ el:'Marketplaces', en:'Marketplaces', de:'Marktplätze', fr:'Marketplaces', it:'Marketplace', es:'Marketplaces' },
  visit:      { el:'Επίσκεψη', en:'Visit', de:'Besuchen', fr:'Visiter', it:'Visita', es:'Visitar' },
  shareWa:    { el:'WhatsApp', en:'WhatsApp', de:'WhatsApp', fr:'WhatsApp', it:'WhatsApp', es:'WhatsApp' },
}

const LL = (lang: Lang, key: string) => AI_LABELS[key]?.[lang] || AI_LABELS[key]?.en || key

export default function ListingsTab({ id }: { id: string }) {
  const { vehicles, settings } = useFleetStore()
  const lang = settings.lang
  const v = vehicles.find(x => x.id === id)
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState('')
  const [siteUrl, setSiteUrl] = useState('')
  const [aiMarket, setAiMarket] = useState('AutoScout24')
  const [aiLang, setAiLang] = useState<Lang>(lang)
  const [aiResult, setAiResult] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

  useEffect(() => {
    setSiteUrl(window.location.origin)
  }, [])

  useEffect(() => {
    if (!siteUrl || !id || !v || !isPublicVehicleStatus(v.status)) {
      setQrUrl(null)
      return
    }
    const publicUrl = `${siteUrl}/v/${id}`
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicUrl)}`)
  }, [siteUrl, id, v])

  if (!v) return null

  const isPublic = isPublicVehicleStatus(v.status)
  const publicUrl = `${siteUrl}/v/${id}`

  const generateAI = async () => {
    setAiLoading(true)
    setAiResult('')
    setAiError('')
    try {
      const res = await fetch('/api/ai-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle: {
            make: v.make, model: v.model, year: v.year,
            mileage: v.mileage, fuelType: v.fuelType, gearType: v.gearType,
            engineCC: v.engineCC, powerKW: v.powerKW, color: v.color,
            doors: v.doors, seats: v.seats,
            salePrice: v.sale?.price,
            notes: v.notes,
          },
          targetLang: aiLang,
          marketplace: aiMarket,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setAiError(typeof data?.error === 'string' && data.error.trim() ? data.error : 'Description generation failed.')
        return
      }
      if (!data.description) {
        setAiError('Description generation returned no content.')
        return
      }
      setAiResult(data.description)
    } catch {
      setAiError('Description generation failed.')
    } finally {
      setAiLoading(false)
    }
  }

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  const printQR = () => {
    if (!qrUrl) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<html><head><title>QR</title></head><body style="text-align:center;padding:40px;font-family:Arial">
      <h2>${v.make} ${v.model} ${v.year}</h2><p>${v.plate || ''}</p>
      <img src="${qrUrl}" width="200" /><p style="font-size:11px;word-break:break-all;margin-top:12px">${publicUrl}</p>
      <script>window.onload=()=>window.print()</script></body></html>`)
    win.document.close()
  }

  return (
    <div>
      {/* ═══ AI DESCRIPTION GENERATOR ═══ */}
      <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{LL(lang, 'aiTitle')}</div>
        <div style={{ color: 'var(--text2)', fontSize: 12, marginBottom: 12 }}>{LL(lang, 'aiSub')}</div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 4, display: 'block' }}>{LL(lang, 'forMarket')}</label>
            <select value={aiMarket} onChange={e => setAiMarket(e.target.value)} style={{ width: '100%' }}>
              {MARKETPLACES.map(m => <option key={m.name} value={m.name}>{m.flag} {m.name}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 4, display: 'block' }}>{LL(lang, 'inLang')}</label>
            <select value={aiLang} onChange={e => setAiLang(e.target.value as Lang)} style={{ width: '100%' }}>
              {LANGUAGES.map(option => (
                <option key={option.code} value={option.code}>
                  {option.flag} {option.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn btn-primary" onClick={generateAI} disabled={aiLoading} style={{ whiteSpace: 'nowrap' }}>
              {aiLoading ? LL(lang, 'generating') : LL(lang, 'generate')}
            </button>
          </div>
        </div>

        {aiResult && (
          <div>
            <textarea
              value={aiResult}
              onChange={e => setAiResult(e.target.value)}
              rows={8}
              style={{ width: '100%', fontSize: 13, fontFamily: 'monospace', marginBottom: 8 }}
            />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" style={{ fontSize: 13 }}
                onClick={() => copyText(aiResult, 'ai')}>
                {copied === 'ai' ? `✅ ${LL(lang, 'copied')}` : `📋 ${LL(lang, 'copy')}`}
              </button>
              <a href={MARKETPLACES.find(m => m.name === aiMarket)?.url} target="_blank" rel="noopener noreferrer"
                className="btn btn-ghost" style={{ fontSize: 13 }}>
                🔗 {LL(lang, 'openSite')} {aiMarket}
              </a>
            </div>
          </div>
        )}

        {aiError && (
          <p style={{ fontSize: 12, color: 'var(--warning)', marginTop: 8 }}>
            ⚠️ {aiError}
          </p>
        )}
      </div>

      {/* ═══ Public Link + QR ═══ */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>🔗 {LL(lang, 'publicLink')}</div>
        {isPublic ? (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <code style={{ flex: 1, background: 'var(--surface2)', padding: '8px 12px', borderRadius: 6, fontSize: 12, wordBreak: 'break-all' }}>
                {publicUrl}
              </code>
              <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => copyText(publicUrl, 'link')}>
                {copied === 'link' ? '✅' : '📋'} {LL(lang, 'copy')}
              </button>
              <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontSize: 13 }}>👁️</a>
            </div>
            <a href={`https://wa.me/?text=${encodeURIComponent(`🚗 ${v.make} ${v.model} ${v.year}\n${v.mileage?.toLocaleString()} km\n${v.sale?.price ? '€' + v.sale.price.toLocaleString() : ''}\n\n${publicUrl}`)}`}
              target="_blank" rel="noopener noreferrer" className="btn btn-success" style={{ fontSize: 13 }}>
              💬 {LL(lang, 'shareWa')}
            </a>
          </>
        ) : (
          <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 0 }}>
            Set vehicle status to <strong>for_sale</strong> to enable the public page and QR sharing.
          </p>
        )}
      </div>

      {/* QR */}
      {isPublic && qrUrl && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>📱 {LL(lang, 'qrCode')}</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <img src={qrUrl} alt="QR" style={{ width: 120, height: 120, border: '1px solid var(--border)', borderRadius: 8 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={printQR}>🖨️ Print QR</button>
              <a href={qrUrl} download={`QR-${v.plate || id}.png`} className="btn btn-ghost" style={{ fontSize: 13 }}>⬇️ PNG</a>
            </div>
          </div>
        </div>
      )}

      {/* Marketplaces */}
      <div>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>🌐 {LL(lang, 'marketplaces')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {MARKETPLACES.map(m => (
            <div key={m.name} className="card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 18 }}>{m.flag}</span>
              <span style={{ fontWeight: 600, flex: 1, fontSize: 14 }}>{m.name}</span>
              {m.connected ? (
                <>
                  <button className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 10px' }}
                    onClick={() => copyText(aiResult || `${v.make} ${v.model} ${v.year} | ${v.mileage?.toLocaleString()} km | ${v.fuelType} | €${v.sale?.price || ''}\n${publicUrl}`, m.name)}>
                    {copied === m.name ? '✅' : '📋'} {LL(lang, 'copy')}
                  </button>
                  <a href={m.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: 12, padding: '4px 10px' }}>
                    🔗 {LL(lang, 'openSite')}
                  </a>
                </>
              ) : (
                <a href={m.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 10px' }}>
                  🔗 {LL(lang, 'visit')}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
