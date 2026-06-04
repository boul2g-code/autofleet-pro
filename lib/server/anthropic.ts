import { createClient } from '../supabase/server'

type SettingsKeyRow = {
  key?: string | null
  value?: string | null
  anthropic_key?: string | null
}

function firstNonEmptyString(...values: Array<unknown>): string | null {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return null
}

function readLegacyApiKey(value: string | null | undefined): string | null {
  if (!value) return null
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>
    return firstNonEmptyString(parsed?.apiKey)
  } catch {
    return null
  }
}

export async function getServerAnthropicKey(): Promise<string | null> {
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()

  if (user) {
    const { data, error } = await sb
      .from('settings')
      .select('key, value, anthropic_key')
      .eq('user_id', user.id)

    if (!error && data) {
      const appRow = (data as SettingsKeyRow[]).find(row => row.key === 'app')
      const storedKey = firstNonEmptyString(
        appRow?.anthropic_key,
        readLegacyApiKey(appRow?.value),
      )
      if (storedKey) return storedKey
    }
  }

  return firstNonEmptyString(process.env.ANTHROPIC_API_KEY)
}
