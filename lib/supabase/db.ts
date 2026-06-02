import { createClient } from './client'
import type { Vehicle, AppSettings, Organization } from '../types'

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
    .select('org_id')
    .eq('user_id', user.id)
    .single()

  const row = vehicleToRow(v)
  row.user_id = user.id               // Always stamp with authenticated user
  if (settingsRow?.org_id) row.org_id = settingsRow.org_id

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
  const { data } = await sb.from('settings').select('*').eq('user_id', user.id).single()
  if (!data) return null
  return {
    lang: data.lang || 'el',
    anthropicKey: data.anthropic_key || '',
    org: data.org_data || undefined,
  }
}

export async function dbSaveSettings(s: Partial<AppSettings>): Promise<boolean> {
  const { sb, user } = await getAuthUser()
  const { error } = await sb.from('settings').upsert({
    user_id: user.id,
    lang: s.lang,
    anthropic_key: s.anthropicKey,
    org_data: s.org,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' })
  if (error) { console.error('dbSaveSettings error:', error); return false }
  return true
}

// ── Org ─────────────────────────────────────────────────────

export async function dbGetOrg(): Promise<Organization | null> {
  const { sb, user } = await getAuthUser().catch(() => ({ sb: createClient(), user: null }))
  if (!user) return null
  const { data } = await sb.from('settings').select('org_data').eq('user_id', user.id).single()
  return data?.org_data || null
}

export async function dbSaveOrg(org: Organization): Promise<boolean> {
  const { sb, user } = await getAuthUser()
  const { error } = await sb.from('settings').upsert({
    user_id: user.id,
    org_data: org,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' })
  if (error) { console.error('dbSaveOrg error:', error); return false }
  return true
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
