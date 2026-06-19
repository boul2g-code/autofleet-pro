/* eslint-disable react/no-unescaped-entities */
'use client'
import { useState, useEffect, useRef } from 'react'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'

export default function GlobalSearch({ onSelect }: { onSelect?: (id: string) => void }) {
  const { vehicles, settings } = useFleetStore()
  const lang = settings.lang
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
        setTimeout(() => inputRef.current?.focus(), 50)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const results = q.length < 2 ? [] : vehicles.filter(v => {
    const s = q.toLowerCase()
    return [
      v.make, v.model, v.plate, v.vin, v.color,
      String(v.year || ''), v.purchase?.sellerName,
      v.sale?.buyerName, v.storage?.address,
      String(v.purchase?.price || ''), String(v.sale?.price || ''),
      v.purchase?.invoiceNumber, v.sale?.invoiceNumber,
      v.transportIn?.cmrNumber, v.transportOut?.cmrNumber,
    ].some(f => (f || '').toLowerCase().includes(s))
  }).slice(0, 8)

  if (!open) {
    return (
      <button onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50) }}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--surface2)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
          color: 'var(--text2)', fontSize: 13, minWidth: 180,
        }}>
        🔍 <span>{t(lang, 'veh.search')}</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.6 }}>⌘K</span>
      </button>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 80 }}>
      <div onClick={() => setOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 560, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 18 }}>🔍</span>
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
            placeholder={t(lang, 'vehicles.searchPlaceholderLong', { search: t(lang, 'veh.search') })}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 16, color: 'var(--text)' }}
            autoFocus />
          <span style={{ fontSize: 11, color: 'var(--text2)', background: 'var(--surface2)', padding: '2px 6px', borderRadius: 4 }}>ESC</span>
        </div>
        {q.length >= 2 && (
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {results.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text2)', fontSize: 14 }}>
                {t(lang, 'vehicles.searchNoResults', { query: q })}
              </div>
            ) : results.map(v => (
              <div key={v.id}
                onClick={() => {
                  setOpen(false)
                  setQ('')
                  onSelect?.(v.id)
                  // Navigate to vehicles and select
                  window.location.href = '/vehicles#' + v.id
                }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                {v.photo
                  ? <img src={v.photo} alt="" style={{ width: 40, height: 30, objectFit: 'cover', borderRadius: 4 }} />
                  : <div style={{ width: 40, height: 30, background: 'var(--surface2)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🚗</div>
                }
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{v.make} {v.model} {v.year}</div>
                  <div style={{ color: 'var(--text2)', fontSize: 12 }}>
                    {v.plate && <span style={{ marginRight: 8 }}>📋 {v.plate}</span>}
                    {v.vin && <span style={{ marginRight: 8 }}>🔢 {v.vin.slice(-8)}</span>}
                    {v.mileage && <span>{v.mileage.toLocaleString()} km</span>}
                  </div>
                </div>
                <span className={`badge status-${v.status}`} style={{ fontSize: 11 }}>{t(lang, `status.${v.status}`)}</span>
              </div>
            ))}
          </div>
        )}
        {q.length < 2 && (
          <div style={{ padding: '12px 16px', color: 'var(--text2)', fontSize: 13 }}>
            {t(lang, 'vehicles.searchTypeMore')}
          </div>
        )}
      </div>
    </div>
  )
}
