'use client'

import { useFleetStore } from '@/store/useFleetStore'

export default function Toast() {
  const { toast } = useFleetStore()
  if (!toast) return null

  const bg = toast.type === 'success' ? 'var(--success)' : toast.type === 'error' ? 'var(--error)' : 'var(--blue)'
  const color = toast.type === 'success' ? '#000' : '#fff'

  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 9999,
      padding: '12px 20px', borderRadius: 10,
      fontWeight: 600, fontSize: 13,
      background: bg, color,
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      animation: 'fadeIn 0.3s ease',
    }}>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }`}</style>
      {toast.msg}
    </div>
  )
}
