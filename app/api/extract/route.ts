import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { applyRateLimit, isBase64Like, jsonNoStore, readJsonBody, validateSameOrigin } from '@/lib/security'

export const runtime = 'nodejs'

const MAX_BASE64_SIZE = 12 * 1024 * 1024

const SYSTEM_PROMPT = `You are a document data extractor for a vehicle trading company.
Extract all vehicle-related data and return ONLY a valid JSON object. No markdown, no code fences, pure JSON.
Fields (use null if not found): vin, make, model, year, color, engine, fuel (diesel|petrol|electric|hybrid|lpg),
gearbox (manual|automatic), mileage, firstReg (YYYY-MM-DD), regCountry, plate, seats, payload, cocNum,
purchaseDate (YYYY-MM-DD), sellerName, sellerCountry, priceNet, priceGross, vatRate, purchaseInvoiceNum,
cmrNumber, carrier, origin, destination, departureDate (YYYY-MM-DD), arrivalDate (YYYY-MM-DD), truckPlate, driver,
saleBuyerName, saleBuyerCountry, saleDate (YYYY-MM-DD), salePriceNet, salePriceGross, saleInvoiceNum`

interface ExtractRequestBody {
  base64Data?: string
  mimeType?: string
}

export async function POST(req: NextRequest) {
  try {
    const originError = validateSameOrigin(req, { allowMissingOrigin: true })
    if (originError) return originError

    const rateLimitError = applyRateLimit(req, 'ai-extract', { limit: 8, windowMs: 5 * 60_000 })
    if (rateLimitError) return rateLimitError

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return jsonNoStore({ error: 'Unauthorized' }, { status: 401 })

    const parsedBody = await readJsonBody<ExtractRequestBody>(req, { maxBytes: 16 * 1024 * 1024 })
    if ('response' in parsedBody) return parsedBody.response

    const { base64Data, mimeType } = parsedBody.data
    if (!base64Data || !mimeType) {
      return jsonNoStore({ error: 'Missing params' }, { status: 400 })
    }

    if (base64Data.length > MAX_BASE64_SIZE) {
      return jsonNoStore({ error: 'Document too large for AI extraction' }, { status: 413 })
    }

    if (!isBase64Like(base64Data)) {
      return jsonNoStore({ error: 'Invalid document encoding' }, { status: 400 })
    }

    const key = process.env.ANTHROPIC_API_KEY
    if (!key) {
      return jsonNoStore({ error: 'AI extraction is not configured on the server' }, { status: 503 })
    }

    const normalizedMimeType = mimeType.toLowerCase()
    const isPDF = normalizedMimeType === 'application/pdf'
    const isImage = ['image/jpeg', 'image/png', 'image/webp'].includes(normalizedMimeType)
    if (!isPDF && !isImage) {
      return jsonNoStore({ error: 'PDF, JPG, PNG, or WEBP only' }, { status: 400 })
    }

    const contentParts: unknown[] = [
      { type: 'text', text: 'Extract all vehicle data from this document.' },
      isPDF
        ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64Data } }
        : { type: 'image', source: { type: 'base64', media_type: normalizedMimeType, data: base64Data } },
    ]

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: contentParts }],
      }),
      signal: AbortSignal.timeout(45_000),
    })

    if (!res.ok) {
      console.error('anthropic extract error:', res.status)
      return jsonNoStore({ error: 'AI extraction failed' }, { status: 502 })
    }

    const data = await res.json()
    const raw = (data.content?.[0]?.text || '').replace(/```json\n?|```\n?/g, '').trim()

    let extracted: Record<string, unknown> = {}
    try {
      extracted = JSON.parse(raw)
    } catch {
      return jsonNoStore({ error: 'Invalid JSON from AI' }, { status: 422 })
    }

    const cleaned = Object.fromEntries(
      Object.entries(extracted).filter(([, value]) => value !== null && value !== ''),
    )

    return jsonNoStore({ data: cleaned, fieldCount: Object.keys(cleaned).length })
  } catch (err) {
    console.error('extract route unexpected error:', err)
    if (err instanceof Error && err.name === 'TimeoutError') {
      return jsonNoStore({ error: 'AI extraction timed out' }, { status: 504 })
    }
    return jsonNoStore({ error: 'Unexpected error' }, { status: 500 })
  }
}
