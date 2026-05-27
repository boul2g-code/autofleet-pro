import { describe, expect, it } from 'vitest'
import {
  MAX_DOCUMENT_UPLOAD_BYTES,
  MAX_VEHICLE_PHOTO_BYTES,
  formatFileSize,
  validateDocumentUpload,
  validateVehiclePhotoUpload,
} from '@/lib/uploads'

describe('upload validation', () => {
  it('accepts supported document uploads', () => {
    expect(
      validateDocumentUpload({
        name: 'invoice.pdf',
        type: 'application/pdf',
        size: 1024,
      }),
    ).toBeNull()
  })

  it('rejects unsupported document uploads', () => {
    expect(
      validateDocumentUpload({
        name: 'notes.txt',
        type: 'text/plain',
        size: 512,
      }),
    ).toBe('Unsupported document type. Use PDF, JPG, PNG, or WEBP.')
  })

  it('rejects oversized documents', () => {
    expect(
      validateDocumentUpload({
        name: 'big.pdf',
        type: 'application/pdf',
        size: MAX_DOCUMENT_UPLOAD_BYTES + 1,
      }),
    ).toBe(`Documents must be ${formatFileSize(MAX_DOCUMENT_UPLOAD_BYTES)} or smaller.`)
  })

  it('rejects unsupported vehicle photos', () => {
    expect(
      validateVehiclePhotoUpload({
        name: 'car.gif',
        type: 'image/gif',
        size: 1000,
      }),
    ).toBe('Vehicle photos must be JPG, PNG, or WEBP.')
  })

  it('rejects oversized vehicle photos', () => {
    expect(
      validateVehiclePhotoUpload({
        name: 'car.jpg',
        type: 'image/jpeg',
        size: MAX_VEHICLE_PHOTO_BYTES + 1,
      }),
    ).toBe(`Vehicle photos must be ${formatFileSize(MAX_VEHICLE_PHOTO_BYTES)} or smaller.`)
  })
})
