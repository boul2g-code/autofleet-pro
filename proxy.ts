import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { applySecurityHeaders, jsonNoStore } from '@/lib/security'
import { getSupabasePublishableKey, getSupabaseUrl } from '@/lib/supabase/env'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Refresh session and validate the current auth cookie boundary.
  const { data: claimsData } = await supabase.auth.getClaims()
  const isAuthenticated = Boolean(claimsData?.claims?.sub)

  const { pathname } = request.nextUrl
  const isApiRoute = pathname.startsWith('/api/')
  const isPublicPage = ['/login', '/pricing', '/contact', '/auth/callback'].some(p => pathname.startsWith(p))

  if (!isAuthenticated && isApiRoute && !pathname.startsWith('/api/stripe/webhook')) {
    return applySecurityHeaders(jsonNoStore({ error: 'Unauthorized' }, { status: 401 }), { noStore: true })
  }

  if (!isAuthenticated && !isPublicPage && !isApiRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return applySecurityHeaders(NextResponse.redirect(url), { noStore: true })
  }

  if (isAuthenticated && pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return applySecurityHeaders(NextResponse.redirect(url), { noStore: true })
  }

  if (!isPublicPage && !pathname.startsWith('/_next') && !isApiRoute) {
    supabaseResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  }

  return applySecurityHeaders(supabaseResponse)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
