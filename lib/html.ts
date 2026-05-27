export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function escapeHtmlWithBreaks(value: unknown): string {
  return escapeHtml(value).replace(/\r?\n/g, '<br>')
}

export function sanitizeImageSrc(value: unknown): string {
  if (typeof value !== 'string') return ''

  const trimmed = value.trim()
  if (!trimmed) return ''

  const isSafeRemote = trimmed.startsWith('https://') || trimmed.startsWith('http://')
  const isSafeDataUrl = /^data:image\/(?:png|jpeg|jpg|webp|gif);base64,/i.test(trimmed)

  return isSafeRemote || isSafeDataUrl ? trimmed : ''
}
