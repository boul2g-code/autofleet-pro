'use client'
import { useMemo } from 'react'
import Link from 'next/link'
import AppShell from '@/components/AppShell'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { calcFinancials, fmtCur } from '@/lib/financials'
import BackupReminder from '@/components/BackupReminder'

function daysSince(date?: string) {
  if (!date) return 0
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000)
}

const catIcon: Record<string, string> = {
  car: '🚗', truck: '🚛', van: '🚐', bus: '🚌', moto: '🏍️', construction: '🏗️'
}

export default function DashboardPage() {
  const { vehicles, settings } = useFleetStore()
  const lang = settings?.lang ?? 'el'

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12
    ? { el: 'Καλημέρα', en: 'Good morning', de: 'Guten Morgen', fr: 'Bonjour', it: 'Buongiorno', es: 'Buenos días' }[lang]
    : hour < 18
    ? { el: 'Καλό απόγευμα', en: 'Good afternoon', de: 'Guten Tag', fr: 'Bon après-midi', it: 'Buon pomeriggio', es: 'Buenas tardes' }[lang]
    : { el: 'Καλησπέρα', en: 'Good evening', de: 'Guten Abend', fr: 'Bonsoir', it: 'Buonasera', es: 'Buenas noches' }[lang]

  const orgName = settings?.org?.name || ''

  const stats = useMemo(() => {
    const inStock = vehicles.filter(v =>
      ['purchased','transit_in','stored','for_sale'].includes(v.status || '')
    )
    const sold = vehicles.filter(v => ['sold','transit_out','delivered'].includes(v.status || ''))
    const stockValue = inStock.reduce((s, v) => s + (v.purchase?.price || 0), 0)

    const thisMonth = new Date(); thisMonth.setDate(1)
    const monthSold = sold.filter(v => v.sale?.date && new Date(v.sale.date) >= thisMonth)
    const monthProfit = monthSold.reduce((s, v) => s + calcFinancials(v).grossProfit, 0)
    const totalProfit = sold.reduce((s, v) => s + calcFinancials(v).grossProfit, 0)

    const soldWithDays = sold.filter(v => v.purchase?.date && v.sale?.date)
    const avgDays = soldWithDays.length > 0
      ? Math.round(soldWithDays.reduce((s, v) => {
          const d = (new Date(v.sale!.date!).getTime() - new Date(v.purchase!.date!).getTime()) / 86400000
          return s + d
        }, 0) / soldWithDays.length)
      : 0

    const over90 = inStock.filter(v => daysSince(v.purchase?.date || v.created_at) > 90)
    const over45 = inStock.filter(v => {
      const d = daysSince(v.purchase?.date || v.created_at)
      return d > 45 && d <= 90
    })
    const agingCost = [...over90, ...over45].reduce((s, v) => {
      const d = daysSince(v.purchase?.date || v.created_at)
      return s + (d * (v.storage?.costPerDay || 8))
    }, 0)

    const inTransit = vehicles.filter(v => ['transit_in','transit_out'].includes(v.status || ''))

    // Top opportunity: highest score/profit vehicle for_sale or stored
    const opportunities = inStock
      .filter(v => ['for_sale','stored'].includes(v.status || ''))
      .map(v => ({ v, fin: calcFinancials(v) }))
      .filter(x => x.fin.saleRevenue > 0 || x.v.sale?.price)
      .sort((a, b) => (b.v.sale?.price || 0) - (a.v.sale?.price || 0))
    const topOpp = opportunities[0]?.v || null

    // Needs attention: longest in stock
    const needsAttn = [...inStock]
      .sort((a, b) => daysSince(b.purchase?.date || b.created_at) - daysSince(a.purchase?.date || a.created_at))[0] || null

    // Pending deliveries
    const pendingDelivery = vehicles.filter(v => v.status === 'transit_out').length

    // Missing documents (for_sale with 0 docs)
    const missingDocs = vehicles.filter(v =>
      v.status === 'for_sale' && (!v.documents || v.documents.length === 0)
    ).length

    // High margin vehicles (profit > 4000, not sold)
    const highMargin = inStock.filter(v => {
      const sale = v.sale?.price || 0
      const cost = (v.purchase?.price || 0) + (v.transportIn?.cost || 0) + (v.storage?.workCost || 0)
      return sale > 0 && (sale - cost) > 4000
    })

    return {
      total: vehicles.length,
      inStock: inStock.length,
      stockValue,
      sold: sold.length,
      monthProfit,
      totalProfit,
      avgDays,
      over90: over90.length,
      over45: over45.length,
      agingCost,
      inTransit: inTransit.length,
      topOpp,
      needsAttn,
      pendingDelivery,
      missingDocs,
      highMargin: highMargin.length,
      recent: [...vehicles].sort((a, b) =>
        new Date(b.updated_at || b.created_at || 0).getTime() -
        new Date(a.updated_at || a.created_at || 0).getTime()
      ).slice(0, 6),
    }
  }, [vehicles])

  const statusColor: Record<string, string> = {
    purchased: '#3B82F6', transit_in: '#10B981', stored: '#F59E0B',
    for_sale: '#8B5CF6', sold: '#22C55E', transit_out: '#EF4444', delivered: '#6EE7B7'
  }

  return (
    <AppShell>
      {/* ── MORNING BRIEF ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #1E3A5F 100%)',
        borderRadius: 12, padding: '18px 24px', marginBottom: 20,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <div style={{ color: '#94A3B8', fontSize: 12, marginBottom: 4 }}>
            {now.toLocaleDateString(lang === 'el' ? 'el-GR' : lang === 'de' ? 'de-DE' : lang === 'it' ? 'it-IT' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <div style={{ color: '#F1F5F9', fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
            {greeting}{orgName ? `, ${orgName}` : ''} 👋
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {stats.over90 > 0 && (
              <div style={{ color: '#FCA5A5', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>⚠️</span>
                <span>
                  <strong>{stats.over90}</strong>{' '}
                  {lang === 'el' ? 'οχήματα πάνω από 90 ημέρες' :
                   lang === 'it' ? 'veicoli oltre 90 giorni' :
                   lang === 'de' ? 'Fahrzeuge über 90 Tage' :
                   'vehicles over 90 days'}
                </span>
              </div>
            )}
            {stats.highMargin > 0 && (
              <div style={{ color: '#86EFAC', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>💰</span>
                <span>
                  <strong>{stats.highMargin}</strong>{' '}
                  {lang === 'el' ? 'με περιθώριο >€4.000' :
                   lang === 'it' ? 'con margine >€4.000' :
                   'with margin >€4,000'}
                </span>
              </div>
            )}
            {stats.pendingDelivery > 0 && (
              <div style={{ color: '#93C5FD', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>🚚</span>
                <span>
                  <strong>{stats.pendingDelivery}</strong>{' '}
                  {lang === 'el' ? 'παραδόσεις σε εκκρεμότητα' :
                   lang === 'it' ? 'consegne in sospeso' :
                   'pending deliveries'}
                </span>
              </div>
            )}
            {stats.missingDocs > 0 && (
              <div style={{ color: '#FDE68A', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>📄</span>
                <span>
                  <strong>{stats.missingDocs}</strong>{' '}
                  {lang === 'el' ? 'έγγραφα λείπουν' :
                   lang === 'it' ? 'documenti mancanti' :
                   'missing documents'}
                </span>
              </div>
            )}
            {stats.over90 === 0 && stats.highMargin === 0 && stats.pendingDelivery === 0 && stats.missingDocs === 0 && (
              <div style={{ color: '#86EFAC', fontSize: 13 }}>
                ✅ {lang === 'el' ? 'Όλα εντάξει σήμερα!' : lang === 'it' ? 'Tutto ok oggi!' : 'All good today!'}
              </div>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#64748B', fontSize: 11 }}>P&L</div>
          <div style={{ color: stats.totalProfit >= 0 ? '#86EFAC' : '#FCA5A5', fontSize: 22, fontWeight: 700 }}>
            {stats.totalProfit >= 0 ? '+' : ''}{fmtCur(stats.totalProfit)}
          </div>
          <div style={{ color: '#64748B', fontSize: 11 }}>
            {stats.sold} {lang === 'el' ? 'πωλήσεις' : lang === 'it' ? 'vendite' : 'sold'}{stats.avgDays > 0 ? ` · ø ${stats.avgDays}d` : ''}
          </div>
        </div>
      </div>

      {/* ── KPI CARDS — compact ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginBottom: 20 }}>
        {[
          { label: lang === 'el' ? 'Σύνολο' : lang === 'it' ? 'Totale' : 'Total', value: stats.total, icon: '🚗', color: '#2563EB' },
          { label: lang === 'el' ? 'Σε Απόθεμα' : lang === 'it' ? 'In Stock' : 'In Stock', value: stats.inStock, icon: '📦', color: '#8B5CF6' },
          { label: lang === 'el' ? 'Αξία Αποθέματος' : lang === 'it' ? 'Valore Stock' : 'Stock Value', value: fmtCur(stats.stockValue), icon: '💶', color: '#059669' },
          { label: lang === 'el' ? 'Κέρδος Μήνα' : lang === 'it' ? 'Profitto Mese' : 'Month Profit', value: fmtCur(stats.monthProfit), icon: '📅', color: stats.monthProfit >= 0 ? '#059669' : '#DC2626' },
          { label: lang === 'el' ? 'Σε Μεταφορά' : lang === 'it' ? 'In Transito' : 'In Transit', value: stats.inTransit, icon: '🚚', color: '#0284C7' },
          { label: lang === 'el' ? 'Πωλήθηκαν' : lang === 'it' ? 'Venduti' : 'Sold', value: stats.sold, icon: '✅', color: '#16A34A' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 22 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: k.color, lineHeight: 1.2 }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── ROW: Alerts + Top Opportunity ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>

        {/* Stock Aging Alert */}
        {(stats.over90 > 0 || stats.over45 > 0) ? (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '14px 16px',
          }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#991B1B', marginBottom: 10 }}>
              🔥 {stats.over90 + stats.over45} {lang === 'el' ? 'οχήματα σε απόθεμα >30 ημέρες' : lang === 'it' ? 'veicoli in stock >30 giorni' : 'vehicles in stock >30 days'}
            </div>
            <div style={{ fontSize: 12, color: '#B91C1C', marginBottom: 10 }}>
              {lang === 'el' ? 'Εκτιμ. Κόστος Αναμονής' : lang === 'it' ? 'Costo stimato di giacenza' : 'Est. Holding Cost'}: <strong>{fmtCur(stats.agingCost)}</strong>
            </div>
            {/* Top 4 worst */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {vehicles
                .filter(v => ['purchased','transit_in','stored','for_sale'].includes(v.status || ''))
                .sort((a, b) => daysSince(b.purchase?.date || b.created_at) - daysSince(a.purchase?.date || a.created_at))
                .slice(0, 4)
                .map(v => {
                  const d = daysSince(v.purchase?.date || v.created_at)
                  const cost = d * (v.storage?.costPerDay || 8)
                  return (
                    <Link key={v.id} href={`/vehicles/${v.id}`}
                      style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#991B1B', textDecoration: 'none', padding: '3px 0', borderBottom: '1px solid #FEE2E2' }}>
                      <span>{catIcon[v.category || 'car']} {v.make} {v.model}</span>
                      <span style={{ fontWeight: 600 }}>⏱ {d}d · €{cost.toLocaleString()}</span>
                    </Link>
                  )
                })
              }
            </div>
          </div>
        ) : (
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100, color: 'var(--text2)', fontSize: 13 }}>
            ✅ {lang === 'el' ? 'Κανένα πρόβλημα αποθέματος!' : lang === 'it' ? 'Nessun problema di stock!' : 'No stock issues!'}
          </div>
        )}

        {/* Top Opportunity */}
        {stats.topOpp ? (
          <Link href={`/vehicles/${stats.topOpp.id}`} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '14px 16px', height: '100%',
            }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#166534', marginBottom: 8 }}>
                🏆 {lang === 'el' ? 'Καλύτερη Ευκαιρία' : lang === 'it' ? 'Migliore opportunità' : 'Top Opportunity'}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
                {catIcon[stats.topOpp.category || 'car']} {stats.topOpp.make} {stats.topOpp.model}
              </div>
              <div style={{ fontSize: 12, color: '#6B7280', margin: '4px 0' }}>
                {stats.topOpp.year} · {stats.topOpp.plate}
              </div>
              {stats.topOpp.sale?.price && (
                <div style={{ fontSize: 15, fontWeight: 700, color: '#16A34A', marginTop: 4 }}>
                  {lang === 'el' ? 'Τιμή Πώλησης' : lang === 'it' ? 'Prezzo vendita' : 'Sale Price'}: {fmtCur(stats.topOpp.sale.price)}
                </div>
              )}
              {stats.needsAttn && (
                <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid #BBF7D0' }}>
                  <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 2 }}>
                    ⚠️ {lang === 'el' ? 'Χρειάζεται Προσοχή' : lang === 'it' ? 'Richiede attenzione' : 'Needs Attention'}
                  </div>
                  <div style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>
                    {catIcon[stats.needsAttn.category || 'car']} {stats.needsAttn.make} {stats.needsAttn.model} · {daysSince(stats.needsAttn.purchase?.date || stats.needsAttn.created_at)}d
                  </div>
                </div>
              )}
            </div>
          </Link>
        ) : (
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100, color: 'var(--text2)', fontSize: 13 }}>
            {lang === 'el' ? 'Δεν υπάρχουν οχήματα προς πώληση' : 'No vehicles for sale'}
          </div>
        )}
      </div>

      {/* ── Fleet Status bar ── */}
      <div className="card" style={{ marginBottom: 16, padding: '12px 16px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {lang === 'el' ? 'Κατάσταση Στόλου' : lang === 'it' ? 'Stato Flotta' : 'Fleet Status'}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(Object.entries({
            purchased: vehicles.filter(v => v.status === 'purchased').length,
            transit_in: vehicles.filter(v => v.status === 'transit_in').length,
            stored: vehicles.filter(v => v.status === 'stored').length,
            for_sale: vehicles.filter(v => v.status === 'for_sale').length,
            sold: vehicles.filter(v => v.status === 'sold').length,
            transit_out: vehicles.filter(v => v.status === 'transit_out').length,
            delivered: vehicles.filter(v => v.status === 'delivered').length,
          }) as [string, number][]).map(([status, count]) => (
            <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor[status], flexShrink: 0 }} />
              <span style={{ color: 'var(--text2)' }}>{t(lang, `status.${status}`)}</span>
              <span style={{ fontWeight: 700, color: 'var(--text)' }}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Vehicles ── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 600, fontSize: 13 }}>
            {lang === 'el' ? 'Πρόσφατα Οχήματα' : lang === 'it' ? 'Veicoli Recenti' : lang === 'de' ? 'Letzte Fahrzeuge' : 'Recent Vehicles'}
          </div>
          <Link href="/vehicles" style={{ fontSize: 12, color: 'var(--primary)', textDecoration: 'none' }}>
            {lang === 'el' ? 'Δείτε όλα →' : lang === 'it' ? 'Vedi tutti →' : 'View all →'}
          </Link>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <tbody>
            {stats.recent.map(v => {
              const fin = calcFinancials(v)
              return (
                <tr key={v.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '9px 16px', width: 36 }}>
                    <span style={{ fontSize: 18 }}>{catIcon[v.category || 'car'] || '🚗'}</span>
                  </td>
                  <td style={{ padding: '9px 8px' }}>
                    <Link href={`/vehicles/${v.id}`} style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 500 }}>
                      {v.make || '—'} {v.model || ''}
                    </Link>
                    <div style={{ fontSize: 11, color: 'var(--text2)' }}>{v.year}{v.plate ? ` · ${v.plate}` : ''}</div>
                  </td>
                  <td style={{ padding: '9px 8px' }}>
                    <span className={`badge status-${v.status}`} style={{ fontSize: 10 }}>
                      {t(lang, `status.${v.status}`)}
                    </span>
                  </td>
                  <td style={{ padding: '9px 16px', textAlign: 'right', fontWeight: 600, fontSize: 12,
                    color: fin.saleRevenue > 0 ? (fin.grossProfit >= 0 ? 'var(--success)' : 'var(--danger)') : 'var(--text2)' }}>
                    {fin.saleRevenue > 0 ? (fin.grossProfit >= 0 ? '+' : '') + fmtCur(fin.grossProfit) : '—'}
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
