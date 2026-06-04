import { NextResponse } from 'next/server'
import { getServerAnthropicKey } from '@/lib/server/anthropic'

function readAnthropicText(data: unknown): string {
  if (!data || typeof data !== 'object') return ''
  const content = (data as { content?: Array<{ text?: string }> }).content
  const text = content?.[0]?.text
  return typeof text === 'string' ? text.trim() : ''
}

function readAnthropicError(data: unknown): string {
  if (!data || typeof data !== 'object') return ''
  const message = (data as { error?: { message?: string } }).error?.message
  return typeof message === 'string' ? message.trim() : ''
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    const { vehicle, targetLang, marketplace } = body || {}
    const key = await getServerAnthropicKey()
    if (!key) return NextResponse.json({ error: 'AI description is not configured.' }, { status: 503 })

    const langNames: Record<string, string> = {
      it: 'Italian', de: 'German', en: 'English', el: 'Greek', fr: 'French', es: 'Spanish'
    }

    const prompt = `You are an expert used car dealer copywriter. Write a compelling vehicle listing for ${marketplace}.
Vehicle: ${vehicle.make} ${vehicle.model} ${vehicle.year} | ${vehicle.mileage?.toLocaleString()} km | ${vehicle.fuelType} | ${vehicle.gearType} | ${vehicle.engineCC}cc/${vehicle.powerKW}kW | ${vehicle.color} | €${vehicle.salePrice || 'N/A'}
Notes: ${vehicle.notes || 'Good condition'}
Write in ${langNames[targetLang] || 'English'}.
Format exactly:
TITLE: [max 60 chars]
DESCRIPTION: [3-4 sentences]
HIGHLIGHTS:
• [point 1]
• [point 2]
• [point 3]
• [point 4]`

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 600, messages: [{ role: 'user', content: prompt }] }),
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      const detail = readAnthropicError(data) || 'Anthropic request failed.'
      return NextResponse.json({ error: detail }, { status: 502 })
    }

    const description = readAnthropicText(data)
    if (!description) {
      return NextResponse.json({ error: 'Anthropic returned an empty description.' }, { status: 422 })
    }
    return NextResponse.json({ description })
  } catch (e) {
    console.error('ai-description route error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
