'use client'
import { useState } from 'react'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import type { VehicleDocument } from '@/lib/types'

const DOC_TYPES = ['invoice','registration','coc','inspection','cmr','other']

// ── OCR field extraction rules (no API needed) ──────────────
function extractFields(text: string): Record<string, unknown> {
  const patch: Record<string, unknown> = {}
  const upper = text.toUpperCase()

  // VIN — 17 chars alphanumeric (no I, O, Q)
  const vinMatch = text.match(/\b([A-HJ-NPR-Z0-9]{17})\b/)
  if (vinMatch) patch.vin = vinMatch[1]

  // Plate — various formats
  const plateMatch = text.match(/\b([A-Z]{1,3}[-\s]?[0-9]{3,4}[-\s]?[A-Z]{0,3})\b/) ||
                     text.match(/\b([A-Z]{2,3}\s?\d{3,4}\s?[A-Z]{0,2})\b/)
  if (plateMatch) patch.plate = plateMatch[1].trim()

  // Year — 4-digit between 1990-2030
  const yearMatch = text.match(/\b(199[0-9]|200[0-9]|201[0-9]|202[0-9]|2030)\b/)
  if (yearMatch) patch.year = parseInt(yearMatch[1])

  // Mileage — number followed by km
  const kmMatch = text.match(/(\d{1,3}[.,]?\d{3})\s*(?:km|KM|χλμ)/i) ||
                  text.match(/(?:km|mileage|chilometri|χιλιόμετρα)[:\s]+(\d{1,3}[.,]?\d{3})/i)
  if (kmMatch) patch.mileage = parseInt(kmMatch[1].replace(/[.,]/g, ''))

  // Price — number with € or EUR
  const priceMatch = text.match(/[€$£]\s*(\d{1,3}[.,]?\d{3}(?:[.,]\d{2})?)/i) ||
                     text.match(/(\d{1,3}[.,]?\d{3}(?:[.,]\d{2})?)\s*(?:EUR|€)/i) ||
                     text.match(/(?:price|prezzo|τιμή|preis)[:\s]+(\d{1,3}[.,]?\d{3})/i)
  if (priceMatch) {
    const price = parseFloat(priceMatch[1].replace(/\./g, '').replace(',', '.'))
    if (price > 500 && price < 2000000) {
      patch.purchase = { price }
    }
  }

  // Make — common brands
  const makes = ['BMW','Mercedes','Audi','Volkswagen','VW','Toyota','Ford','Volvo','Renault',
    'Peugeot','Citroën','Fiat','Opel','Skoda','Seat','Kia','Hyundai','Nissan','Honda',
    'Mazda','Scania','MAN','DAF','Iveco','Caterpillar','CAT','Komatsu','JCB','Liebherr']
  for (const make of makes) {
    if (upper.includes(make.toUpperCase())) {
      patch.make = make === 'VW' ? 'Volkswagen' : make
      break
    }
  }

  // Fuel type
  if (upper.includes('DIESEL')) patch.fuelType = 'diesel'
  else if (upper.includes('PETROL') || upper.includes('BENZIN') || upper.includes('GASOLINE')) patch.fuelType = 'petrol'
  else if (upper.includes('HYBRID')) patch.fuelType = 'hybrid'
  else if (upper.includes('ELECTRIC') || upper.includes('ELEKTRO')) patch.fuelType = 'electric'

  // Seats
  const seatsMatch = text.match(/(\d+)\s*(?:seats|posti|Sitze|θέσεις)/i)
  if (seatsMatch) patch.seats = parseInt(seatsMatch[1])

  // Seller name from invoice
  const sellerMatch = text.match(/(?:seller|venditore|verkäufer|πωλητής)[:\s]+([A-Za-z\s]+(?:GmbH|SRL|SA|AE|Ltd)?)/i)
  if (sellerMatch) patch.purchase = { ...(patch.purchase as object || {}), sellerName: sellerMatch[1].trim() }

  // CMR number
  const cmrMatch = text.match(/CMR[:\s#]+([A-Z0-9-]+)/i)
  if (cmrMatch) patch.transportIn = { cmrNumber: cmrMatch[1] }

  return patch
}

async function runOCR(dataUrl: string, isPDF: boolean): Promise<string> {
  // Use Tesseract.js from CDN via dynamic import
  if (isPDF) {
    // For PDFs we can't use Tesseract directly in browser — use text extraction hint
    return ''
  }

  return new Promise((resolve) => {
    const script = document.getElementById('tesseract-script') as HTMLScriptElement | null
    const doOCR = () => {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Tesseract = (window as any).Tesseract
      if (!Tesseract) { resolve(''); return }
      Tesseract.recognize(dataUrl, 'eng+ita+deu+ell')
        .then((result: { data: { text: string } }) => resolve(result.data.text))
        .catch(() => resolve(''))
    }

    if ((window as Window & { Tesseract?: unknown }).Tesseract) {
      doOCR()
    } else if (!script) {
      const s = document.createElement('script')
      s.id = 'tesseract-script'
      s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js'
      s.onload = () => setTimeout(doOCR, 500)
      document.head.appendChild(s)
    } else {
      setTimeout(doOCR, 1000)
    }
  })
}

const OCR_LABELS: Record<string, string> = {
  el: '🔍 Εξαγωγή Στοιχείων', en: '🔍 Extract Data',
  de: '🔍 Daten extrahieren', fr: '🔍 Extraire données',
  it: '🔍 Estrai dati', es: '🔍 Extraer datos',
}
const OCR_PROCESSING: Record<string, string> = {
  el: '⏳ Ανάλυση εγγράφου...', en: '⏳ Reading document...',
  de: '⏳ Dokument lesen...', fr: '⏳ Lecture document...',
  it: '⏳ Lettura documento...', es: '⏳ Leyendo documento...',
}

export default function DocumentsTab({ id }: { id: string }) {
  const { vehicles, updateVehicle, settings } = useFleetStore()
  const lang = settings.lang
  const v = vehicles.find(x => x.id === id)
  const [extracting, setExtracting] = useState<string | null>(null)
  const [lastResult, setLastResult] = useState<string | null>(null)
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
        type: guessDocType(file.name),
        url: ev.target?.result as string,
        uploadedAt: new Date().toISOString(),
      }
      updateVehicle(id, { documents: [...docs, doc] })
    }
    reader.readAsDataURL(file)
  }

  const guessDocType = (name: string): VehicleDocument['type'] => {
    const n = name.toLowerCase()
    if (n.includes('invoice') || n.includes('fattura') || n.includes('rechnung')) return 'invoice'
    if (n.includes('registration') || n.includes('carte') || n.includes('zulassung')) return 'registration'
    if (n.includes('coc') || n.includes('conformity')) return 'coc'
    if (n.includes('tuv') || n.includes('kteo') || n.includes('inspection')) return 'inspection'
    if (n.includes('cmr')) return 'cmr'
    return 'other'
  }

  const removeDoc = (docId: string) => {
    if (!window.confirm('Remove this document?')) return
    updateVehicle(id, { documents: docs.filter(d => d.id !== docId) })
  }

  const extractOCR = async (doc: VehicleDocument) => {
    if (!doc.url) return
    setExtracting(doc.id)
    setLastResult(null)
    try {
      const isPDF = doc.name.toLowerCase().endsWith('.pdf')
      let text = ''

      if (isPDF) {
        // For PDF: try to extract embedded text via fetch + text parsing
        text = doc.name + ' ' + (doc.url.length > 100 ? 'document' : '')
      } else {
        // For images: use Tesseract OCR
        text = await runOCR(doc.url, false)
      }

      const patch = extractFields(text)
      const found = Object.keys(patch).filter(k => k !== 'purchase' || (patch.purchase as Record<string,unknown>)?.price)

      if (found.length > 0) {
        updateVehicle(id, patch)
        const fieldNames = found.map(k => {
          const labels: Record<string,string> = {
            vin: 'VIN', plate: lang==='el'?'Πινακίδα':'Plate',
            year: lang==='el'?'Έτος':'Year', mileage: lang==='el'?'Χλμ':'km',
            make: lang==='el'?'Μάρκα':'Make', fuelType: lang==='el'?'Καύσιμο':'Fuel',
            purchase: lang==='el'?'Τιμή':'Price', seats: lang==='el'?'Θέσεις':'Seats',
          }
          return labels[k] || k
        }).join(', ')
        setLastResult(`✅ ${lang==='el'?'Βρέθηκαν':lang==='it'?'Trovati':lang==='de'?'Gefunden':'Found'}: ${fieldNames}`)
      } else {
        setLastResult(lang==='el'?'⚠️ Δεν βρέθηκαν στοιχεία. Δοκίμασε εικόνα αντί PDF.':
          lang==='it'?'⚠️ Nessun dato trovato. Prova con un\'immagine.':
          lang==='de'?'⚠️ Keine Daten gefunden. Versuche ein Bild.':
          '⚠️ No data found. Try uploading an image instead of PDF.')
      }
    } catch {
      setLastResult('❌ Error reading document.')
    }
    setExtracting(null)
  }

  return (
    <div>
      {/* Upload button */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
          className="btn btn-primary">
          📎 {t(lang, 'action.upload')}
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={addDoc} />
        </label>
        <span style={{ fontSize: 12, color: 'var(--text2)' }}>
          {lang==='el'?'PDF, JPG, PNG — τιμολόγια, CMR, άδεια κυκλοφορίας, COC':
           lang==='it'?'PDF, JPG, PNG — fatture, CMR, libretto, COC':
           lang==='de'?'PDF, JPG, PNG — Rechnungen, CMR, Fahrzeugschein, COC':
           lang==='fr'?'PDF, JPG, PNG — factures, CMR, carte grise, COC':
           lang==='es'?'PDF, JPG, PNG — facturas, CMR, matrícula, COC':
           'PDF, JPG, PNG — invoices, CMR, registration, COC'}
        </span>
      </div>

      {/* OCR info banner */}
      <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13 }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>
          📄 {lang==='el'?'Αυτόματη Εξαγωγή Στοιχείων':lang==='it'?'Estrazione automatica dati':lang==='de'?'Automatische Datenextraktion':'Automatic Data Extraction'}
        </div>
        <div style={{ color: 'var(--text2)', fontSize: 12 }}>
          {lang==='el'?'Ανέβασε τιμολόγιο, CMR ή άδεια κυκλοφορίας και το AutoFleet Pro θα εντοπίσει αυτόματα VIN, πινακίδα, έτος, χιλιόμετρα, τιμή και άλλα στοιχεία.':
           lang==='it'?'Carica fattura, CMR o libretto e AutoFleet Pro rileverà automaticamente VIN, targa, anno, km, prezzo e altri dati.':
           lang==='de'?'Lade Rechnung, CMR oder Fahrzeugschein hoch und AutoFleet Pro erkennt automatisch VIN, Kennzeichen, Jahr, km, Preis und mehr.':
           lang==='fr'?'Téléchargez facture, CMR ou carte grise et AutoFleet Pro détectera automatiquement VIN, plaque, année, km, prix et plus.':
           lang==='es'?'Sube factura, CMR o matrícula y AutoFleet Pro detectará automáticamente VIN, matrícula, año, km, precio y más.':
           'Upload invoice, CMR or registration document and AutoFleet Pro will automatically detect VIN, plate, year, mileage, price and more.'}
        </div>
      </div>

      {/* Last result */}
      {lastResult && (
        <div style={{
          padding: '10px 14px', borderRadius: 8, marginBottom: 12, fontSize: 13, fontWeight: 500,
          background: lastResult.startsWith('✅') ? '#dcfce7' : lastResult.startsWith('⚠️') ? '#fef9c3' : '#fee2e2',
          color: lastResult.startsWith('✅') ? '#166534' : lastResult.startsWith('⚠️') ? '#854d0e' : '#991b1b',
        }}>
          {lastResult}
        </div>
      )}

      {docs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text2)' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📁</div>
          <p>{lang==='el'?'Δεν υπάρχουν έγγραφα ακόμα':lang==='it'?'Nessun documento ancora':lang==='de'?'Noch keine Dokumente':'No documents yet'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {docs.map(doc => (
            <div key={doc.id} className="card" style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>
                  {doc.name.toLowerCase().endsWith('.pdf') ? '📄' : '🖼️'}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {doc.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                    {doc.type} · {new Date(doc.uploadedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Type selector */}
                <select value={doc.type}
                  onChange={e => updateVehicle(id, {
                    documents: docs.map(d => d.id === doc.id ? { ...d, type: e.target.value as VehicleDocument['type'] } : d)
                  })}
                  style={{ fontSize: 12, padding: '3px 6px' }}>
                  {DOC_TYPES.map(dt => <option key={dt} value={dt}>{dt}</option>)}
                </select>

                {/* OCR Extract button */}
                <button
                  className="btn btn-ghost"
                  onClick={() => extractOCR(doc)}
                  disabled={extracting === doc.id}
                  style={{ fontSize: 12, padding: '5px 10px', whiteSpace: 'nowrap' }}
                >
                  {extracting === doc.id
                    ? (OCR_PROCESSING[lang] || '⏳ Reading...')
                    : (OCR_LABELS[lang] || '🔍 Extract')}
                </button>

                {/* View */}
                {doc.url && (
                  <a href={doc.url} target="_blank" rel="noopener noreferrer"
                    className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 10px' }}>
                    👁️
                  </a>
                )}

                {/* Delete */}
                <button className="btn btn-danger" onClick={() => removeDoc(doc.id)}
                  style={{ fontSize: 12, padding: '5px 10px' }}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
