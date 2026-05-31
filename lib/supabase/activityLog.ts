import { createClient } from './client'

export async function logActivity(params: {
  vehicleId?: string
  action: string
  section?: string
  summary?: string
  oldValue?: unknown
  newValue?: unknown
}) {
  try {
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return
    await sb.from('activity_log').insert({
      user_id: user.id,
      vehicle_id: params.vehicleId,
      action: params.action,
      section: params.section,
      summary: params.summary,
      old_value: params.oldValue,
      new_value: params.newValue,
    })
  } catch {
    // silently fail - activity log is non-critical
  }
}
