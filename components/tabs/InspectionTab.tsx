'use client'

import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import type { Vehicle } from '@/lib/types'

interface Props { vehicle: Vehicle }

interface InspectionData {
  date: string
  inspector: string
  mileage: string
  overall: string // excellent|good|fair|poor
  // Body
  frontBumper: string; rearBumper: string; hoodBonnet: string; roof: string
  frontLeft: string; frontRight: string; rearLeft: string; rearRight: string
  windscreenFront: string; windscreenRear: string
  // Mechanical
  engine: string; gearbox: string; brakes: string; suspension: string
  exhaust: string; battery: string; ac: string; electrics: string
  // Interior
  seats: string; dashboard: string; carpet: string; headliner: string
  // Tyres
  tyreFrontLeft: string; tyreFrontRight: string; tyreRearLeft: string; tyreRearRight: string
  // Notes
  damageNotes: string
  repairsNeeded: string
  estimatedRepairCost: string
  photos: string[] // base64
}

const RATINGS = ['ok', 'minor', 'major', 'missing'] as const
type Rating = typeof RATINGS[number]

const RATING_LABELS: Record<string, Record<Rating, string>> = {
  el: { ok: '✅ OK', minor: '⚠️ Μικρό', major: '❌ Σοβαρό', missing: '🚫 Λείπει' },
  en: { ok: '✅ OK', minor: '⚠️ Minor', major: '❌ Major', missing: '🚫 Missing' },
  de: { ok: '✅ OK', minor: '⚠️ Klein', major: '❌ Schwer', missing: '🚫 Fehlt' },
  fr: { ok: '✅ OK', minor: '⚠️ Mineur', major: '❌ Majeur', missing: '🚫 Manquant' },
  it: { ok: '✅ OK', minor: '⚠️ Lieve', major: '❌ Grave', missing: '🚫 Mancante' },
  es: { ok: '✅ OK', minor: '⚠️ Leve', major: '❌ Grave', missing: '🚫 Falta' },
}

const DEFAULT_INSPECTION: InspectionData = {
  date: '', inspector: '', mileage: '', overall: 'good',
  frontBumper: 'ok', rearBumper: 'ok', hoodBonnet: 'ok', roof: 'ok',
  frontLeft: 'ok', frontRight: 'ok', rearLeft: 'ok', rearRight: 'ok',
  windscreenFront: 'ok', windscreenRear: 'ok',
  engine: 'ok', gearbox: 'ok', brakes: 'ok', suspension: 'ok',
  exhaust: 'ok', battery: 'ok', ac: 'ok', electrics: 'ok',
  seats: 'ok', dashboard: 'ok', carpet: 'ok', headliner: 'ok',
  tyreFrontLeft: 'ok', tyreFrontRight: 'ok', tyreRearLeft: 'ok', tyreRearRight: 'ok',
  damageNotes: '', repairsNeeded: '', estimatedRepairCost: '',
  photos: [],
}

export default function InspectionTab({ vehicle: v }: Props) {
  const { lang, updateVehicle, showToast } = useFleetStore()

  // Store inspection data as a JSON field in vehicle
  const insp: InspectionData = (v as Vehicle & { inspection?: InspectionData }).inspection ?? DEFAULT_INSPECTION

  const up = (field: keyof InspectionData, val: string | string[]) => {
    updateVehicle(v.id, { inspection: { ...insp, [field]: val } } as Partial<Vehicle>)
  }

  const save = () => showToast(t(lang, 'msg.saved'))

  const rl = RATING_LABELS[lang] ?? RATING_LABELS.en

  const sectionLabel = ({
    el: { body: '🚗 Αμάξωμα', mechanical: '🔧 Μηχανικά', interior: '🪑 Εσωτερικό', tyres: '⚫ Ελαστικά', notes: '📝 Σημειώσεις' },
    en: { body: '🚗 Body', mechanical: '🔧 Mechanical', interior: '🪑 Interior', tyres: '⚫ Tyres', notes: '📝 Notes' },
    de: { body: '🚗 Karosserie', mechanical: '🔧 Mechanik', interior: '🪑 Innenraum', tyres: '⚫ Reifen', notes: '📝 Notizen' },
    fr: { body: '🚗 Carrosserie', mechanical: '🔧 Mécanique', interior: '🪑 Intérieur', tyres: '⚫ Pneus', notes: '📝 Notes' },
    it: { body: '🚗 Carrozzeria', mechanical: '🔧 Meccanica', interior: '🪑 Interno', tyres: '⚫ Pneumatici', notes: '📝 Note' },
    es: { body: '🚗 Carrocería', mechanical: '🔧 Mecánica', interior: '🪑 Interior', tyres: '⚫ Neumáticos', notes: '📝 Notas' },
  } as Record<string, { body: string; mechanical: string; interior: string; tyres: string; notes: string }>)[lang]
    ?? { body: '🚗 Body', mechanical: '🔧 Mechanical', interior: '🪑 Interior', tyres: '⚫ Tyres', notes: '📝 Notes' }

  const fieldLabel: Record<string, Record<string, string>> = {
    el: {
      frontBumper: 'Εμπρός Προφυλακτήρας', rearBumper: 'Πίσω Προφυλακτήρας',
      hoodBonnet: 'Καπό', roof: 'Οροφή',
      frontLeft: 'Εμπρός Αριστερή Πόρτα', frontRight: 'Εμπρός Δεξιά Πόρτα',
      rearLeft: 'Πίσω Αριστερή Πόρτα', rearRight: 'Πίσω Δεξιά Πόρτα',
      windscreenFront: 'Εμπρός Παρμπρίζ', windscreenRear: 'Πίσω Τζάμι',
      engine: 'Κινητήρας', gearbox: 'Κιβώτιο', brakes: 'Φρένα', suspension: 'Ανάρτηση',
      exhaust: 'Εξάτμιση', battery: 'Μπαταρία', ac: 'A/C', electrics: 'Ηλεκτρολογικά',
      seats: 'Καθίσματα', dashboard: 'Ταμπλό', carpet: 'Χαλιά', headliner: 'Ταβάνι',
      tyreFrontLeft: 'Εμπρός Αρ.', tyreFrontRight: 'Εμπρός Δεξ.',
      tyreRearLeft: 'Πίσω Αρ.', tyreRearRight: 'Πίσω Δεξ.',
    },
    en: {
      frontBumper: 'Front Bumper', rearBumper: 'Rear Bumper',
      hoodBonnet: 'Hood/Bonnet', roof: 'Roof',
      frontLeft: 'Front Left Door', frontRight: 'Front Right Door',
      rearLeft: 'Rear Left Door', rearRight: 'Rear Right Door',
      windscreenFront: 'Windscreen Front', windscreenRear: 'Rear Window',
      engine: 'Engine', gearbox: 'Gearbox', brakes: 'Brakes', suspension: 'Suspension',
      exhaust: 'Exhaust', battery: 'Battery', ac: 'A/C', electrics: 'Electrics',
      seats: 'Seats', dashboard: 'Dashboard', carpet: 'Carpet', headliner: 'Headliner',
      tyreFrontLeft: 'Front Left', tyreFrontRight: 'Front Right',
      tyreRearLeft: 'Rear Left', tyreRearRight: 'Rear Right',
    },
    de: {
      frontBumper: 'Vordere Stoßstange', rearBumper: 'Hintere Stoßstange',
      hoodBonnet: 'Motorhaube', roof: 'Dach',
      frontLeft: 'Vordertür Links', frontRight: 'Vordertür Rechts',
      rearLeft: 'Hintertür Links', rearRight: 'Hintertür Rechts',
      windscreenFront: 'Frontscheibe', windscreenRear: 'Heckscheibe',
      engine: 'Motor', gearbox: 'Getriebe', brakes: 'Bremsen', suspension: 'Federung',
      exhaust: 'Auspuff', battery: 'Batterie', ac: 'Klimaanlage', electrics: 'Elektrik',
      seats: 'Sitze', dashboard: 'Armaturenbrett', carpet: 'Teppich', headliner: 'Dachhimmel',
      tyreFrontLeft: 'VL', tyreFrontRight: 'VR', tyreRearLeft: 'HL', tyreRearRight: 'HR',
    },
    fr: {
      frontBumper: 'Pare-choc avant', rearBumper: 'Pare-choc arrière',
      hoodBonnet: 'Capot', roof: 'Toit',
      frontLeft: 'Portière AV Gauche', frontRight: 'Portière AV Droite',
      rearLeft: 'Portière AR Gauche', rearRight: 'Portière AR Droite',
      windscreenFront: 'Pare-brise', windscreenRear: 'Lunette arrière',
      engine: 'Moteur', gearbox: 'Boîte', brakes: 'Freins', suspension: 'Suspension',
      exhaust: 'Échappement', battery: 'Batterie', ac: 'Clim', electrics: 'Électrique',
      seats: 'Sièges', dashboard: 'Tableau de bord', carpet: 'Moquette', headliner: 'Ciel de toit',
      tyreFrontLeft: 'AV G', tyreFrontRight: 'AV D', tyreRearLeft: 'AR G', tyreRearRight: 'AR D',
    },
    it: {
      frontBumper: 'Paraurti anteriore', rearBumper: 'Paraurti posteriore',
      hoodBonnet: 'Cofano', roof: 'Tetto',
      frontLeft: 'Portiera ANT SX', frontRight: 'Portiera ANT DX',
      rearLeft: 'Portiera POST SX', rearRight: 'Portiera POST DX',
      windscreenFront: 'Parabrezza', windscreenRear: 'Lunotto',
      engine: 'Motore', gearbox: 'Cambio', brakes: 'Freni', suspension: 'Sospensioni',
      exhaust: 'Scarico', battery: 'Batteria', ac: 'Aria condiz.', electrics: 'Elettrico',
      seats: 'Sedili', dashboard: 'Cruscotto', carpet: 'Tappeti', headliner: 'Cielo',
      tyreFrontLeft: 'ANT SX', tyreFrontRight: 'ANT DX', tyreRearLeft: 'POST SX', tyreRearRight: 'POST DX',
    },
    es: {
      frontBumper: 'Paragolpes delantero', rearBumper: 'Paragolpes trasero',
      hoodBonnet: 'Capó', roof: 'Techo',
      frontLeft: 'Puerta del. izq.', frontRight: 'Puerta del. der.',
      rearLeft: 'Puerta tras. izq.', rearRight: 'Puerta tras. der.',
      windscreenFront: 'Parabrisas', windscreenRear: 'Luneta trasera',
      engine: 'Motor', gearbox: 'Caja', brakes: 'Frenos', suspension: 'Suspensión',
      exhaust: 'Escape', battery: 'Batería', ac: 'Aire acond.', electrics: 'Eléctrico',
      seats: 'Asientos', dashboard: 'Salpicadero', carpet: 'Alfombra', headliner: 'Techo interior',
      tyreFrontLeft: 'DEL IZQ', tyreFrontRight: 'DEL DER', tyreRearLeft: 'TRA IZQ', tyreRearRight: 'TRA DER',
    },
  }
  const FL = fieldLabel[lang] ?? fieldLabel.en

  const RatingSelect = ({ field }: { field: keyof InspectionData }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 130 }}>
      <label style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{FL[field as string] || field}</label>
      <select
        className="af-input"
        value={String(insp[field] || 'ok')}
        onChange={e => up(field, e.target.value)}
        style={{
          fontSize: 12,
          background: insp[field] === 'major' ? 'rgba(255,68,68,0.1)'
            : insp[field] === 'minor' ? 'rgba(255,165,0,0.1)'
            : insp[field] === 'missing' ? 'rgba(100,100,100,0.2)'
            : 'var(--surface)',
        }}
      >
        {RATINGS.map(r => <option key={r} value={r}>{rl[r]}</option>)}
      </select>
    </div>
  )

  const hasIssues = Object.entries(insp).filter(([k, v]) =>
    typeof v === 'string' && (v === 'minor' || v === 'major' || v === 'missing') &&
    !['date','inspector','mileage','overall','damageNotes','repairsNeeded','estimatedRepairCost'].includes(k)
  )

  const inp = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', color: 'var(--text)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 13, outline: 'none', width: '100%' }

  return (
    <div className="af-card">
      <div className="af-section-title">
        {lang === 'el' ? '🔍 Έκθεση Επιθεώρησης' : lang === 'de' ? '🔍 Inspektionsbericht' : '🔍 Inspection Report'}
      </div>

      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px,1fr))', gap: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{lang === 'el' ? 'Ημ/νία Επιθεώρησης' : lang === 'de' ? 'Prüfdatum' : 'Inspection Date'}</label>
          <input style={inp} type="date" value={insp.date} onChange={e => up('date', e.target.value)} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{lang === 'el' ? 'Επιθεωρητής' : lang === 'de' ? 'Prüfer' : 'Inspector'}</label>
          <input style={inp} type="text" value={insp.inspector} onChange={e => up('inspector', e.target.value)} placeholder="Name" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{lang === 'el' ? 'Χλμ κατά Επιθεώρηση' : lang === 'de' ? 'Km bei Prüfung' : 'Mileage at Inspection'}</label>
          <input style={inp} type="number" value={insp.mileage} onChange={e => up('mileage', e.target.value)} placeholder="150000" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{lang === 'el' ? 'Γενική Αξιολόγηση' : lang === 'de' ? 'Gesamtbewertung' : 'Overall Rating'}</label>
          <select style={inp} value={insp.overall} onChange={e => up('overall', e.target.value)}>
            {['excellent','good','fair','poor'].map(c => <option key={c} value={c}>{t(lang, `cond.${c}`)}</option>)}
          </select>
        </div>
      </div>

      {/* Issues summary */}
      {hasIssues.length > 0 && (
        <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--error)', marginBottom: 6 }}>
            ⚠️ {hasIssues.length} {lang === 'el' ? 'Προβλήματα βρέθηκαν' : lang === 'de' ? 'Probleme gefunden' : 'Issues found'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
            {hasIssues.map(([k]) => FL[k] || k).join(', ')}
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>{sectionLabel.body}</div>

      {/* Visual car diagram */}
      <div style={{ position: 'relative', marginBottom: 20, textAlign: 'center' }}>
        <div style={{ display: 'inline-block', position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 40px' }}>
          {/* Simple ASCII car diagram with color indicators */}
          <div style={{ fontFamily: 'monospace', fontSize: 10, lineHeight: 1.8, color: 'var(--muted)', whiteSpace: 'pre' }}>
            {`    ╔══════════╗
    ║  FRONT   ║  ${insp.windscreenFront === 'ok' ? '🟢' : insp.windscreenFront === 'minor' ? '🟡' : '🔴'}
  ╔═╬══════════╬═╗
  ║ ║  ${insp.hoodBonnet === 'ok' ? '🟢' : insp.hoodBonnet === 'minor' ? '🟡' : '🔴'}HOOD   ║ ║
${insp.frontLeft === 'ok' ? '🟢' : insp.frontLeft === 'minor' ? '🟡' : '🔴'} ║          ║ ${insp.frontRight === 'ok' ? '🟢' : insp.frontRight === 'minor' ? '🟡' : '🔴'}
  ║ ╠══════════╣ ║
${insp.rearLeft === 'ok' ? '🟢' : insp.rearLeft === 'minor' ? '🟡' : '🔴'} ║  ${insp.roof === 'ok' ? '🟢' : insp.roof === 'minor' ? '🟡' : '🔴'} ROOF  ║ ${insp.rearRight === 'ok' ? '🟢' : insp.rearRight === 'minor' ? '🟡' : '🔴'}
  ╚═╬══════════╬═╝
    ║  REAR    ║  ${insp.windscreenRear === 'ok' ? '🟢' : insp.windscreenRear === 'minor' ? '🟡' : '🔴'}
    ╚══════════╝`}
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 8 }}>
            🟢 {rl.ok}  🟡 {rl.minor}  🔴 {rl.major}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px,1fr))', gap: 10, marginBottom: 20 }}>
        {(['frontBumper','rearBumper','hoodBonnet','roof','frontLeft','frontRight','rearLeft','rearRight','windscreenFront','windscreenRear'] as (keyof InspectionData)[]).map(f => (
          <RatingSelect key={f} field={f} />
        ))}
      </div>

      {/* Mechanical */}
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>{sectionLabel.mechanical}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px,1fr))', gap: 10, marginBottom: 20 }}>
        {(['engine','gearbox','brakes','suspension','exhaust','battery','ac','electrics'] as (keyof InspectionData)[]).map(f => (
          <RatingSelect key={f} field={f} />
        ))}
      </div>

      {/* Interior */}
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>{sectionLabel.interior}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px,1fr))', gap: 10, marginBottom: 20 }}>
        {(['seats','dashboard','carpet','headliner'] as (keyof InspectionData)[]).map(f => (
          <RatingSelect key={f} field={f} />
        ))}
      </div>

      {/* Tyres */}
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>{sectionLabel.tyres}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {(['tyreFrontLeft','tyreFrontRight','tyreRearLeft','tyreRearRight'] as (keyof InspectionData)[]).map(f => (
          <RatingSelect key={f} field={f} />
        ))}
      </div>

      {/* Notes */}
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>{sectionLabel.notes}</div>
      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{lang === 'el' ? 'Σημειώσεις Ζημιών' : lang === 'de' ? 'Schadensnotizen' : 'Damage Notes'}</label>
          <textarea style={{ ...inp, resize: 'vertical', minHeight: 80 }} value={insp.damageNotes} onChange={e => up('damageNotes', e.target.value)} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{lang === 'el' ? 'Απαιτούμενες Επισκευές' : lang === 'de' ? 'Erforderliche Reparaturen' : 'Repairs Needed'}</label>
          <textarea style={{ ...inp, resize: 'vertical', minHeight: 60 }} value={insp.repairsNeeded} onChange={e => up('repairsNeeded', e.target.value)} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 200 }}>
          <label style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{lang === 'el' ? 'Εκτιμώμενο Κόστος Επισκευών (€)' : lang === 'de' ? 'Geschätzte Reparaturkosten (€)' : 'Estimated Repair Cost (€)'}</label>
          <input style={inp} type="number" step="0.01" value={insp.estimatedRepairCost} onChange={e => up('estimatedRepairCost', e.target.value)} placeholder="0.00" />
        </div>
      </div>

      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <button className="af-btn af-btn-primary" onClick={save}>{t(lang, 'actions.save')}</button>
      </div>
    </div>
  )
}
