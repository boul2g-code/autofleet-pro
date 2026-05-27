export const BILLING_PLANS = ['starter', 'professional', 'enterprise'] as const

export type BillingPlan = typeof BILLING_PLANS[number]

export function isBillingPlan(value: string): value is BillingPlan {
  return (BILLING_PLANS as readonly string[]).includes(value)
}

export function getPlanPriceId(plan: BillingPlan): string | undefined {
  return {
    starter: process.env.STRIPE_PRICE_STARTER,
    professional: process.env.STRIPE_PRICE_PROFESSIONAL,
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE,
  }[plan]
}

export function getPlanFromPriceId(value: string | null | undefined): BillingPlan | null {
  const priceId = value ?? ''

  if (priceId && priceId === process.env.STRIPE_PRICE_STARTER) return 'starter'
  if (priceId && priceId === process.env.STRIPE_PRICE_PROFESSIONAL) return 'professional'
  if (priceId && priceId === process.env.STRIPE_PRICE_ENTERPRISE) return 'enterprise'

  return null
}
