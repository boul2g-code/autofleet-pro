import { describe, expect, it } from 'vitest'
import { escapeHtml, escapeHtmlWithBreaks, sanitizeImageSrc } from '@/lib/html'

describe('html helpers', () => {
  it('escapes user-controlled html', () => {
    expect(escapeHtml(`<img src=x onerror='alert(1)'>`)).toBe('&lt;img src=x onerror=&#39;alert(1)&#39;&gt;')
  })

  it('preserves line breaks safely', () => {
    expect(escapeHtmlWithBreaks('line 1\n<script>alert(1)</script>')).toBe('line 1<br>&lt;script&gt;alert(1)&lt;/script&gt;')
  })

  it('allows only safe image sources', () => {
    expect(sanitizeImageSrc('https://example.com/car.jpg')).toBe('https://example.com/car.jpg')
    expect(sanitizeImageSrc('data:image/png;base64,abc123')).toBe('data:image/png;base64,abc123')
    expect(sanitizeImageSrc('javascript:alert(1)')).toBe('')
  })
})
