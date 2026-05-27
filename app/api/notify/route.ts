import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { escapeHtml, escapeHtmlWithBreaks } from '@/lib/html'
import { applyRateLimit, isValidEmail, jsonNoStore, readJsonBody, validateSameOrigin } from '@/lib/security'

export const runtime = 'nodejs'

/**
 * POST /api/notify
 * Send email notification for important vehicle events.
 * Uses Resend (free tier: 100 emails/day) or falls back to Supabase auth emails.
 *
 * Body: { type, vehicleId, vehicleName, detail, recipientEmail }
 */
export async function POST(req: NextRequest) {
  try {
    const originError = validateSameOrigin(req, { allowMissingOrigin: true })
    if (originError) return originError

    const rateLimitError = applyRateLimit(req, 'notify', { limit: 8, windowMs: 60 * 60_000 })
    if (rateLimitError) return rateLimitError

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return jsonNoStore({ error: 'Unauthorized' }, { status: 401 })

    const parsedBody = await readJsonBody<{
      type: 'status_change' | 'low_stock' | 'profit_alert' | 'reminder' | 'custom'
      vehicleId: string
      vehicleName: string
      detail: string
      recipientEmail?: string
    }>(req, { maxBytes: 16 * 1024 })
    if ('response' in parsedBody) return parsedBody.response

    const { type, vehicleName, detail, recipientEmail } = parsedBody.data

    const allowedTypes = new Set(['status_change', 'low_stock', 'profit_alert', 'reminder', 'custom'])
    if (!allowedTypes.has(type)) {
      return jsonNoStore({ error: 'Invalid notification type' }, { status: 400 })
    }

    if (!vehicleName || vehicleName.length > 140 || !detail || detail.length > 2000) {
      return jsonNoStore({ error: 'Invalid notification payload' }, { status: 400 })
    }

    const email = recipientEmail || user.email
    if (!email || !isValidEmail(email)) return jsonNoStore({ error: 'No valid email address' }, { status: 400 })
    if (email !== user.email) return jsonNoStore({ error: 'Recipient override is not allowed' }, { status: 403 })

    const RESEND_KEY = process.env.RESEND_API_KEY
    if (!RESEND_KEY) {
      // No email provider configured — log to activity table instead
      await supabase.from('activity_log').insert({
        user_id: user.id,
        vehicle_id: null,
        action: 'notification',
        section: type,
        summary: `[EMAIL SKIPPED - no RESEND_API_KEY] To: ${email} — ${vehicleName}: ${detail}`,
      })
      return jsonNoStore({ ok: true, sent: false, reason: 'No RESEND_API_KEY configured' })
    }

    const subjects = {
      status_change: `🚗 Status Update: ${vehicleName}`,
      low_stock:     `⚠️ Low Stock Alert`,
      profit_alert:  `💰 Profit Alert: ${vehicleName}`,
      reminder:      `⏰ Reminder: ${vehicleName}`,
      custom:        `📋 AutoFleet: ${vehicleName}`,
    }

    const safeSubject = escapeHtml(subjects[type] || 'Notification')
    const safeVehicleName = escapeHtml(vehicleName)
    const safeDetail = escapeHtmlWithBreaks(detail)

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: 'IBM Plex Sans', Arial, sans-serif; background: #f5f5f5; padding: 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: #0f0f18; border-radius: 12px; overflow: hidden;">
    <div style="background: #f0a500; padding: 16px 24px;">
      <span style="font-size: 18px; font-weight: 700; color: #000;">🚗 AutoFleet Pro</span>
    </div>
    <div style="padding: 28px 24px; color: #e2e2f0;">
      <h2 style="color: #f0a500; margin: 0 0 16px; font-size: 18px;">${safeSubject}</h2>
      <div style="font-size: 12px; color: #9aa0b5; margin-bottom: 12px;">Vehicle: ${safeVehicleName || '—'}</div>
      <div style="background: #1e1e2a; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <div style="font-size: 14px; line-height: 1.6;">${safeDetail}</div>
      </div>
      <p style="font-size: 12px; color: #6a6a8a; margin: 0;">This notification was sent by AutoFleet Pro. You can manage notifications in Settings.</p>
    </div>
  </div>
</body>
</html>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_KEY}` },
      body: JSON.stringify({
        from: 'AutoFleet Pro <noreply@autofleetpro.app>',
        to: [email],
        subject: subjects[type] || 'AutoFleet Notification',
        html,
      }),
      signal: AbortSignal.timeout(15_000),
    })

    if (!res.ok) {
      console.error('notify email provider error:', res.status)
      return jsonNoStore({ error: 'Email delivery failed' }, { status: 502 })
    }

    return jsonNoStore({ ok: true, sent: true })
  } catch (err) {
    console.error('notify route unexpected error:', err)
    if (err instanceof Error && err.name === 'TimeoutError') {
      return jsonNoStore({ error: 'Email delivery timed out' }, { status: 504 })
    }
    return jsonNoStore({ error: 'Unexpected error' }, { status: 500 })
  }
}
