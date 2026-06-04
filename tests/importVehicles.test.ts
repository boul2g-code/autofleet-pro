import { describe, expect, it } from 'vitest'
import { getImportPreview, rowToVehiclePatch } from '../lib/importVehicles'

describe('import helpers', () => {
  it('keeps a 20-row preview without truncating the import dataset', () => {
    const rows = Array.from({ length: 137 }, (_, index) => ({ Make: `Car ${index + 1}` }))
    const preview = getImportPreview(rows)

    expect(rows).toHaveLength(137)
    expect(preview).toHaveLength(20)
    expect(preview[0]).toEqual({ Make: 'Car 1' })
    expect(preview[19]).toEqual({ Make: 'Car 20' })
  })

  it('maps a sheet row into a vehicle patch', () => {
    const patch = rowToVehiclePatch({
      Make: 'Audi',
      Model: 'A4',
      Year: '2021',
      Mileage: '87,400 km',
      Price: '18.500',
      Plate: 'AN12345',
    })

    expect(patch).toMatchObject({
      make: 'Audi',
      model: 'A4',
      year: 2021,
      mileage: 87400,
      plate: 'AN12345',
      purchase: {
        price: 18500,
      },
    })
  })
})
