'use client'
import { useState } from 'react'
import AppShell from '@/components/AppShell'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'

export default function ImportPage() {
  const { addVehicle, settings } = useFleetStore()
  const lang = settings.lang
  const [preview, setPreview] = useState<Record<string, string>[]>([])
  const [importing, setImporting] = useState(false)
  const [done, setDone] = useState(0)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const XLSX = await import('xlsx')
    const buf = await file.arrayBuffer()
    const wb = XLSX.read(buf)
    const ws = wb.Sheets[wb.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: '' })
    setPreview(rows.slice(0, 5))
  }

  const doImport = async () => {
    if (!preview.length) return
    setImporting(true)
    setDone(0)
    for (const row of preview) {
      await addVehicle({
        make: row['Make'] || row['make'] || row['Marke'] || row['Marca'] || '',
        model: row['Model'] || row['model'] || row['Modell'] || row['Modèle'] || '',
        year: parseInt(row['Year'] || row['year'] || row['Jahr'] || '0') || undefined,
        plate: row['Plate'] || row['plate'] || row['Kennzeichen'] || row['Targa'] || '',
        vin: row['VIN'] || row['vin'] || '',
        mileage: parseInt(row['Mileage'] || row['mileage'] || row['km'] || '0') || undefined,
        status: 'purchased',
      })
      setDone(d => d + 1)
    }
    setImporting(false)
    alert(`Imported ${preview.length} vehicles!`)
  }

  return (
    <AppShell>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>{t(lang, 'nav.import')}</h1>

      <div className="card" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginTop: 0, marginBottom: 12 }}>Import from Excel / CSV</h2>
        <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 12 }}>
          Upload an Excel (.xlsx) or CSV file. Columns detected: Make, Model, Year, Plate, VIN, Mileage
        </p>
        <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
          📂 Choose File
          <input type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={handleFile} />
        </label>
      </div>

      {preview.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginTop: 0, marginBottom: 12 }}>
            Preview (first {preview.length} rows)
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {Object.keys(preview[0]).slice(0, 8).map(k => (
                    <th key={k} style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--text2)', fontWeight: 500 }}>{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    {Object.values(row).slice(0, 8).map((val, j) => (
                      <td key={j} style={{ padding: '6px 8px' }}>{String(val)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="btn btn-primary" onClick={doImport} disabled={importing}>
              {importing ? `⏳ Importing ${done}/${preview.length}...` : `✅ Import ${preview.length} vehicles`}
            </button>
            <button className="btn btn-ghost" onClick={() => setPreview([])}>Cancel</button>
          </div>
        </div>
      )}
    </AppShell>
  )
}
