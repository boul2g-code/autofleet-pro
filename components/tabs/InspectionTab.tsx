'use client'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import type { InspectionItem } from '@/lib/types'
import type { Lang } from '@/lib/types'

// Translated area names
const AREAS: Record<string, Record<Lang, string>> = {
  'front_bumper':     { el:'Εμπρός προφυλακτήρας', en:'Front bumper',     de:'Frontstoßstange',    fr:'Pare-chocs avant',    it:'Paraurti anteriore',  es:'Paragolpes delantero' },
  'hood':             { el:'Καπό',                  en:'Hood',             de:'Motorhaube',          fr:'Capot',               it:'Cofano',              es:'Capó' },
  'windshield':       { el:'Παρμπρίζ',              en:'Windshield',       de:'Windschutzscheibe',   fr:'Pare-brise',          it:'Parabrezza',          es:'Parabrisas' },
  'roof':             { el:'Οροφή',                 en:'Roof',             de:'Dach',                fr:'Toit',                it:'Tetto',               es:'Techo' },
  'rear_windshield':  { el:'Πίσω τζάμι',            en:'Rear windshield',  de:'Heckscheibe',         fr:'Lunette arrière',     it:'Lunotto',             es:'Luneta trasera' },
  'rear_bumper':      { el:'Πίσω προφυλακτήρας',    en:'Rear bumper',      de:'Heckstoßstange',      fr:'Pare-chocs arrière',  it:'Paraurti posteriore', es:'Paragolpes trasero' },
  'front_left_door':  { el:'Αριστ. εμπρός πόρτα',  en:'Front left door',  de:'Vordere linke Tür',   fr:'Porte avant gauche',  it:'Porta ant. sinistra', es:'Puerta del. izquierda' },
  'rear_left_door':   { el:'Αριστ. πίσω πόρτα',    en:'Rear left door',   de:'Hintere linke Tür',   fr:'Porte arr. gauche',   it:'Porta post. sinistra',es:'Puerta tras. izquierda' },
  'front_right_door': { el:'Δεξιά εμπρός πόρτα',   en:'Front right door', de:'Vordere rechte Tür',  fr:'Porte avant droite',  it:'Porta ant. destra',   es:'Puerta del. derecha' },
  'rear_right_door':  { el:'Δεξιά πίσω πόρτα',     en:'Rear right door',  de:'Hintere rechte Tür',  fr:'Porte arr. droite',   it:'Porta post. destra',  es:'Puerta tras. derecha' },
  'left_fender':      { el:'Αριστ. φτερό',          en:'Left fender',      de:'Linker Kotflügel',    fr:'Aile gauche',         it:'Parafango sinistro',  es:'Aleta izquierda' },
  'right_fender':     { el:'Δεξί φτερό',            en:'Right fender',     de:'Rechter Kotflügel',   fr:'Aile droite',         it:'Parafango destro',    es:'Aleta derecha' },
  'left_mirror':      { el:'Αριστ. καθρέπτης',      en:'Left mirror',      de:'Linker Spiegel',      fr:'Rétro. gauche',       it:'Specchio sinistro',   es:'Espejo izquierdo' },
  'right_mirror':     { el:'Δεξί καθρέπτης',        en:'Right mirror',     de:'Rechter Spiegel',     fr:'Rétro. droit',        it:'Specchio destro',     es:'Espejo derecho' },
  'engine':           { el:'Κινητήρας',              en:'Engine',           de:'Motor',               fr:'Moteur',              it:'Motore',              es:'Motor' },
  'transmission':     { el:'Κιβώτιο',               en:'Transmission',     de:'Getriebe',            fr:'Boîte de vitesses',   it:'Cambio',              es:'Transmisión' },
  'brakes':           { el:'Φρένα',                 en:'Brakes',           de:'Bremsen',             fr:'Freins',              it:'Freni',               es:'Frenos' },
  'suspension':       { el:'Ανάρτηση',              en:'Suspension',       de:'Fahrwerk',            fr:'Suspension',          it:'Sospensioni',         es:'Suspensión' },
  'exhaust':          { el:'Εξάτμιση',              en:'Exhaust',          de:'Auspuff',             fr:'Échappement',         it:'Scarico',             es:'Escape' },
  'interior':         { el:'Εσωτερικό',             en:'Interior',         de:'Innenraum',           fr:'Intérieur',           it:'Interno',             es:'Interior' },
  'dashboard':        { el:'Ταμπλό',                en:'Dashboard',        de:'Armaturenbrett',      fr:'Tableau de bord',     it:'Cruscotto',           es:'Salpicadero' },
  'seats':            { el:'Καθίσματα',             en:'Seats',            de:'Sitze',               fr:'Sièges',              it:'Sedili',              es:'Asientos' },
  'ac':               { el:'Κλιματισμός',           en:'A/C',              de:'Klimaanlage',         fr:'Climatisation',       it:'Aria condizionata',   es:'Aire acondicionado' },
  'electronics':      { el:'Ηλεκτρονικά',           en:'Electronics',     de:'Elektronik',          fr:'Électronique',        it:'Elettronica',         es:'Electrónica' },
  'front_left_tire':  { el:'Εμπρός αριστ. ελαστικό',en:'Front left tire', de:'Vord. linker Reifen', fr:'Pneu av. gauche',     it:'Gomma ant. sin.',     es:'Neumático del. izq.' },
  'front_right_tire': { el:'Εμπρός δεξί ελαστικό',  en:'Front right tire',de:'Vord. rechter Reifen',fr:'Pneu av. droit',      it:'Gomma ant. des.',     es:'Neumático del. der.' },
  'rear_left_tire':   { el:'Πίσω αριστ. ελαστικό',  en:'Rear left tire',  de:'Hint. linker Reifen', fr:'Pneu arr. gauche',    it:'Gomma post. sin.',    es:'Neumático tras. izq.' },
  'rear_right_tire':  { el:'Πίσω δεξί ελαστικό',    en:'Rear right tire', de:'Hint. rechter Reifen',fr:'Pneu arr. droit',     it:'Gomma post. des.',    es:'Neumático tras. der.' },
}

const AREA_KEYS = Object.keys(AREAS)

const COND_COLORS: Record<string, string> = {
  good: '#22c55e', fair: '#f59e0b', poor: '#ef4444', na: '#475569',
}

// Car body SVG diagram with clickable areas
const CAR_AREAS_SVG = [
  { key: 'hood',            x: 200, y: 30,  w: 120, h: 60,  label: '↑' },
  { key: 'windshield',      x: 200, y: 90,  w: 120, h: 40,  label: '🪟' },
  { key: 'roof',            x: 200, y: 130, w: 120, h: 60,  label: '□' },
  { key: 'rear_windshield', x: 200, y: 190, w: 120, h: 40,  label: '🪟' },
  { key: 'rear_bumper',     x: 200, y: 310, w: 120, h: 40,  label: '↓' },
  { key: 'front_bumper',    x: 200, y: 10,  w: 120, h: 25,  label: '↑' },
  { key: 'front_left_door', x: 120, y: 130, w: 80,  h: 60,  label: 'FL' },
  { key: 'rear_left_door',  x: 120, y: 190, w: 80,  h: 60,  label: 'RL' },
  { key: 'front_right_door',x: 320, y: 130, w: 80,  h: 60,  label: 'FR' },
  { key: 'rear_right_door', x: 320, y: 190, w: 80,  h: 60,  label: 'RR' },
  { key: 'left_fender',     x: 100, y: 60,  w: 80,  h: 70,  label: 'LF' },
  { key: 'right_fender',    x: 340, y: 60,  w: 80,  h: 70,  label: 'RF' },
  { key: 'left_mirror',     x: 90,  y: 130, w: 30,  h: 25,  label: '◁' },
  { key: 'right_mirror',    x: 400, y: 130, w: 30,  h: 25,  label: '▷' },
]

export default function InspectionTab({ id }: { id: string }) {
  const { vehicles, updateVehicle, settings } = useFleetStore()
  const lang = settings.lang
  const v = vehicles.find(x => x.id === id)
  if (!v) return null

  const items: InspectionItem[] = AREA_KEYS.map(key => {
    const existing = v.inspection?.find(i => i.area === key)
    return existing || { area: key, condition: 'na' as const }
  })

  const update = (key: string, patch: Partial<InspectionItem>) => {
    const newItems = items.map(item => item.area === key ? { ...item, ...patch } : item)
    updateVehicle(id, { inspection: newItems })
  }

  const getItem = (key: string) => items.find(i => i.area === key) || { area: key, condition: 'na' as const }

  const counts = {
    good: items.filter(i => i.condition === 'good').length,
    fair: items.filter(i => i.condition === 'fair').length,
    poor: items.filter(i => i.condition === 'poor').length,
  }

  const condLabel = (c: string) => {
    const labels: Record<string, Record<Lang, string>> = {
      good: { el:'✅ Καλό', en:'✅ Good', de:'✅ Gut', fr:'✅ Bon', it:'✅ Buono', es:'✅ Bueno' },
      fair: { el:'⚠️ Μέτριο', en:'⚠️ Fair', de:'⚠️ Mäßig', fr:'⚠️ Moyen', it:'⚠️ Discreto', es:'⚠️ Regular' },
      poor: { el:'❌ Κακό', en:'❌ Poor', de:'❌ Schlecht', fr:'❌ Mauvais', it:'❌ Scarso', es:'❌ Malo' },
      na:   { el:'— N/A', en:'— N/A', de:'— N/A', fr:'— N/A', it:'— N/A', es:'— N/A' },
    }
    return labels[c]?.[lang] || c
  }

  return (
    <div>
      {/* Summary */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {Object.entries(counts).map(([cond, count]) => (
          <div key={cond} style={{ background: 'var(--surface2)', borderRadius: 8, padding: '10px 20px', borderLeft: `3px solid ${COND_COLORS[cond]}` }}>
            <div style={{ fontWeight: 700, fontSize: 22 }}>{count}</div>
            <div style={{ fontSize: 12, color: 'var(--text2)' }}>{condLabel(cond).replace(/[✅⚠️❌—] ?/,'')}</div>
          </div>
        ))}
      </div>

      {/* Car diagram */}
      <div style={{ marginBottom: 20, overflowX: 'auto' }}>
        <svg viewBox="0 0 520 360" style={{ width: '100%', maxWidth: 520, display: 'block', margin: '0 auto' }}>
          {/* Car body outline */}
          <rect x="100" y="60" width="320" height="240" rx="20" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
          <rect x="160" y="30" width="200" height="240" rx="10" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
          
          {/* Clickable zones */}
          {CAR_AREAS_SVG.map(area => {
            const item = getItem(area.key)
            const color = COND_COLORS[item.condition]
            return (
              <g key={area.key} style={{ cursor: 'pointer' }}
                onClick={() => {
                  const order = ['na','good','fair','poor']
                  const next = order[(order.indexOf(item.condition) + 1) % order.length] as InspectionItem['condition']
                  update(area.key, { condition: next })
                }}>
                <rect x={area.x} y={area.y} width={area.w} height={area.h} rx="4"
                  fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5"/>
                <text x={area.x + area.w/2} y={area.y + area.h/2 + 4}
                  textAnchor="middle" fontSize="10" fill={color} fontWeight="600">
                  {area.label}
                </text>
              </g>
            )
          })}

          {/* Legend */}
          <text x="10" y="345" fontSize="9" fill="#94a3b8">Click to cycle: N/A → Good → Fair → Poor</text>
        </svg>
      </div>

      {/* Detail grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 8 }}>
        {AREA_KEYS.map(key => {
          const item = getItem(key)
          const areaName = AREAS[key]?.[lang] || AREAS[key]?.en || key
          return (
            <div key={key} style={{ background: 'var(--surface2)', borderRadius: 8, padding: '10px 12px', borderLeft: `3px solid ${COND_COLORS[item.condition]}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{areaName}</span>
                <select value={item.condition}
                  onChange={e => update(key, { condition: e.target.value as InspectionItem['condition'] })}
                  style={{ fontSize: 11, padding: '2px 4px', width: 'auto', background: 'var(--surface)', color: COND_COLORS[item.condition], fontWeight: 600 }}>
                  <option value="na">{condLabel('na')}</option>
                  <option value="good">{condLabel('good')}</option>
                  <option value="fair">{condLabel('fair')}</option>
                  <option value="poor">{condLabel('poor')}</option>
                </select>
              </div>
              <input value={item.notes || ''} onChange={e => update(key, { notes: e.target.value })}
                placeholder={lang === 'el' ? 'Σημειώσεις / κόστος επισκευής (€)' : lang === 'de' ? 'Notizen / Reparaturkosten (€)' : lang === 'it' ? 'Note / costo riparazione (€)' : lang === 'fr' ? 'Notes / coût réparation (€)' : lang === 'es' ? 'Notas / costo reparación (€)' : 'Notes / repair cost (€)'}
                style={{ fontSize: 12, padding: '4px 8px' }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
