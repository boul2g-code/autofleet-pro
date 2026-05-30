'use client'
import { useState } from 'react'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import type { VehicleDocument } from '@/lib/types'

const DOC_TYPES = ['invoice','registration','coc','inspection','cmr','other']

export default function DocumentsTab({ id }: { id: string }) {
  const { vehicles, updateVehicle, settings } = useFleetStore()
  const lang = settings.lang
  const v = vehicles.find(x => x.id === id)
  const [extracting, setExtracting] = useState(false)
  if (!v) return null

  const docs = v.documents || []

  const addDoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const doc: VehicleDocument = {
        id: Date.now().toString(),
        name: file.name,
        type: 'other',
        url: ev.target?.result as string,
        uploadedAt: new Date().toISOString(),
      }
      updateVehicle(id, { documents: [...docs, doc] })
    }
    reader.readAsDataURL(file)
  }

  const removeDoc = (docId: string) => {
    updateVehicle(id, { documents: docs.filter(d => d.id !== docId) })
  }

  const extractWithAI = async (doc: VehicleDocument) => {
    if (!settings.anthropicKey) {
      alert('Set your Anthropic API key in Settings first.')
      return
    }
    if (!doc.url) return
    setExtracting(true)
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docUrl: doc.url, vehicleId: id }),
      })
      const data = await res.json()
      if (data.patch) {
        updateVehicle(id, data.patch)
        alert('AI extraction complete! Vehicle data updated.')
      }
    } catch {
      alert('Extraction failed.')
    }
    setExtracting(false)
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
          className="btn btn-primary">
          📎 {t(lang, 'action.upload')} Document
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={addDoc} />
        </label>
      </div>

      {docs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text2)' }}>
          <div style={{ fontSize: 32 }}>📄</div>
          <p>No documents yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {docs.map(doc => (
            <div key={doc.id} className="card" style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 20 }}>
                  {doc.name.endsWith('.pdf') ? '📄' : '🖼️'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{doc.name}</div>
                  <div style={{ color: 'var(--text2)', fontSize: 12 }}>
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
                {doc.url && (
                  <a href={doc.url} target="_blank" rel="noopener noreferrer"
                    className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12 }}>
                    👁️ View
                  </a>
                )}
                <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: 12 }}
                  onClick={() => extractWithAI(doc)} disabled={extracting}>
                  {extracting ? '⏳' : '🤖 AI Extract'}
                </button>
                <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: 12 }}
                  onClick={() => removeDoc(doc.id)}>
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {settings.anthropicKey ? (
        <p style={{ marginTop: 12, fontSize: 12, color: 'var(--success)' }}>✅ AI extraction enabled</p>
      ) : (
        <p style={{ marginTop: 12, fontSize: 12, color: 'var(--text2)' }}>
          💡 Add Anthropic API key in Settings to enable AI data extraction from documents.
        </p>
      )}
    </div>
  )
}
