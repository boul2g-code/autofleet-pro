const DOCUMENT_UPLOAD_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
])

const VEHICLE_PHOTO_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])

export const MAX_DOCUMENT_UPLOAD_BYTES = 12 * 1024 * 1024
export const MAX_VEHICLE_PHOTO_BYTES = 6 * 1024 * 1024
const PHOTO_RESIZE_THRESHOLD_BYTES = 2 * 1024 * 1024

interface UploadLike {
  name?: string
  type?: string
  size?: number
}

function normalizeMimeType(value: string | undefined): string {
  return (value ?? '').trim().toLowerCase()
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function isSupportedDocumentMimeType(value: string): boolean {
  return DOCUMENT_UPLOAD_MIME_TYPES.has(normalizeMimeType(value))
}

export function validateDocumentUpload(file: UploadLike): string | null {
  const mimeType = normalizeMimeType(file.type)
  const size = file.size ?? 0

  if (!mimeType || !isSupportedDocumentMimeType(mimeType)) {
    return `Unsupported document type. Use PDF, JPG, PNG, or WEBP.`
  }

  if (size <= 0) {
    return 'Empty files cannot be uploaded.'
  }

  if (size > MAX_DOCUMENT_UPLOAD_BYTES) {
    return `Documents must be ${formatFileSize(MAX_DOCUMENT_UPLOAD_BYTES)} or smaller.`
  }

  return null
}

export function validateVehiclePhotoUpload(file: UploadLike): string | null {
  const mimeType = normalizeMimeType(file.type)
  const size = file.size ?? 0

  if (!mimeType || !VEHICLE_PHOTO_MIME_TYPES.has(mimeType)) {
    return 'Vehicle photos must be JPG, PNG, or WEBP.'
  }

  if (size <= 0) {
    return 'Empty images cannot be uploaded.'
  }

  if (size > MAX_VEHICLE_PHOTO_BYTES) {
    return `Vehicle photos must be ${formatFileSize(MAX_VEHICLE_PHOTO_BYTES)} or smaller.`
  }

  return null
}

function readFileAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
    reader.onerror = () => reject(reader.error ?? new Error('Could not read image file'))
    reader.readAsDataURL(file)
  })
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Could not decode image'))
    image.src = dataUrl
  })
}

export async function prepareVehiclePhoto(file: File, maxDimension = 1600): Promise<string> {
  const originalDataUrl = await readFileAsDataUrl(file)

  try {
    const image = await loadImage(originalDataUrl)
    const longestSide = Math.max(image.naturalWidth, image.naturalHeight)
    const shouldResize = longestSide > maxDimension || file.size > PHOTO_RESIZE_THRESHOLD_BYTES

    if (!shouldResize) {
      return originalDataUrl
    }

    const scale = Math.min(1, maxDimension / longestSide)
    const width = Math.max(1, Math.round(image.naturalWidth * scale))
    const height = Math.max(1, Math.round(image.naturalHeight * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    if (!context) {
      return originalDataUrl
    }

    context.drawImage(image, 0, 0, width, height)

    const targetMimeType = normalizeMimeType(file.type) === 'image/png' ? 'image/png' : 'image/jpeg'
    const resizedDataUrl = canvas.toDataURL(targetMimeType, targetMimeType === 'image/png' ? undefined : 0.82)

    return resizedDataUrl.length < originalDataUrl.length ? resizedDataUrl : originalDataUrl
  } catch {
    return originalDataUrl
  }
}
