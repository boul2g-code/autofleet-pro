'use client'

import { useRef, useState } from 'react'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import { docIcon, guessDoctType, fmtDate, DOC_TYPES } from '@/lib/utils'
import { formatFileSize, MAX_DOCUMENT_UPLOAD_BYTES, validateDocumentUpload } from '@/lib/uploads'
import type {
  CreateUploadUrlResponse,
  Vehicle,
  VehicleDocument,
  PurchaseData,
  TransportData,
  SaleData,
} from '@/lib/types'

interface Props { vehicle: Vehicle }
type AIState = 'idle' | 'loading' | 'ok' | 'error'

async function blobToBase64(blob: Blob): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      resolve(result.includes(',') ? result.split(',')[1] : result)
    }
    reader.onerror = () => reject(reader.error ?? new Error('Could not read file'))
    reader.readAsDataURL(blob)
  })
}

export default function DocumentsTab({ vehicle: v }: Props) {
  const { lang, updateVehicleSection, showToast } = useFleetStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [aiState, setAiState] = useState<Record<number, AIState>>({})
  const [aiMsg, setAiMsg] = useState<Record<number, string>>({})
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)

  const T = (k: string) => t(lang, `documents.${k}`)
  const docs = v.documents || []
  const supabase = createClient()

  const processFiles = async (files: FileList | null) => {
    if (!files || !files.length || uploading) return

    setUploading(true)
    try {
      const newDocs = await Promise.all(
        Array.from(files).map(async file => {
          const uploadError = validateDocumentUpload(file)
          if (uploadError) {
            throw new Error(`${file.name}: ${uploadError}`)
          }

          const mimeType = file.type || 'application/octet-stream'
          const docType = guessDoctType(file.name)

          const res = await fetch('/api/create-upload-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              vehicleId: v.id,
              documentType: docType,
              mimeType,
              sizeBytes: file.size,
            }),
          })

          const json = await res.json() as CreateUploadUrlResponse & { error?: string }
          if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`)

          const { documentId, path, token } = json
          const { error } = await supabase.storage
            .from('documents')
            .uploadToSignedUrl(path, token, file, { contentType: mimeType })

          if (error) throw new Error(error.message)

          return {
            id: documentId,
            name: file.name,
            mimeType,
            docType,
            storagePath: path,
            metadata: {
              sizeBytes: file.size,
            },
            uploadDate: new Date().toISOString(),
          } satisfies VehicleDocument
        }),
      )

      await updateVehicleSection(v.id, 'documents', [...docs, ...newDocs])
      showToast(`${newDocs.length} file(s) uploaded ✓`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      showToast(`${T('aiErr')}: ${msg}`, 'error')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const deleteDoc = async (i: number) => {
    const doc = docs[i]
    try {
      const { error } = await supabase.storage.from('documents').remove([doc.storagePath])
      if (error) throw new Error(error.message)

      await updateVehicleSection(v.id, 'documents', docs.filter((_, idx) => idx !== i))
      showToast(t(lang, 'msg.deleted'))
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      showToast(`${T('aiErr')}: ${msg}`, 'error')
    }
  }

  const updateDocType = async (i: number, docType: string) => {
    const updated = docs.map((d, idx) =>
      idx === i ? { ...d, docType: docType as VehicleDocument['docType'] } : d,
    )
    await updateVehicleSection(v.id, 'documents', updated)
  }

  const viewDoc = async (doc: VehicleDocument) => {
    try {
      const { data, error } = await supabase.storage.from('documents').download(doc.storagePath)
      if (error || !data) throw new Error(error?.message || 'Could not download document')

      const url = URL.createObjectURL(data)
      window.open(url, '_blank', 'noopener,noreferrer')
      setTimeout(() => URL.revokeObjectURL(url), 60_000)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      showToast(`${T('aiErr')}: ${msg}`, 'error')
    }
  }

  const extractAI = async (i: number) => {
    const doc = docs[i]
    setAiState(s => ({ ...s, [i]: 'loading' }))
    setAiMsg(s => ({ ...s, [i]: '' }))

    try {
      const { data: blob, error: downloadError } = await supabase.storage
        .from('documents')
        .download(doc.storagePath)

      if (downloadError || !blob) {
        throw new Error(downloadError?.message || 'Could not download document')
      }

      const base64Data = await blobToBase64(blob)

      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Data, mimeType: doc.mimeType }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`)

      const ex = json.data as Record<string, unknown>
      const fieldCount: number = json.fieldCount ?? 0
      if (fieldCount === 0) throw new Error('No data found in document')

      const store = useFleetStore.getState()
      const cur = store.vehicles.find(x => x.id === v.id) ?? v

      const topFields = ['vin', 'make', 'model', 'year', 'color', 'engine', 'fuel', 'gearbox',
        'mileage', 'firstReg', 'regCountry', 'plate', 'seats', 'payload', 'cocNum'] as const
      const topUpdates: Record<string, string> = {}
      topFields.forEach(f => { if (ex[f] != null) topUpdates[f] = String(ex[f]) })
      if (Object.keys(topUpdates).length) await store.updateVehicle(v.id, topUpdates)

      if (ex.purchaseDate || ex.sellerName || ex.priceGross || ex.purchaseInvoiceNum) {
        const purchase: PurchaseData = {
          ...cur.purchase,
          ...(ex.purchaseDate ? { date: String(ex.purchaseDate) } : {}),
          ...(ex.sellerName ? { sellerName: String(ex.sellerName) } : {}),
          ...(ex.sellerCountry ? { sellerCountry: String(ex.sellerCountry) } : {}),
          ...(ex.priceNet != null ? { priceNet: String(ex.priceNet) } : {}),
          ...(ex.priceGross != null ? { priceGross: String(ex.priceGross) } : {}),
          ...(ex.vatRate != null ? { vatRate: String(ex.vatRate) } : {}),
          ...(ex.purchaseInvoiceNum ? { invoiceNum: String(ex.purchaseInvoiceNum) } : {}),
        }
        await store.updateVehicleSection(v.id, 'purchase', purchase)
      }

      if (ex.cmrNumber || ex.carrier || ex.origin) {
        const importTransport: TransportData = {
          ...cur.importTransport,
          ...(ex.cmrNumber ? { cmr: String(ex.cmrNumber) } : {}),
          ...(ex.carrier ? { carrier: String(ex.carrier) } : {}),
          ...(ex.origin ? { origin: String(ex.origin) } : {}),
          ...(ex.destination ? { dest: String(ex.destination) } : {}),
          ...(ex.departureDate ? { depDate: String(ex.departureDate) } : {}),
          ...(ex.arrivalDate ? { arrDate: String(ex.arrivalDate) } : {}),
          ...(ex.truckPlate ? { truckPlate: String(ex.truckPlate) } : {}),
          ...(ex.driver ? { driver: String(ex.driver) } : {}),
        }
        await store.updateVehicleSection(v.id, 'importTransport', importTransport)
      }

      if (ex.saleBuyerName || ex.saleDate || ex.salePriceGross) {
        const sale: SaleData = {
          ...cur.sale,
          ...(ex.saleDate ? { date: String(ex.saleDate) } : {}),
          ...(ex.saleBuyerName ? { buyerName: String(ex.saleBuyerName) } : {}),
          ...(ex.saleBuyerCountry ? { buyerCountry: String(ex.saleBuyerCountry) } : {}),
          ...(ex.salePriceNet != null ? { priceNet: String(ex.salePriceNet) } : {}),
          ...(ex.salePriceGross != null ? { priceGross: String(ex.salePriceGross) } : {}),
          ...(ex.saleInvoiceNum ? { invoiceNum: String(ex.saleInvoiceNum) } : {}),
        }
        await store.updateVehicleSection(v.id, 'sale', sale)
      }

      setAiState(s => ({ ...s, [i]: 'ok' }))
      setAiMsg(s => ({ ...s, [i]: `✓ ${fieldCount} ${T('aiOk')}` }))
      showToast(`${T('aiOk')} - ${fieldCount} fields`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setAiState(s => ({ ...s, [i]: 'error' }))
      setAiMsg(s => ({ ...s, [i]: msg }))
      showToast(`${T('aiErr')}: ${msg}`, 'error')
    }
  }

  return (
    <div className="af-card">
      <div className="af-section-title">{T('title')}</div>

      <div
        className={`upload-zone${dragOver ? ' dragover' : ''}`}
        onClick={() => fileRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); void processFiles(e.dataTransfer.files) }}
        role="button" tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
      >
        <div style={{ fontSize: 36, marginBottom: 10 }}>{uploading ? '⏳' : '📎'}</div>
        <div style={{ color: 'var(--muted)', fontSize: 13 }}>
          {uploading ? T('aiLoading') : T('upload')}
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, opacity: 0.7 }}>{T('hint')}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, opacity: 0.7 }}>
          PDF, JPG, PNG, WEBP · max {formatFileSize(MAX_DOCUMENT_UPLOAD_BYTES)}
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        multiple
        accept="application/pdf,image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={e => { void processFiles(e.target.files) }}
      />

      <div style={{ marginTop: 20 }}>
        {docs.length === 0
          ? <div style={{ color: 'var(--muted)', textAlign: 'center', padding: 20 }}>{T('noDoc')}</div>
          : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
              {docs.map((doc, i) => (
                <DocCard
                  key={doc.id}
                  doc={doc}
                  index={i}
                  lang={lang}
                  aiState={aiState[i] ?? 'idle'}
                  aiMsg={aiMsg[i] ?? ''}
                  onView={() => { void viewDoc(doc) }}
                  onExtract={() => { void extractAI(i) }}
                  onDelete={() => { void deleteDoc(i) }}
                  onTypeChange={val => { void updateDocType(i, val) }}
                />
              ))}
            </div>
        }
      </div>
    </div>
  )
}

function DocCard({ doc, index: _i, lang, aiState, aiMsg, onView, onExtract, onDelete, onTypeChange }: {
  doc: VehicleDocument
  index: number
  lang: string
  aiState: AIState
  aiMsg: string
  onView: () => void
  onExtract: () => void
  onDelete: () => void
  onTypeChange: (v: string) => void
}) {
  const T = (k: string) => t(lang as 'el' | 'en' | 'de', `documents.${k}`)
  const stateColor = { idle: 'var(--muted)', loading: 'var(--blue)', ok: 'var(--success)', error: 'var(--error)' }[aiState]

  return (
    <div style={{ background: 'var(--surface)', border: `1px solid ${aiState === 'ok' ? 'rgba(46,213,115,0.3)' : 'var(--border)'}`, borderRadius: 10, padding: 14, transition: 'border-color 0.2s' }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{docIcon(doc.mimeType)}</div>
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, wordBreak: 'break-word', lineHeight: 1.4 }}>{doc.name}</div>
      <select className="af-input" style={{ padding: '3px 6px', fontSize: 11, marginBottom: 6 }} value={doc.docType} onChange={e => onTypeChange(e.target.value)}>
        {DOC_TYPES.map(dt => <option key={dt} value={dt}>{t(lang as 'el' | 'en' | 'de', `docType.${dt}`)}</option>)}
      </select>
      <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 10 }}>{fmtDate(doc.uploadDate)}</div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <button className="af-btn af-btn-secondary af-btn-xs" onClick={onView}>{T('view')}</button>
        <button className="af-btn af-btn-secondary af-btn-xs" onClick={onExtract} disabled={aiState === 'loading'} style={{ opacity: aiState === 'loading' ? 0.6 : 1 }}>
          {aiState === 'loading' ? <><span className="spinner" style={{ marginRight: 4 }} />{T('aiLoading')}</> : `🤖 ${T('aiExtract')}`}
        </button>
        <button className="af-btn af-btn-danger af-btn-xs" onClick={onDelete}>{T('del')}</button>
      </div>
      {aiState !== 'idle' && <div style={{ fontSize: 11, color: stateColor, marginTop: 8, lineHeight: 1.4 }}>{aiMsg}</div>}
    </div>
  )
}
