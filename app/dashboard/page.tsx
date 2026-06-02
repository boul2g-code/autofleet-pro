'use client'
import { useMemo } from 'react'
import Link from 'next/link'
import AppShell from '@/components/AppShell'
import { useFleetStore } from '@/store/useFleetStore'
import { calcFinancials, fmtCur } from '@/lib/financials'
import BackupReminder from '@/components/BackupReminder'

function daysSince(date?: string) {
  if (!date) return 0
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000)
}

const catIcon: Record<string, string> = {
  car: '🚗', truck: '🚛', van: '🚐', bus: '🚌', moto: '🏍️', construction: '🏗️'
}

function L(lang: string, el: string, it: string, de: string, fr: string, es: string, en: string) {
  const map: Record<string, string> = { el, it, de, fr, es }
  return map[lang] || en
}

export default function DashboardPage() {
  const { vehicles, settings } = useFleetStore()
  const lang = settings?.lang ?? 'el'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const org = settings?.org as any

  const defaultStoreCost = org?.defaultStoreCost || 8

  const now = new Date()
  const hour = now.getHours()
  const greeting =
    hour < 12 ? L(lang,'Καλημέρα','Buongiorno','Guten Morgen','Bonjour','Buenos días','Good morning')
    : hour < 18 ? L(lang,'Καλό απόγευμα','Buon pomeriggio','Guten Tag','Bon après-midi','Buenas tardes','Good afternoon')
    : L(lang,'Καλησπέρα','Buonasera','Guten Abend','Bonsoir','Buenas noches','Good evening')

  const stats = useMemo(() => {
    const inStock = vehicles.filter(v => ['purchased','transit_in','stored','for_sale'].includes(v.status || ''))
    const sold = vehicles.filter(v => ['sold','transit_out','delivered'].includes(v.status || ''))
    const stockValue = inStock.reduce((s, v) => s + (v.purchase?.price || 0), 0)

    const thisMonth = new Date(); thisMonth.setDate(1)
    const monthSold = sold.filter(v => v.sale?.date && new Date(v.sale.date) >= thisMonth)
    const monthProfit = monthSold.reduce((s, v) => s + calcFinancials(v).grossProfit, 0)
    const totalProfit = sold.reduce((s, v) => s + calcFinancials(v).grossProfit, 0)

    const soldWithDays = sold.filter(v => v.purchase?.date && v.sale?.date)
    const avgDays = soldWithDays.length > 0
      ? Math.round(soldWithDays.reduce((s, v) => {
          return s + (new Date(v.sale!.date!).getTime() - new Date(v.purchase!.date!).getTime()) / 86400000
        }, 0) / soldWithDays.length)
      : 0

    // Previous period avg (sold before this month)
    const prevSold = sold.filter(v => v.purchase?.date && v.sale?.date && new Date(v.sale.date) < thisMonth)
    const prevAvgDays = prevSold.length > 0
      ? Math.round(prevSold.reduce((s, v) => {
          return s + (new Date(v.sale!.date!).getTime() - new Date(v.purchase!.date!).getTime()) / 86400000
        }, 0) / prevSold.length)
      : 0
    const avgDaysDelta = prevAvgDays > 0 ? avgDays - prevAvgDays : 0

    const over90 = inStock.filter(v => daysSince(v.purchase?.date || v.created_at) > 90)
    const over45 = inStock.filter(v => { const d = daysSince(v.purchase?.date || v.created_at); return d > 45 && d <= 90 })
    const over120 = inStock.filter(v => daysSince(v.purchase?.date || v.created_at) > 120)
    const agingCost = [...over90, ...over45].reduce((s, v) => {
      return s + (daysSince(v.purchase?.date || v.created_at) * (v.storage?.costPerDay || defaultStoreCost))
    }, 0)

    const inTransit = vehicles.filter(v => ['transit_in','transit_out'].includes(v.status || ''))
    const pendingDelivery = vehicles.filter(v => v.status === 'transit_out').length
    const missingDocs = vehicles.filter(v => v.status === 'for_sale' && (!v.documents || v.documents.length === 0)).length

    // Top profit opportunities (for_sale or stored with sale price set)
    const opportunities = inStock
      .filter(v => ['for_sale','stored'].includes(v.status || '') && v.sale?.price && v.purchase?.price)
      .map(v => ({
        v,
        profit: (v.sale?.price || 0) - (v.purchase?.price || 0) - (v.transportIn?.cost || 0) - (v.storage?.workCost || 0)
      }))
      .filter(x => x.profit > 0)
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 4)

    // Dead stock >120 days
    const deadStock = inStock
      .filter(v => daysSince(v.purchase?.date || v.created_at) > 120)
      .sort((a, b) => daysSince(b.purchase?.date || b.created_at) - daysSince(a.purchase?.date || a.created_at))
      .slice(0, 4)

    // Fleet value trend (last 6 months)
    const fleetTrend: { month: string; value: number; profit: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}`
      const monthName = d.toLocaleString(lang === 'el' ? 'el-GR' : lang === 'it' ? 'it-IT' : lang === 'de' ? 'de-DE' : lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-GB', { month: 'short' })
      // Vehicles purchased up to end of this month, not yet sold
      const val = vehicles
        .filter(v => {
          const pur = v.purchase?.date?.slice(0,7)
          return pur && pur <= monthKey
        })
        .reduce((s, v) => {
          // If sold after this month or not sold, count as stock
          const saleDate = v.sale?.date?.slice(0,7)
          if (!saleDate || saleDate > monthKey) return s + (v.purchase?.price || 0)
          return s
        }, 0)
      const profit = sold
        .filter(v => v.sale?.date?.slice(0,7) === monthKey)
        .reduce((s, v) => s + calcFinancials(v).grossProfit, 0)
      fleetTrend.push({ month: monthName, value: val, profit })
    }

    const topOpp = opportunities[0]?.v || null
    const needsAttn = [...inStock]
      .sort((a, b) => daysSince(b.purchase?.date || b.created_at) - daysSince(a.purchase?.date || a.created_at))[0] || null

    const recent = [...vehicles]
      .sort((a, b) => new Date(b.updated_at || b.created_at || 0).getTime() - new Date(a.updated_at || a.created_at || 0).getTime())
      .slice(0, 6)

    const highMargin = inStock.filter(v => {
      const p = (v.sale?.price || 0) - (v.purchase?.price || 0) - (v.transportIn?.cost || 0)
      return p > 4000
    }).length

    return {
      total: vehicles.length, inStock: inStock.length, stockValue,
      sold: sold.length, monthProfit, totalProfit, avgDays, avgDaysDelta,
      over90: over90.length, over45: over45.length, over120: over120.length,
      agingCost, inTransit: inTransit.length, pendingDelivery, missingDocs,
      highMargin, topOpp, needsAttn, opportunities, deadStock, fleetTrend, recent,
    }
  }, [vehicles, defaultStoreCost, lang])

  const statusColor: Record<string, string> = {
    purchased:'#3B82F6',transit_in:'#10B981',stored:'#F59E0B',
    for_sale:'#8B5CF6',sold:'#22C55E',transit_out:'#EF4444',delivered:'#6EE7B7'
  }

  const maxTrendVal = Math.max(...stats.fleetTrend.map(t => t.value), 1)

  return (
    <AppShell>
      {/* ── MORNING BRIEF ── */}
      <div style={{
        background:'linear-gradient(135deg,#1E293B 0%,#312E81 100%)',
        borderRadius:12,padding:'16px 22px',marginBottom:16,
        display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:12,
      }}>
        <div>
          <div style={{color:'#94A3B8',fontSize:12,marginBottom:3}}>
            {now.toLocaleDateString(lang==='el'?'el-GR':lang==='it'?'it-IT':lang==='de'?'de-DE':lang==='fr'?'fr-FR':'en-GB',{weekday:'long',day:'numeric',month:'long'})}
          </div>
          <div style={{color:'#F1F5F9',fontSize:17,fontWeight:700,marginBottom:10}}>
            {greeting}{org?.name?`, ${org.name}`:''} 👋
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:14}}>
            {stats.over90>0&&<span style={{color:'#FCA5A5',fontSize:13}}>⚠️ <strong>{stats.over90}</strong> {L(lang,'οχήματα >90 ημέρες','veicoli >90 giorni','Fahrzeuge >90 Tage','véhicules >90 jours','vehículos >90 días','vehicles >90 days')}</span>}
            {stats.highMargin>0&&<span style={{color:'#86EFAC',fontSize:13}}>💰 <strong>{stats.highMargin}</strong> {L(lang,'περιθώριο >€4.000','margine >€4.000','Marge >€4.000','marge >€4.000','margen >€4.000','margin >€4,000')}</span>}
            {stats.pendingDelivery>0&&<span style={{color:'#93C5FD',fontSize:13}}>🚚 <strong>{stats.pendingDelivery}</strong> {L(lang,'παραδόσεις εκκρεμούν','consegne in sospeso','Lieferungen ausstehend','livraisons en attente','entregas pendientes','pending deliveries')}</span>}
            {stats.missingDocs>0&&<span style={{color:'#FDE68A',fontSize:13}}>📄 <strong>{stats.missingDocs}</strong> {L(lang,'έγγραφα λείπουν','documenti mancanti','Dokumente fehlen','documents manquants','documentos faltantes','missing documents')}</span>}
            {stats.over90===0&&stats.highMargin===0&&stats.pendingDelivery===0&&stats.missingDocs===0&&(
              <span style={{color:'#86EFAC',fontSize:13}}>✅ {L(lang,'Όλα εντάξει!','Tutto ok!','Alles gut!','Tout va bien!','¡Todo bien!','All good!')}</span>
            )}
          </div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{color:'#64748B',fontSize:11}}>P&L</div>
          <div style={{color:stats.totalProfit>=0?'#86EFAC':'#FCA5A5',fontSize:22,fontWeight:700}}>
            {stats.totalProfit>=0?'+':''}{fmtCur(stats.totalProfit)}
          </div>
          <div style={{color:'#64748B',fontSize:11}}>{stats.sold} {L(lang,'πωλήσεις','vendite','Verkäufe','ventes','ventas','sold')}{stats.avgDays>0?` · ø ${stats.avgDays}d`:''}</div>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:10,marginBottom:16}}>
        {[
          {label:L(lang,'Σύνολο','Totale','Gesamt','Total','Total','Total'),value:stats.total,icon:'🚗',color:'#6366F1'},
          {label:L(lang,'Σε Απόθεμα','In Stock','In Lager','En Stock','En Stock','In Stock'),value:stats.inStock,icon:'📦',color:'#8B5CF6'},
          {label:L(lang,'Αξία Αποθέματος','Valore Stock','Lagerwert','Valeur Stock','Valor Stock','Stock Value'),value:fmtCur(stats.stockValue),icon:'💶',color:'#059669'},
          {label:L(lang,'Κέρδος Μήνα','Profitto Mese','Monatsgewinn','Profit Mois','Ganancia Mes','Month Profit'),value:fmtCur(stats.monthProfit),icon:'📅',color:stats.monthProfit>=0?'#059669':'#DC2626'},
          {label:L(lang,'Σε Μεταφορά','In Transito','Im Transport','En Transit','En Tránsito','In Transit'),value:stats.inTransit,icon:'🚚',color:'#0284C7'},
          {label:L(lang,'Πωλήθηκαν','Venduti','Verkauft','Vendus','Vendidos','Sold'),value:stats.sold,icon:'✅',color:'#16A34A'},
        ].map(k=>(
          <div key={k.label} className="card" style={{padding:'10px 14px',display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:20}}>{k.icon}</span>
            <div>
              <div style={{fontSize:10,color:'var(--text2)',fontWeight:500,textTransform:'uppercase',letterSpacing:'0.04em'}}>{k.label}</div>
              <div style={{fontSize:17,fontWeight:700,color:k.color,lineHeight:1.2}}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── ROW 1: Fleet Trend + Avg Days ── */}
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:12,marginBottom:12}}>

        {/* Fleet Value Trend */}
        <div className="card" style={{padding:'14px 16px'}}>
          <div style={{fontWeight:600,fontSize:13,marginBottom:12}}>
            📈 {L(lang,'Αξία Στόλου - Τελευταίοι 6 Μήνες','Valore Flotta - Ultimi 6 Mesi','Flottenw. - Letzte 6 Monate','Valeur Flotte - 6 Derniers Mois','Valor Flota - Últimos 6 Meses','Fleet Value - Last 6 Months')}
          </div>
          <div style={{display:'flex',gap:6,alignItems:'flex-end',height:80}}>
            {stats.fleetTrend.map((t,i)=>(
              <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                <div style={{fontSize:9,color:'var(--text2)',fontWeight:500}}>
                  {t.value>0?`€${Math.round(t.value/1000)}k`:'—'}
                </div>
                <div style={{
                  width:'100%',background:'var(--primary)',borderRadius:'3px 3px 0 0',
                  height:`${Math.max(4,(t.value/maxTrendVal)*64)}px`,
                  opacity:i===5?1:0.4+i*0.1,
                  transition:'height 0.3s',
                }} />
                <div style={{fontSize:10,color:'var(--text2)'}}>{t.month}</div>
              </div>
            ))}
          </div>
          {/* Month profit row */}
          <div style={{display:'flex',gap:6,marginTop:8,borderTop:'1px solid var(--border)',paddingTop:8}}>
            {stats.fleetTrend.map((t,i)=>(
              <div key={i} style={{flex:1,textAlign:'center'}}>
                <div style={{fontSize:9,color:t.profit>0?'var(--success)':t.profit<0?'var(--danger)':'var(--text3)',fontWeight:500}}>
                  {t.profit!==0?`${t.profit>0?'+':''}€${Math.round(t.profit/1000)}k`:'—'}
                </div>
              </div>
            ))}
          </div>
          <div style={{fontSize:10,color:'var(--text2)',marginTop:4}}>{L(lang,'Κέρδος ανά μήνα','Profitto mensile','Gewinn pro Monat','Profit mensuel','Ganancia mensual','Monthly profit')}</div>
        </div>

        {/* Avg Days to Sell */}
        <div className="card" style={{padding:'14px 16px',display:'flex',flexDirection:'column',justifyContent:'center'}}>
          <div style={{fontWeight:600,fontSize:12,color:'var(--text2)',marginBottom:8}}>
            ⏱ {L(lang,'Μ.Ο. Ημέρες Πώλησης','Giorni Medi Vendita','Ø Verkaufstage','Jours Moyens Vente','Días Medios Venta','Avg Days to Sell')}
          </div>
          <div style={{fontSize:40,fontWeight:800,color:'var(--text)',lineHeight:1}}>
            {stats.avgDays>0?stats.avgDays:'—'}
            <span style={{fontSize:16,fontWeight:400,color:'var(--text2)'}}>{stats.avgDays>0?' d':''}</span>
          </div>
          {stats.avgDaysDelta!==0&&stats.avgDays>0&&(
            <div style={{
              marginTop:8,fontSize:13,fontWeight:600,
              color:stats.avgDaysDelta<0?'var(--success)':'var(--danger)',
            }}>
              {stats.avgDaysDelta>0?'↑':'↓'} {Math.abs(stats.avgDaysDelta)}d {L(lang,'από πέρσι','dal mese precedente','vom Vormonat','du mois précédent','del mes anterior','vs prev. period')}
            </div>
          )}
          {stats.avgDays===0&&(
            <div style={{fontSize:12,color:'var(--text2)',marginTop:8}}>
              {L(lang,'Δεν υπάρχουν πωλήσεις ακόμα','Nessuna vendita ancora','Noch keine Verkäufe','Pas encore de ventes','Sin ventas aún','No sales yet')}
            </div>
          )}
          <div style={{marginTop:12,paddingTop:8,borderTop:'1px solid var(--border)'}}>
            <div style={{fontSize:11,color:'var(--text2)'}}>
              {L(lang,'Βασίζεται σε','Basato su','Basiert auf','Basé sur','Basado en','Based on')} {stats.sold} {L(lang,'πωλήσεις','vendite','Verkäufe','ventes','ventas','sales')}
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Dead Stock + Top Opportunities ── */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>

        {/* Dead Stock >120 days */}
        <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:10,padding:'14px 16px'}}>
          <div style={{fontWeight:700,fontSize:13,color:'#991B1B',marginBottom:10}}>
            💀 {L(lang,`Dead Stock (${stats.over120} οχήματα >120 ημέρες)`,`Dead Stock (${stats.over120} veicoli >120 giorni)`,`Dead Stock (${stats.over120} Fahrzeuge >120 Tage)`,`Dead Stock (${stats.over120} véhicules >120 jours)`,`Dead Stock (${stats.over120} vehículos >120 días)`,`Dead Stock (${stats.over120} vehicles >120 days)`)}
          </div>
          {stats.deadStock.length===0?(
            <div style={{fontSize:13,color:'#16a34a',fontWeight:500}}>✅ {L(lang,'Κανένα!','Nessuno!','Keines!','Aucun!','¡Ninguno!','None!')}</div>
          ):(
            <div style={{display:'flex',flexDirection:'column',gap:5}}>
              {stats.deadStock.map(v=>{
                const d = daysSince(v.purchase?.date||v.created_at)
                const cost = d*(v.storage?.costPerDay||defaultStoreCost)
                return (
                  <Link key={v.id} href={`/vehicles/${v.id}`}
                    style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'#991B1B',textDecoration:'none',padding:'4px 0',borderBottom:'1px solid #FEE2E2'}}>
                    <span>{catIcon[v.category||'car']} {v.make} {v.model}</span>
                    <span style={{fontWeight:700}}>🔴 {d}d · {fmtCur(cost)}</span>
                  </Link>
                )
              })}
              <div style={{fontSize:11,color:'#B91C1C',marginTop:4}}>
                {L(lang,'Εκτιμ. κόστος αναμονής συνολικά:','Costo stimato totale:','Gesch. Gesamtkosten:','Coût total estimé:','Coste total estimado:','Est. total holding cost:')} <strong>{fmtCur(stats.agingCost)}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Top Profit Opportunities */}
        <div style={{background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:10,padding:'14px 16px'}}>
          <div style={{fontWeight:700,fontSize:13,color:'#166534',marginBottom:10}}>
            🏆 {L(lang,'Κορυφαίες Ευκαιρίες Κέρδους','Top Opportunità di Profitto','Top Gewinnchancen','Top Opportunités de Profit','Top Oportunidades Beneficio','Top Profit Opportunities')}
          </div>
          {stats.opportunities.length===0?(
            <div style={{fontSize:13,color:'var(--text2)'}}>
              {L(lang,'Βάλε τιμή πώλησης στα οχήματα','Imposta prezzi di vendita','Verkaufspreise setzen','Définir prix de vente','Establecer precios venta','Set sale prices on vehicles')}
            </div>
          ):(
            <div style={{display:'flex',flexDirection:'column',gap:5}}>
              {stats.opportunities.map(({v,profit})=>(
                <Link key={v.id} href={`/vehicles/${v.id}`}
                  style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'#166534',textDecoration:'none',padding:'4px 0',borderBottom:'1px solid #BBF7D0'}}>
                  <span>{catIcon[v.category||'car']} {v.make} {v.model}</span>
                  <span style={{fontWeight:700,color:'#16a34a'}}>+{fmtCur(profit)}</span>
                </Link>
              ))}
              <div style={{fontSize:11,color:'#166534',marginTop:4}}>
                {L(lang,'Πούλα σήμερα, βγάλε:','Vendi oggi, guadagni:','Heute verkaufen, Gewinn:','Vends aujourd\'hui, gagnes:','Vende hoy, ganas:','Sell today, earn:')} <strong>{fmtCur(stats.opportunities.reduce((s,x)=>s+x.profit,0))}</strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── ROW 3: Stock Alerts + Top Opportunity ── */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
        {(stats.over90>0||stats.over45>0)?(
          <div style={{background:'#FEF3C7',border:'1px solid #FDE68A',borderRadius:10,padding:'14px 16px'}}>
            <div style={{fontWeight:700,fontSize:13,color:'#92400E',marginBottom:8}}>
              ⚠️ {L(lang,`${stats.over90+stats.over45} οχήματα >30 ημέρες`,`${stats.over90+stats.over45} veicoli >30 giorni`,`${stats.over90+stats.over45} Fahrzeuge >30 Tage`,`${stats.over90+stats.over45} véhicules >30 jours`,`${stats.over90+stats.over45} vehículos >30 días`,`${stats.over90+stats.over45} vehicles >30 days`)}
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:3}}>
              {vehicles.filter(v=>['purchased','transit_in','stored','for_sale'].includes(v.status||''))
                .sort((a,b)=>daysSince(b.purchase?.date||b.created_at)-daysSince(a.purchase?.date||a.created_at))
                .slice(0,3).map(v=>{
                  const d=daysSince(v.purchase?.date||v.created_at)
                  const cost=d*(v.storage?.costPerDay||defaultStoreCost)
                  return(
                    <Link key={v.id} href={`/vehicles/${v.id}`}
                      style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'#92400E',textDecoration:'none',padding:'3px 0',borderBottom:'1px solid #FDE68A'}}>
                      <span>{catIcon[v.category||'car']} {v.make} {v.model}</span>
                      <span style={{fontWeight:600}}>{d>90?'🔴':d>45?'🟡':'🟢'} {d}d · {fmtCur(cost)}</span>
                    </Link>
                  )
                })
              }
            </div>
          </div>
        ):(
          <div className="card" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:90,color:'var(--text2)',fontSize:13}}>
            ✅ {L(lang,'Κανένα πρόβλημα!','Nessun problema!','Kein Problem!','Aucun problème!','¡Sin problemas!','No stock issues!')}
          </div>
        )}

        {stats.topOpp?(
          <Link href={`/vehicles/${stats.topOpp.id}`} style={{textDecoration:'none'}}>
            <div style={{background:'#EEF2FF',border:'1px solid #C7D2FE',borderRadius:10,padding:'14px 16px',height:'100%'}}>
              <div style={{fontWeight:700,fontSize:12,color:'#4F46E5',marginBottom:6}}>
                🚀 {L(lang,'Επόμενη Πώληση','Prossima Vendita','Nächster Verkauf','Prochaine Vente','Próxima Venta','Next Best Sale')}
              </div>
              <div style={{fontSize:15,fontWeight:700}}>{catIcon[stats.topOpp.category||'car']} {stats.topOpp.make} {stats.topOpp.model}</div>
              <div style={{fontSize:11,color:'var(--text2)',margin:'3px 0'}}>{stats.topOpp.year} · {stats.topOpp.plate}</div>
              {stats.topOpp.sale?.price&&<div style={{fontSize:14,fontWeight:700,color:'#6366F1'}}>{fmtCur(stats.topOpp.sale.price)}</div>}
            </div>
          </Link>
        ):(
          <div className="card" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:90,color:'var(--text2)',fontSize:13}}>
            {L(lang,'Δεν υπάρχουν προς πώληση','Nessun veicolo in vendita','Keine zum Verkauf','Aucun en vente','Sin vehículos en venta','No vehicles for sale')}
          </div>
        )}
      </div>

      {/* ── Fleet Status ── */}
      <div className="card" style={{marginBottom:12,padding:'10px 16px'}}>
        <div style={{fontSize:11,fontWeight:600,color:'var(--text2)',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.04em'}}>
          {L(lang,'Κατάσταση Στόλου','Stato Flotta','Flottenübersicht','État Flotte','Estado Flota','Fleet Status')}
        </div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          {(['purchased','transit_in','stored','for_sale','sold','transit_out','delivered'] as const).map(status=>{
            const count=vehicles.filter(v=>v.status===status).length
            const labels: Record<string,Record<string,string>> = {
              purchased:{el:'Αγοράστηκε',it:'Acquistato',de:'Gekauft',fr:'Acheté',es:'Comprado',en:'Purchased'},
              transit_in:{el:'Μεταφορά Εισ.',it:'Transito In',de:'Transport Ein',fr:'Transit Entrant',es:'Tránsito Ent.',en:'Transit In'},
              stored:{el:'Σε Αποθήκη',it:'In Magazzino',de:'Im Lager',fr:'En Entrepôt',es:'En Almacén',en:'Stored'},
              for_sale:{el:'Προς Πώληση',it:'In Vendita',de:'Zum Verkauf',fr:'En Vente',es:'En Venta',en:'For Sale'},
              sold:{el:'Πωλήθηκε',it:'Venduto',de:'Verkauft',fr:'Vendu',es:'Vendido',en:'Sold'},
              transit_out:{el:'Μεταφορά Εξ.',it:'Transito Out',de:'Transport Aus',fr:'Transit Sortant',es:'Tránsito Sal.',en:'Transit Out'},
              delivered:{el:'Παραδόθηκε',it:'Consegnato',de:'Geliefert',fr:'Livré',es:'Entregado',en:'Delivered'},
            }
            return(
              <div key={status} style={{display:'flex',alignItems:'center',gap:4,fontSize:12}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:statusColor[status],flexShrink:0}}/>
                <span style={{color:'var(--text2)'}}>{labels[status]?.[lang]||labels[status].en}</span>
                <span style={{fontWeight:700}}>{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Recent Vehicles ── */}
      <div className="card" style={{padding:0,overflow:'hidden'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 16px',borderBottom:'1px solid var(--border)'}}>
          <div style={{fontWeight:600,fontSize:13}}>
            {L(lang,'Πρόσφατα Οχήματα','Veicoli Recenti','Letzte Fahrzeuge','Véhicules Récents','Vehículos Recientes','Recent Vehicles')}
          </div>
          <Link href="/vehicles" style={{fontSize:12,color:'var(--primary)',textDecoration:'none'}}>
            {L(lang,'Δείτε όλα →','Vedi tutti →','Alle anzeigen →','Voir tout →','Ver todos →','View all →')}
          </Link>
        </div>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
          <tbody>
            {stats.recent.map(v=>{
              const fin=calcFinancials(v)
              const statusLabels: Record<string,Record<string,string>> = {
                purchased:{el:'Αγοράστηκε',it:'Acquistato',de:'Gekauft',fr:'Acheté',es:'Comprado',en:'Purchased'},
                transit_in:{el:'Μεταφορά Εισ.',it:'Transito In',de:'Transport Ein',fr:'Transit In',es:'Tránsito Ent.',en:'Transit In'},
                stored:{el:'Σε Αποθήκη',it:'In Magazzino',de:'Im Lager',fr:'En Stock',es:'En Almacén',en:'Stored'},
                for_sale:{el:'Προς Πώληση',it:'In Vendita',de:'Zum Verkauf',fr:'En Vente',es:'En Venta',en:'For Sale'},
                sold:{el:'Πωλήθηκε',it:'Venduto',de:'Verkauft',fr:'Vendu',es:'Vendido',en:'Sold'},
                transit_out:{el:'Μεταφορά Εξ.',it:'Transito Out',de:'Transport Aus',fr:'Transit Out',es:'Tránsito Sal.',en:'Transit Out'},
                delivered:{el:'Παραδόθηκε',it:'Consegnato',de:'Geliefert',fr:'Livré',es:'Entregado',en:'Delivered'},
              }
              return(
                <tr key={v.id} style={{borderBottom:'1px solid var(--border)'}}>
                  <td style={{padding:'8px 16px',width:32}}><span style={{fontSize:18}}>{catIcon[v.category||'car']||'🚗'}</span></td>
                  <td style={{padding:'8px 8px'}}>
                    <Link href={`/vehicles/${v.id}`} style={{color:'var(--text)',textDecoration:'none',fontWeight:500}}>
                      {v.make||'—'} {v.model||''}
                    </Link>
                    <div style={{fontSize:11,color:'var(--text2)'}}>{v.year}{v.plate?` · ${v.plate}`:''}</div>
                  </td>
                  <td style={{padding:'8px 8px'}}>
                    <span className={`badge status-${v.status}`} style={{fontSize:10}}>
                      {statusLabels[v.status||'']?.[lang]||v.status}
                    </span>
                  </td>
                  <td style={{padding:'8px 16px',textAlign:'right',fontWeight:600,fontSize:12,
                    color:fin.saleRevenue>0?(fin.grossProfit>=0?'var(--success)':'var(--danger)'):'var(--text2)'}}>
                    {fin.saleRevenue>0?(fin.grossProfit>=0?'+':'')+fmtCur(fin.grossProfit):'—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <BackupReminder />
    </AppShell>
  )
}
