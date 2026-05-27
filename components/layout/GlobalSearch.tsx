'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { catIcon, statusIcon, fmtCur } from '@/lib/utils'

export default function GlobalSearch() {
  const { lang, vehicles } = useFleetStore()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const openSearch = () => {
    setQuery('')
    setOpen(true)
  }

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(current => {
          const next = !current
          if (next) setQuery('')
          return next
        })
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (!open) return

    const timer = window.setTimeout(() => inputRef.current?.focus(), 50)
    return () => window.clearTimeout(timer)
  }, [open])

  const results = query.trim().length < 1 ? [] : vehicles.filter(v => {
    const q = query.toLowerCase()
    return [
      v.businessId, v.vin, v.plate, v.make, v.model, v.year, v.color,
      v.purchase?.sellerName, v.sale?.buyerName,
      v.purchase?.priceGross, v.sale?.priceGross,
      v.purchase?.invoiceNum, v.sale?.invoiceNum,
      v.importTransport?.cmr, v.exportTransport?.cmr,
      v.regCountry, v.cocNum,
    ].some(f => (f || '').toString().toLowerCase().includes(q))
  }).slice(0, 12)

  const go = (id: string) => {
    setOpen(false)
    router.push(`/vehicles/${id}`)
  }

  const placeholder = lang === 'el'
    ? 'Αναζήτηση VIN, πινακίδα, μάρκα, τιμολόγιο...'
    : lang === 'de'
    ? 'FIN, Kennzeichen, Marke, Rechnung suchen...'
    : 'Search VIN, plate, make, invoice...'

  return (
    <>
      {/* Search button — always visible in header */}
      <button
        onClick={openSearch}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
          color: 'var(--muted)', fontSize: 13, transition: 'all 0.15s',
          minWidth: 200,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'
          ;(e.currentTarget as HTMLElement).style.color = 'var(--text)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
          ;(e.currentTarget as HTMLElement).style.color = 'var(--muted)'
        }}
      >
        <span>🔍</span>
        <span style={{ flex: 1, textAlign: 'left' }}>{placeholder.split('...')[0]}...</span>
        <span style={{ fontSize: 11, background: 'var(--card)', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace' }}>⌘K</span>
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 2000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '10vh 20px' }}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, width: '100%', maxWidth: 600, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
            {/* Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 18 }}>🔍</span>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={placeholder}
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 15, fontFamily: 'IBM Plex Sans, sans-serif' }}
              />
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>

            {/* Results */}
            <div style={{ maxHeight: 420, overflowY: 'auto' }}>
              {query.trim() && results.length === 0 && (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--muted)' }}>
                  {lang === 'el' ? 'Δεν βρέθηκαν αποτελέσματα' : lang === 'de' ? 'Keine Ergebnisse' : 'No results found'}
                </div>
              )}
              {results.map(v => (
                <div
                  key={v.id}
                  onClick={() => go(v.id)}
                  style={{ display: 'flex', gap: 12, padding: '12px 20px', cursor: 'pointer', borderBottom: '1px solid rgba(42,42,62,0.5)', alignItems: 'center' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(240,165,0,0.06)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <div style={{ fontSize: 24, flexShrink: 0 }}>{catIcon(v.category)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      {v.make || '—'} {v.model} {v.year}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>{v.businessId}</span>
                      {v.vin && <span style={{ fontFamily: 'monospace' }}>{v.vin}</span>}
                      {v.plate && <span style={{ background: 'var(--surface)', padding: '1px 6px', borderRadius: 4, border: '1px solid var(--border)', fontFamily: 'monospace' }}>{v.plate}</span>}
                      <span>{statusIcon(v.status)} {t(lang, `status.${v.status}`)}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    {v.purchase?.priceGross && (
                      <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>
                        {fmtCur(v.purchase.priceGross, v.purchase.currency)}
                      </div>
                    )}
                    {v.sale?.priceGross && (
                      <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--success)' }}>
                        → {fmtCur(v.sale.priceGross, v.sale.currency)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {!query.trim() && (
                <div style={{ padding: '20px', color: 'var(--muted)', fontSize: 12 }}>
                  <div style={{ marginBottom: 8, fontWeight: 600, color: 'var(--text)', fontSize: 13 }}>
                    {lang === 'el' ? 'Μπορείτε να αναζητήσετε με:' : lang === 'de' ? 'Sie können suchen nach:' : 'You can search by:'}
                  </div>
                  {['VIN', lang === 'el' ? 'Πινακίδα' : lang === 'de' ? 'Kennzeichen' : 'License Plate',
                    lang === 'el' ? 'Μάρκα / Μοντέλο' : lang === 'de' ? 'Marke / Modell' : 'Make / Model',
                    lang === 'el' ? 'Αρ. Τιμολογίου' : lang === 'de' ? 'Rechnungsnr.' : 'Invoice No.',
                    'CMR', lang === 'el' ? 'Αγοραστής / Πωλητής' : lang === 'de' ? 'Käufer / Verkäufer' : 'Buyer / Seller',
                    lang === 'el' ? 'Τιμή αγοράς' : lang === 'de' ? 'Kaufpreis' : 'Purchase price',
                  ].map(s => <span key={s} style={{ display: 'inline-block', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, padding: '3px 8px', margin: '3px', fontSize: 11 }}>{s}</span>)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
