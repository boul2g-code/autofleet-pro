import { beforeEach, describe, expect, it, vi } from 'vitest'

const exchangeCodeForSession = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      exchangeCodeForSession,
    },
  })),
}))

describe('GET /auth/callback', () => {
  beforeEach(() => {
    exchangeCodeForSession.mockReset()
  })

  it('redirects to a sanitized internal path after successful auth', async () => {
    exchangeCodeForSession.mockResolvedValue({ error: null })
    const { GET } = await import('@/app/auth/callback/route')

    const response = await GET(
      new Request('https://autofleet-pro.vercel.app/auth/callback?code=test-code&next=https://evil.example/phish'),
    )

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('https://autofleet-pro.vercel.app/dashboard')
    expect(response.headers.get('cache-control')).toContain('no-store')
  })

  it('redirects to login on auth exchange failure', async () => {
    exchangeCodeForSession.mockResolvedValue({ error: { message: 'nope' } })
    const { GET } = await import('@/app/auth/callback/route')

    const response = await GET(
      new Request('https://autofleet-pro.vercel.app/auth/callback?code=test-code&next=/settings'),
    )

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('https://autofleet-pro.vercel.app/login?error=auth_callback_failed')
    expect(response.headers.get('x-frame-options')).toBe('DENY')
  })
})
