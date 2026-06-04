import * as Sentry from '@sentry/nextjs'
import { NextResponse } from 'next/server'
import { getServerAnthropicKey } from '@/lib/server/anthropic'

export async function POST(req: Request) {
  try {
    const { docUrl, vehicleId } = await req.json()
    const apiKey = await getServerAnthropicKey()
    if (!apiKey) return NextResponse.json({ error: 'No API key' }, { status: 400 })

    const isImage = docUrl.startsWith('data:image')
    const isPdf = docUrl.startsWith('data:application/pdf')

    const content: unknown[] = []
    if (isImage) {
      const [header, data] = docUrl.split(',')
      const mediaType = header.match(/data:([^;]+)/)?.[1] || 'image/jpeg'
      content.push({ type: 'image', source: { type: 'base64', media_type: mediaType, data } })
    } else if (isPdf) {
      const [, data] = docUrl.split(',')
      content.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data } })
    } else {
      content.push({ type: 'text', text: 'Document preview not available' })
    }

    content.push({
      type: 'text',
      text: `Extract vehicle data from this document and return ONLY a JSON object with any of these fields you can find:
      { "make": string, "model": string, "year": number, "vin": string, "plate": string, "engineCC": number, "powerKW": number, "mileage": number, "color": string, "fuelType": string,
        "purchase": { "price": number, "date": string, "invoiceNumber": string, "sellerName": string, "sellerCountry": string, "vatAmount": number },
        "sale": { "price": number, "date": string, "buyerName": string }
      }
      Return ONLY valid JSON, no explanation.`,
    })

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1000,
        messages: [{ role: 'user', content }],
      }),
    })

    const data = await res.json()
    const text = data.content?.[0]?.text || '{}'
    const clean = text.replace(/```json|```/g, '').trim()
    const patch = JSON.parse(clean)

    return NextResponse.json({ patch, vehicleId })
  } catch (e) {
    Sentry.captureException(e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
