import { describe, expect, it } from 'vitest'
import { rowToVehicle, vehicleToRow } from '@/lib/supabase/vehicleMappers'

describe('vehicle mappers', () => {
  it('maps a vehicle into a database row payload', () => {
    expect(
      vehicleToRow({
        id: '11111111-1111-4111-8111-111111111111',
        businessId: 'VH-TEST123',
        createdAt: '2026-05-25T10:00:00.000Z',
        updatedAt: '2026-05-25T11:00:00.000Z',
        status: 'purchased',
        category: 'car',
        make: 'BMW',
        model: '320d',
        documents: [],
      }),
    ).toEqual({
      id: '11111111-1111-4111-8111-111111111111',
      business_id: 'VH-TEST123',
      created_at: '2026-05-25T10:00:00.000Z',
      updated_at: '2026-05-25T11:00:00.000Z',
      status: 'purchased',
      category: 'car',
      data: {
        make: 'BMW',
        model: '320d',
        documents: [],
      },
    })
  })

  it('drops malformed stored documents and derives fallback business ids', () => {
    const vehicle = rowToVehicle({
      id: '11111111-1111-4111-8111-111111111111',
      created_at: '2026-05-25T10:00:00.000Z',
      updated_at: '2026-05-25T11:00:00.000Z',
      user_id: 'user-1',
      status: 'for_sale',
      category: 'truck',
      data: {
        make: 'MAN',
        documents: [
          { id: 'ok', storagePath: 'docs/file.pdf' },
          { id: 'bad' },
          'wrong-shape',
        ],
      },
    })

    expect(vehicle.businessId).toBe('VH-111111111111')
    expect(vehicle.documents).toEqual([{ id: 'ok', storagePath: 'docs/file.pdf' }])
  })
})
