import { describe, expect, it } from 'vitest'
import { sanitizeRedirectPath } from '@/lib/security'

describe('security helpers', () => {
  it('keeps safe internal redirect paths', () => {
    expect(sanitizeRedirectPath('/vehicles/abc?tab=docs#top')).toBe('/vehicles/abc?tab=docs#top')
  })

  it('rejects external or malformed redirect targets', () => {
    expect(sanitizeRedirectPath('https://evil.example')).toBe('/dashboard')
    expect(sanitizeRedirectPath('//evil.example/path')).toBe('/dashboard')
    expect(sanitizeRedirectPath('\\evil')).toBe('/dashboard')
  })
})
