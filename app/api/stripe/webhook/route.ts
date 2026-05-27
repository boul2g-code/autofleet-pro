import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getPlanFromPriceId, isBillingPlan } from '@/lib/billing'
import { createAdminClient } from '@/lib/supabase/admin'
import { jsonNoStore } from '@/lib/security'

export const runtime = 'nodejs'

type ManagedSubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired'
  | 'paused'

interface SubscriptionRow {
  current_period_end: string | null
  plan: 'trial' | 'starter' | 'professional' | 'enterprise'
  status: ManagedSubscriptionStatus
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  trial_ends_at: string | null
  user_id: string
}

interface PlanLookupRow {
  plan?: SubscriptionRow['plan']
}

interface UserLookupRow {
  user_id?: string
}

function toIsoFromUnix(value: number | null | undefined): string | null {
  if (!value) return null
  return new Date(value * 1000).toISOString()
}

function normalizeStatus(status: Stripe.Subscription.Status): ManagedSubscriptionStatus {
  if (status === 'canceled') return 'cancelled'
  if (status === 'paused') return 'paused'
  if (status === 'unpaid') return 'unpaid'
  if (status === 'past_due') return 'past_due'
  if (status === 'incomplete') return 'incomplete'
  if (status === 'incomplete_expired') return 'incomplete_expired'
  if (status === 'trialing') return 'trialing'
  return 'active'
}

function resolvePlan(
  subscription: Stripe.Subscription,
  fallbackPlan?: string | null,
): SubscriptionRow['plan'] {
  const planFromMetadata = subscription.metadata?.plan
  if (planFromMetadata && isBillingPlan(planFromMetadata)) return planFromMetadata

  const firstPriceId = subscription.items.data[0]?.price?.id
  const planFromPrice = getPlanFromPriceId(firstPriceId)
  if (planFromPrice) return planFromPrice

  if (fallbackPlan && (fallbackPlan === 'trial' || isBillingPlan(fallbackPlan))) {
    return fallbackPlan
  }

  return 'starter'
}

async function resolveUserId(
  admin: ReturnType<typeof createAdminClient>,
  subscriptionId: string | null,
  customerId: string | null,
  metadataUserId: string | undefined,
): Promise<string | null> {
  if (metadataUserId) return metadataUserId

  if (subscriptionId) {
    const { data } = await admin
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', subscriptionId)
      .maybeSingle()

    const record = data as UserLookupRow | null
    if (record?.user_id) return record.user_id
  }

  if (customerId) {
    const { data } = await admin
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .maybeSingle()

    const record = data as UserLookupRow | null
    if (record?.user_id) return record.user_id
  }

  return null
}

async function upsertManagedSubscription(
  admin: ReturnType<typeof createAdminClient>,
  row: SubscriptionRow,
): Promise<void> {
  const { error } = await admin
    .from('subscriptions')
    .upsert(row, { onConflict: 'user_id' })

  if (error) throw new Error(error.message)
}

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeKey || !webhookSecret) {
    return jsonNoStore({ error: 'Stripe env vars not configured' }, { status: 501 })
  }

  try {
    const signature = req.headers.get('stripe-signature') || ''
    if (!signature) {
      return jsonNoStore({ error: 'Missing signature' }, { status: 400 })
    }

    const contentLength = Number.parseInt(req.headers.get('content-length') || '0', 10)
    if (Number.isFinite(contentLength) && contentLength > 512 * 1024) {
      return jsonNoStore({ error: 'Webhook payload too large' }, { status: 413 })
    }

    const body = await req.text()
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' })

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch {
      return jsonNoStore({ error: 'Invalid signature' }, { status: 400 })
    }

    const admin = createAdminClient()

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : null
      if (!subscriptionId) return jsonNoStore({ received: true })

      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const userId = await resolveUserId(
        admin,
        subscription.id,
        typeof subscription.customer === 'string' ? subscription.customer : null,
        session.metadata?.userId || session.client_reference_id || undefined,
      )

      if (!userId) {
        return jsonNoStore({ error: 'Could not resolve subscription owner' }, { status: 400 })
      }

      await upsertManagedSubscription(admin, {
        current_period_end: toIsoFromUnix(subscription.current_period_end),
        plan: resolvePlan(subscription, session.metadata?.plan || null),
        status: normalizeStatus(subscription.status),
        stripe_customer_id: typeof subscription.customer === 'string' ? subscription.customer : null,
        stripe_subscription_id: subscription.id,
        trial_ends_at: toIsoFromUnix(subscription.trial_end),
        user_id: userId,
      })
    }

    if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = typeof subscription.customer === 'string' ? subscription.customer : null
      const userId = await resolveUserId(
        admin,
        subscription.id,
        customerId,
        subscription.metadata?.userId,
      )

      if (!userId) {
        return jsonNoStore({ error: 'Could not resolve subscription owner' }, { status: 400 })
      }

      await upsertManagedSubscription(admin, {
        current_period_end: toIsoFromUnix(subscription.current_period_end),
        plan: resolvePlan(subscription, null),
        status: normalizeStatus(subscription.status),
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        trial_ends_at: toIsoFromUnix(subscription.trial_end),
        user_id: userId,
      })
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = typeof subscription.customer === 'string' ? subscription.customer : null
      const userId = await resolveUserId(
        admin,
        subscription.id,
        customerId,
        subscription.metadata?.userId,
      )

      if (!userId) {
        return jsonNoStore({ error: 'Could not resolve subscription owner' }, { status: 400 })
      }

      const existingPlan = await admin
        .from('subscriptions')
        .select('plan')
        .eq('user_id', userId)
        .maybeSingle()

      await upsertManagedSubscription(admin, {
        current_period_end: toIsoFromUnix(subscription.current_period_end),
        plan: (existingPlan.data as PlanLookupRow | null)?.plan ?? resolvePlan(subscription, null),
        status: 'cancelled',
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        trial_ends_at: toIsoFromUnix(subscription.trial_end),
        user_id: userId,
      })
    }

    return jsonNoStore({ received: true })
  } catch (err) {
    console.error('stripe webhook error:', err)
    return jsonNoStore({ error: 'Unexpected webhook error' }, { status: 500 })
  }
}
