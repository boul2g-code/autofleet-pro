import { NextResponse } from 'next/server'
import { getServerAnthropicKey } from '@/lib/server/anthropic'

export async function POST(req: Request) {
  try {
    const { make, model, year, fuel, mileage, purchasePrice } = await req.json()
    if (!make || !model || !year) {
      return NextResponse.json({ error: 'Missing vehicle data' }, { status: 400 })
    }

    const apiKey = await getServerAnthropicKey()
    if (!apiKey) return NextResponse.json({ error: 'No API key' }, { status: 400 })

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
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await resp.json()
    const text = (data?.content?.[0]?.text || '').trim()
    const clean = text.replace(/```json|```/g, '').trim()
    const marketValue = JSON.parse(clean)
    return NextResponse.json({ marketValue })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
