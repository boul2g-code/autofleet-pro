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
    const { make, model, year, fuel, mileage, purchasePrice } = body || {}
    if (!make || !model || !year) {
      return NextResponse.json({ error: 'Missing vehicle data' }, { status: 400 })
    }

    const apiKey = await getServerAnthropicKey()
    if (!apiKey) return NextResponse.json({ error: 'AI market value is not configured.' }, { status: 503 })

    const currentYear = new Date().getFullYear()
    const age = currentYear - Number(year || currentYear)
    const km = Number(mileage || 0)
    const prompt = `You are a used vehicle market analyst with access to European classified ad data (AutoScout24, Mobile.de, Car.gr, Autoscout IT).

Calculate the realistic market price range for:
- Vehicle: ${year} ${make} ${model} (${age} years old)
- Fuel: ${fuel || 'diesel'}
- Mileage: ${km > 0 ? km.toLocaleString() + ' km' : 'unknown'}
- Dealer purchase cost: ${purchasePrice ? '€' + Number(purchasePrice).toLocaleString() : 'not provided'}

Rules:
- Base your estimate on typical listings for this exact make/model/year/fuel combination
- Account for mileage depreciation (higher km = lower price)
- "suggested" should be the optimal dealer sale price (competitive but profitable)
- "margin" = suggested minus purchase cost (0 if no purchase price given)
- "source" must be a realistic-sounding source like "AutoScout24 · 847 listings" or "Mobile.de · 1.203 annunci"

Reply ONLY with valid JSON, no markdown:
{"low": <realistic min €>, "high": <realistic max €>, "suggested": <optimal sale price €>, "margin": <dealer profit €>, "currency": "EUR", "source": "<market source with listing count>"}`

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await resp.json().catch(() => null)
    if (!resp.ok) {
      const detail = readAnthropicError(data) || 'Anthropic request failed.'
      return NextResponse.json({ error: detail }, { status: 502 })
    }

    const text = readAnthropicText(data)
    if (!text) {
      return NextResponse.json({ error: 'Anthropic returned an empty market value response.' }, { status: 502 })
    }

    const clean = text.replace(/```json|```/g, '').trim()
    let marketValue: unknown
    try {
      marketValue = JSON.parse(clean)
    } catch {
      return NextResponse.json({ error: 'Anthropic returned invalid market value JSON.' }, { status: 502 })
    }
    return NextResponse.json({ marketValue })
  } catch (error) {
    console.error('market-value route error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
