import { createClient } from './client'
import type { AppSettings, Vehicle } from '@/lib/types'
import { parseAppSettingsValue, sanitizeAppSettings } from '@/lib/appSettings'
import { rowToVehicle, type VehicleRow, vehicleToRow } from './vehicleMappers'

async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return user?.id ?? null
}

export async function fetchAllVehicles(): Promise<Vehicle[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('fetchAllVehicles:', error.message)
    return []
  }

  return (data || []).map(rowToVehicle)
}

export async function upsertVehicle(v: Vehicle): Promise<void> {
  const supabase = createClient()
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('vehicles')
    .upsert({ ...vehicleToRow(v), user_id: userId }, { onConflict: 'id' })

  if (error) throw new Error(error.message)
}

export async function removeVehicle(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('vehicles').delete().eq('id', id)

  if (error) throw new Error(error.message)
}

export async function fetchSettings(): Promise<AppSettings | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'app')
    .single()

  return parseAppSettingsValue(data?.value)
}

export async function saveSettingsToDB(s: AppSettings): Promise<void> {
  const supabase = createClient()
  const userId = await getCurrentUserId()
  if (!userId) return

  await supabase
    .from('settings')
    .upsert(
      { user_id: userId, key: 'app', value: JSON.stringify(sanitizeAppSettings(s)) },
      { onConflict: 'user_id,key' },
    )
}

export async function fetchLang(): Promise<string | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'lang')
    .single()

  return data?.value ?? null
}

export async function saveLangToDB(lang: string): Promise<void> {
  const supabase = createClient()
  const userId = await getCurrentUserId()
  if (!userId) return

  await supabase
    .from('settings')
    .upsert({ user_id: userId, key: 'lang', value: lang }, { onConflict: 'user_id,key' })
}

export async function uploadDocumentToStorage(
  path: string,
  fileBody: Blob,
  token: string,
): Promise<string | null> {
  const supabase = createClient()
  const { error } = await supabase.storage
    .from('documents')
    .uploadToSignedUrl(path, token, fileBody)

  if (error) {
    console.error('uploadDoc:', error.message)
    return null
  }

  return path
}

export async function deleteDocumentFromStorage(path: string): Promise<void> {
  const supabase = createClient()

  await supabase.storage.from('documents').remove([path])
}

export function subscribeToVehicles(
  onUpsert: (v: Vehicle) => void,
  onDelete: (id: string) => void,
): () => void {
  const supabase = createClient()
  const channel = supabase
    .channel('vehicles-realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'vehicles' },
      payload => onUpsert(rowToVehicle(payload.new as VehicleRow)),
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'vehicles' },
      payload => onUpsert(rowToVehicle(payload.new as VehicleRow)),
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'vehicles' },
      payload => onDelete((payload.old as VehicleRow).id),
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
