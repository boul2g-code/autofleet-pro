'use client'
import { useMemo } from 'react'
import Link from 'next/link'
import AppShell from '@/components/AppShell'
import { useFleetStore } from '@/store/useFleetStore'
import { calcFinancials, fmtCur } from '@/lib/financials'
import { localeForLang, t } from '@/lib/i18n'
import {
  getEffectiveTargetProfit,
  getMissingDocTypes,
  hasLowMargin,
  hasMissingRequiredDocs,
  hasNoSalePrice,
  type RequiredDocType,
} from '@/lib/vehicleHealth'
import BackupReminder from '@/components/BackupReminder'

function daysSince(date?: string) {
  if (!date) return 0
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000)
}

const catIcon: Record<string, string> = {
  car: '🚗', truck: '🚛', van: '🚐', bus: '🚌', moto: '🏍️', construction: '🏗️'
}

type MissingDocGroup = {
  type: RequiredDocType
  count: number
}

export default function DashboardPage() {
  const { vehicles, settings } = useFleetStore()
  const lang = settings?.lang ?? 'el'
  const tx = (key: string, vars?: Record<string, string | number>) => t(lang, key, vars)
  const org = settings?.org

  const defaultStoreCost = org?.defaultStoreCost || 8

  const now = new Date()
  const hour = now.getHours()
  const greeting =
    hour < 12 ? tx('dash.greeting.morning')
    : hour < 18 ? tx('dash.greeting.afternoon')
    : tx('dash.greeting.evening')

  const stats = useMemo(() => {
    const inStock = vehicles.filter(v => ['purchased','transit_in','stored','for_sale'].includes(v.status || ''))
    const sold = vehicles.filter(v => ['sold','transit_out','delivered'].includes(v.status || ''))
    const stockValue = inStock.reduce((s, v) => s + (v.purchase?.price || 0), 0)
    const targetProfit = getEffectiveTargetProfit(org)

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
    const missingDocsVehicles = inStock.filter(hasMissingRequiredDocs)
    const missingDocGroups: MissingDocGroup[] = (['invoice', 'registration', 'coc', 'cmr'] as const)
      .map(type => ({
        type,
        count: inStock.filter(v => getMissingDocTypes(v).includes(type)).length,
      }))
      .filter(group => group.count > 0)
    const belowTargetMarginVehicles = inStock.filter(v => hasLowMargin(v, targetProfit))
    const noSalePriceVehicles = inStock.filter(hasNoSalePrice)
    const agingCost = [...over90, ...over45].reduce((s, v) => {
      return s + (daysSince(v.purchase?.date || v.created_at) * (v.storage?.costPerDay || defaultStoreCost))
    }, 0)

    const inTransit = vehicles.filter(v => ['transit_in','transit_out'].includes(v.status || ''))
    const pendingDelivery = vehicles.filter(v => v.status === 'transit_out').length
    const missingDocs = missingDocsVehicles.length

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
      const monthName = d.toLocaleString(localeForLang(lang), { month: 'short' })
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

    const highMargin = inStock.filter(v => calcFinancials(v).grossProfit > 4000).length

    // ── Health Score ────────────────────────────────────────
    const totalInStock = inStock.length
    const deadStockCount = over90.length
    const missingDocsCount = missingDocsVehicles.length
    const belowTargetMargin = belowTargetMarginVehicles.length
    const noSalePrice = noSalePriceVehicles.length
    const lockedCapital = over90.reduce((s, v) => s + (v.purchase?.price || 0), 0)
    const deadStockPenalty = totalInStock > 0
      ? Math.min(30, Math.round((deadStockCount / totalInStock) * 30))
      : 0
    const missingDocsPenalty = totalInStock > 0
      ? Math.min(20, Math.round((missingDocsCount / totalInStock) * 20))
      : 0
    const lowMarginPenalty = totalInStock > 0
      ? Math.min(20, Math.round((belowTargetMargin / totalInStock) * 20))
      : 0
    const noSalePricePenalty = totalInStock > 0
      ? Math.min(15, Math.round((noSalePrice / totalInStock) * 15))
      : 0

    // Score: start at 100, deduct for problems
    const healthScore = Math.max(
      0,
      100 - deadStockPenalty - missingDocsPenalty - lowMarginPenalty - noSalePricePenalty,
    )
    const healthBreakdown = [
      { key: 'dead-stock', penalty: deadStockPenalty, count: deadStockCount },
      { key: 'missing-docs', penalty: missingDocsPenalty, count: missingDocsCount },
      { key: 'low-margin', penalty: lowMarginPenalty, count: belowTargetMargin },
      { key: 'no-sale-price', penalty: noSalePricePenalty, count: noSalePrice },
    ].filter(item => item.count > 0 && item.penalty > 0)

    return {
      total: vehicles.length, inStock: inStock.length, stockValue,
      sold: sold.length, monthProfit, totalProfit, avgDays, avgDaysDelta,
      over90: over90.length, over45: over45.length, over120: over120.length,
      agingCost, inTransit: inTransit.length, pendingDelivery, missingDocs,
      highMargin, topOpp, needsAttn, opportunities, deadStock, fleetTrend, recent,
      healthScore, deadStockCount, missingDocsCount, missingDocGroups,
      belowTargetMargin, noSalePrice, lockedCapital, targetProfit, healthBreakdown,
    }
  }, [vehicles, defaultStoreCost, lang, org])

  const statusColor: Record<string, string> = {
    purchased:'#3B82F6',transit_in:'#10B981',stored:'#F59E0B',
    for_sale:'#8B5CF6',sold:'#22C55E',transit_out:'#EF4444',delivered:'#6EE7B7'
  }

  const maxTrendVal = Math.max(...stats.fleetTrend.map(t => t.value), 1)

  const healthScore = stats.healthScore
  const scoreColor = healthScore >= 90 ? '#16A34A' : healthScore >= 70 ? '#D97706' : '#DC2626'
  const scoreBg = healthScore >= 90 ? '#F0FDF4' : healthScore >= 70 ? '#FFFBEB' : '#FEF2F2'
  const scoreBorder = healthScore >= 90 ? '#BBF7D0' : healthScore >= 70 ? '#FDE68A' : '#FECACA'
  const scoreTooltip = [
    tx('dash.scoreSummary', { score: healthScore }),
    ...stats.healthBreakdown.map(item => {
      const label = item.key === 'dead-stock'
        ? tx('dash.breakdown.deadStock')
        : item.key === 'missing-docs'
          ? tx('dash.breakdown.missingDocs')
          : item.key === 'low-margin'
            ? tx('dash.breakdown.lowMargin')
            : tx('dash.breakdown.noSalePrice')
      return `-${item.penalty} ${label}`
    }),
  ].join('\n')

  return (
    <AppShell>
      {/* ── DEALER HEALTH PANEL ── */}
      <div style={{
        background: scoreBg,
        border: `1.5px solid ${scoreBorder}`,
        borderRadius: 12,
        padding: '14px 20px',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        flexWrap: 'wrap',
      }}>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'white',
            border: `3px solid ${scoreColor}`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }} title={scoreTooltip}>
            <div style={{ fontSize: 20, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{healthScore}</div>
            <div style={{ fontSize: 9, color: scoreColor, fontWeight: 600 }}>/100</div>
          </div>
          <div style={{ fontSize: 10, color: '#6B7280', marginTop: 4, fontWeight: 600 }}>
            {tx('dash.fleetHealth')}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              {stats.healthBreakdown.length === 0 ? (
                <div style={{ fontSize: 15, fontWeight: 700, color: '#16A34A' }}>
                  ✅ {tx('dash.allGoodNoIssues')}
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '6px 16px' }}>
                    {stats.deadStockCount > 0 && (
                      <Link href="/vehicles?health=dead-stock" style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#374151', textDecoration:'none' }}>
                        <span>🚨</span>
                        <span style={{ fontWeight:700, color:'#DC2626' }}>{stats.deadStockCount}</span>
                        <span>{tx('dash.healthVehiclesOverDays', { count: stats.deadStockCount, days: 90 })}</span>
                      </Link>
                    )}
                    {stats.lockedCapital > 0 && (
                      <Link href="/vehicles?health=dead-stock" style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#374151', textDecoration:'none' }}>
                        <span>💰</span>
                        <span style={{ fontWeight:700, color:'#D97706' }}>{fmtCur(stats.lockedCapital)}</span>
                        <span>{tx('dash.lockedCapital')}</span>
                      </Link>
                    )}
                    {stats.belowTargetMargin > 0 && (
                      <Link href="/vehicles?health=low-margin" style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#374151', textDecoration:'none' }}>
                        <span>📉</span>
                        <span style={{ fontWeight:700, color:'#DC2626' }}>{stats.belowTargetMargin}</span>
                        <span>{tx('dash.belowTarget', { amount: fmtCur(stats.targetProfit) })}</span>
                      </Link>
                    )}
                    {stats.noSalePrice > 0 && (
                      <Link href="/vehicles?health=no-sale-price" style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#374151', textDecoration:'none' }}>
                        <span>🏷️</span>
                        <span style={{ fontWeight:700, color:'#6B7280' }}>{stats.noSalePrice}</span>
                        <span>{tx('dash.noSalePrice')}</span>
                      </Link>
                    )}
                  </div>

                  {stats.missingDocGroups.length > 0 && (
                    <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#92400E' }}>📄 {tx('dash.missingLabel')}</span>
                      {stats.missingDocGroups.map(group => (
                        <Link
                          key={group.type}
                          href="/vehicles?health=missing-docs"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '4px 9px',
                            borderRadius: 999,
                            background: '#FFF7ED',
                            border: '1px solid #FED7AA',
                            fontSize: 12,
                            color: '#9A3412',
                            textDecoration: 'none',
                            fontWeight: 600,
                          }}
                        >
                          <span>{group.count}</span>
                          <span>{tx(`doc.${group.type}`)}</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: 10, fontSize: 12, color: '#6B7280', display: 'flex', flexDirection: 'column', gap: 2 }} title={scoreTooltip}>
                    {stats.healthBreakdown.map(item => (
                      <span key={item.key}>
                        -{item.penalty}{' '}
                        {item.key === 'dead-stock'
                          ? tx('dash.breakdown.deadStock')
                          : item.key === 'missing-docs'
                            ? tx('dash.breakdown.missingDocs')
                            : item.key === 'low-margin'
                              ? tx('dash.breakdown.lowMargin')
                              : tx('dash.breakdown.noSalePrice')}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {stats.healthBreakdown.length > 0 && (
              <Link href="/vehicles?health=attention" className="btn btn-primary" style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>
                {tx('dash.fixIssues')}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── MORNING BRIEF ── */}
      <div style={{
        background:'linear-gradient(135deg,#1E293B 0%,#312E81 100%)',
        borderRadius:12,padding:'16px 22px',marginBottom:16,
        display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:12,
      }}>
        <div>
          <div style={{color:'#94A3B8',fontSize:12,marginBottom:3}}>
            {now.toLocaleDateString(localeForLang(lang),{weekday:'long',day:'numeric',month:'long'})}
          </div>
          <div style={{color:'#F1F5F9',fontSize:17,fontWeight:700,marginBottom:10}}>
            {greeting}{org?.name?`, ${org.name}`:''} 👋
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:14}}>
            {stats.over90>0&&<span style={{color:'#FCA5A5',fontSize:13}}>⚠️ <strong>{stats.over90}</strong> {tx('dash.healthVehiclesOverDays', { count: stats.over90, days: 90 })}</span>}
            {stats.highMargin>0&&<span style={{color:'#86EFAC',fontSize:13}}>💰 <strong>{stats.highMargin}</strong> {tx('dash.marginOverAmount', { amount: '€4.000' })}</span>}
            {stats.pendingDelivery>0&&<span style={{color:'#93C5FD',fontSize:13}}>🚚 <strong>{stats.pendingDelivery}</strong> {tx('dash.pendingDeliveries')}</span>}
            {stats.missingDocs>0&&<span style={{color:'#FDE68A',fontSize:13}}>📄 <strong>{stats.missingDocs}</strong> {tx('dash.missingDocuments')}</span>}
            {stats.over90===0&&stats.highMargin===0&&stats.pendingDelivery===0&&stats.missingDocs===0&&(
              <span style={{color:'#86EFAC',fontSize:13}}>✅ {tx('dash.allGoodShort')}</span>
            )}
          </div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{color:'#64748B',fontSize:11}}>P&L</div>
          <div style={{color:stats.totalProfit>=0?'#86EFAC':'#FCA5A5',fontSize:22,fontWeight:700}}>
            {stats.totalProfit>=0?'+':''}{fmtCur(stats.totalProfit)}
          </div>
          <div style={{color:'#64748B',fontSize:11}}>{tx('dash.basedOnSales', { count: stats.sold })}{stats.avgDays>0?` · ø ${stats.avgDays}d`:''}</div>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:10,marginBottom:16}}>
        {[
          {label:tx('dash.total'),value:stats.total,icon:'🚗',color:'#6366F1'},
          {label:tx('dash.inStock'),value:stats.inStock,icon:'📦',color:'#8B5CF6'},
          {label:tx('dash.stockValue'),value:fmtCur(stats.stockValue),icon:'💶',color:'#059669'},
          {label:tx('dash.monthProfit'),value:fmtCur(stats.monthProfit),icon:'📅',color:stats.monthProfit>=0?'#059669':'#DC2626'},
          {label:tx('dash.inTransit'),value:stats.inTransit,icon:'🚚',color:'#0284C7'},
          {label:tx('dash.sold'),value:stats.sold,icon:'✅',color:'#16A34A'},
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
            📈 {tx('dash.fleetValueLastMonths')}
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
          <div style={{fontSize:10,color:'var(--text2)',marginTop:4}}>{tx('dash.monthlyProfit')}</div>
        </div>

        {/* Avg Days to Sell */}
        <div className="card" style={{padding:'14px 16px',display:'flex',flexDirection:'column',justifyContent:'center'}}>
          <div style={{fontWeight:600,fontSize:12,color:'var(--text2)',marginBottom:8}}>
            ⏱ {tx('dash.avgDaysToSellLong')}
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
              {stats.avgDaysDelta>0?'↑':'↓'} {Math.abs(stats.avgDaysDelta)}d {tx('dash.vsPrevPeriod')}
            </div>
          )}
          {stats.avgDays===0&&(
            <div style={{fontSize:12,color:'var(--text2)',marginTop:8}}>
              {tx('dash.noSalesYet')}
            </div>
          )}
          <div style={{marginTop:12,paddingTop:8,borderTop:'1px solid var(--border)'}}>
            <div style={{fontSize:11,color:'var(--text2)'}}>
              {tx('dash.basedOnSales', { count: stats.sold })}
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Dead Stock + Top Opportunities ── */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>

        {/* Dead Stock >120 days */}
        <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:10,padding:'14px 16px'}}>
          <div style={{fontWeight:700,fontSize:13,color:'#991B1B',marginBottom:10}}>
            💀 {tx('dash.deadStockTitle', { count: stats.over120, days: 120 })}
          </div>
          {stats.deadStock.length===0?(
            <div style={{fontSize:13,color:'#16a34a',fontWeight:500}}>✅ {tx('dash.none')}</div>
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
                {tx('dash.totalHoldingCost')} <strong>{fmtCur(stats.agingCost)}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Top Profit Opportunities */}
        <div style={{background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:10,padding:'14px 16px'}}>
          <div style={{fontWeight:700,fontSize:13,color:'#166534',marginBottom:10}}>
            🏆 {tx('dash.topProfitOpportunities')}
          </div>
          {stats.opportunities.length===0?(
            <div style={{fontSize:13,color:'var(--text2)'}}>
              {tx('dash.setSalePrices')}
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
                {tx('dash.sellTodayEarn')} <strong>{fmtCur(stats.opportunities.reduce((s,x)=>s+x.profit,0))}</strong>
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
              ⚠️ {tx('dash.healthVehiclesOverDays', { count: stats.over90 + stats.over45, days: 30 })}
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
            ✅ {tx('dash.noStockIssues')}
          </div>
        )}

        {stats.topOpp?(
          <Link href={`/vehicles/${stats.topOpp.id}`} style={{textDecoration:'none'}}>
            <div style={{background:'#EEF2FF',border:'1px solid #C7D2FE',borderRadius:10,padding:'14px 16px',height:'100%'}}>
              <div style={{fontWeight:700,fontSize:12,color:'#4F46E5',marginBottom:6}}>
                🚀 {tx('dash.nextBestSale')}
              </div>
              <div style={{fontSize:15,fontWeight:700}}>{catIcon[stats.topOpp.category||'car']} {stats.topOpp.make} {stats.topOpp.model}</div>
              <div style={{fontSize:11,color:'var(--text2)',margin:'3px 0'}}>{stats.topOpp.year} · {stats.topOpp.plate}</div>
              {stats.topOpp.sale?.price&&<div style={{fontSize:14,fontWeight:700,color:'#6366F1'}}>{fmtCur(stats.topOpp.sale.price)}</div>}
            </div>
          </Link>
        ):(
          <div className="card" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:90,color:'var(--text2)',fontSize:13}}>
            {tx('dash.noVehiclesForSale')}
          </div>
        )}
      </div>

      {/* ── Fleet Status ── */}
      <div className="card" style={{marginBottom:12,padding:'10px 16px'}}>
        <div style={{fontSize:11,fontWeight:600,color:'var(--text2)',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.04em'}}>
          {tx('dash.fleetStatus')}
        </div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          {(['purchased','transit_in','stored','for_sale','sold','transit_out','delivered'] as const).map(status=>{
            const count=vehicles.filter(v=>v.status===status).length
            return(
              <div key={status} style={{display:'flex',alignItems:'center',gap:4,fontSize:12}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:statusColor[status],flexShrink:0}}/>
                <span style={{color:'var(--text2)'}}>{tx(`status.${status}`)}</span>
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
            {tx('dash.recentVehicles')}
          </div>
          <Link href="/vehicles" style={{fontSize:12,color:'var(--primary)',textDecoration:'none'}}>
            {tx('action.viewAll')} →
          </Link>
        </div>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
          <tbody>
            {stats.recent.map(v=>{
              const fin=calcFinancials(v)
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
                      {v.status ? tx(`status.${v.status}`) : '—'}
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
