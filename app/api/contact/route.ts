import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, company, email, phone, vehicles, plan } = await req.json()

    // Send via Resend (free tier: 100 emails/day)
    // Fallback: log to Supabase if no email service configured
    const RESEND_KEY = process.env.RESEND_API_KEY

    if (RESEND_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'AutoFleet Pro <onboarding@resend.dev>',
          to: ['autofleetpro1@gmail.com'],
          subject: `AutoFleet Pro — ${plan} — ${company || name}`,
          html: `
            <h2>Nuova richiesta AutoFleet Pro</h2>
            <table>
              <tr><td><b>Nome</b></td><td>${name}</td></tr>
              <tr><td><b>Azienda</b></td><td>${company || '—'}</td></tr>
              <tr><td><b>Email</b></td><td>${email}</td></tr>
              <tr><td><b>Telefono</b></td><td>${phone || '—'}</td></tr>
              <tr><td><b>Veicoli/mese</b></td><td>${vehicles || '—'}</td></tr>
              <tr><td><b>Piano</b></td><td>${plan}</td></tr>
            </table>
            <p><b>Rispondere a:</b> ${email}</p>
          `,
          reply_to: email,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(JSON.stringify(data))
    }

    // Always save to Supabase as backup
    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await sb.from('contact_requests').insert({
      name, company, email, phone, vehicles, plan,
      created_at: new Date().toISOString()
    }).single()

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Contact error:', e)
    // Still return ok — email fallback will work via mailto
    return NextResponse.json({ ok: true, fallback: true })
  }
}
