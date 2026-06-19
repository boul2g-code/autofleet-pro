/* eslint-disable react/no-unescaped-entities */
'use client'
import { useFleetStore } from '@/store/useFleetStore'
import { calcFinancials, fmtCur } from '@/lib/financials'
import { scoreVehicle } from '@/lib/vehicleScore'
import type { Lang } from '@/lib/types'

const T: Record<string, Partial<Record<Lang, string>>> = {
  saleScore:   { el:'Βαθμός Πωλησιμότητας', en:'Saleability Score', de:'Verkaufbarkeit', fr:'Score de vente', it:'Score vendibilità', es:'Puntuación venta' },
  highProb:    { el:'Υψηλή πιθανότητα πώλησης', en:'High sale probability', de:'Hohe Verkaufswahrscheinlichkeit', fr:'Haute probabilité', it:'Alta probabilità di vendita', es:'Alta probabilidad de venta' },
  medProb:     { el:'Μέτρια πιθανότητα', en:'Medium probability', de:'Mittlere Wahrscheinlichkeit', fr:'Probabilité moyenne', it:'Probabilità media', es:'Probabilidad media' },
  lowProb:     { el:'Χαμηλή — απαιτείται δράση', en:'Low — action required', de:'Niedrig — handeln Sie jetzt', fr:'Faible — agissez', it:'Bassa — agisci subito', es:'Baja — actúa ahora' },
  whyScore:    { el:'Γιατί αυτός ο βαθμός', en:'Why this score', de:'Warum diese Bewertung', fr:'Pourquoi ce score', it:'Perché questo score', es:'Por qué esta puntuación' },
  positive:    { el:'Θετικά', en:'Positive', de:'Positiv', fr:'Positif', it:'Positivo', es:'Positivo' },
  toImprove:   { el:'Βελτίωση', en:'To improve', de:'Zu verbessern', fr:'À améliorer', it:'Da migliorare', es:'A mejorar' },
  margin:      { el:'Ανάλυση Κέρδους', en:'Profit Analysis', de:'Gewinnanalyse', fr:'Analyse du profit', it:'Analisi del profitto', es:'Análisis de beneficio' },
  purchCost:   { el:'Κόστος Αγοράς', en:'Purchase Cost', de:'Kaufpreis', fr:'Coût achat', it:'Costo acquisto', es:'Costo compra' },
  transCost:   { el:'Μεταφορά', en:'Transport', de:'Transport', fr:'Transport', it:'Trasporto', es:'Transporte' },
  storageCost: { el:'Αποθήκευση', en:'Storage', de:'Lagerung', fr:'Stockage', it:'Deposito/Stoccaggio', es:'Almacenamiento' },
  workCost:    { el:'Εργασίες', en:'Repairs/Prep', de:'Reparaturen', fr:'Réparations', it:'Preparazione/Riparazioni', es:'Reparaciones' },
  transCostOut:{ el:'Μεταφορά Εξ.', en:'Delivery', de:'Lieferung', fr:'Livraison', it:'Consegna', es:'Entrega' },
  totalCost:   { el:'Συνολικό Κόστος', en:'Total Cost', de:'Gesamtkosten', fr:'Coût total', it:'Costo totale', es:'Costo total' },
  askPrice:    { el:'Τιμή Πώλησης', en:'Sale Price', de:'Verkaufspreis', fr:'Prix de vente', it:'Prezzo di vendita', es:'Precio de venta' },
  grossProfit: { el:'Μεικτό Κέρδος', en:'Gross Profit', de:'Bruttogewinn', fr:'Bénéfice brut', it:'Profitto lordo', es:'Beneficio bruto' },
  margin_pct:  { el:'Περιθώριο %', en:'Margin %', de:'Marge %', fr:'Marge %', it:'Margine %', es:'Margen %' },
  noPrice:     { el:'Προσθέστε τιμή πώλησης για ανάλυση', en:'Add sale price to see profit analysis', de:'Verkaufspreis hinzufügen für Analyse', fr:'Ajoutez le prix de vente', it:'Aggiungi prezzo di vendita per vedere l\'analisi', es:'Añade precio de venta para ver análisis' },
  lowMarg:     { el:'⚠️ Χαμηλό περιθώριο κέρδους', en:'⚠️ Low margin alert', de:'⚠️ Niedriger Marge', fr:'⚠️ Marge faible', it:'⚠️ Margine basso — attenzione', es:'⚠️ Margen bajo — atención' },
  goodMarg:    { el:'🔥 Καλό περιθώριο κέρδους', en:'🔥 Good margin', de:'🔥 Gute Marge', fr:'🔥 Bonne marge', it:'🔥 Buon margine', es:'🔥 Buen margen' },
  exportTitle: { el:'🌍 Export Readiness', en:'🌍 Export Readiness', de:'🌍 Export-Bereitschaft', fr:'🌍 Prêt à l\'export', it:'🌍 Export Readiness', es:'🌍 Listo para exportar' },
  exportOk:    { el:'Έτοιμο για εξαγωγή', en:'Ready for export', de:'Exportbereit', fr:'Prêt à exporter', it:'Pronto per l\'export', es:'Listo para exportar' },
  exportNot:   { el:'Ελλιπή έγγραφα', en:'Incomplete documentation', de:'Unvollständige Dokumente', fr:'Documentation incomplète', it:'Documentazione incompleta', es:'Documentación incompleta' },
  pts:         { el:'πόντοι', en:'pts', de:'Pkt', fr:'pts', it:'punti', es:'pts' },
}

const LL = (lang: Lang, key: string) => T[key]?.[lang] || T[key]?.en || key

// Translated score reasons
const REASON_T: Record<string, Partial<Record<Lang, string>>> = {
  'Popular make':           { el:'Δημοφιλής μάρκα', en:'Popular make', de:'Beliebte Marke', fr:'Marque populaire', it:'Marca popolare', es:'Marca popular' },
  'Premium brand':          { el:'Premium μάρκα', en:'Premium brand', de:'Premiummarke', fr:'Marque premium', it:'Marca premium', es:'Marca premium' },
  'Low mileage':            { el:'Χαμηλά χιλιόμετρα', en:'Low mileage', de:'Niedrige Laufleistung', fr:'Faible kilométrage', it:'Chilometraggio basso', es:'Bajo kilometraje' },
  'Good mileage':           { el:'Καλά χιλιόμετρα', en:'Good mileage', de:'Gute Laufleistung', fr:'Bon kilométrage', it:'Buon chilometraggio', es:'Buen kilometraje' },
  'High mileage (>180k)':   { el:'Υψηλά χιλιόμετρα (>180k)', en:'High mileage (>180k)', de:'Hohe Laufleistung (>180k)', fr:'Kilométrage élevé (>180k)', it:'Chilometraggio alto (>180k)', es:'Alto kilometraje (>180k)' },
  'Mileage not recorded':   { el:'Χιλιόμετρα δεν καταγράφηκαν', en:'Mileage not recorded', de:'Laufleistung nicht erfasst', fr:'Kilométrage non enregistré', it:'Chilometraggio non registrato', es:'Kilometraje no registrado' },
  'Recent vehicle (≤3 years)': { el:'Νέο όχημα (≤3 χρόνια)', en:'Recent vehicle (≤3 years)', de:'Neufahrzeug (≤3 Jahre)', fr:'Véhicule récent (≤3 ans)', it:'Veicolo recente (≤3 anni)', es:'Vehículo reciente (≤3 años)' },
  'Good age (≤6 years)':    { el:'Καλή ηλικία (≤6 χρόνια)', en:'Good age (≤6 years)', de:'Gutes Alter (≤6 Jahre)', fr:'Bon âge (≤6 ans)', it:'Buona età (≤6 anni)', es:'Buena edad (≤6 años)' },
  'Diesel — high demand DE/IT': { el:'Diesel — υψηλή ζήτηση', en:'Diesel — high demand', de:'Diesel — hohe Nachfrage', fr:'Diesel — forte demande', it:'Diesel — alta domanda DE/IT', es:'Diésel — alta demanda' },
  'Hybrid — growing demand': { el:'Υβριδικό — αυξανόμενη ζήτηση', en:'Hybrid — growing demand', de:'Hybrid — wachsende Nachfrage', fr:'Hybride — demande croissante', it:'Ibrido — domanda crescente', es:'Híbrido — demanda creciente' },
  'Electric — premium segment': { el:'Ηλεκτρικό — premium τμήμα', en:'Electric — premium segment', de:'Elektrisch — Premiumsegment', fr:'Électrique — segment premium', it:'Elettrico — segmento premium', es:'Eléctrico — segmento premium' },
  'Photo available':        { el:'Φωτογραφία διαθέσιμη', en:'Photo available', de:'Foto vorhanden', fr:'Photo disponible', it:'Foto presente', es:'Foto disponible' },
  'No photo — reduces visibility': { el:'Χωρίς φωτογραφία — μειώνει ορατότητα', en:'No photo — reduces visibility', de:'Kein Foto — reduziert Sichtbarkeit', fr:'Pas de photo — réduit la visibilité', it:'Nessuna foto — riduce visibilità', es:'Sin foto — reduce visibilidad' },
  'Sale price set':         { el:'Τιμή πώλησης ορισμένη', en:'Sale price set', de:'Verkaufspreis festgelegt', fr:'Prix de vente fixé', it:'Prezzo di vendita impostato', es:'Precio de venta establecido' },
  'No sale price set':      { el:'Δεν έχει οριστεί τιμή', en:'No sale price set', de:'Kein Verkaufspreis', fr:'Prix de vente non fixé', it:'Prezzo di vendita mancante', es:'Sin precio de venta' },
  'Recently acquired':      { el:'Πρόσφατη απόκτηση', en:'Recently acquired', de:'Kürzlich erworben', fr:'Récemment acquis', it:'Acquisito di recente', es:'Adquirido recientemente' },
  'Good inspection result': { el:'Καλό αποτέλεσμα επιθεώρησης', en:'Good inspection result', de:'Gutes Inspektionsergebnis', fr:'Bon résultat d\'inspection', it:'Buon risultato ispezione', es:'Buen resultado inspección' },
  'VIN recorded':           { el:'VIN καταγεγραμμένο', en:'VIN recorded', de:'FIN erfasst', fr:'NIV enregistré', it:'Telaio registrato', es:'Nº bastidor registrado' },
}

const trReason = (lang: Lang, r: string) => REASON_T[r]?.[lang] || REASON_T[r]?.en || r

export default function ScoreTab({ id }: { id: string }) {
  const { vehicles, settings } = useFleetStore()
  const lang = settings.lang
  const v = vehicles.find(x => x.id === id)
  if (!v) return null

  const score = scoreVehicle(v)
  const fin = calcFinancials(v)

  const scoreColor = score.total >= 70 ? '#22c55e' : score.total >= 45 ? '#f59e0b' : '#ef4444'
  const scoreBg = score.total >= 70 ? 'rgba(34,197,94,0.06)' : score.total >= 45 ? 'rgba(245,158,11,0.06)' : 'rgba(239,68,68,0.06)'
  const scoreLabel = score.recommendation === 'high' ? LL(lang, 'highProb') : score.recommendation === 'medium' ? LL(lang, 'medProb') : LL(lang, 'lowProb')

  const hasPrice = fin.saleRevenue > 0
  const lowMargin = hasPrice && fin.margin < 8
  const goodMargin = hasPrice && fin.margin >= 15

  // Score reason with points
  const REASON_PTS: Record<string, number> = {
    'Popular make': 10, 'Premium brand': 5,
    'Low mileage': 12, 'Good mileage': 8,
    'High mileage (>180k)': -10, 'Mileage not recorded': -5,
    'Recent vehicle (≤3 years)': 15, 'Good age (≤6 years)': 8,
    'Diesel — high demand DE/IT': 5, 'Hybrid — growing demand': 8, 'Electric — premium segment': 10,
    'Photo available': 5, 'No photo — reduces visibility': -8,
    'Sale price set': 5, 'No sale price set': -5,
    'Recently acquired': 3, 'Good inspection result': 8, 'VIN recorded': 3,
  }

  return (
    <div>
      {/* ═══ SCORE ═══ */}
      <div style={{ background: scoreBg, border: `2px solid ${scoreColor}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          {/* Circle */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle cx="55" cy="55" r="46" fill="none" stroke="var(--surface2)" strokeWidth="9"/>
              <circle cx="55" cy="55" r="46" fill="none" stroke={scoreColor} strokeWidth="9"
                strokeDasharray={`${2.89 * score.total} 289`} strokeLinecap="round"
                transform="rotate(-90 55 55)" style={{ transition: 'stroke-dasharray 1s ease' }}/>
              <text x="55" y="50" textAnchor="middle" fontSize="26" fontWeight="800" fill={scoreColor}>{score.total}</text>
              <text x="55" y="67" textAnchor="middle" fontSize="11" fill="var(--text2)">/100</text>
            </svg>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{LL(lang, 'saleScore')}</div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: scoreColor, marginBottom: 12 }}>{scoreLabel}</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6, fontWeight: 600 }}>{LL(lang, 'whyScore')}:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[...score.reasons.positive.map(r => ({ r, pts: REASON_PTS[r] || 5, pos: true })),
                ...score.reasons.negative.map(r => ({ r, pts: REASON_PTS[r] || -5, pos: false }))
              ].sort((a,b) => Math.abs(b.pts) - Math.abs(a.pts)).slice(0, 8).map(({ r, pts, pos }) => (
                <div key={r} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 8px', borderRadius: 6, background: pos ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)' }}>
                  <span style={{ fontSize: 12, color: pos ? '#22c55e' : '#f59e0b' }}>
                    {pos ? '✅' : '⚠️'} {trReason(lang, r)}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: pos ? '#22c55e' : '#ef4444', marginLeft: 8, flexShrink: 0 }}>
                    {pos ? '+' : ''}{pts} {LL(lang, 'pts')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ DETAILED PROFIT BREAKDOWN ═══ */}
      <div className="card" style={{ marginBottom: 16, borderLeft: `3px solid ${goodMargin ? '#22c55e' : lowMargin ? '#ef4444' : 'var(--border)'}` }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>💰 {LL(lang, 'margin')}</div>
        {hasPrice ? (
          <>
            {lowMargin && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', borderRadius: 8, padding: '8px 12px', marginBottom: 12, fontSize: 13, color: 'var(--danger)', fontWeight: 600 }}>
                {LL(lang, 'lowMarg')} — {fin.margin.toFixed(1)}%
              </div>
            )}
            {goodMargin && (
              <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid var(--success)', borderRadius: 8, padding: '8px 12px', marginBottom: 12, fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>
                {LL(lang, 'goodMarg')} — {fin.margin.toFixed(1)}%
              </div>
            )}

            {/* Full cost breakdown */}
            {[
              { label: LL(lang, 'purchCost'), value: fin.purchaseCost, color: '#ef4444', indent: false },
              { label: LL(lang, 'transCost'), value: fin.transportInCost, color: '#f87171', indent: true },
              { label: `${LL(lang, 'storageCost')} (${fin.storageDays}d)`, value: fin.storageCost, color: '#f87171', indent: true },
              { label: LL(lang, 'workCost'), value: fin.workCost, color: '#f87171', indent: true },
              { label: LL(lang, 'transCostOut'), value: fin.transportOutCost, color: '#f87171', indent: true },
            ].filter(r => r.value > 0).map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', paddingLeft: row.indent ? 16 : 0, borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                <span style={{ color: row.indent ? 'var(--text2)' : 'var(--text)' }}>{row.indent ? '└ ' : ''}{row.label}</span>
                <span style={{ fontWeight: 500, color: row.color }}>{fmtCur(row.value)}</span>
              </div>
            ))}

            {/* Totals */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '2px solid var(--border)', marginTop: 4, fontSize: 14, fontWeight: 700 }}>
              <span>{LL(lang, 'totalCost')}</span>
              <span style={{ color: '#ef4444' }}>{fmtCur(fin.totalCost)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
              <span style={{ color: 'var(--text2)' }}>{LL(lang, 'askPrice')}</span>
              <span style={{ color: '#3b82f6', fontWeight: 600 }}>{fmtCur(fin.saleRevenue)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', marginTop: 8, borderRadius: 8, background: fin.grossProfit >= 0 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)' }}>
              <span style={{ fontWeight: 700 }}>{LL(lang, 'grossProfit')}</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: fin.grossProfit >= 0 ? '#22c55e' : '#ef4444' }}>
                  {fin.grossProfit >= 0 ? '+' : ''}{fmtCur(fin.grossProfit)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>{LL(lang, 'margin_pct')}: {fin.margin.toFixed(1)}%</div>
              </div>
            </div>
          </>
        ) : (
          <p style={{ color: 'var(--text2)', fontSize: 13, fontStyle: 'italic' }}>💡 {LL(lang, 'noPrice')}</p>
        )}
      </div>

      {/* ═══ EXPORT READINESS ═══ */}
      <div className="card" style={{ borderLeft: `3px solid ${score.exportReady ? '#22c55e' : '#f59e0b'}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{LL(lang, 'exportTitle')}</div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: score.exportReady ? '#22c55e' : '#f59e0b' }}>
              {Math.round(Object.values(score.exportChecks).filter(Boolean).length / Object.keys(score.exportChecks).length * 100)}%
            </div>
            <div style={{ fontSize: 11, color: score.exportReady ? '#22c55e' : '#f59e0b' }}>
              {score.exportReady ? LL(lang, 'exportOk') : LL(lang, 'exportNot')}
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {Object.entries(score.exportChecks).map(([key, ok]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 6, background: ok ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)', fontSize: 13 }}>
              <span>{ok ? '✅' : '❌'}</span>
              <span style={{ color: ok ? 'var(--text)' : 'var(--text2)' }}>{key}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
