/* eslint-disable react/no-unescaped-entities */
'use client'
import AppShell from '@/components/AppShell'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { calcFinancials, fmtCur } from '@/lib/financials'
import { scoreVehicle } from '@/lib/vehicleScore'
import Link from 'next/link'
import type { Lang } from '@/lib/types'

const T: Record<string, Record<Lang, string>> = {
  topOpp:    { el:'🔥 Καλύτερη Ευκαιρία', en:'🔥 Top Opportunity', de:'🔥 Beste Chance', fr:'🔥 Meilleure opportunité', it:'🔥 Top Opportunity', es:'🔥 Mejor oportunidad' },
  topOppSub: { el:'Υψηλότερο score + κέρδος', en:'Highest score + profit', de:'Höchste Bewertung + Gewinn', fr:'Score + profit le plus élevé', it:'Score più alto + profitto', es:'Mayor puntuación + beneficio' },
  attention: { el:'⚠️ Απαιτεί Προσοχή', en:'⚠️ Needs Attention', de:'⚠️ Achtung erforderlich', fr:'⚠️ Attention requise', it:'⚠️ Attenzione richiesta', es:'⚠️ Requiere atención' },
  agingCost: { el:'Εκτιμ. Κόστος Αναμονής', en:'Est. Holding Cost', de:'Gesch. Haltekosten', fr:'Coût de détention est.', it:'Costo stimato immobilizzo', es:'Costo estimado inmovilización' },
  expProfit: { el:'Εκτιμ. Κέρδος', en:'Est. Profit', de:'Gesch. Gewinn', fr:'Bénéfice estimé', it:'Profitto stimato', es:'Beneficio estimado' },
  daysStock: { el:'ημ. σε απόθεμα', en:'days in stock', de:'Tage Lager', fr:'jours en stock', it:'giorni in stock', es:'días en stock' },
  noVeh:     { el:'Δεν υπάρχουν οχήματα ακόμα', en:'No vehicles yet', de:'Noch keine Fahrzeuge', fr:'Aucun véhicule', it:'Nessun veicolo ancora', es:'Sin vehículos aún' },
  addFirst:  { el:'Προσθέστε το πρώτο σας', en:'Add your first vehicle', de:'Erstes Fahrzeug hinzufügen', fr:'Ajoutez votre premier', it:'Aggiungi il primo veicolo', es:'Añade tu primer vehículo' },
  fleetSt:   { el:'Κατάσταση Στόλου', en:'Fleet Status', de:'Flottenstatus', fr:'Statut flotte', it:'Stato flotta', es:'Estado flota' },
  quickL:    { el:'Γρήγορες Συνδέσεις', en:'Quick Links', de:'Schnellzugriff', fr:'Accès rapide', it:'Accesso rapido', es:'Acceso rápido' },
  recentV:   { el:'Πρόσφατα Οχήματα', en:'Recent Vehicles', de:'Neueste Fahrzeuge', fr:'Véhicules récents', it:'Veicoli recenti', es:'Vehículos recientes' },
  stockVal:  { el:'Αξία Αποθέματος', en:'Stock Value', de:'Lagerwert', fr:'Valeur stock', it:'Valore stock', es:'Valor stock' },
  monProfit: { el:'Κέρδος Μήνα', en:'Month Profit', de:'Monatsgewinn', fr:'Bénéfice mois', it:'Profitto mese', es:'Beneficio mes' },
  avgDays:   { el:'Μέσος Χρόνος', en:'Avg Days to Sell', de:'Ø Verkaufstage', fr:'Délai moyen', it:'Giorni medi vendita', es:'Días medios' },
  totProfit: { el:'Σύνολο Κέρδους', en:'Total Profit', de:'Gesamtgewinn', fr:'Bénéfice total', it:'Profitto totale', es:'Beneficio total' },
  inStock:   { el:'Σε Απόθεμα', en:'In Stock', de:'Auf Lager', fr:'En stock', it:'In stock', es:'En stock' },
  sold:      { el:'Πωλήθηκαν', en:'Sold', de:'Verkauft', fr:'Vendus', it:'Venduti', es:'Vendidos' },
  inTransit: { el:'Σε Μεταφορά', en:'In Transit', de:'Im Transport', fr:'En transit', it:'In transito', es:'En tránsito' },
  viewAll:   { el:'Δείτε όλα →', en:'View all →', de:'Alle anzeigen →', fr:'Voir tout →', it:'Vedi tutto →', es:'Ver todo →' },
}
const LL = (lang: Lang, k: string) => T[k]?.[lang] || T[k]?.en || k

export default function DashboardPage() {
  const { vehicles, settings } = useFleetStore()
  const lang = settings.lang

  const inStock  = vehicles.filter(v => ['purchased','transit_in','stored','for_sale'].includes(v.status || ''))
  const sold     = vehicles.filter(v => ['sold','transit_out','delivered'].includes(v.status || ''))
  const inTransit = vehicles.filter(v => ['transit_in','transit_out'].includes(v.status || ''))
  const stockValue = inStock.reduce((s, v) => s + (v.purchase?.price || 0), 0)
  const totalProfit = sold.reduce((s, v) => s + calcFinancials(v).grossProfit, 0)

  const now = new Date()
  const monthProfit = sold
    .filter(v => { const d = new Date(v.sale?.date || v.updated_at || 0); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() })
    .reduce((s, v) => s + calcFinancials(v).grossProfit, 0)

  const avgDays = (() => {
    const withDates = sold.filter(v => v.purchase?.date && v.sale?.date)
    if (!withDates.length) return 0
    return Math.round(withDates.reduce((s, v) => s + (new Date(v.sale!.date!).getTime() - new Date(v.purchase!.date!).getTime()) / 86400000, 0) / withDates.length)
  })()

  // Stock aging
  const agingVehicles = inStock.map(v => {
    const startDate = v.storage?.arrivalDate || v.purchase?.date || v.created_at || ''
    const days = Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000)
    const holdingCost = days * (v.storage?.costPerDay || 5)
    return { ...v, days, holdingCost }
  }).filter(v => v.days > 30).sort((a, b) => b.holdingCost - a.holdingCost)

  const totalHoldingCost = agingVehicles.reduce((s, v) => s + v.holdingCost, 0)

  // Top opportunity: in-stock vehicle with best score + profit potential
  const topOpportunity = inStock.map(v => {
    const sc = scoreVehicle(v)
    const fin = calcFinancials(v)
    return { ...v, score: sc.total, profit: fin.grossProfit }
  }).filter(v => v.score > 0).sort((a, b) => (b.score * 0.6 + b.profit * 0.0001) - (a.score * 0.6 + a.profit * 0.0001))[0]

  // Worst attention: highest holding cost
  const worstAttention = agingVehicles[0]

  const recent = [...vehicles].sort((a,b) =>
    new Date(b.updated_at || b.created_at || 0).getTime() - new Date(a.updated_at || a.created_at || 0).getTime()
  ).slice(0, 7)

  const KPIs = [
    { label: t(lang, 'dash.total'),  value: vehicles.length,           icon: '🚗', color: '#3b82f6' },
    { label: LL(lang, 'inStock'),    value: inStock.length,             icon: '📦', color: '#f59e0b' },
    { label: LL(lang, 'stockVal'),   value: fmtCur(stockValue),         icon: '💰', color: '#8b5cf6' },
    { label: LL(lang, 'sold'),       value: sold.length,                icon: '✅', color: '#22c55e' },
    { label: LL(lang, 'monProfit'),  value: fmtCur(monthProfit),        icon: '📅', color: monthProfit >= 0 ? '#22c55e' : '#ef4444' },
    { label: LL(lang, 'totProfit'),  value: fmtCur(totalProfit),        icon: '📈', color: totalProfit >= 0 ? '#22c55e' : '#ef4444' },
    { label: LL(lang, 'inTransit'),  value: inTransit.length,           icon: '🚚', color: '#06b6d4' },
    { label: LL(lang, 'avgDays'),    value: avgDays > 0 ? `${avgDays}d` : '—', icon: '⏱️', color: avgDays > 60 ? '#ef4444' : avgDays > 30 ? '#f59e0b' : '#22c55e' },
  ]

  return (
    <AppShell>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:10 }}>
        <h1 style={{ fontSize:22, fontWeight:700, margin:0 }}>{t(lang, 'nav.dashboard')}</h1>
        <Link href="/vehicles"><button className="btn btn-primary">+ {t(lang, 'veh.new')}</button></Link>
      </div>

      {/* ═══ TOP OPPORTUNITY + ATTENTION widgets ═══ */}
      {vehicles.length > 0 && (topOpportunity || worstAttention) && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
          {/* Top opportunity */}
          {topOpportunity && (
            <Link href="/vehicles" style={{ textDecoration:'none' }}>
              <div style={{ background:'rgba(34,197,94,0.06)', border:'2px solid #22c55e', borderRadius:12, padding:16, cursor:'pointer', height:'100%' }}
                onMouseEnter={e=>(e.currentTarget.style.background='rgba(34,197,94,0.12)')}
                onMouseLeave={e=>(e.currentTarget.style.background='rgba(34,197,94,0.06)')}>
                <div style={{ fontSize:13, fontWeight:700, color:'#22c55e', marginBottom:8 }}>{LL(lang,'topOpp')}</div>
                <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:8 }}>
                  {topOpportunity.photo
                    ? <img src={topOpportunity.photo} alt="" style={{ width:48, height:36, objectFit:'cover', borderRadius:6 }}/>
                    : <div style={{ width:48, height:36, background:'var(--surface2)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🚗</div>
                  }
                  <div>
                    <div style={{ fontWeight:700, fontSize:15, color:'var(--text)' }}>{topOpportunity.make} {topOpportunity.model}</div>
                    <div style={{ fontSize:12, color:'var(--text2)' }}>{topOpportunity.year} · {topOpportunity.plate || '—'}</div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  <span style={{ background:'rgba(34,197,94,0.15)', color:'#22c55e', padding:'3px 10px', borderRadius:999, fontSize:12, fontWeight:700 }}>
                    Score: {topOpportunity.score}/100
                  </span>
                  {topOpportunity.profit > 0 && (
                    <span style={{ background:'rgba(34,197,94,0.15)', color:'#22c55e', padding:'3px 10px', borderRadius:999, fontSize:12, fontWeight:700 }}>
                      {LL(lang,'expProfit')}: {fmtCur(topOpportunity.profit)}
                    </span>
                  )}
                </div>
                <div style={{ fontSize:11, color:'var(--text2)', marginTop:6 }}>{LL(lang,'topOppSub')}</div>
              </div>
            </Link>
          )}

          {/* Worst attention */}
          {worstAttention && (
            <Link href="/vehicles" style={{ textDecoration:'none' }}>
              <div style={{ background:'rgba(239,68,68,0.06)', border:'2px solid #ef4444', borderRadius:12, padding:16, cursor:'pointer', height:'100%' }}
                onMouseEnter={e=>(e.currentTarget.style.background='rgba(239,68,68,0.12)')}
                onMouseLeave={e=>(e.currentTarget.style.background='rgba(239,68,68,0.06)')}>
                <div style={{ fontSize:13, fontWeight:700, color:'#ef4444', marginBottom:8 }}>{LL(lang,'attention')}</div>
                <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:8 }}>
                  {worstAttention.photo
                    ? <img src={worstAttention.photo} alt="" style={{ width:48, height:36, objectFit:'cover', borderRadius:6 }}/>
                    : <div style={{ width:48, height:36, background:'var(--surface2)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🚗</div>
                  }
                  <div>
                    <div style={{ fontWeight:700, fontSize:15, color:'var(--text)' }}>{worstAttention.make} {worstAttention.model}</div>
                    <div style={{ fontSize:12, color:'var(--text2)' }}>{worstAttention.year} · {worstAttention.plate || '—'}</div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  <span style={{ background:'rgba(239,68,68,0.15)', color:'#ef4444', padding:'3px 10px', borderRadius:999, fontSize:12, fontWeight:700 }}>
                    ⏱ {worstAttention.days} {LL(lang,'daysStock')}
                  </span>
                  <span style={{ background:'rgba(239,68,68,0.15)', color:'#ef4444', padding:'3px 10px', borderRadius:999, fontSize:12, fontWeight:700 }}>
                    {LL(lang,'agingCost')}: {fmtCur(worstAttention.holdingCost)}
                  </span>
                </div>
              </div>
            </Link>
          )}
        </div>
      )}

      {/* ═══ AGING ALERT ═══ */}
      {agingVehicles.length > 0 && (
        <div style={{ background:'rgba(239,68,68,0.06)', border:'2px solid var(--danger)', borderRadius:12, padding:'14px 18px', marginBottom:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10, flexWrap:'wrap', gap:8 }}>
            <div>
              <div style={{ fontWeight:700, fontSize:15, color:'var(--danger)' }}>
                🔥 {agingVehicles.length} {t(lang, 'dash.agingAlert') || 'vehicles sitting too long'}
              </div>
              <div style={{ color:'var(--text2)', fontSize:13, marginTop:2 }}>
                {LL(lang,'agingCost')}: <strong style={{ color:'var(--danger)' }}>{fmtCur(totalHoldingCost)}</strong>
              </div>
            </div>
            <Link href="/manifest"><button className="btn btn-danger" style={{ fontSize:12, padding:'5px 12px' }}>Top 10 →</button></Link>
          </div>
          {agingVehicles.slice(0,4).map(v => (
            <Link key={v.id} href="/vehicles" style={{ textDecoration:'none' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 10px', marginBottom:4, background:'rgba(239,68,68,0.04)', borderRadius:8, cursor:'pointer' }}
                onMouseEnter={e=>(e.currentTarget.style.background='rgba(239,68,68,0.1)')}
                onMouseLeave={e=>(e.currentTarget.style.background='rgba(239,68,68,0.04)')}>
                {v.photo ? <img src={v.photo} alt="" style={{ width:34, height:24, objectFit:'cover', borderRadius:4, flexShrink:0 }}/> : <span style={{ fontSize:16 }}>{{'car':'🚗','truck':'🚛','van':'🚐','bus':'🚌','moto':'🏍️','construction':'🏗️'}[v.category||'car']||'🚗'}</span>}
                <div style={{ flex:1, fontSize:13, fontWeight:500, color:'var(--text)' }}>{v.make} {v.model} {v.plate ? `· ${v.plate}` : ''}</div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <span style={{ color:'var(--danger)', fontWeight:700, fontSize:13 }}>⚠️ {v.days}d</span>
                  <span style={{ color:'var(--text2)', fontSize:12, marginLeft:8 }}>{fmtCur(v.holdingCost)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ═══ KPIs ═══ */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(155px,1fr))', gap:10, marginBottom:20 }}>
        {KPIs.map(k => (
          <div key={k.label} className="card" style={{ borderLeft:`3px solid ${k.color}`, padding:'12px 14px' }}>
            <div style={{ fontSize:20 }}>{k.icon}</div>
            <div style={{ fontSize:19, fontWeight:700, marginTop:4, color:k.color }}>{k.value}</div>
            <div style={{ fontSize:11, color:'var(--text2)', marginTop:2, lineHeight:1.3 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* ═══ Status bar ═══ */}
      {vehicles.length > 0 && (
        <div className="card" style={{ marginBottom:16, padding:'12px 16px' }}>
          <div style={{ fontSize:13, fontWeight:600, marginBottom:8 }}>{LL(lang,'fleetSt')}</div>
          <div style={{ display:'flex', gap:2, height:16, borderRadius:4, overflow:'hidden', marginBottom:8 }}>
            {(['purchased','transit_in','stored','for_sale','sold','transit_out','delivered'] as const).map(s => {
              const c = vehicles.filter(v => v.status === s).length
              if (!c) return null
              const colors: Record<string,string> = { purchased:'#3b82f6', transit_in:'#22c55e', stored:'#f59e0b', for_sale:'#8b5cf6', sold:'#16a34a', transit_out:'#ef4444', delivered:'#06b6d4' }
              return <div key={s} style={{ background:colors[s], flex:c, minWidth:4 }} title={`${t(lang,`status.${s}`)}: ${c}`}/>
            })}
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {(['purchased','transit_in','stored','for_sale','sold','transit_out','delivered'] as const).map(s => {
              const c = vehicles.filter(v => v.status === s).length
              if (!c) return null
              return <span key={s} className={`badge status-${s}`} style={{ fontSize:11 }}>{t(lang,`status.${s}`)} {c}</span>
            })}
          </div>
        </div>
      )}

      {/* ═══ Bottom grid ═══ */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <h2 style={{ fontSize:14, fontWeight:600, margin:0 }}>{LL(lang,'recentV')}</h2>
            <Link href="/vehicles" style={{ color:'var(--primary)', fontSize:12, textDecoration:'none' }}>{LL(lang,'viewAll')}</Link>
          </div>
          {vehicles.length === 0 ? (
            <div style={{ textAlign:'center', padding:'20px 0', color:'var(--text2)' }}>
              <div style={{ fontSize:32 }}>🚗</div>
              <p style={{ marginTop:8, fontSize:13 }}>{LL(lang,'addFirst')}</p>
              <Link href="/vehicles"><button className="btn btn-primary" style={{ marginTop:8, fontSize:13 }}>+ {t(lang,'veh.new')}</button></Link>
            </div>
          ) : recent.map(v => {
            const fin = calcFinancials(v)
            const sc = scoreVehicle(v)
            return (
              <Link key={v.id} href="/vehicles" style={{ textDecoration:'none', color:'var(--text)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 0', borderBottom:'1px solid var(--border)' }}>
                  {v.photo ? <img src={v.photo} alt="" style={{ width:34, height:24, objectFit:'cover', borderRadius:3, flexShrink:0 }}/> : <div style={{ width:34, height:24, background:'var(--surface2)', borderRadius:3, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>{{'car':'🚗','truck':'🚛','van':'🚐','bus':'🚌','moto':'🏍️','construction':'🏗️'}[v.category||'car']||'🚗'}</div>}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:500, fontSize:13, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{v.make} {v.model} {v.year ? `'${String(v.year).slice(-2)}` : ''}</div>
                    <div style={{ fontSize:11, color:'var(--text2)' }}>{v.plate || '—'}</div>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                      <span className={`badge status-${v.status}`} style={{ fontSize:10 }}>{t(lang,`status.${v.status}`)}</span>
                      <span style={{ fontSize:11, color: sc.total >= 70 ? '#22c55e' : sc.total >= 45 ? '#f59e0b' : '#ef4444', fontWeight:700 }}>{sc.total}</span>
                    </div>
                    {fin.saleRevenue > 0 && <div style={{ fontSize:11, color:fin.grossProfit >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight:600, marginTop:1 }}>{fin.grossProfit >= 0 ? '+' : ''}{fmtCur(fin.grossProfit)}</div>}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div className="card">
            <div style={{ fontSize:13, fontWeight:600, marginBottom:8 }}>{LL(lang,'quickL')}</div>
            {[
              { href:'/manifest', icon:'📋', label:t(lang,'manifest.title') },
              { href:'/analytics', icon:'📈', label:t(lang,'nav.analytics') },
              { href:'/import', icon:'📥', label:t(lang,'nav.import') },
              { href:'/settings', icon:'⚙️', label:t(lang,'nav.settings') },
              { href:'/landing', icon:'🌐', label:'Landing Page' },
            ].map(item => (
              <Link key={item.href} href={item.href} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 0', borderBottom:'1px solid var(--border)', textDecoration:'none', color:'var(--text)', fontSize:13 }}>
                <span>{item.icon}</span><span>{item.label}</span><span style={{ marginLeft:'auto', color:'var(--text2)' }}>→</span>
              </Link>
            ))}
          </div>

          {sold.length > 0 && (
            <div className="card" style={{ borderLeft:'3px solid var(--success)' }}>
              <div style={{ fontSize:12, color:'var(--text2)', marginBottom:4 }}>P&L</div>
              <div style={{ fontSize:26, fontWeight:800, color:totalProfit >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                {totalProfit >= 0 ? '+' : ''}{fmtCur(totalProfit)}
              </div>
              <div style={{ fontSize:12, color:'var(--text2)', marginTop:4 }}>
                {sold.length} {LL(lang,'sold')} · {avgDays > 0 ? `ø ${avgDays}d` : ''}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
