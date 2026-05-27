import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseServiceRoleKey, getSupabaseUrl } from '@/lib/supabase/env'

let adminClient: SupabaseClient<any> | null = null

export function createAdminClient(): SupabaseClient<any> {
  const supabaseUrl = getSupabaseUrl()
  const serviceRoleKey = getSupabaseServiceRoleKey()

  if (!adminClient) {
    adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return adminClient
}
