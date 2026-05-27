'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import { createClient } from '@/lib/supabase/client'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { CURRENCIES, genBusinessId, genUuid, isUuid } from '@/lib/utils'
import { exportVehiclesCSV } from '@/lib/csvExport'
import type { Currency, Lang, SubscriptionRecord, Vehicle } from '@/lib/types'

function formatSubscriptionDate(value: string | null | undefined, lang: Lang): string {
  if (!value) return '—'

  const locale = lang === 'el' ? 'el-GR' : lang === 'de' ? 'de-DE' : 'en-GB'
  return new Date(value).toLocaleDateString(locale)
}

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const { lang, setLang, settings, saveSettings, vehicles, showToast, user } = useFleetStore()
  const T = (k: string) => t(lang, k)

  const [form, setForm] = useState({ ...settings })
  const [notifLoading, setNotifLoading] = useState(false)
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(null)
  const [subscriptionLoading, setSubscriptionLoading] = useState(true)

  useEffect(() => {
    // Intentionally resync the local editable draft when the persisted store changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({ ...settings })
  }, [settings])

  useEffect(() => {
    const result = searchParams.get('subscription')
    if (result === 'success') {
      showToast(lang === 'el' ? 'Η αναβάθμιση ολοκληρώθηκε.' : lang === 'de' ? 'Upgrade abgeschlossen.' : 'Upgrade completed.')
    }
    if (result === 'cancelled') {
      showToast(lang === 'el' ? 'Η πληρωμή ακυρώθηκε.' : lang === 'de' ? 'Zahlung abgebrochen.' : 'Payment cancelled.', 'info')
    }
  }, [lang, searchParams, showToast])

  useEffect(() => {
    if (!user?.id) {
      // Logging out should immediately clear the visible subscription state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubscription(null)
      setSubscriptionLoading(false)
      return
    }

    const supabase = createClient()
    setSubscriptionLoading(true)

    void (async () => {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('user_id, plan, status, stripe_customer_id, stripe_subscription_id, trial_ends_at, current_period_end')
          .eq('user_id', user.id)
          .maybeSingle()

        if (error) {
          console.error('subscription fetch error:', error)
          setSubscription(null)
          return
        }

        setSubscription((data as SubscriptionRecord | null) ?? null)
      } finally {
        setSubscriptionLoading(false)
      }
    })()
  }, [user?.id])

  const normalizeImportedVehicle = (raw: Partial<Vehicle>): Partial<Vehicle> => {
    const rawId = typeof raw.id === 'string' ? raw.id : ''
    const businessId = raw.businessId || (rawId.startsWith('VH-') ? rawId : genBusinessId())

    return {
      ...raw,
      id: isUuid(rawId) ? rawId : genUuid(),
      businessId,
      documents: (raw.documents || []).filter(doc => typeof doc.storagePath === 'string' && doc.storagePath.length > 0),
    }
  }

  const handleSave = async () => {
    await saveSettings({ ...form, apiKey: '' })
    showToast(T('msg.saved'))
  }

  const handleExport = () => {
    const safeSettings = { ...settings, apiKey: '' }
    const data = JSON.stringify({
      vehicles,
      settings: safeSettings,
      exportDate: new Date().toISOString(),
    }, null, 2)

    const blob = new Blob([data], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `autofleet-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async ev => {
      try {
        const data = JSON.parse(ev.target!.result as string)
        if (data.vehicles) {
          const store = useFleetStore.getState()
          for (const rawVehicle of data.vehicles as Partial<Vehicle>[]) {
            const vehicle = normalizeImportedVehicle(rawVehicle)
            await store.updateVehicle(vehicle.id!, vehicle)
          }
        }

        if (data.settings) {
          const mergedSettings = { ...settings, ...data.settings, apiKey: '' }
          await saveSettings(mergedSettings)
          setForm(mergedSettings)
        }

        showToast('Imported ✓')
      } catch {
        showToast('Import error', 'error')
      }
    }

    reader.readAsText(file)
  }

  const inputStyle = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '9px 12px',
    color: 'var(--text)',
    fontFamily: 'IBM Plex Sans, sans-serif',
    fontSize: 13,
    outline: 'none',
    width: '100%',
  }

  const labelStyle = {
    fontSize: 11,
    color: 'var(--muted)',
    letterSpacing: '0.5px',
    fontWeight: 600 as const,
    textTransform: 'uppercase' as const,
    display: 'block',
    marginBottom: 5,
  }

  const fieldStyle = { display: 'flex', flexDirection: 'column' as const, gap: 5 }

  const effectivePlan = subscription?.plan ?? 'trial'
  const effectiveStatus = subscription?.status ?? 'trialing'
  const cycleDate = subscription?.current_period_end ?? subscription?.trial_ends_at ?? null
  const cycleLabel = effectiveStatus === 'active'
    ? (lang === 'el' ? 'Επόμενη ανανέωση' : lang === 'de' ? 'Nächste Verlängerung' : 'Next renewal')
    : (lang === 'el' ? 'Λήξη δοκιμής' : lang === 'de' ? 'Test endet' : 'Trial ends')

  const planLabel = {
    trial: lang === 'el' ? 'Δοκιμή' : lang === 'de' ? 'Testphase' : 'Trial',
    starter: 'Starter',
    professional: 'Professional',
    enterprise: 'Enterprise',
  }[effectivePlan]

  const statusLabel = {
    trialing: lang === 'el' ? 'Δοκιμή' : lang === 'de' ? 'Testphase' : 'Trialing',
    active: lang === 'el' ? 'Ενεργή' : lang === 'de' ? 'Aktiv' : 'Active',
    past_due: lang === 'el' ? 'Σε καθυστέρηση' : lang === 'de' ? 'Überfällig' : 'Past due',
    cancelled: lang === 'el' ? 'Ακυρωμένη' : lang === 'de' ? 'Gekündigt' : 'Cancelled',
    unpaid: lang === 'el' ? 'Απλήρωτη' : lang === 'de' ? 'Unbezahlt' : 'Unpaid',
    incomplete: lang === 'el' ? 'Ελλιπής' : lang === 'de' ? 'Unvollständig' : 'Incomplete',
    incomplete_expired: lang === 'el' ? 'Έληξε' : lang === 'de' ? 'Abgelaufen' : 'Expired',
    paused: lang === 'el' ? 'Σε παύση' : lang === 'de' ? 'Pausiert' : 'Paused',
  }[effectiveStatus]

  const statusColor = effectiveStatus === 'active'
    ? 'var(--success)'
    : effectiveStatus === 'trialing'
      ? 'var(--accent)'
      : 'var(--error)'

  const aiTitle = lang === 'el'
    ? 'AI extraction'
    : lang === 'de'
      ? 'KI-Extraktion'
      : 'AI extraction'

  const aiCopy = lang === 'el'
    ? 'Το Anthropic key τρέχει πλέον μόνο server-side μέσω env variables για μεγαλύτερη ασφάλεια.'
    : lang === 'de'
      ? 'Der Anthropic-Schlüssel läuft jetzt aus Sicherheitsgründen nur serverseitig über Umgebungsvariablen.'
      : 'The Anthropic key now runs server-side only through environment variables for better security.'

  return (
    <AppShell>
      <div className="af-card" style={{ maxWidth: 720 }}>
        <div className="af-section-title">{T('settings.company')}</div>
        <div style={{ display: 'grid', gap: 14 }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>{T('settings.compName')}</label>
            <input style={inputStyle} value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>{T('settings.compDE')}</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }} value={form.companyDE} onChange={e => setForm(f => ({ ...f, companyDE: e.target.value }))} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>{T('settings.compGR')}</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }} value={form.companyGR} onChange={e => setForm(f => ({ ...f, companyGR: e.target.value }))} />
          </div>
        </div>

        <div className="af-section-title" style={{ marginTop: 28 }}>API & {T('settings.lang')}</div>
        <div style={{ display: 'grid', gap: 14 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{aiTitle}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>{aiCopy}</div>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>{T('settings.lang')}</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={lang} onChange={e => setLang(e.target.value as Lang)}>
              <option value="el">Ελληνικά</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>{T('settings.currency')}</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.defaultCurrency} onChange={e => setForm(f => ({ ...f, defaultCurrency: e.target.value as Currency }))}>
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <button className="af-btn af-btn-primary" onClick={handleSave}>{T('actions.save')}</button>
        </div>

        <div className="af-section-title" style={{ marginTop: 28 }}>💳 {lang === 'el' ? 'Συνδρομή' : lang === 'de' ? 'Abonnement' : 'Subscription'}</div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{subscriptionLoading ? '…' : planLabel}</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#000', background: statusColor, borderRadius: 999, padding: '3px 10px' }}>
                  {subscriptionLoading ? 'Loading' : statusLabel}
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
                {subscriptionLoading ? 'Loading subscription…' : `${cycleLabel}: ${formatSubscriptionDate(cycleDate, lang)}`}
              </div>
            </div>
            <a href="/pricing" style={{ background: 'var(--accent)', color: '#000', padding: '8px 20px', borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none', display: 'inline-block' }}>
              {effectiveStatus === 'active' && effectivePlan !== 'trial'
                ? (lang === 'el' ? 'Αλλαγή πλάνου' : lang === 'de' ? 'Plan ändern' : 'Change plan')
                : (lang === 'el' ? 'Αναβάθμιση' : lang === 'de' ? 'Upgrade' : 'Upgrade')}
            </a>
          </div>
        </div>

        <div className="af-section-title" style={{ marginTop: 20 }}>🔔 {lang === 'el' ? 'Ειδοποιήσεις' : lang === 'de' ? 'Benachrichtigungen' : 'Notifications'}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 }}>
          <button
            className="af-btn af-btn-secondary af-btn-sm"
            disabled={notifLoading}
            onClick={async () => {
              setNotifLoading(true)
              try {
                const res = await fetch('/api/notify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    type: 'custom',
                    vehicleId: '',
                    vehicleName: 'AutoFleet Pro',
                    detail: `Test notification from AutoFleet Pro.\nAccount: ${user?.email || '—'}\nVehicles: ${vehicles.length}`,
                  }),
                })
                const d = await res.json()
                if (d.sent) showToast('Test email sent ✓')
                else showToast(d.reason || 'Email not sent (check RESEND_API_KEY)', 'info')
              } finally {
                setNotifLoading(false)
              }
            }}
          >
            {notifLoading ? '⏳' : '📧'} {lang === 'el' ? 'Αποστολή Δοκιμαστικού Email' : lang === 'de' ? 'Test-E-Mail senden' : 'Send Test Email'}
          </button>
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>
          {lang === 'el' ? 'Απαιτεί RESEND_API_KEY στα env variables' : lang === 'de' ? 'Erfordert RESEND_API_KEY in den Umgebungsvariablen' : 'Requires RESEND_API_KEY in environment variables'}
        </div>

        <div className="af-section-title" style={{ marginTop: 28 }}>{T('settings.data')}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="af-btn af-btn-secondary af-btn-sm" onClick={handleExport}>📤 {T('settings.exportJson')}</button>
          <button className="af-btn af-btn-secondary af-btn-sm" onClick={() => exportVehiclesCSV(vehicles)}>📊 Export CSV</button>
          <label className="af-btn af-btn-secondary af-btn-sm" style={{ cursor: 'pointer' }}>
            📥 {T('settings.importJson')}
            <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
          </label>
        </div>
        <div style={{ marginTop: 12, color: 'var(--muted)', fontSize: 12 }}>{vehicles.length} vehicles in database · {user?.email || '—'}</div>
      </div>
    </AppShell>
  )
}
