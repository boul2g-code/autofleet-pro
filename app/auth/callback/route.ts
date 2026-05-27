import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { applySecurityHeaders, sanitizeRedirectPath } from '@/lib/security'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = sanitizeRedirectPath(searchParams.get('next'))

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return applySecurityHeaders(NextResponse.redirect(`${origin}${next}`), { noStore: true })
    }
  }

  return applySecurityHeaders(NextResponse.redirect(`${origin}/login?error=auth_callback_failed`), { noStore: true })
}
