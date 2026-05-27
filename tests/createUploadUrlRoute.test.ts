import { describe, expect, it } from 'vitest'
import { POST } from '@/app/api/create-upload-url/route'

const VEHICLE_ID = '11111111-1111-4111-8111-111111111111'

describe('POST /api/create-upload-url', () => {
  it('rejects unsupported mime types before hitting Supabase', async () => {
    const response = await POST(
      new Request('http://localhost/api/create-upload-url', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          vehicleId: VEHICLE_ID,
          documentType: 'invoice',
          mimeType: 'text/plain',
          sizeBytes: 1024,
        }),
      }),
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Unsupported mimeType' })
  })

  it('rejects oversized files before auth lookup', async () => {
    const response = await POST(
      new Request('http://localhost/api/create-upload-url', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          vehicleId: VEHICLE_ID,
          documentType: 'invoice',
          mimeType: 'application/pdf',
          sizeBytes: 20 * 1024 * 1024,
        }),
      }),
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Files must be 12 MB or smaller' })
  })

  it('rejects malformed vehicle ids', async () => {
    const response = await POST(
      new Request('http://localhost/api/create-upload-url', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          vehicleId: 'not-a-uuid',
          documentType: 'invoice',
          mimeType: 'application/pdf',
          sizeBytes: 1024,
        }),
      }),
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'vehicleId must be a UUID' })
  })
})
