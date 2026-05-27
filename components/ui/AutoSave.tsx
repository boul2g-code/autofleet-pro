'use client'

import { useEffect, useRef, useState } from 'react'
import { useFleetStore } from '@/store/useFleetStore'

interface Props {
  vehicleId: string
  deps: unknown[]  // values to watch for changes
}

/**
 * Shows an "auto-saving..." / "saved" indicator.
 * Debounces saves — waits 1.5s after last change before saving.
 */
export default function AutoSave({ vehicleId, deps }: Props) {
  const { updateVehicle, vehicles } = useFleetStore()
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(false)

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }

    // Something changed — debounce the save
    if (timerRef.current) clearTimeout(timerRef.current)
    setStatus('saving')

    timerRef.current = setTimeout(async () => {
      const v = vehicles.find(x => x.id === vehicleId)
      if (v) {
        await updateVehicle(vehicleId, { updatedAt: new Date().toISOString() })
        setStatus('saved')
        setTimeout(() => setStatus('idle'), 2500)
      }
    }, 1500)

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  if (status === 'idle') return null

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 500,
      background: status === 'saved' ? 'var(--success)' : 'var(--surface)',
      border: `1px solid ${status === 'saved' ? 'var(--success)' : 'var(--border)'}`,
      color: status === 'saved' ? '#000' : 'var(--muted)',
      borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 600,
      display: 'flex', alignItems: 'center', gap: 8,
      animation: 'fadeIn 0.2s ease',
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
    }}>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
      {status === 'saving'
        ? <><span className="spinner" /> Auto-saving...</>
        : <>✓ Saved</>
      }
    </div>
  )
}
