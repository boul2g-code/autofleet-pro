import { describe, expect, it } from 'vitest'
import { isPublicVehicleStatus } from '../lib/vehiclePublic'

describe('public vehicle gating', () => {
  it('allows only for-sale vehicles on the public page', () => {
    expect(isPublicVehicleStatus('for_sale')).toBe(true)
    expect(isPublicVehicleStatus('sold')).toBe(false)
    expect(isPublicVehicleStatus('delivered')).toBe(false)
    expect(isPublicVehicleStatus('purchased')).toBe(false)
    expect(isPublicVehicleStatus(undefined)).toBe(false)
  })
})
