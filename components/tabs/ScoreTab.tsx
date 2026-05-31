/* eslint-disable react/no-unescaped-entities */
'use client'
import { useFleetStore } from '@/store/useFleetStore'
import { calcFinancials, fmtCur } from '@/lib/financials'
import { scoreVehicle } from '@/lib/vehicleScore'
import type { Lang } from '@/lib/types'

const L: Record<string, Record<Lang, string>> = {
  title:       { el:'Βαθμολογία & Ανάλυση', en:'Score & Analysis', de:'Bewertung & Analyse', fr:'Score & Analyse', it:'Score & Analisi', es:'Puntuación & Análisis' },
  saleScore:   { el:'Βαθμός Πωλησιμότητας', en:'Saleability Score', de:'Verkaufbarkeit', fr:'Score de vente', it:'Score vendibilità', es:'Puntuación venta' },
  highProb:    { el:'Υψηλή πιθανότητα πώλησης', en:'High sale probability', de:'Hohe Verkaufswahrscheinlichkeit', fr:'Haute probabilité de vente', it:'Alta probabilità di vendita', es:'Alta probabilidad de venta' },
  medProb:     { el:'Μέτρια πιθανότητα', en:'Medium probability', de:'Mittlere Wahrscheinlichkeit', fr:'Probabilité moyenne', it:'Probabilità media', es:'Probabilidad media' },
  lowProb:     { el:'Χαμηλή πιθανότητα — δράσε', en:'Low probability — take action', de:'Niedrig — handeln Sie', fr:'Faible — agissez', it:'Bassa — agisci', es:'Baja — actúa' },
  positive:    { el:'Θετικά', en:'Positive factors', de:'Positive Faktoren', fr:'Facteurs positifs', it:'Fattori positivi', es:'Factores positivos' },
  negative:    { el:'Αρνητικά / Βελτίωση', en:'Areas to improve', de:'Verbesserungsbereiche', fr:'Axes d\'amélioration', it:'Aree di miglioramento', es:'Áreas de mejora' },
  margin:      { el:'Ανάλυση Περιθωρίου', en:'Margin Analysis', de:'Margenanalyse', fr:'Analyse de marge', it:'Analisi del margine', es:'Análisis de margen' },
  totalCost:   { el:'Συνολικό Κόστος', en:'Total Cost', de:'Gesamtkosten', fr:'Coût total', it:'Costo totale', es:'Costo total' },
  askPrice:    { el:'Τιμή Ζήτησης', en:'Asking Price', de:'Verkaufspreis', fr:'Prix demandé', it:'Prezzo richiesto', es:'Precio solicitado' },
  netProfit:   { el:'Εκτιμ. Καθαρό Κέρδος', en:'Est. Net Profit', de:'Gesch. Reingewinn', fr:'Bénéfice net est.', it:'Profitto netto stimato', es:'Beneficio neto estimado' },
  margin_pct:  { el:'Περιθώριο %', en:'Margin %', de:'Marge %', fr:'Marge %', it:'Margine %', es:'Margen %' },
  noPrice:     { el:'Προσθέστε τιμή πώλησης', en:'Add sale price to see margin', de:'Verkaufspreis hinzufügen', fr:'Ajoutez le prix de vente', it:'Aggiungi prezzo di vendita', es:'Añade precio de venta' },
  exportTitle: { el:'Export Readiness', en:'Export Readiness', de:'Export-Bereitschaft', fr:'Prêt à l\'export', it:'Export Readiness', es:'Listo para exportar' },
  exportOk:    { el:'Έτοιμο για εξαγωγή', en:'Export ready', de:'Exportbereit', fr:'Prêt à exporter', it:'Pronto per l\'export', es:'Listo para exportar' },
  exportNot:   { el:'Ελλιπή έγγραφα', en:'Incomplete documentation', de:'Unvollständige Dokumente', fr:'Documentation incomplète', it:'Documentazione incompleta', es:'Documentación incompleta' },
  margAlert:   { el:'⚠️ Χαμηλό περιθώριο', en:'⚠️ Low margin alert', de:'⚠️ Niedriger Marge', fr:'⚠️ Marge faible', it:'⚠️ Margine basso', es:'⚠️ Margen bajo' },
  margGood:    { el:'🔥 Καλό περιθώριο', en:'🔥 Good margin', de:'🔥 Gute Marge', fr:'🔥 Bonne marge', it:'🔥 Buon margine', es:'🔥 Buen margen' },
}

const LL = (lang: Lang, key: string) => L[key]?.[lang] || L[key]?.en || key

export default function ScoreTab({ id }: { id: string }) {
  const { vehicles, settings } = useFleetStore()
  const lang = settings.lang
  const v = vehicles.find(x => x.id === id)
  if (!v) return null

  const score = scoreVehicle(v)
  const fin = calcFinancials(v)

  const scoreColor = score.total >= 70 ? '#22c55e' : score.total >= 45 ? '#f59e0b' : '#ef4444'
  const scoreBg = score.total >= 70 ? 'rgba(34,197,94,0.08)' : score.total >= 45 ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)'
  const scoreLabel = score.recommendation === 'high' ? LL(lang, 'highProb') : score.recommendation === 'medium' ? LL(lang, 'medProb') : LL(lang, 'lowProb')

  // Margin alert
  const hasPrice = fin.saleRevenue > 0
  const lowMargin = hasPrice && fin.margin < 8
  const goodMargin = hasPrice && fin.margin >= 15

  return (
    <div>
      {/* ═══ SALE SCORE ═══ */}
      <div style={{ background: scoreBg, border: `2px solid ${scoreColor}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          {/* Score circle */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--surface2)" strokeWidth="8"/>
              <circle cx="50" cy="50" r="42" fill="none" stroke={scoreColor} strokeWidth="8"
                strokeDasharray={`${2.64 * score.total} 264`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dasharray 0.8s ease' }}/>
              <text x="50" y="46" textAnchor="middle" fontSize="24" fontWeight="800" fill={scoreColor}>{score.total}</text>
              <text x="50" y="62" textAnchor="middle" fontSize="10" fill="var(--text2)">/100</text>
            </svg>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginTop: -4 }}>{LL(lang, 'saleScore')}</div>
          </div>

          {/* Score details */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: scoreColor, marginBottom: 8 }}>
              {scoreLabel}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>✅ {LL(lang, 'positive')}</div>
                {score.reasons.positive.slice(0, 4).map(r => (
                  <div key={r} style={{ fontSize: 12, color: '#22c55e', padding: '1px 0' }}>• {r}</div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>⚠️ {LL(lang, 'negative')}</div>
                {score.reasons.negative.slice(0, 4).map(r => (
                  <div key={r} style={{ fontSize: 12, color: '#f59e0b', padding: '1px 0' }}>• {r}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MARGIN ANALYSIS ═══ */}
      <div className="card" style={{ marginBottom: 16, borderLeft: `3px solid ${goodMargin ? '#22c55e' : lowMargin ? '#ef4444' : 'var(--border)'}` }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>💰 {LL(lang, 'margin')}</div>
        {hasPrice ? (
          <>
            {/* Margin alert banner */}
            {lowMargin && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', borderRadius: 8, padding: '8px 12px', marginBottom: 12, fontSize: 13, color: 'var(--danger)', fontWeight: 600 }}>
                {LL(lang, 'margAlert')} — {fin.margin.toFixed(1)}% margin · {fmtCur(fin.grossProfit)} profit
              </div>
            )}
            {goodMargin && (
              <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid var(--success)', borderRadius: 8, padding: '8px 12px', marginBottom: 12, fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>
                {LL(lang, 'margGood')} — {fin.margin.toFixed(1)}% · {fmtCur(fin.grossProfit)}
              </div>
            )}

            {/* Profit breakdown bar */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', height: 24, borderRadius: 6, overflow: 'hidden', marginBottom: 6 }}>
                <div style={{ background: '#ef4444', flex: fin.totalCost, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', fontWeight: 600, minWidth: 20 }}>
                  {fin.totalCost > 0 ? 'Cost' : ''}
                </div>
                <div style={{ background: fin.grossProfit >= 0 ? '#22c55e' : '#dc2626', flex: Math.abs(fin.grossProfit) || 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', fontWeight: 600, minWidth: 20 }}>
                  {fin.grossProfit >= 0 ? 'Profit' : 'Loss'}
                </div>
              </div>
            </div>

            {/* Numbers */}
            {[
              { label: LL(lang, 'totalCost'), value: fmtCur(fin.totalCost), color: '#ef4444' },
              { label: LL(lang, 'askPrice'), value: fmtCur(fin.saleRevenue), color: '#3b82f6' },
              { label: LL(lang, 'netProfit'), value: fmtCur(fin.grossProfit), color: fin.grossProfit >= 0 ? '#22c55e' : '#ef4444' },
              { label: LL(lang, 'margin_pct'), value: fin.margin.toFixed(1) + '%', color: fin.margin >= 15 ? '#22c55e' : fin.margin >= 8 ? '#f59e0b' : '#ef4444' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                <span style={{ color: 'var(--text2)' }}>{row.label}</span>
                <span style={{ fontWeight: 700, color: row.color }}>{row.value}</span>
              </div>
            ))}
          </>
        ) : (
          <p style={{ color: 'var(--text2)', fontSize: 13, fontStyle: 'italic' }}>💡 {LL(lang, 'noPrice')}</p>
        )}
      </div>

      {/* ═══ EXPORT READINESS ═══ */}
      <div className="card" style={{ borderLeft: `3px solid ${score.exportReady ? '#22c55e' : '#f59e0b'}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>🌍 {LL(lang, 'exportTitle')}</div>
          <span style={{
            padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700,
            background: score.exportReady ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
            color: score.exportReady ? '#22c55e' : '#f59e0b',
          }}>
            {score.exportReady ? `✅ ${LL(lang, 'exportOk')}` : `⚠️ ${LL(lang, 'exportNot')}`}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {Object.entries(score.exportChecks).map(([key, ok]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 6, background: ok ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)', fontSize: 13 }}>
              <span style={{ fontSize: 16 }}>{ok ? '✅' : '❌'}</span>
              <span style={{ color: ok ? 'var(--text)' : 'var(--text2)' }}>{key}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
