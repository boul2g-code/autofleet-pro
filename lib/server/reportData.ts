import type { AppSettings, Vehicle } from '@/lib/types'
import { DEFAULT_APP_SETTINGS, parseAppSettingsValue } from '@/lib/appSettings'
import { createClient } from '@/lib/supabase/server'
import { rowToVehicle, type VehicleRow } from '@/lib/supabase/vehicleMappers'
import { isUuid } from '@/lib/utils'

interface ReportDataResult {
  error?: string
  settings?: AppSettings
  status: number
  vehicle?: Vehicle
}

export async function getAuthorizedVehicleReportData(vehicleId: string): Promise<ReportDataResult> {
  if (!isUuid(vehicleId)) {
    return { error: 'vehicleId must be a UUID', status: 400 }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized', status: 401 }
  }

  const [{ data: vehicleRow, error: vehicleError }, { data: settingsRow }] = await Promise.all([
    supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicleId)
      .single<VehicleRow>(),
    supabase
      .from('settings')
      .select('value')
      .eq('user_id', user.id)
      .eq('key', 'app')
      .single(),
  ])

  if (vehicleError || !vehicleRow) {
    return { error: 'Vehicle not found', status: 404 }
  }

  return {
    settings: parseAppSettingsValue(settingsRow?.value) ?? DEFAULT_APP_SETTINGS,
    status: 200,
    vehicle: rowToVehicle(vehicleRow),
  }
}
