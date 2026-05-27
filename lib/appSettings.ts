import type { AppSettings, Currency } from './types'

const DEFAULT_COMPANY_DE = 'Musterstraße 1, 10115 Berlin, Deutschland'
const DEFAULT_COMPANY_GR = 'Ομόνοια 1, 10431 Αθήνα, Ελλάδα'

export const DEFAULT_APP_SETTINGS: AppSettings = {
  companyName: 'AutoFleet Trading GmbH',
  companyDE: DEFAULT_COMPANY_DE,
  companyGR: DEFAULT_COMPANY_GR,
  apiKey: '',
  defaultCurrency: 'EUR',
}

function isCurrency(value: unknown): value is Currency {
  return value === 'EUR' || value === 'USD' || value === 'GBP' || value === 'CHF'
}

export function sanitizeAppSettings(value: unknown): AppSettings {
  const raw = value && typeof value === 'object'
    ? value as Partial<Record<keyof AppSettings | 'apiKey', unknown>>
    : {}

  return {
    companyName: typeof raw.companyName === 'string' ? raw.companyName : DEFAULT_APP_SETTINGS.companyName,
    companyDE: typeof raw.companyDE === 'string' ? raw.companyDE : DEFAULT_COMPANY_DE,
    companyGR: typeof raw.companyGR === 'string' ? raw.companyGR : DEFAULT_COMPANY_GR,
    apiKey: '',
    defaultCurrency: isCurrency(raw.defaultCurrency) ? raw.defaultCurrency : 'EUR',
  }
}

export function parseAppSettingsValue(value: string | null | undefined): AppSettings | null {
  if (!value) return null

  try {
    return sanitizeAppSettings(JSON.parse(value))
  } catch {
    return null
  }
}
