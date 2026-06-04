import { createClient } from './client'
import type { Vehicle, AppSettings, Organization } from '../types'

type SettingsRow = {
  key?: string | null
  value?: string | null
  lang?: string | null
  org_data?: unknown
  anthropic_key?: string | null
  org_id?: string | null
  organization_id?: string | null
}

const APP_SETTINGS_KEY = 'app'
const LANG_SETTINGS_KEY = 'lang'
const SUPPORTED_LANGS = new Set<AppSettings['lang']>(['el', 'en', 'de', 'fr', 'it', 'es'])

export type SettingsUpsertRow = {
  user_id: string
  key: string
  value: string
  lang: AppSettings['lang']
  org_data: Organization | null
  anthropic_key: string | null
  org_id: string | null
  organization_id: string | null
  updated_at: string
}

// ── Auth helper ──────────────────────────────────────────────
// Always call this before any DB operation.
// Returns the authenticated user or throws — never proceeds unauthenticated.
async function getAuthUser() {
  const sb = createClient()
  const { data: { user }, error } = await sb.auth.getUser()
  if (error || !user) throw new Error('Not authenticated')
  return { sb, user }
}

// ── Vehicles ────────────────────────────────────────────────
// Defense in depth: RLS (Layer 1) + application filter (Layer 2)
// Even if someone drops the RLS policy, the .eq('user_id') still protects.

export async function dbGetVehicles(): Promise<Vehicle[]> {
  const { sb, user } = await getAuthUser()
  const { data, error } = await sb
    .from('vehicles')
    .select('*')
    .eq('user_id', user.id)           // Layer 2: application-level filter
    .order('created_at', { ascending: false })
  if (error) {
    console.error('dbGetVehicles error:', error)
    return []
  }
  return (data || []).map(rowToVehicle)
}

export async function dbGetVehicle(id: string): Promise<Vehicle | null> {
  if (!id) return null
  const { sb, user } = await getAuthUser()
  const { data, error } = await sb
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)           // Layer 2: cannot fetch another dealer's vehicle by id
    .single()
  if (error || !data) return null
  return rowToVehicle(data)
}

export async function dbCreateVehicle(v: Partial<Vehicle>): Promise<Vehicle | null> {
  const { sb, user } = await getAuthUser()

  // Get org_id from settings
  const { data: settingsRow } = await sb
    .from('settings')
    .select('org_id, organization_id')
    .eq('user_id', user.id)
    .eq('key', APP_SETTINGS_KEY)
    .maybeSingle()

  const row = vehicleToRow(v)
  row.user_id = user.id               // Always stamp with authenticated user
  if (settingsRow?.org_id) row.org_id = settingsRow.org_id
  if (settingsRow?.organization_id) row.organization_id = settingsRow.organization_id

  const { data, error } = await sb
    .from('vehicles')
    .insert(row)
    .select()
    .single()

  if (error) {
    console.error('dbCreateVehicle error:', error)
    return null
  }
  return rowToVehicle(data)
}

export async function dbUpdateVehicle(id: string, v: Partial<Vehicle>): Promise<boolean> {
  const { sb, user } = await getAuthUser()
  const row = vehicleToRow(v)
  row.updated_at = new Date().toISOString()
  const { error } = await sb
    .from('vehicles')
    .update(row)
    .eq('id', id)
    .eq('user_id', user.id)           // Layer 2: cannot update another dealer's vehicle
  if (error) {
    console.error('dbUpdateVehicle error:', error)
    return false
  }
  return true
}

export async function dbDeleteVehicle(id: string): Promise<boolean> {
  const { sb, user } = await getAuthUser()
  const { error } = await sb
    .from('vehicles')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)           // Layer 2: cannot delete another dealer's vehicle
  if (error) {
    console.error('dbDeleteVehicle error:', error)
    return false
  }
  return true
}

// ── Settings ────────────────────────────────────────────────

export async function dbGetSettings(): Promise<AppSettings | null> {
  const { sb, user } = await getAuthUser().catch(() => ({ sb: createClient(), user: null }))
  if (!user) return null
  const { data, error } = await sb
    .from('settings')
    .select('key, value, lang, org_data, anthropic_key, org_id, organization_id')
    .eq('user_id', user.id)
  if (error) {
    console.error('dbGetSettings error:', error)
    return null
  }
  return parseSettingsRows((data || []) as SettingsRow[])
}

export async function dbSaveSettings(s: Partial<AppSettings>): Promise<boolean> {
  const { sb, user } = await getAuthUser()
  const { data: currentRows, error: readError } = await sb
    .from('settings')
    .select('key, value, lang, org_data, anthropic_key, org_id, organization_id')
    .eq('user_id', user.id)
  if (readError) {
    console.error('dbSaveSettings read error:', readError)
    return false
  }
  const rows = buildSettingsRows(user.id, s, (currentRows || []) as SettingsRow[])
  const { error } = await sb.from('settings').upsert(rows, { onConflict: 'user_id,key' })
  if (error) { console.error('dbSaveSettings error:', error); return false }
  return true
}

// ── Org ─────────────────────────────────────────────────────

export async function dbGetOrg(): Promise<Organization | null> {
  const settings = await dbGetSettings()
  return settings?.org || null
}

export async function dbSaveOrg(org: Organization): Promise<boolean> {
  return dbSaveSettings({ org })
}

// ── Row converters ───────────────────────────────────────────

function rowToVehicle(row: Record<string, unknown>): Vehicle {
  return {
    id: row.id as string,
    org_id: row.org_id as string | undefined,
    created_at: row.created_at as string | undefined,
    updated_at: row.updated_at as string | undefined,
    category: row.category as Vehicle['category'],
    make: row.make as string | undefined,
    model: row.model as string | undefined,
    year: row.year as number | undefined,
    vin: row.vin as string | undefined,
    plate: row.plate as string | undefined,
    color: row.color as string | undefined,
    fuelType: row.fuel_type as Vehicle['fuelType'],
    gearType: row.gear_type as Vehicle['gearType'],
    engineCC: row.engine_cc as number | undefined,
    powerKW: row.power_kw as number | undefined,
    mileage: row.mileage as number | undefined,
    seats: row.seats as number | undefined,
    doors: row.doors as number | undefined,
    weightKg: row.weight_kg as number | undefined,
    payloadKg: row.payload_kg as number | undefined,
    status: (row.status as Vehicle['status']) || 'purchased',
    photo: row.photo as string | undefined,
    notes: row.notes as string | undefined,
    purchase: row.purchase as Vehicle['purchase'],
    transportIn: row.transport_in as Vehicle['transportIn'],
    storage: row.storage as Vehicle['storage'],
    sale: row.sale as Vehicle['sale'],
    transportOut: row.transport_out as Vehicle['transportOut'],
    documents: (row.documents as Vehicle['documents']) || [],
    inspection: (row.inspection as Vehicle['inspection']) || [],
  }
}

function vehicleToRow(v: Partial<Vehicle>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (v.category !== undefined) row.category = v.category
  if (v.make !== undefined) row.make = v.make
  if (v.model !== undefined) row.model = v.model
  if (v.year !== undefined) row.year = v.year
  if (v.vin !== undefined) row.vin = v.vin
  if (v.plate !== undefined) row.plate = v.plate
  if (v.color !== undefined) row.color = v.color
  if (v.fuelType !== undefined) row.fuel_type = v.fuelType
  if (v.gearType !== undefined) row.gear_type = v.gearType
  if (v.engineCC !== undefined) row.engine_cc = v.engineCC
  if (v.powerKW !== undefined) row.power_kw = v.powerKW
  if (v.mileage !== undefined) row.mileage = v.mileage
  if (v.seats !== undefined) row.seats = v.seats
  if (v.doors !== undefined) row.doors = v.doors
  if (v.weightKg !== undefined) row.weight_kg = v.weightKg
  if (v.payloadKg !== undefined) row.payload_kg = v.payloadKg
  if (v.status !== undefined) row.status = v.status
  if (v.photo !== undefined) row.photo = v.photo
  if (v.notes !== undefined) row.notes = v.notes
  if (v.purchase !== undefined) row.purchase = v.purchase
  if (v.transportIn !== undefined) row.transport_in = v.transportIn
  if (v.storage !== undefined) row.storage = v.storage
  if (v.sale !== undefined) row.sale = v.sale
  if (v.transportOut !== undefined) row.transport_out = v.transportOut
  if (v.documents !== undefined) row.documents = v.documents
  if (v.inspection !== undefined) row.inspection = v.inspection
  return row
}

function toLang(value: string | null | undefined): AppSettings['lang'] {
  return value && SUPPORTED_LANGS.has(value as AppSettings['lang'])
    ? (value as AppSettings['lang'])
    : 'el'
}

function firstString(...values: Array<unknown>): string | undefined {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return undefined
}

function parseJsonObject(value: string | null | undefined): Record<string, unknown> | undefined {
  if (!value) return undefined
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : undefined
  } catch {
    return undefined
  }
}

function normalizeOrganization(value: unknown): Organization | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  const raw = value as Record<string, unknown>
  const org: Partial<Organization> = {}

  if (typeof raw.id === 'string') org.id = raw.id
  if (typeof raw.name === 'string') org.name = raw.name
  else if (typeof raw.companyName === 'string') org.name = raw.companyName
  if (typeof raw.vat === 'string') org.vat = raw.vat
  if (typeof raw.taxOffice === 'string') org.taxOffice = raw.taxOffice
  if (typeof raw.country === 'string') org.country = raw.country
  if (typeof raw.address === 'string') org.address = raw.address
  if (typeof raw.city === 'string') org.city = raw.city
  if (typeof raw.zip === 'string') org.zip = raw.zip
  if (typeof raw.phone === 'string') org.phone = raw.phone
  if (typeof raw.email === 'string') org.email = raw.email
  if (typeof raw.website === 'string') org.website = raw.website
  if (typeof raw.address_de === 'string') org.address_de = raw.address_de
  else if (typeof raw.companyDE === 'string') org.address_de = raw.companyDE
  if (typeof raw.address_gr === 'string') org.address_gr = raw.address_gr
  else if (typeof raw.companyGR === 'string') org.address_gr = raw.companyGR
  if (typeof raw.vat_number === 'string') org.vat_number = raw.vat_number
  if (typeof raw.logo === 'string') org.logo = raw.logo
  if (typeof raw.logo_url === 'string') org.logo_url = raw.logo_url
  if (typeof raw.primaryColor === 'string') org.primaryColor = raw.primaryColor
  if (typeof raw.secondaryColor === 'string') org.secondaryColor = raw.secondaryColor
  if (typeof raw.responsible === 'string') org.responsible = raw.responsible
  if (typeof raw.stamp === 'string') org.stamp = raw.stamp
  if (typeof raw.autoscout === 'string') org.autoscout = raw.autoscout
  if (typeof raw.mobilede === 'string') org.mobilede = raw.mobilede
  if (typeof raw.cargr === 'string') org.cargr = raw.cargr
  if (typeof raw.facebook === 'string') org.facebook = raw.facebook
  if (typeof raw.defaultStoreCost === 'number') org.defaultStoreCost = raw.defaultStoreCost
  if (typeof raw.defaultTransportCostPerKm === 'number') org.defaultTransportCostPerKm = raw.defaultTransportCostPerKm
  if (typeof raw.marginTarget === 'number') org.marginTarget = raw.marginTarget
  if (typeof raw.targetProfit === 'number') org.targetProfit = raw.targetProfit
  if (typeof raw.plan === 'string') org.plan = raw.plan
  if (typeof raw.status === 'string') org.status = raw.status
  if (typeof raw.trial_ends_at === 'string') org.trial_ends_at = raw.trial_ends_at

  return Object.keys(org).length > 0 ? (org as Organization) : undefined
}

function buildLegacyAppValue(
  settings: AppSettings,
  existingValue?: Record<string, unknown>,
): string {
  const next: Record<string, unknown> = { ...(existingValue || {}) }
  if (settings.org?.name) next.companyName = settings.org.name
  else delete next.companyName
  if (settings.org?.address_de) next.companyDE = settings.org.address_de
  else delete next.companyDE
  if (settings.org?.address_gr) next.companyGR = settings.org.address_gr
  else delete next.companyGR
  if (settings.anthropicKey) next.apiKey = settings.anthropicKey
  else delete next.apiKey

  return JSON.stringify(next)
}

export function parseSettingsRows(rows: SettingsRow[]): AppSettings | null {
  const appRow = rows.find(row => row.key === APP_SETTINGS_KEY)
  const langRow = rows.find(row => row.key === LANG_SETTINGS_KEY)
  const legacyApp = parseJsonObject(appRow?.value)
  const org = normalizeOrganization(appRow?.org_data) || normalizeOrganization(legacyApp)
  const anthropicKey = firstString(appRow?.anthropic_key, legacyApp?.apiKey)
  const lang = toLang(firstString(langRow?.value, langRow?.lang, appRow?.lang))

  if (!appRow && !langRow && !org && !anthropicKey) return null
  return {
    lang,
    anthropicKey,
    org,
  }
}

export function buildSettingsRows(
  userId: string,
  patch: Partial<AppSettings>,
  currentRows: SettingsRow[] = [],
): SettingsUpsertRow[] {
  const current = parseSettingsRows(currentRows) || { lang: 'el' as AppSettings['lang'] }
  const merged: AppSettings = {
    lang: patch.lang ?? current.lang,
    anthropicKey: patch.anthropicKey !== undefined ? patch.anthropicKey : current.anthropicKey,
    org: patch.org !== undefined ? patch.org : current.org,
  }
  const updatedAt = new Date().toISOString()
  const appRow = currentRows.find(row => row.key === APP_SETTINGS_KEY)
  const langRow = currentRows.find(row => row.key === LANG_SETTINGS_KEY)
  const legacyApp = parseJsonObject(appRow?.value)
  const appOrgId = firstString(appRow?.org_id, langRow?.org_id) || null
  const appOrganizationId = firstString(appRow?.organization_id, langRow?.organization_id) || null
  const emptyOrgData = null

  return [
    {
      user_id: userId,
      key: APP_SETTINGS_KEY,
      value: buildLegacyAppValue(merged, legacyApp),
      lang: merged.lang,
      org_data: merged.org ?? null,
      anthropic_key: merged.anthropicKey || null,
      org_id: appOrgId,
      organization_id: appOrganizationId,
      updated_at: updatedAt,
    },
    {
      user_id: userId,
      key: LANG_SETTINGS_KEY,
      value: merged.lang,
      lang: merged.lang,
      org_data: emptyOrgData,
      anthropic_key: null,
      org_id: appOrgId,
      organization_id: appOrganizationId,
      updated_at: updatedAt,
    },
  ]
}
