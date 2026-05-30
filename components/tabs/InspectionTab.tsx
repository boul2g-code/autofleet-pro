'use client'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import type { InspectionItem } from '@/lib/types'

const AREAS = [
  'Front bumper', 'Hood', 'Windshield', 'Roof', 'Rear windshield',
  'Rear bumper', 'Front left door', 'Rear left door', 'Front right door', 'Rear right door',
  'Left fender', 'Right fender', 'Left mirror', 'Right mirror',
  'Engine', 'Transmission', 'Brakes', 'Suspension', 'Exhaust',
  'Interior', 'Dashboard', 'Seats', 'A/C', 'Electronics',
  'Front left tire', 'Front right tire', 'Rear left tire', 'Rear right tire',
]

const COND_COLORS: Record<string, string> = {
  good: '#22c55e',
  fair: '#f59e0b',
  poor: '#ef4444',
  na: '#94a3b8',
}

const COND_LABELS: Record<string, string> = {
  good: '✅ Good',
  fair: '⚠️ Fair',
  poor: '❌ Poor',
  na: '— N/A',
}

export default function InspectionTab({ id }: { id: string }) {
  const { vehicles, updateVehicle, settings } = useFleetStore()
  const lang = settings.lang
  const v = vehicles.find(x => x.id === id)
  if (!v) return null

  const items: InspectionItem[] = v.inspection?.length
    ? v.inspection
    : AREAS.map(area => ({ area, condition: 'na' as const }))

  const update = (index: number, patch: Partial<InspectionItem>) => {
    const newItems = items.map((item, i) => i === index ? { ...item, ...patch } : item)
    updateVehicle(id, { inspection: newItems })
  }

  const totalCost = items.reduce((sum, item) => {
    return sum + (parseFloat(String(item.notes?.match(/€(\d+)/)?.[1] || '0')) || 0)
  }, 0)

  const counts = {
    good: items.filter(i => i.condition === 'good').length,
    fair: items.filter(i => i.condition === 'fair').length,
    poor: items.filter(i => i.condition === 'poor').length,
  }

  return (
    <div>
      {/* Summary */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        {Object.entries(counts).map(([cond, count]) => (
          <div key={cond} style={{
            background: 'var(--surface2)', borderRadius: 8, padding: '8px 16px',
            borderLeft: `3px solid ${COND_COLORS[cond]}`,
          }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{count}</div>
            <div style={{ fontSize: 12, color: 'var(--text2)' }}>{cond.charAt(0).toUpperCase() + cond.slice(1)}</div>
          </div>
        ))}
      </div>

      {/* Inspection items */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
        {items.map((item, i) => (
          <div key={item.area} style={{
            background: 'var(--surface2)', borderRadius: 8, padding: '10px 12px',
            borderLeft: `3px solid ${COND_COLORS[item.condition]}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{item.area}</span>
              <select value={item.condition}
                onChange={e => update(i, { condition: e.target.value as InspectionItem['condition'] })}
                style={{ fontSize: 12, padding: '2px 6px', width: 'auto', background: 'var(--surface)' }}>
                {Object.entries(COND_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <input
              value={item.notes || ''}
              onChange={e => update(i, { notes: e.target.value })}
              placeholder="Notes / repair cost (€)"
              style={{ fontSize: 12, padding: '4px 8px' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
