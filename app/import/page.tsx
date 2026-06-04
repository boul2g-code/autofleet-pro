'use client'
import { useState } from 'react'
import AppShell from '@/components/AppShell'
import { useFleetStore } from '@/store/useFleetStore'
import { IMPORT_COLUMN_MAP, getImportPreview, rowToVehiclePatch, type ImportRow } from '@/lib/importVehicles'
import * as XLSX from 'xlsx'

export default function ImportPage() {
  const { vehicles, addVehicle, settings } = useFleetStore()
  const lang = settings?.lang ?? 'el'
  const [rows, setRows] = useState<ImportRow[]>([])
  const [preview, setPreview] = useState<ImportRow[]>([])
  const [done, setDone] = useState(0)
  const [importing, setImporting] = useState(false)
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')

  const T = {
    title: { el:'Εισαγωγή Οχημάτων', en:'Import Vehicles', de:'Fahrzeuge importieren', fr:'Importer des véhicules', it:'Importa Veicoli', es:'Importar Vehículos' },
    sub: { el:'Ανέβασε αρχείο Excel (.xlsx) ή CSV με τα οχήματά σου.', en:'Upload an Excel (.xlsx) or CSV file with your vehicles.', de:'Lade eine Excel (.xlsx) oder CSV-Datei hoch.', fr:'Téléchargez un fichier Excel (.xlsx) ou CSV.', it:'Carica un file Excel (.xlsx) o CSV con i tuoi veicoli.', es:'Sube un archivo Excel (.xlsx) o CSV con tus vehículos.' },
    columns: { el:'Στήλες που αναγνωρίζονται αυτόματα:', en:'Automatically detected columns:', de:'Automatisch erkannte Spalten:', fr:'Colonnes détectées automatiquement :', it:'Colonne rilevate automaticamente:', es:'Columnas detectadas automáticamente:' },
    choose: { el:'📂 Επιλογή Αρχείου', en:'📂 Choose File', de:'📂 Datei wählen', fr:'📂 Choisir un fichier', it:'📂 Scegli file', es:'📂 Elegir archivo' },
    preview: { el:'Προεπισκόπηση', en:'Preview', de:'Vorschau', fr:'Aperçu', it:'Anteprima', es:'Vista previa' },
    rows: { el:'σειρές', en:'rows', de:'Zeilen', fr:'lignes', it:'righe', es:'filas' },
    importBtn: { el:'✅ Εισαγωγή', en:'✅ Import', de:'✅ Importieren', fr:'✅ Importer', it:'✅ Importa', es:'✅ Importar' },
    importing: { el:'⏳ Εισαγωγή', en:'⏳ Importing', de:'⏳ Importieren', fr:'⏳ Importation', it:'⏳ Importazione', es:'⏳ Importando' },
    of: { el:'από', en:'of', de:'von', fr:'sur', it:'di', es:'de' },
    successTitle: { el:'✅ Εισαγωγή ολοκληρώθηκε!', en:'✅ Import complete!', de:'✅ Import abgeschlossen!', fr:'✅ Importation terminée !', it:'✅ Importazione completata!', es:'✅ ¡Importación completada!' },
    successMsg: { el:'οχήματα προστέθηκαν', en:'vehicles added', de:'Fahrzeuge hinzugefügt', fr:'véhicules ajoutés', it:'veicoli aggiunti', es:'vehículos añadidos' },
    template: { el:'📥 Κατέβασε πρότυπο Excel', en:'📥 Download Excel template', de:'📥 Excel-Vorlage herunterladen', fr:'📥 Télécharger le modèle Excel', it:'📥 Scarica modello Excel', es:'📥 Descargar plantilla Excel' },
    noFile: { el:'⚠️ Μη έγκυρο αρχείο. Χρησιμοποίησε .xlsx ή .csv', en:'⚠️ Invalid file. Use .xlsx or .csv', de:'⚠️ Ungültige Datei. Verwende .xlsx oder .csv', fr:'⚠️ Fichier invalide. Utilisez .xlsx ou .csv', it:'⚠️ File non valido. Usa .xlsx o .csv', es:'⚠️ Archivo inválido. Usa .xlsx o .csv' },
    hint: { el:'Τα δεδομένα σου δεν αποστέλλονται πουθενά — η επεξεργασία γίνεται τοπικά στον browser.', en:'Your data is not sent anywhere — processing happens locally in the browser.', de:'Deine Daten werden nirgendwo gesendet — Verarbeitung erfolgt lokal im Browser.', fr:'Vos données ne sont envoyées nulle part — le traitement se fait localement.', it:'I tuoi dati non vengono inviati da nessuna parte — elaborazione locale nel browser.', es:'Tus datos no se envían a ningún lugar — el procesamiento es local en el navegador.' },
  }

  const t = (key: keyof typeof T): string => {
    const val = T[key] as Record<string, string>
    return val[lang] || val['en']
  }

  const parseFile = async (file: File) => {
    setError('')
    setFileName(file.name)
    try {
      const buf = await file.arrayBuffer()
      const wb = XLSX.read(buf)
      const ws = wb.Sheets[wb.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json<ImportRow>(ws, { defval: '' })
      if (!data.length) {
        setRows([])
        setPreview([])
        setError(t('noFile'))
        return
      }
      setRows(data)
      setPreview(getImportPreview(data))
    } catch {
      setRows([])
      setPreview([])
      setError(t('noFile'))
    }
  }

  const doImport = async () => {
    if (!rows.length) return
    setImporting(true)
    setDone(0)
    let count = 0
    for (const row of rows) {
      const patch = rowToVehiclePatch(row)
      const v = await addVehicle(patch)
      if (!v) continue
      count++
      setDone(count)
    }
    setImporting(false)
    setRows([])
    setPreview([])
    setFileName('')
    const msg = (T.successMsg as Record<string,string>)[lang] || (T.successMsg as Record<string,string>)['en']; alert(`${count} ${msg}`)
  }

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['Make','Model','Year','Plate','VIN','Mileage','Price','Color','Fuel','Category','Notes'],
      ['BMW','320d',2021,'M-BW 3201','WBA5A71010G123001',87400,18500,'Black','diesel','car','Full service history'],
      ['Volvo','FH 500',2020,'GBG-VO FH','YV2XT01C5LB122002',520000,55000,'Blue','diesel','truck',''],
    ])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Vehicles')
    XLSX.writeFile(wb, 'AutoFleet_Import_Template.xlsx')
  }

  return (
    <AppShell>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:10 }}>
          <div>
            <h1 style={{ fontSize:22, fontWeight:700, margin:0 }}>{t('title')}</h1>
            <p style={{ color:'var(--text2)', fontSize:14, margin:'4px 0 0' }}>{t('sub')}</p>
          </div>
          <button className="btn btn-ghost" onClick={downloadTemplate} style={{ fontSize:13 }}>
            {t('template')}
          </button>
        </div>

        {/* Upload card */}
        <div className="card" style={{ marginBottom:16 }}>
          <div style={{ fontSize:13, color:'var(--text2)', marginBottom:12 }}>
            <strong>{t('columns')}</strong>
            {' '}{lang==='el'?'Μάρκα, Μοντέλο, Έτος, Πινακίδα, VIN, Χιλιόμετρα, Τιμή, Χρώμα, Καύσιμο, Κατηγορία':
               lang==='it'?'Marca, Modello, Anno, Targa, VIN, Chilometri, Prezzo, Colore, Carburante, Categoria':
               lang==='de'?'Marke, Modell, Jahr, Kennzeichen, VIN, Kilometer, Preis, Farbe, Kraftstoff, Kategorie':
               lang==='fr'?'Marque, Modèle, Année, Immatriculation, VIN, Kilométrage, Prix, Couleur, Carburant, Catégorie':
               lang==='es'?'Marca, Modelo, Año, Matrícula, VIN, Kilometraje, Precio, Color, Combustible, Categoría':
               'Make, Model, Year, Plate, VIN, Mileage, Price, Color, Fuel, Category'}
          </div>

          <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
            <label className="btn btn-primary" style={{ cursor:'pointer' }}>
              {t('choose')}
              <input type="file" accept=".xlsx,.csv,.xls" style={{ display:'none' }}
                onChange={e => { const f=e.target.files?.[0]; if(f) parseFile(f) }} />
            </label>
            {fileName && <span style={{ fontSize:13, color:'var(--text2)' }}>📄 {fileName}</span>}
          </div>

          {error && (
            <div style={{ marginTop:12, color:'var(--danger)', fontSize:13 }}>{error}</div>
          )}

          <div style={{ marginTop:12, fontSize:12, color:'var(--text3)' }}>🔒 {t('hint')}</div>
        </div>

        {/* Preview table */}
        {preview.length > 0 && (
          <div className="card" style={{ padding:0, overflow:'hidden' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
              <div style={{ fontWeight:600, fontSize:14 }}>
                {t('preview')} ({preview.length}/{rows.length} {t('rows')})
              </div>
              <button className="btn btn-primary" onClick={doImport} disabled={importing} style={{ fontSize:13 }}>
                {importing
                  ? `${t('importing')} ${done}/${rows.length}...`
                  : `${t('importBtn')} ${rows.length} ${t('rows')}`}
              </button>
            </div>

            {/* Progress bar */}
            {importing && (
              <div style={{ height:4, background:'var(--surface2)' }}>
                <div style={{ height:'100%', width:`${rows.length ? (done/rows.length)*100 : 0}%`, background:'var(--primary)', transition:'width 0.3s' }} />
              </div>
            )}

            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                <thead>
                  <tr style={{ background:'var(--surface2)' }}>
                    {Object.keys(preview[0]).slice(0,9).map(k => (
                      <th key={k} style={{ padding:'8px 10px', textAlign:'left', fontWeight:600, fontSize:11, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.04em', whiteSpace:'nowrap' }}>
                        {k}
                        {IMPORT_COLUMN_MAP[k.toLowerCase().trim()] && (
                          <span style={{ color:'var(--primary)', marginLeft:4 }}>✓</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0,10).map((row, i) => (
                    <tr key={i} style={{ borderBottom:'1px solid var(--border)' }}>
                      {Object.values(row).slice(0,9).map((v, j) => (
                        <td key={j} style={{ padding:'7px 10px', color:'var(--text)' }}>
                          {String(v).slice(0,40) || '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {preview.length > 10 && (
              <div style={{ padding:'8px 16px', fontSize:12, color:'var(--text2)', borderTop:'1px solid var(--border)' }}>
                ... +{rows.length - 10} {lang==='el'?'ακόμα σειρές':lang==='it'?'altre righe':lang==='de'?'weitere Zeilen':lang==='fr'?'autres lignes':lang==='es'?'filas más':'more rows'}
              </div>
            )}
          </div>
        )}

        {/* Current vehicles count */}
        <div style={{ marginTop:16, fontSize:13, color:'var(--text2)' }}>
          {lang==='el'?`${vehicles.length} οχήματα στο σύστημα`:
           lang==='it'?`${vehicles.length} veicoli nel sistema`:
           lang==='de'?`${vehicles.length} Fahrzeuge im System`:
           lang==='fr'?`${vehicles.length} véhicules dans le système`:
           lang==='es'?`${vehicles.length} vehículos en el sistema`:
           `${vehicles.length} vehicles in the system`}
        </div>
      </div>
    </AppShell>
  )
}
