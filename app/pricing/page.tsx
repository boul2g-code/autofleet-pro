'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '€49',
    period: '/month',
    color: '#4a90e2',
    features: [
      '1 user account',
      'Up to 50 vehicles',
      'All 11 languages',
      'PDF reports',
      'CMR printing',
      'QR codes',
      'CSV export',
      'Email support',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '€99',
    period: '/month',
    color: '#f0a500',
    features: [
      '3 user accounts',
      'Unlimited vehicles',
      'AI document extraction',
      'Analytics dashboard',
      'Inspection reports',
      'Marketplace listings',
      'Activity log',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '€199',
    period: '/month',
    color: '#2ed573',
    features: [
      '10 user accounts',
      'Unlimited vehicles',
      'Custom company branding',
      'API access',
      'White-label option',
      'Dedicated account manager',
      'Phone support',
      'Custom integrations',
    ],
    cta: 'Contact Us',
    popular: false,
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleSubscribe = async (planId: string) => {
    if (planId === 'enterprise') {
      window.location.assign('mailto:sales@autofleetpro.app?subject=Enterprise Inquiry')
      return
    }
    setLoading(planId)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      const data = await res.json()
      if (data.url) window.location.assign(data.url)
      else if (data.error?.includes('Unauthorized')) router.push('/login')
      else alert(data.error || 'Error creating checkout')
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f18', fontFamily: 'IBM Plex Sans, sans-serif', padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={{ fontSize: 14, color: '#f0a500', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>AutoFleet Pro</div>
        <h1 style={{ fontSize: 42, fontWeight: 700, color: '#e2e2f0', margin: '0 0 16px', letterSpacing: -1 }}>
          Simple, transparent pricing
        </h1>
        <p style={{ fontSize: 16, color: '#6a6a8a', maxWidth: 480, margin: '0 auto' }}>
          For vehicle traders, dealers and transport companies across Europe.
          Start with a 14-day free trial — no credit card required.
        </p>
      </div>

      {/* Plans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 24, maxWidth: 1000, margin: '0 auto 60px' }}>
        {PLANS.map(plan => (
          <div
            key={plan.id}
            style={{
              background: plan.popular ? '#1e1e2a' : '#17171f',
              border: `1px solid ${plan.popular ? plan.color : '#2a2a3e'}`,
              borderRadius: 16,
              padding: 32,
              position: 'relative',
              transform: plan.popular ? 'scale(1.03)' : 'scale(1)',
              boxShadow: plan.popular ? `0 0 40px ${plan.color}22` : 'none',
            }}
          >
            {plan.popular && (
              <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: plan.color, color: '#000', padding: '4px 16px', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                Most Popular
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: plan.color, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>{plan.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 40, fontWeight: 700, color: '#e2e2f0', fontFamily: 'IBM Plex Mono' }}>{plan.price}</span>
                <span style={{ fontSize: 14, color: '#6a6a8a' }}>{plan.period}</span>
              </div>
            </div>

            <ul style={{ listStyle: 'none', marginBottom: 28 }}>
              {plan.features.map(f => (
                <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '7px 0', borderBottom: '1px solid rgba(42,42,62,0.5)', fontSize: 13, color: '#c8c8e0' }}>
                  <span style={{ color: plan.color, fontSize: 14, flexShrink: 0 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => void handleSubscribe(plan.id)}
              disabled={loading === plan.id}
              style={{
                width: '100%', padding: '14px', borderRadius: 10,
                border: plan.popular ? 'none' : `1px solid ${plan.color}`,
                background: plan.popular ? plan.color : 'transparent',
                color: plan.popular ? '#000' : plan.color,
                fontSize: 14, fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
                fontFamily: 'IBM Plex Sans, sans-serif',
                transition: 'all 0.15s',
                opacity: loading === plan.id ? 0.7 : 1,
              }}
            >
              {loading === plan.id ? '⏳ Loading...' : plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Features table */}
      <div style={{ maxWidth: 800, margin: '0 auto', background: '#17171f', border: '1px solid #2a2a3e', borderRadius: 16, padding: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#e2e2f0', marginBottom: 20, textAlign: 'center' }}>Everything included</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 16 }}>
          {[
            '🚗 Unlimited vehicle types (cars, trucks, vans, buses, motorcycles, construction)',
            '🌍 11 languages (EL, EN, DE, ES, FR, TR, BG, HR, AR, ZH, JA)',
            '📄 PDF reports & CMR waybills',
            '📱 QR codes per vehicle',
            '🤖 AI data extraction from documents',
            '📊 Financial P&L per vehicle',
            '🔍 Full-text search across all fields',
            '⚠️ Double-confirm on deletion',
            '📋 Activity log',
            '🎨 50+ color options',
            '🌐 22+ European marketplaces',
            '💾 Real-time cloud sync',
          ].map(f => (
            <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: '#aaa', lineHeight: 1.5 }}>
              <span style={{ flexShrink: 0 }}>{f.slice(0, 2)}</span>
              <span>{f.slice(3)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 600, margin: '40px auto 0', textAlign: 'center' }}>
        <p style={{ color: '#6a6a8a', fontSize: 13 }}>
          Questions? Email <a href="mailto:hello@autofleetpro.app" style={{ color: '#f0a500' }}>hello@autofleetpro.app</a>
          {' · '}
          <a href="/login" style={{ color: '#4a90e2' }}>Login →</a>
        </p>
      </div>
    </div>
  )
}
