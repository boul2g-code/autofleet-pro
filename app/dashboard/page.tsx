/* eslint-disable react/no-unescaped-entities */
'use client'
import AppShell from '@/components/AppShell'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { calcFinancials, fmtCur } from '@/lib/financials'
import Link from 'next/link'
import type { Lang } from '@/lib/types'

// KPI labels in all languages
const KPI_LABELS: Record<string, Record<Lang, string>> = {
  stock:        { el:'Σε Απόθεμα', en:'In Stock', de:'Auf Lager', fr:'En stock', it:'In stock', es:'En stock' },
  stockValue:   { el:'Αξία Αποθέματος', en:'Stock Value', de:'Lagerwert', fr:'Valeur stock', it:'Valore stock', es:'Valor stock' },
  monthProfit:  { el:'Κέρδος Μήνα', en:'Month Profit', de:'Monatsgewinn', fr:'Bénéfice mois', it:'Profitto mese', es:'Beneficio mes' },
  avgDays:      { el:'Μέσος Χρόνος Πώλησης', en:'Avg Days to Sell', de:'Ø Verkaufstage', fr:'Délai moyen vente', it:'Giorni medi vendita', es:'Días medios venta' },
  totalProfit:  { el:'Συνολικό Κέρδος', en:'Total Profit', de:'Gesamtgewinn', fr:'Bénéfice total', it:'Profitto totale', es:'Beneficio total' },
  agingAlert:   { el:'Αυτοκίνητα σε Αναμονή', en:'Vehicles Sitting Too Long', de:'Fahrzeuge zu lange auf Lager', fr:'Véhicules en attente trop longue', it:'Auto ferme da troppo', es:'Vehículos parados demasiado' },
  agingCost:    { el:'Εκτιμώμενο Κόστος Αναμονής', en:'Estimated Holding Cost', de:'Geschätzte Haltekosten', fr:'Coût de détention estimé', it:'Costo stimato immobilizzo', es:'Costo estimado inmovilización' },
  topAging:     { el:'Top 10 Παλαιότερα', en:'Top 10 Oldest', de:'Top 10 Älteste', fr:'Top 10 Plus anciens', it:'Top 10 Auto ferme', es:'Top 10 Más antiguas' },
  daysInStock:  { el:'ημέρες σε απόθεμα', en:'days in stock', de:'Tage auf Lager', fr:'jours en stock', it:'giorni in stock', es:'días en stock' },
  estCost:      { el:'Εκτιμ. κόστος', en:'Est. cost', de:'Gesch. Kosten', fr:'Coût est.', it:'Costo stimato', es:'Costo estimado' },
  quickLinks:   { el:'Γρήγορες Συνδέσεις', en:'Quick Links', de:'Schnellzugriff', fr:'Accès rapide', it:'Accesso rapido', es:'Acceso rápido' },
  recentVeh:    { el:'Πρόσφατα Οχήματα', en:'Recent Vehicles', de:'Neueste Fahrzeuge', fr:'Véhicules récents', it:'Veicoli recenti', es:'Vehículos recientes' },
  noVehicles:   { el:'Δεν υπάρχουν οχήματα', en:'No vehicles yet', de:'Keine Fahrzeuge', fr:'Aucun véhicule', it:'Nessun veicolo', es:'Sin vehículos' },
  addFirst:     { el:'Προσθέστε το πρώτο σας', en:'Add your first vehicle', de:'Fügen Sie Ihr erstes Fahrzeug hinzu', fr:'Ajoutez votre premier véhicule', it:'Aggiungi il primo veicolo', es:'Añade tu primer vehículo' },
  fleetStatus:  { el:'Κατάσταση Στόλου', en:'Fleet Status', de:'Flottenstatus', fr:'Statut flotte', it:'Stato flotta', es:'Estado flota' },
  totalVeh:     { el:'Σύνολο Οχημάτων', en:'Total Vehicles', de:'Fahrzeuge gesamt', fr:'Total véhicules', it:'Totale veicoli', es:'Total vehículos' },
  sold:         { el:'Πωλήθηκαν', en:'Sold', de:'Verkauft', fr:'Vendus', it:'Venduti', es:'Vendidos' },
  inTransit:    { el:'Σε Μεταφορά', en:'In Transit', de:'Im Transport', fr:'En transit', it:'In transito', es:'En tránsito' },
}

const L = (lang: Lang, key: string) => KPI_LABELS[key]?.[lang] || KPI_LABELS[key]?.en || key

export default function DashboardPage() {
  const { vehicles, settings } = useFleetStore()
  const lang = settings.lang

  const inStock = vehicles.filter(v => ['purchased','transit_in','stored','for_sale'].includes(v.status || ''))
  const sold = vehicles.filter(v => ['sold','transit_out','delivered'].includes(v.status || ''))
  const inTransit = vehicles.filter(v => ['transit_in','transit_out'].includes(v.status || ''))

  // Stock value = sum of purchase prices of in-stock vehicles
  const stockValue = inStock.reduce((s, v) => s + (v.purchase?.price || 0), 0)

  // Month profit = sold this month
  const now = new Date()
  const monthProfit = sold.filter(v => {
    const d = new Date(v.sale?.date || v.updated_at || 0)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).reduce((s, v) => s + calcFinancials(v).grossProfit, 0)

  // Avg days to sell
  const avgDays = sold.length > 0
    ? Math.round(sold.filter(v => v.purchase?.date && v.sale?.date).reduce((s, v) => {
        const days = (new Date(v.sale!.date!).getTime() - new Date(v.purchase!.date!).getTime()) / 86400000
        return s + days
      }, 0) / Math.max(1, sold.filter(v => v.purchase?.date && v.sale?.date).length))
    : 0

  // Total profit
  const totalProfit = sold.reduce((s, v) => s + calcFinancials(v).grossProfit, 0)

  // STOCK AGING — vehicles sitting too long
  const agingVehicles = inStock
    .filter(v => v.purchase?.date || v.created_at)
    .map(v => {
      const startDate = v.storage?.arrivalDate || v.purchase?.date || v.created_at || ''
      const days = Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000)
      const dailyCost = v.storage?.costPerDay || 5 // default €5/day estimate
      const holdingCost = days * dailyCost
      return { ...v, days, holdingCost, dailyCost }
    })
    .filter(v => v.days > 30)
    .sort((a, b) => b.days - a.days)

  const totalHoldingCost = agingVehicles.reduce((s, v) => s + v.holdingCost, 0)

  // Recent vehicles
  const recent = [...vehicles]
    .sort((a,b) => new Date(b.updated_at || b.created_at || 0).getTime() - new Date(a.updated_at || a.created_at || 0).getTime())
    .slice(0, 8)

  return (
    <AppShell>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{t(lang, 'nav.dashboard')}</h1>
        <Link href="/vehicles">
          <button className="btn btn-primary">+ {t(lang, 'veh.new')}</button>
        </Link>
      </div>

      {/* ═══ AGING ALERT — Most valuable feature ═══ */}
      {agingVehicles.length > 0 && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '2px solid var(--danger)', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--danger)' }}>
                🔥 {agingVehicles.length} {L(lang, 'agingAlert')}
              </div>
              <div style={{ color: 'var(--text2)', fontSize: 13, marginTop: 2 }}>
                {L(lang, 'agingCost')}: <strong style={{ color: 'var(--danger)' }}>{fmtCur(totalHoldingCost)}</strong>
              </div>
            </div>
            <Link href="/manifest">
              <button className="btn btn-danger" style={{ fontSize: 12, padding: '6px 12px' }}>
                {L(lang, 'topAging')} →
              </button>
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {agingVehicles.slice(0, 5).map(v => (
              <Link key={v.id} href="/vehicles" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(239,68,68,0.05)', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.12)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.05)')}>
                  {v.photo
                    ? <img src={v.photo} alt="" style={{ width: 36, height: 26, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                    : <div style={{ width: 36, height: 26, background: 'var(--surface2)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🚗</div>
                  }
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>
                      {v.make} {v.model} {v.year} {v.plate ? `· ${v.plate}` : ''}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text2)' }}>
                      {v.storage?.location ? `📍 ${v.storage.location} · ` : ''}
                      {v.days} {L(lang, 'daysInStock')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ color: 'var(--danger)', fontWeight: 700, fontSize: 14 }}>
                      ⚠️ {v.days}d
                    </div>
                    <div style={{ color: 'var(--text2)', fontSize: 11 }}>
                      {L(lang, 'estCost')}: {fmtCur(v.holdingCost)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {agingVehicles.length > 5 && (
              <div style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 12, padding: '4px 0' }}>
                +{agingVehicles.length - 5} more...
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ KPI CARDS ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: L(lang, 'totalVeh'), value: vehicles.length, icon: '🚗', color: '#3b82f6' },
          { label: L(lang, 'stock'), value: inStock.length, icon: '📦', color: '#f59e0b' },
          { label: L(lang, 'stockValue'), value: fmtCur(stockValue), icon: '💰', color: '#8b5cf6' },
          { label: L(lang, 'sold'), value: sold.length, icon: '✅', color: '#22c55e' },
          { label: L(lang, 'monthProfit'), value: fmtCur(monthProfit), icon: '📅', color: monthProfit >= 0 ? '#22c55e' : '#ef4444' },
          { label: L(lang, 'totalProfit'), value: fmtCur(totalProfit), icon: '📈', color: totalProfit >= 0 ? '#22c55e' : '#ef4444' },
          { label: L(lang, 'inTransit'), value: inTransit.length, icon: '🚚', color: '#06b6d4' },
          { label: L(lang, 'avgDays'), value: avgDays > 0 ? `${avgDays}d` : '—', icon: '⏱️', color: avgDays > 60 ? '#ef4444' : avgDays > 30 ? '#f59e0b' : '#22c55e' },
        ].map(k => (
          <div key={k.label} className="card" style={{ borderLeft: `3px solid ${k.color}`, padding: '12px 14px' }}>
            <div style={{ fontSize: 20 }}>{k.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2, lineHeight: 1.3 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* ═══ Status bar ═══ */}
      {vehicles.length > 0 && (
        <div className="card" style={{ marginBottom: 16, padding: '12px 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{L(lang, 'fleetStatus')}</div>
          <div style={{ display: 'flex', gap: 2, height: 18, borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
            {(['purchased','transit_in','stored','for_sale','sold','transit_out','delivered'] as const).map(s => {
              const count = vehicles.filter(v => v.status === s).length
              if (!count) return null
              const colors: Record<string, string> = { purchased:'#3b82f6', transit_in:'#22c55e', stored:'#f59e0b', for_sale:'#8b5cf6', sold:'#16a34a', transit_out:'#ef4444', delivered:'#06b6d4' }
              return <div key={s} style={{ background: colors[s], flex: count, minWidth: 4 }} title={`${t(lang, `status.${s}`)}: ${count}`} />
            })}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(['purchased','transit_in','stored','for_sale','sold','transit_out','delivered'] as const).map(s => {
              const count = vehicles.filter(v => v.status === s).length
              if (!count) return null
              return <span key={s} className={`badge status-${s}`} style={{ fontSize: 11 }}>{t(lang, `status.${s}`)} {count}</span>
            })}
          </div>
        </div>
      )}

      {/* ═══ Bottom grid ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent vehicles */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{L(lang, 'recentVeh')}</h2>
            <Link href="/vehicles" style={{ color: 'var(--primary)', fontSize: 12, textDecoration: 'none' }}>{t(lang, 'action.viewAll')} →</Link>
          </div>
          {vehicles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text2)' }}>
              <div style={{ fontSize: 32 }}>🚗</div>
              <p style={{ marginTop: 8, fontSize: 13 }}>{L(lang, 'addFirst')}</p>
              <Link href="/vehicles"><button className="btn btn-primary" style={{ marginTop: 8, fontSize: 13 }}>+ {t(lang, 'veh.new')}</button></Link>
            </div>
          ) : recent.map(v => {
            const fin = calcFinancials(v)
            return (
              <Link key={v.id} href="/vehicles" style={{ textDecoration: 'none', color: 'var(--text)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  {v.photo
                    ? <img src={v.photo} alt="" style={{ width: 34, height: 24, objectFit: 'cover', borderRadius: 3, flexShrink: 0 }} />
                    : <div style={{ width: 34, height: 24, background: 'var(--surface2)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>🚗</div>
                  }
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {v.make} {v.model} {v.year ? `'${String(v.year).slice(-2)}` : ''}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text2)' }}>{v.plate || '—'}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span className={`badge status-${v.status}`} style={{ fontSize: 10 }}>{t(lang, `status.${v.status}`)}</span>
                    {fin.saleRevenue > 0 && (
                      <div style={{ fontSize: 11, color: fin.grossProfit >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600, marginTop: 2 }}>
                        {fin.grossProfit >= 0 ? '+' : ''}{fmtCur(fin.grossProfit)}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick links + profit summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{L(lang, 'quickLinks')}</div>
            {[
              { href:'/manifest', icon:'📋', label: t(lang, 'manifest.title') },
              { href:'/analytics', icon:'📈', label: t(lang, 'nav.analytics') },
              { href:'/import', icon:'📥', label: t(lang, 'nav.import') },
              { href:'/settings', icon:'⚙️', label: t(lang, 'nav.settings') },
              { href:'/landing', icon:'🌐', label: 'Landing Page' },
            ].map(item => (
              <Link key={item.href} href={item.href}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 0', borderBottom:'1px solid var(--border)', textDecoration:'none', color:'var(--text)', fontSize:13 }}>
                <span>{item.icon}</span><span>{item.label}</span>
                <span style={{ marginLeft:'auto', color:'var(--text2)' }}>→</span>
              </Link>
            ))}
          </div>

          {sold.length > 0 && (
            <div className="card" style={{ borderLeft: '3px solid var(--success)' }}>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>P&L — {L(lang, 'sold')}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: totalProfit >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                {totalProfit >= 0 ? '+' : ''}{fmtCur(totalProfit)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>
                {sold.length} veicoli · {avgDays > 0 ? `ø ${avgDays}d` : ''}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
