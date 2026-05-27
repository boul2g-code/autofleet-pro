'use client'

import { useMemo } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { computeFin } from '@/lib/financials'
import { fmtCur, catIcon, ALL_STATUSES } from '@/lib/utils'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

const COLORS = ['#f0a500','#4a90e2','#2ed573','#ff4444','#b48aff','#ff7043','#00c896']

function AnalyticsCard({
  title,
  value,
  sub,
  color = 'var(--accent)',
}: {
  title: string
  value: string
  sub?: string
  color?: string
}) {
  return (
    <div className="af-card" style={{ padding: '16px 20px' }}>
      <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color, fontFamily: 'IBM Plex Mono, monospace' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

function AnalyticsSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', letterSpacing: 2, textTransform: 'uppercase', margin: '24px 0 12px', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>{children}</div>
  )
}

export default function AnalyticsPage() {
  const { vehicles, lang } = useFleetStore()
  const T = (k: string) => t(lang, k)

  const stats = useMemo(() => {
    const sold = vehicles.filter(v => v.sale?.priceGross && v.purchase?.priceGross)
    const fins = sold.map(v => ({ v, fin: computeFin(v) }))

    // Monthly profit (last 12 months)
    const now = new Date()
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1)
      return {
        name: d.toLocaleString('default', { month: 'short' }),
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        profit: 0, revenue: 0, count: 0,
      }
    })

    fins.forEach(({ v, fin }) => {
      const saleDate = v.sale?.date || v.updatedAt
      if (!saleDate) return
      const key = saleDate.slice(0, 7)
      const m = months.find(m => m.key === key)
      if (m) { m.profit += fin.profit ?? 0; m.revenue += fin.sp; m.count++ }
    })

    // By category
    const byCat = vehicles.reduce((acc, v) => {
      acc[v.category] = (acc[v.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const catData = Object.entries(byCat).map(([cat, count]) => ({
      name: t(lang, `cat.${cat}`), value: count, icon: catIcon(cat as never),
    }))

    // By status
    const byStatus = ALL_STATUSES.map(s => ({
      name: t(lang, `status.${s}`),
      value: vehicles.filter(v => v.status === s).length,
    })).filter(d => d.value > 0)

    // By make (top 10)
    const byMake = vehicles.reduce((acc, v) => {
      if (v.make) acc[v.make] = (acc[v.make] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const makeData = Object.entries(byMake)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([name, count]) => ({ name, count: count as number }))

    // Top profitable vehicles
    const topProfit = fins
      .sort((a, b) => (b.fin.profit ?? 0) - (a.fin.profit ?? 0))
      .slice(0, 5)

    // Avg days to sell
    const soldWithDates = vehicles.filter(v => v.purchase?.date && v.sale?.date)
    const avgDays = soldWithDates.length
      ? Math.round(soldWithDates.reduce((s, v) => {
          const saleDate = v.sale?.date ?? ''
          const purchDate = v.purchase?.date ?? ''
          const days = saleDate && purchDate
            ? (new Date(saleDate).getTime() - new Date(purchDate).getTime()) / 86400000
            : 0
          return s + days
        }, 0) / soldWithDates.length)
      : 0

    const totalRevenue = fins.reduce((s, { fin }) => s + fin.sp, 0)
    const totalProfit = fins.reduce((s, { fin }) => s + (fin.profit ?? 0), 0)
    const avgMargin = fins.length ? fins.reduce((s, { fin }) => s + (fin.margin ?? 0), 0) / fins.length : 0
    const totalCosts = fins.reduce((s, { fin }) => s + fin.total, 0)

    return { months, catData, byStatus, makeData, topProfit, avgDays, totalRevenue, totalProfit, avgMargin, totalCosts, soldCount: sold.length }
  }, [vehicles, lang])

  const tooltipStyle = {
    background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8,
    color: 'var(--text)', fontSize: 12,
  }

  if (vehicles.length === 0) {
    return (
      <AppShell>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, opacity: 0.3, marginBottom: 16 }}>📊</div>
          <div style={{ color: 'var(--muted)' }}>
            {lang === 'el' ? 'Δεν υπάρχουν δεδομένα ακόμα' : lang === 'de' ? 'Noch keine Daten' : 'No data yet'}
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: 12, marginBottom: 4 }}>
        <AnalyticsCard title={T('dashboard.total')} value={String(vehicles.length)} color="var(--text)" />
        <AnalyticsCard title={T('dashboard.sold')} value={String(stats.soldCount)} color="var(--success)" />
        <AnalyticsCard title={lang === 'el' ? 'Συνολικά Έσοδα' : lang === 'de' ? 'Gesamtumsatz' : 'Total Revenue'} value={fmtCur(stats.totalRevenue)} />
        <AnalyticsCard title={T('dashboard.profit')} value={fmtCur(stats.totalProfit)} color={stats.totalProfit >= 0 ? 'var(--success)' : 'var(--error)'} />
        <AnalyticsCard title={lang === 'el' ? 'Μέση Κερδοφορία' : lang === 'de' ? 'Ø Marge' : 'Avg Margin'} value={`${stats.avgMargin.toFixed(1)}%`} color="var(--blue)" />
        <AnalyticsCard title={lang === 'el' ? 'Μέρες για Πώληση' : lang === 'de' ? 'Ø Verkaufstage' : 'Avg Days to Sell'} value={stats.avgDays > 0 ? `${stats.avgDays}d` : '—'} color="var(--muted)" sub={lang === 'el' ? 'μέσος όρος' : lang === 'de' ? 'Durchschnitt' : 'average'} />
      </div>

      {/* Monthly Profit Chart */}
      <AnalyticsSectionTitle>{lang === 'el' ? '📈 Κέρδος & Έσοδα ανά Μήνα' : lang === 'de' ? '📈 Monatlicher Gewinn & Umsatz' : '📈 Monthly Profit & Revenue'}</AnalyticsSectionTitle>
      <div className="af-card" style={{ marginBottom: 4 }}>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={stats.months} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--muted)', fontSize: 11 }} />
            <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : String(v)} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtCur(v)} />
            <Legend wrapperStyle={{ fontSize: 11, color: 'var(--muted)' }} />
            <Bar dataKey="revenue" name={lang === 'el' ? 'Έσοδα' : lang === 'de' ? 'Umsatz' : 'Revenue'} fill="var(--blue)" radius={[4, 4, 0, 0]} opacity={0.7} />
            <Bar dataKey="profit" name={lang === 'el' ? 'Κέρδος' : lang === 'de' ? 'Gewinn' : 'Profit'} fill="var(--accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Two-column: Category + Status */}
      <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 4 }}>
        <div>
          <AnalyticsSectionTitle>{lang === 'el' ? '🚗 Κατανομή ανά Κατηγορία' : lang === 'de' ? '🚗 Nach Kategorie' : '🚗 By Category'}</AnalyticsSectionTitle>
          <div className="af-card" style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.catData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={10}>
                  {stats.catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <AnalyticsSectionTitle>{lang === 'el' ? '📊 Κατανομή ανά Κατάσταση' : lang === 'de' ? '📊 Nach Status' : '📊 By Status'}</AnalyticsSectionTitle>
          <div className="af-card" style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.byStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${value}`} fontSize={10}>
                  {stats.byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top makes */}
      <AnalyticsSectionTitle>{lang === 'el' ? '🏆 Top Μάρκες' : lang === 'de' ? '🏆 Top Marken' : '🏆 Top Makes'}</AnalyticsSectionTitle>
      <div className="af-card" style={{ marginBottom: 4 }}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stats.makeData} layout="vertical" margin={{ top: 0, right: 30, left: 60, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
            <XAxis type="number" tick={{ fill: 'var(--muted)', fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text)', fontSize: 11 }} width={55} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" name={lang === 'el' ? 'Αριθμός' : lang === 'de' ? 'Anzahl' : 'Count'} fill="var(--accent)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top 5 Most Profitable */}
      {stats.topProfit.length > 0 && <>
        <AnalyticsSectionTitle>{lang === 'el' ? '💰 Top 5 Πιο Κερδοφόρα Οχήματα' : lang === 'de' ? '💰 Top 5 Profitabelste Fahrzeuge' : '💰 Top 5 Most Profitable Vehicles'}</AnalyticsSectionTitle>
        <div className="af-card">
          {stats.topProfit.map(({ v, fin }, i) => (
            <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 28, height: 28, background: i === 0 ? 'var(--accent)' : 'var(--surface)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: i === 0 ? '#000' : 'var(--muted)', flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: 20 }}>{catIcon(v.category)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{v.make} {v.model} {v.year}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{v.plate || v.businessId}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, color: (fin.profit ?? 0) >= 0 ? 'var(--success)' : 'var(--error)', fontSize: 14 }}>{fmtCur(fin.profit)}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{fin.margin?.toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      </>}

      <style>{`@media(max-width:900px){ .analytics-grid { grid-template-columns: 1fr !important; } }`}</style>
    </AppShell>
  )
}
