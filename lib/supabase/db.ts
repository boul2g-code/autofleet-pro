import { createClient } from './client'
import type { Vehicle, AppSettings, Organization } from '../types'

type VehicleWithMeta = Vehicle & { _dbData?: Record<string, unknown> }
type SettingsRow = {
  key: string
  value: string
  organization_id?: string | null
  org_id?: string | null
  org_data?: unknown
  lang?: string | null
  anthropic_key?: string | null
}

const VEHICLE_DATA_KEYS = [
  'make',
  'model',
  'year',
  'vin',
  'plate',
  'color',
  'fuelType',
  'gearType',
  'engineCC',
  'powerKW',
  'mileage',
  'seats',
  'doors',
  'weightKg',
  'payloadKg',
  'photo',
  'notes',
  'purchase',
  'transportIn',
  'storage',
  'sale',
  'transportOut',
  'documents',
] as const

// ── Vehicles ────────────────────────────────────────────────

export async function dbGetVehicles(): Promise<Vehicle[]> {
  const sb = createClient()
  const { data, error } = await sb
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('dbGetVehicles error:', error)
    return []
  }
  return (data || []).map(row => rowToVehicle(row as Record<string, unknown>))
}

export async function dbGetVehicle(id: string): Promise<Vehicle | null> {
  const sb = createClient()
  const { data, error } = await sb
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .single()
  if (error || !data) return null
  return rowToVehicle(data as Record<string, unknown>)
}

export async function dbCreateVehicle(v: Partial<Vehicle>): Promise<Vehicle | null> {
  const sb = createClient()
  const { data: { user }, error: authErr } = await sb.auth.getUser()
  if (authErr || !user) {
    console.error('dbCreateVehicle: not authenticated', authErr)
    return null
  }

  const settingsRows = await readSettingsRows(user.id)
  const row = vehicleToRow(v)
  row.user_id = user.id

  const currentOrgId = getCurrentOrgId(settingsRows)
  if (currentOrgId) row.organization_id = currentOrgId

  const { data, error } = await sb
    .from('vehicles')
    .insert(row)
    .select()
    .single()

  if (error) {
    console.error('dbCreateVehicle error:', error)
    return null
  }
  return rowToVehicle(data as Record<string, unknown>)
}

export async function dbUpdateVehicle(id: string, v: Partial<Vehicle>): Promise<boolean> {
  const sb = createClient()
  const row = vehicleToRow(v)
  row.updated_at = new Date().toISOString()
  const { error } = await sb.from('vehicles').update(row).eq('id', id)
  if (error) {
    console.error('dbUpdateVehicle error:', error)
    return false
  }
  return true
}

export async function dbDeleteVehicle(id: string): Promise<boolean> {
  const sb = createClient()
  const { error } = await sb.from('vehicles').delete().eq('id', id)
  if (error) {
    console.error('dbDeleteVehicle error:', error)
    return false
  }
  return true
}

// ── Settings ────────────────────────────────────────────────

export async function dbGetSettings(): Promise<AppSettings | null> {
  const sb = createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return null

  const rows = await readSettingsRows(user.id)
  if (rows.length === 0) return null

  return settingsRowsToAppSettings(rows)
}

export async function dbSaveSettings(s: Partial<AppSettings>): Promise<boolean> {
  const sb = createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return false

  const existingRows = await readSettingsRows(user.id)
  const nextSettings = mergeSettings(settingsRowsToAppSettings(existingRows) || { lang: 'el' }, s)
  const now = new Date().toISOString()
  const currentOrgId = normalizeUuid(nextSettings.org?.id) || getCurrentOrgId(existingRows)
  const existingAppRow = existingRows.find(row => row.key === 'app')
  const existingAppData = safeParseJsonObject(existingAppRow?.value)

  const appPayload: Record<string, unknown> = {
    ...existingAppData,
    companyName: nextSettings.org?.name || '',
    companyDE: nextSettings.org?.address_de || '',
    companyGR: nextSettings.org?.address_gr || '',
    apiKey: nextSettings.anthropicKey || '',
  }

  const { error } = await sb.from('settings').upsert([
    {
      user_id: user.id,
      key: 'lang',
      value: nextSettings.lang,
      lang: nextSettings.lang,
      organization_id: currentOrgId ?? null,
      org_id: currentOrgId ?? null,
      updated_at: now,
    },
    {
      user_id: user.id,
      key: 'app',
      value: JSON.stringify(appPayload),
      lang: nextSettings.lang,
      organization_id: currentOrgId ?? null,
      org_id: currentOrgId ?? null,
      org_data: nextSettings.org ?? null,
      anthropic_key: nextSettings.anthropicKey || null,
      updated_at: now,
    },
  ], { onConflict: 'user_id,key' })

  if (error) {
    console.error('dbSaveSettings error:', error)
    return false
  }
  return true
}

// ── Org ─────────────────────────────────────────────────────

export async function dbGetOrg(): Promise<Organization | null> {
  return (await dbGetSettings())?.org || null
}

export async function dbSaveOrg(org: Organization): Promise<boolean> {
  const current = await dbGetSettings()
  return dbSaveSettings({ ...(current || { lang: 'el' }), org })
}

// ── Row converters ───────────────────────────────────────────

export function settingsRowsToAppSettings(rows: SettingsRow[]): AppSettings | null {
  if (rows.length === 0) return null

  const langRow = rows.find(row => row.key === 'lang')
  const appRow = rows.find(row => row.key === 'app')
  const appData = safeParseJsonObject(appRow?.value)
  const orgDataRow = rows.find(row => isRecord(row.org_data))
  const currentOrgId = getCurrentOrgId(rows)

  const orgRecord = isRecord(orgDataRow?.org_data)
    ? { ...(orgDataRow?.org_data as Record<string, unknown>) }
    : {}

  const orgName = getString(appData.companyName) || getString(orgRecord.name)
  const addressDe = getString(appData.companyDE) || getString(orgRecord.address_de)
  const addressGr = getString(appData.companyGR) || getString(orgRecord.address_gr)

  const org = orgName || addressDe || addressGr || currentOrgId
    ? {
        ...recordToOrganization(orgRecord),
        id: getString(orgRecord.id) || currentOrgId || 'default',
        name: orgName || 'AutoFleet Pro',
        address_de: addressDe,
        address_gr: addressGr,
      }
    : undefined

  return {
    lang: normalizeLang(langRow?.lang || langRow?.value || appRow?.lang || 'el'),
    anthropicKey: getString(appData.apiKey) || appRow?.anthropic_key || '',
    org,
  }
}

export function rowToVehicle(row: Record<string, unknown>): Vehicle {
  const data = isRecord(row.data) ? { ...row.data } : {}
  const inspection = Array.isArray(row.inspection)
    ? (row.inspection as Vehicle['inspection'])
    : Array.isArray(data.inspection)
      ? (data.inspection as Vehicle['inspection'])
      : []

  const vehicle: VehicleWithMeta = {
    id: getString(row.id) || '',
    org_id: getString(row.organization_id) || getString(row.org_id),
    created_at: getString(row.created_at),
    updated_at: getString(row.updated_at),
    category: (getString(row.category) as Vehicle['category'] | undefined) || 'car',
    make: getString(data.make),
    model: getString(data.model),
    year: getNumber(data.year),
    vin: getString(data.vin),
    plate: getString(data.plate),
    color: getString(data.color),
    fuelType: getString(data.fuelType) as Vehicle['fuelType'] | undefined,
    gearType: getString(data.gearType) as Vehicle['gearType'] | undefined,
    engineCC: getNumber(data.engineCC),
    powerKW: getNumber(data.powerKW),
    mileage: getNumber(data.mileage),
    seats: getNumber(data.seats),
    doors: getNumber(data.doors),
    weightKg: getNumber(data.weightKg),
    payloadKg: getNumber(data.payloadKg),
    status: (getString(row.status) as Vehicle['status'] | undefined) || 'purchased',
    photo: getString(data.photo),
    notes: getString(data.notes),
    purchase: recordOrUndefined(data.purchase) as Vehicle['purchase'],
    transportIn: recordOrUndefined(data.transportIn) as Vehicle['transportIn'],
    storage: recordOrUndefined(data.storage) as Vehicle['storage'],
    sale: recordOrUndefined(data.sale) as Vehicle['sale'],
    transportOut: recordOrUndefined(data.transportOut) as Vehicle['transportOut'],
    documents: Array.isArray(data.documents) ? (data.documents as Vehicle['documents']) : [],
    inspection,
    _dbData: data,
  }

  return vehicle
}

export function vehicleToRow(v: Partial<Vehicle>): Record<string, unknown> {
  const meta = v as VehicleWithMeta
  const data: Record<string, unknown> = isRecord(meta._dbData) ? { ...meta._dbData } : {}

  for (const key of VEHICLE_DATA_KEYS) {
    const value = meta[key]
    if (value !== undefined) data[key] = value
  }

  const row: Record<string, unknown> = {
    data,
  }

  if (v.category !== undefined) row.category = v.category
  if (v.status !== undefined) row.status = v.status
  if (v.inspection !== undefined) row.inspection = v.inspection

  return row
}

// ── Helpers ────────────────────────────────────────────────

async function readSettingsRows(userId: string): Promise<SettingsRow[]> {
  const sb = createClient()
  const { data, error } = await sb
    .from('settings')
    .select('key,value,organization_id,org_id,org_data,lang,anthropic_key')
    .eq('user_id', userId)

  if (error) {
    console.error('settings read error:', error)
    return []
  }

  return (data || []) as SettingsRow[]
}

function getCurrentOrgId(rows: SettingsRow[]): string | undefined {
  for (const row of rows) {
    const direct = normalizeUuid(row.organization_id) || normalizeUuid(row.org_id)
    if (direct) return direct
    if (isRecord(row.org_data)) {
      const embedded = normalizeUuid(getString(row.org_data.id))
      if (embedded) return embedded
    }
  }
  return undefined
}

function mergeSettings(current: AppSettings, patch: Partial<AppSettings>): AppSettings {
  return {
    lang: patch.lang || current.lang || 'el',
    anthropicKey: patch.anthropicKey ?? current.anthropicKey ?? '',
    org: patch.org
      ? {
          ...(current.org || { id: 'default', name: '' }),
          ...patch.org,
        }
      : current.org,
  }
}

function recordToOrganization(record: Record<string, unknown>): Organization {
  return {
    id: getString(record.id) || 'default',
    name: getString(record.name) || 'AutoFleet Pro',
    country: getString(record.country),
    address_de: getString(record.address_de),
    address_gr: getString(record.address_gr),
    vat_number: getString(record.vat_number),
    phone: getString(record.phone),
    email: getString(record.email),
    logo_url: getString(record.logo_url),
    plan: getString(record.plan),
    status: getString(record.status),
    trial_ends_at: getString(record.trial_ends_at),
  }
}

function recordOrUndefined(value: unknown): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined
}

function safeParseJsonObject(value: unknown): Record<string, unknown> {
  if (typeof value !== 'string' || value.trim() === '') return {}
  try {
    const parsed = JSON.parse(value)
    return isRecord(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

function normalizeLang(value: string): AppSettings['lang'] {
  const allowed = new Set(['el', 'en', 'de', 'fr', 'it', 'es'])
  return allowed.has(value) ? (value as AppSettings['lang']) : 'el'
}

function normalizeUuid(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    ? value
    : undefined
}

function getString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function getNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }
  return undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
