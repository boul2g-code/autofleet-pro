import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { isBillingPlan, getPlanPriceId } from '@/lib/billing'
import { createClient } from '@/lib/supabase/server'
import { applyRateLimit, jsonNoStore, readJsonBody, validateSameOrigin } from '@/lib/security'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const originError = validateSameOrigin(req, { allowMissingOrigin: true })
  if (originError) return originError

  const rateLimitError = applyRateLimit(req, 'stripe-checkout', { limit: 12, windowMs: 10 * 60_000 })
  if (rateLimitError) return rateLimitError

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return jsonNoStore({ error: 'Unauthorized' }, { status: 401 })

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return jsonNoStore({ error: 'Stripe not configured' }, { status: 501 })
  }

  try {
    const parsedBody = await readJsonBody<{ plan?: string }>(req, { maxBytes: 4 * 1024 })
    if ('response' in parsedBody) return parsedBody.response

    const { plan } = parsedBody.data
    if (!plan || !isBillingPlan(plan)) {
      return jsonNoStore({ error: 'Invalid plan' }, { status: 400 })
    }

    const priceId = getPlanPriceId(plan)
    if (!priceId) {
      return jsonNoStore({ error: `No price configured for plan: ${plan}` }, { status: 400 })
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' })
    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin

    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('plan, status, stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (existingSubscription?.status === 'active' && existingSubscription.plan === plan) {
      return jsonNoStore({ error: 'Plan is already active' }, { status: 409 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      client_reference_id: user.id,
      customer: existingSubscription?.stripe_customer_id || undefined,
      customer_email: existingSubscription?.stripe_customer_id ? undefined : user.email,
      metadata: { plan, userId: user.id },
      subscription_data: {
        metadata: { plan, userId: user.id },
      },
      line_items: [{ price: priceId, quantity: 1 }],
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      success_url: `${origin}/settings?subscription=success`,
      cancel_url: `${origin}/settings?subscription=cancelled`,
    })

    if (!session.url) {
      return jsonNoStore({ error: 'Could not create checkout session' }, { status: 500 })
    }

    return jsonNoStore({ url: session.url })
  } catch (err) {
    console.error('stripe checkout error:', err)
    return jsonNoStore({ error: 'Unexpected Stripe error' }, { status: 500 })
  }
}
