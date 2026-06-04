import { NextResponse } from 'next/server'
import { getServerAnthropicKey } from '@/lib/server/anthropic'

export async function POST(req: Request) {
  try {
    const { vehicle, targetLang, marketplace } = await req.json()
    const key = await getServerAnthropicKey()
    if (!key) return NextResponse.json({ error: 'No API key' }, { status: 400 })

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
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 600, messages: [{ role: 'user', content: prompt }] }),
    })
    if (!res.ok) {
      const errText = await res.text()
      console.error('Anthropic ai-description error:', res.status, errText)
      return NextResponse.json({ error: 'AI service error' }, { status: 502 })
    }
    const data = await res.json()
    const description = data.content?.[0]?.text?.trim() || ''
    if (!description) {
      console.error('Empty description from Anthropic')
      return NextResponse.json({ error: 'Empty AI response' }, { status: 422 })
    }
    return NextResponse.json({ description })
  } catch (e) {
    console.error('ai-description route error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
