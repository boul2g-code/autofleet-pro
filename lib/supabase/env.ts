function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export function getSupabaseUrl(): string {
  return requireEnv('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL)
}

export function getSupabasePublishableKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return requireEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', key)
}

export function getSupabaseServiceRoleKey(): string {
  return requireEnv('SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY)
}
