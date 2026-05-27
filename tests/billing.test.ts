import { afterEach, describe, expect, it } from 'vitest'
import { getPlanFromPriceId, getPlanPriceId, isBillingPlan } from '@/lib/billing'

const ORIGINAL_ENV = {
  starter: process.env.STRIPE_PRICE_STARTER,
  professional: process.env.STRIPE_PRICE_PROFESSIONAL,
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE,
}

describe('billing helpers', () => {
  afterEach(() => {
    process.env.STRIPE_PRICE_STARTER = ORIGINAL_ENV.starter
    process.env.STRIPE_PRICE_PROFESSIONAL = ORIGINAL_ENV.professional
    process.env.STRIPE_PRICE_ENTERPRISE = ORIGINAL_ENV.enterprise
  })

  it('validates known plans', () => {
    expect(isBillingPlan('starter')).toBe(true)
    expect(isBillingPlan('trial')).toBe(false)
  })

  it('maps plans to price ids and back', () => {
    process.env.STRIPE_PRICE_STARTER = 'price_starter'
    process.env.STRIPE_PRICE_PROFESSIONAL = 'price_professional'
    process.env.STRIPE_PRICE_ENTERPRISE = 'price_enterprise'

    expect(getPlanPriceId('professional')).toBe('price_professional')
    expect(getPlanFromPriceId('price_enterprise')).toBe('enterprise')
    expect(getPlanFromPriceId('price_unknown')).toBeNull()
  })
})
