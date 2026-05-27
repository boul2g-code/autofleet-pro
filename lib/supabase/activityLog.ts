import { createClient } from './client'

export type LogAction = 'create' | 'update' | 'delete' | 'status_change' | 'document_add' | 'document_delete'

export async function logActivity(
  vehicleId: string,
  action: LogAction,
  section: string,
  summary: string,
  oldValue?: unknown,
  newValue?: unknown,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('activity_log').insert({
      user_id: user.id,
      actor_user_id: user.id,
      entity_uuid: vehicleId,
      entity_type: 'vehicle',
      vehicle_id: vehicleId,
      action,
      section,
      summary,
      metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
      old_value: oldValue ? JSON.parse(JSON.stringify(oldValue)) : null,
      new_value: newValue ? JSON.parse(JSON.stringify(newValue)) : null,
    })
  } catch (e) {
    // Never block the main action if logging fails
    console.warn('Activity log failed:', e)
  }
}

export async function fetchActivityLog(vehicleId?: string): Promise<ActivityEntry[]> {
  const supabase = createClient()
  let query = supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (vehicleId) query = query.eq('vehicle_id', vehicleId)

  const { data } = await query
  return (data || []) as ActivityEntry[]
}

export interface ActivityEntry {
  id: string
  created_at: string
  vehicle_id: string
  actor_user_id?: string
  entity_uuid?: string
  entity_type?: string
  action: LogAction
  section: string
  summary: string
  metadata?: Record<string, unknown>
  old_value?: unknown
  new_value?: unknown
}
