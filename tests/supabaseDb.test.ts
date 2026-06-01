import { describe, expect, it } from 'vitest'
import type { Vehicle } from '../lib/types'
import { rowToVehicle, settingsRowsToAppSettings, vehicleToRow } from '../lib/supabase/db'

describe('Supabase DB adapters', () => {
  it('maps the live vehicle schema into the app vehicle shape', () => {
    const vehicle = rowToVehicle({
      id: 'veh-1',
      organization_id: '819a1b3d-7a83-4c97-becf-89982d4a2dbc',
      created_at: '2026-06-01T10:00:00.000Z',
      updated_at: '2026-06-01T10:30:00.000Z',
      category: 'car',
      status: 'for_sale',
      inspection: [{ area: 'engine', condition: 'good' }],
      data: {
        make: 'BMW',
        model: '320d',
        year: 2020,
        mileage: 123456,
        purchase: { sellerName: 'Dealer GmbH' },
        documents: [{ id: 'doc-1', name: 'Invoice', type: 'invoice', uploadedAt: '2026-06-01' }],
        customFlag: true,
      },
    })

    expect(vehicle.id).toBe('veh-1')
    expect(vehicle.org_id).toBe('819a1b3d-7a83-4c97-becf-89982d4a2dbc')
    expect(vehicle.make).toBe('BMW')
    expect(vehicle.model).toBe('320d')
    expect(vehicle.year).toBe(2020)
    expect(vehicle.mileage).toBe(123456)
    expect(vehicle.status).toBe('for_sale')
    expect(vehicle.purchase?.sellerName).toBe('Dealer GmbH')
    expect(vehicle.documents).toHaveLength(1)
    expect((vehicle as Vehicle & { _dbData?: Record<string, unknown> })._dbData?.customFlag).toBe(true)
  })

  it('builds the live vehicle row payload without dropping unknown data keys', () => {
    const row = vehicleToRow({
      id: 'veh-1',
      category: 'truck',
      status: 'stored',
      make: 'Mercedes-Benz',
      model: 'Actros',
      mileage: 880000,
      inspection: [{ area: 'cab', condition: 'fair' }],
      _dbData: {
        customFlag: true,
        legacyField: 'keep-me',
      },
    } as Partial<Vehicle> & { _dbData: Record<string, unknown> })

    expect(row.category).toBe('truck')
    expect(row.status).toBe('stored')
    expect(row).not.toHaveProperty('make')
    expect(row).not.toHaveProperty('org_id')
    expect(row.data).toMatchObject({
      make: 'Mercedes-Benz',
      model: 'Actros',
      mileage: 880000,
      customFlag: true,
      legacyField: 'keep-me',
    })
    expect(row.inspection).toEqual([{ area: 'cab', condition: 'fair' }])
  })

  it('parses key/value settings rows from the live settings table', () => {
    const settings = settingsRowsToAppSettings([
      {
        key: 'lang',
        value: 'el',
        lang: 'el',
      },
      {
        key: 'app',
        value: JSON.stringify({
          companyName: 'AutoFleet Trading GmbH',
          companyDE: 'Berlin, Germany',
          companyGR: 'Athens, Greece',
          apiKey: 'sk-ant-test',
          defaultCurrency: 'EUR',
        }),
        organization_id: '819a1b3d-7a83-4c97-becf-89982d4a2dbc',
      },
    ])

    expect(settings).toEqual({
      lang: 'el',
      anthropicKey: 'sk-ant-test',
      org: {
        id: '819a1b3d-7a83-4c97-becf-89982d4a2dbc',
        name: 'AutoFleet Trading GmbH',
        address_de: 'Berlin, Germany',
        address_gr: 'Athens, Greece',
      },
    })
  })
})
