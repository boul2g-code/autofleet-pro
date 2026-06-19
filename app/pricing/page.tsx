'use client'
import Link from 'next/link'

const PLANS = [
  {
    name: 'Starter',
    price: '€49',
    period: '/month',
    features: ['1 user', '50 vehicles', 'All tabs & CMR', 'PDF reports', '6 languages', 'Email support'],
    offer: 'First Month Free',
    note: 'No credit card required',
    paypal: 'https://paypal.me/Autofleetpro/49',
    highlight: false,
  },
  {
    name: 'Professional',
    price: '€99',
    period: '/month',
    features: ['3 users', 'Unlimited vehicles', 'All features', 'AI document extraction', 'Priority support', 'Excel export'],
    offer: 'First Month Free',
    note: 'No credit card required',
    paypal: 'https://paypal.me/Autofleetpro/99',
    highlight: true,
  },
]

export default function PricingPage() {
  return (
    <div style={{ background: '#0f172a', color: '#f1f5f9', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #1e293b' }}>
        <Link href="/landing" style={{ color: '#f1f5f9', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🚗</span>
          <span style={{ fontWeight: 700 }}>AutoFleet Pro</span>
        </Link>
        <div style={{ flex: 1 }} />
        <Link href="/login" style={{ background: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>Login</Link>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Simple Pricing</h1>
          <p style={{ color: '#94a3b8', fontSize: 16, marginBottom: 10 }}>First Month Free · No credit card required · Cancel anytime</p>
          <p style={{ color: '#cbd5e1', fontSize: 14, maxWidth: 620, margin: '0 auto', lineHeight: 1.6 }}>
            Use AutoFleet Pro free for your first month. If it saves you time and helps you sell vehicles faster, continue. If not, cancel with no obligation.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {PLANS.map(plan => (
            <div key={plan.name} style={{
              background: plan.highlight ? '#1d4ed8' : '#1e293b',
              border: `2px solid ${plan.highlight ? '#3b82f6' : '#334155'}`,
              borderRadius: 16, padding: 28,
              position: 'relative',
            }}>
              {plan.highlight && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#22c55e', color: 'white', padding: '3px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>{plan.name}</div>
              <div style={{ fontSize: 40, fontWeight: 800, marginBottom: 2 }}>{plan.price}</div>
              <div style={{ color: '#94a3b8', fontSize: 14, marginBottom: 8 }}>{plan.period}</div>
              <div style={{ color: '#f8fafc', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{plan.offer}</div>
              <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 20 }}>{plan.note}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                    <span style={{ color: '#22c55e' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                style={{ display: 'block', textAlign: 'center', background: plan.highlight ? 'white' : '#3b82f6', color: plan.highlight ? '#1d4ed8' : 'white', padding: '12px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}
              >
                Start first month free →
              </Link>
              <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: '#94a3b8' }}>
                or <a href={plan.paypal} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'none' }}>pay immediately with PayPal</a>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, background: '#1e293b', borderRadius: 16, padding: 28, border: '1px solid #334155' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>How to get started</h2>
          {[
            '1. Start with 30 days free via the contact form',
            '2. Create your account at autofleet-pro.vercel.app/login',
            '3. Send us your email — we activate your access within 24h',
            '4. If AutoFleet Pro helps your dealership, continue. If not, cancel with no obligation.',
          ].map(step => (
            <div key={step} style={{ padding: '8px 0', borderBottom: '1px solid #334155', fontSize: 14, color: '#cbd5e1' }}>{step}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
