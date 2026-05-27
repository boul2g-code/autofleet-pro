import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { CreateUploadUrlInput, DocType } from '@/lib/types'
import { DOC_TYPES, fileExtensionFromMimeType, genUuid, isUuid } from '@/lib/utils'
import { MAX_DOCUMENT_UPLOAD_BYTES, isSupportedDocumentMimeType } from '@/lib/uploads'
import { applyRateLimit, jsonNoStore, readJsonBody, validateSameOrigin } from '@/lib/security'

function isDocType(value: string): value is DocType {
  return (DOC_TYPES as readonly string[]).includes(value)
}

export async function POST(req: NextRequest) {
  try {
    const originError = validateSameOrigin(req, { allowMissingOrigin: true })
    if (originError) return originError

    const rateLimitError = applyRateLimit(req, 'create-upload-url', { limit: 40, windowMs: 60_000 })
    if (rateLimitError) return rateLimitError

    const parsedBody = await readJsonBody<CreateUploadUrlInput>(req, { maxBytes: 16 * 1024 })
    if ('response' in parsedBody) return parsedBody.response

    const body = parsedBody.data
    const { vehicleId, documentType, mimeType, sizeBytes } = body

    if (!vehicleId || !documentType || !mimeType || typeof sizeBytes !== 'number') {
      return jsonNoStore({ error: 'Missing params' }, { status: 400 })
    }

    if (!isUuid(vehicleId)) {
      return jsonNoStore({ error: 'vehicleId must be a UUID' }, { status: 400 })
    }

    if (!isDocType(documentType)) {
      return jsonNoStore({ error: 'Unsupported documentType' }, { status: 400 })
    }

    if (!isSupportedDocumentMimeType(mimeType)) {
      return jsonNoStore({ error: 'Unsupported mimeType' }, { status: 400 })
    }

    if (sizeBytes <= 0 || sizeBytes > MAX_DOCUMENT_UPLOAD_BYTES) {
      return jsonNoStore({ error: `Files must be ${Math.round(MAX_DOCUMENT_UPLOAD_BYTES / (1024 * 1024))} MB or smaller` }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return jsonNoStore({ error: 'Unauthorized' }, { status: 401 })

    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select('id, business_id')
      .eq('id', vehicleId)
      .single()

    if (vehicleError || !vehicle) {
      return jsonNoStore({ error: 'Vehicle not found' }, { status: 404 })
    }

    const documentId = genUuid()
    const extension = fileExtensionFromMimeType(mimeType)
    const path = `${user.id}/${vehicleId}/${documentType}/${documentId}.${extension}`

    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUploadUrl(path)

    if (error || !data?.token) {
      console.error('create-upload-url error:', error)
      return jsonNoStore({ error: 'Could not create upload URL' }, { status: 500 })
    }

    return jsonNoStore({
      documentId,
      path,
      token: data.token,
    })
  } catch (error) {
    console.error('create-upload-url unexpected error:', error)
    return jsonNoStore({ error: 'Unexpected error' }, { status: 500 })
  }
}
