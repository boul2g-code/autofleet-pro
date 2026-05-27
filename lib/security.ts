import { NextResponse } from 'next/server'

const DEFAULT_JSON_LIMIT_BYTES = 1024 * 1024
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()
type RequestLike = Request & {
  ip?: string
  nextUrl?: URL
}

function normalizeOrigin(value: string | null | undefined): string | null {
  if (!value) return null

  try {
    return new URL(value).origin
  } catch {
    return null
  }
}

function getRequestOrigin(request: RequestLike): string | null {
  const nextUrlOrigin = normalizeOrigin(request.nextUrl?.origin)
  if (nextUrlOrigin) return nextUrlOrigin

  return normalizeOrigin(request.url)
}

function getAllowedOrigins(request: RequestLike): string[] {
  const allowed = new Set<string>()
  const requestOrigin = getRequestOrigin(request)
  if (requestOrigin) allowed.add(requestOrigin)

  const configuredOrigin = normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL)
  if (configuredOrigin) allowed.add(configuredOrigin)

  return Array.from(allowed)
}

export function applySecurityHeaders(
  response: NextResponse,
  options?: {
    contentSecurityPolicy?: string
    noStore?: boolean
  },
): NextResponse {
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(self)')
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin')
  response.headers.set('Origin-Agent-Cluster', '?1')
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  response.headers.set('X-Robots-Tag', 'noindex, nofollow')

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

  if (options?.contentSecurityPolicy) {
    response.headers.set('Content-Security-Policy', options.contentSecurityPolicy)
  }

  if (options?.noStore) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  return response
}

export function jsonNoStore(body: unknown, init?: ResponseInit): NextResponse {
  return applySecurityHeaders(NextResponse.json(body, init), { noStore: true })
}

export function htmlNoStore(
  html: string,
  init?: ResponseInit,
  contentSecurityPolicy?: string,
): NextResponse {
  return applySecurityHeaders(
    new NextResponse(html, {
      ...init,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        ...(init?.headers ?? {}),
      },
    }),
    {
      contentSecurityPolicy,
      noStore: true,
    },
  )
}

export function validateSameOrigin(
  request: RequestLike,
  options?: { allowMissingOrigin?: boolean },
): NextResponse | null {
  const origin = normalizeOrigin(request.headers.get('origin'))
  const referer = normalizeOrigin(request.headers.get('referer'))
  const secFetchSite = request.headers.get('sec-fetch-site')
  const allowedOrigins = getAllowedOrigins(request)

  if (origin && !allowedOrigins.includes(origin)) {
    return jsonNoStore({ error: 'Invalid origin' }, { status: 403 })
  }

  if (!origin && referer && !allowedOrigins.includes(referer)) {
    return jsonNoStore({ error: 'Invalid referer' }, { status: 403 })
  }

  if (!origin && !referer && !options?.allowMissingOrigin && secFetchSite === 'cross-site') {
    return jsonNoStore({ error: 'Cross-site requests are not allowed' }, { status: 403 })
  }

  return null
}

export async function readJsonBody<T>(
  request: Request,
  options?: { maxBytes?: number },
): Promise<{ data: T } | { response: NextResponse }> {
  const contentType = request.headers.get('content-type') || ''
  if (!contentType.toLowerCase().includes('application/json')) {
    return { response: jsonNoStore({ error: 'Content-Type must be application/json' }, { status: 415 }) }
  }

  const maxBytes = options?.maxBytes ?? DEFAULT_JSON_LIMIT_BYTES
  const contentLength = Number.parseInt(request.headers.get('content-length') || '0', 10)
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return { response: jsonNoStore({ error: 'Request payload too large' }, { status: 413 }) }
  }

  let rawBody = ''
  try {
    rawBody = await request.text()
  } catch {
    return { response: jsonNoStore({ error: 'Could not read request body' }, { status: 400 }) }
  }

  if (!rawBody.trim()) {
    return { response: jsonNoStore({ error: 'Request body is required' }, { status: 400 }) }
  }

  if (Buffer.byteLength(rawBody, 'utf8') > maxBytes) {
    return { response: jsonNoStore({ error: 'Request payload too large' }, { status: 413 }) }
  }

  try {
    return { data: JSON.parse(rawBody) as T }
  } catch {
    return { response: jsonNoStore({ error: 'Invalid JSON body' }, { status: 400 }) }
  }
}

function getRateLimitFingerprint(request: RequestLike): string {
  const ip = request.ip
    || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  return `${ip}:${userAgent.slice(0, 120)}`
}

export function applyRateLimit(
  request: RequestLike,
  key: string,
  options: { limit: number; windowMs: number },
): NextResponse | null {
  const now = Date.now()
  const fingerprint = `${key}:${getRateLimitFingerprint(request)}`
  const current = rateLimitStore.get(fingerprint)

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(fingerprint, {
      count: 1,
      resetAt: now + options.windowMs,
    })
    return null
  }

  if (current.count >= options.limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000))
    const response = jsonNoStore(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    )
    response.headers.set('Retry-After', String(retryAfterSeconds))
    return response
  }

  current.count += 1
  rateLimitStore.set(fingerprint, current)
  return null
}

export function reportHtmlContentSecurityPolicy(options?: { scriptHashes?: string[] }): string {
  const scriptHashes = options?.scriptHashes ?? []
  const scriptDirective = scriptHashes.length > 0
    ? `script-src ${scriptHashes.map(hash => `'sha256-${hash}'`).join(' ')}`
    : "script-src 'none'"

  return [
    "default-src 'none'",
    "img-src 'self' data: blob: https:",
    "style-src 'unsafe-inline' https://fonts.googleapis.com",
    "font-src https://fonts.gstatic.com data:",
    scriptDirective,
    "connect-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'none'",
    "form-action 'none'",
  ].join('; ')
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function isBase64Like(value: string): boolean {
  return /^[A-Za-z0-9+/=]+$/.test(value)
}

export function sanitizeRedirectPath(
  value: string | null | undefined,
  fallback = '/dashboard',
): string {
  const candidate = typeof value === 'string' ? value.trim() : ''

  if (!candidate || candidate.length > 2048) {
    return fallback
  }

  if (!candidate.startsWith('/') || candidate.startsWith('//') || candidate.includes('\\')) {
    return fallback
  }

  try {
    const normalized = new URL(candidate, 'https://autofleet-pro.local')
    return `${normalized.pathname}${normalized.search}${normalized.hash}`
  } catch {
    return fallback
  }
}
