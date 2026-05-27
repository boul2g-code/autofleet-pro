'use client'

import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { fmtCur, fmtDate } from '@/lib/utils'
import { computeFin } from '@/lib/financials'
import type { Vehicle } from '@/lib/types'
import { generateVehiclePDF } from '@/lib/pdf'

interface Props { vehicle: Vehicle }

function Row({ label, value, highlight }: { label: string; value: string; highlight?: 'profit' | 'loss' | 'neutral' }) {
  const colors = { profit: 'var(--success)', loss: 'var(--error)', neutral: 'var(--text)' }
  return (
    <div className="fin-row">
      <span style={{ color: 'var(--muted)', fontSize: 13 }}>{label}</span>
      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 500, color: highlight ? colors[highlight] : 'var(--text)' }}>{value}</span>
    </div>
  )
}

function TotalRow({ label, value, highlight }: { label: string; value: string; highlight?: 'profit' | 'loss' }) {
  return (
    <div className="fin-total-row">
      <span style={{ fontSize: 14 }}>{label}</span>
      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 14, color: highlight === 'profit' ? 'var(--success)' : highlight === 'loss' ? 'var(--error)' : 'var(--text)' }}>{value}</span>
    </div>
  )
}

export default function FinancialsTab({ vehicle: v }: Props) {
  const { lang, settings } = useFleetStore()
  const fin = computeFin(v)
  const T = (k: string) => t(lang, `financials.${k}`)

  const handlePDF = async () => {
    await generateVehiclePDF(v, fin, lang, settings)
  }

  return (
    <div className="af-card">
      <div className="af-section-title">{T('title')}</div>

      {/* Cost breakdown */}
      <div style={{ marginBottom: 4 }}>
        {fin.pp > 0 && <Row label={`📥 ${T('purchaseP')}`} value={fmtCur(fin.pp, v.purchase?.currency)} />}
        {fin.ic > 0 && <Row label={`🚛 ${T('importC')}`} value={fmtCur(fin.ic, v.importTransport?.currency)} />}
        {fin.ec > 0 && <Row label={`🔧 ${T('extraC')}`} value={fmtCur(fin.ec)} />}
        {fin.sc > 0 && <Row label={`🏭 ${T('storageC')} (${fin.storageDays}d)`} value={fmtCur(fin.sc, v.storage?.currency)} />}
        {fin.wc > 0 && <Row label={`🔨 ${T('workC')}`} value={fmtCur(fin.wc)} />}
        {fin.xc > 0 && <Row label={`🚚 ${T('exportC')}`} value={fmtCur(fin.xc, v.exportTransport?.currency)} />}
      </div>
      <TotalRow label={`💰 ${T('totalC')}`} value={fmtCur(fin.total)} />

      <div style={{ margin: '16px 0' }} />

      {fin.sp > 0
        ? <>
          <Row label={`📤 ${T('saleP')}`} value={fmtCur(fin.sp, v.sale?.currency)} highlight="neutral" />
          <TotalRow
            label={`📊 ${T('profit')}`}
            value={fin.profit !== null ? fmtCur(fin.profit) : '—'}
            highlight={fin.profit !== null ? (fin.profit >= 0 ? 'profit' : 'loss') : undefined}
          />
          {fin.margin !== null && (
            <div className="fin-row">
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>📈 {T('margin')}</span>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 600, color: fin.margin >= 0 ? 'var(--success)' : 'var(--error)' }}>
                {fin.margin.toFixed(1)}%
              </span>
            </div>
          )}
        </>
        : <div style={{ color: 'var(--muted)', padding: '12px 0', fontSize: 13 }}>📤 {T('notSold')}</div>
      }

      {/* Work items detail */}
      {(v.storage?.workDone || []).length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div className="af-section-title">{t(lang, 'storage.workTitle')}</div>
          {(v.storage?.workDone || []).map((w, i) => (
            <div key={i} className="fin-row">
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>🔧 {w.desc || '—'} {w.date ? `(${fmtDate(w.date)})` : ''}</span>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 13 }}>{fmtCur(w.cost)}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 20, textAlign: 'right' }}>
        <button className="af-btn af-btn-secondary" onClick={handlePDF} style={{ background: 'rgba(240,165,0,0.1)', border: '1px solid rgba(240,165,0,0.3)', color: 'var(--accent)' }}>
          📄 {t(lang, 'actions.pdf')}
        </button>
      </div>
    </div>
  )
}
