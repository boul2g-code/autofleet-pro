import { describe, expect, it } from 'vitest'
import { DEFAULT_APP_SETTINGS, parseAppSettingsValue, sanitizeAppSettings } from '@/lib/appSettings'

describe('app settings sanitization', () => {
  it('falls back to safe defaults and strips apiKey', () => {
    expect(
      sanitizeAppSettings({
        companyName: 'Demo Fleet',
        companyDE: 123,
        companyGR: null,
        apiKey: 'sk-ant-secret',
        defaultCurrency: 'BTC',
      }),
    ).toEqual({
      companyName: 'Demo Fleet',
      companyDE: DEFAULT_APP_SETTINGS.companyDE,
      companyGR: DEFAULT_APP_SETTINGS.companyGR,
      apiKey: '',
      defaultCurrency: 'EUR',
    })
  })

  it('parses stored JSON safely', () => {
    expect(
      parseAppSettingsValue(
        JSON.stringify({
          companyName: 'North Cars',
          companyDE: 'Berlin',
          companyGR: 'Athens',
          apiKey: 'should-be-removed',
          defaultCurrency: 'CHF',
        }),
      ),
    ).toEqual({
      companyName: 'North Cars',
      companyDE: 'Berlin',
      companyGR: 'Athens',
      apiKey: '',
      defaultCurrency: 'CHF',
    })
  })

  it('returns null for invalid JSON', () => {
    expect(parseAppSettingsValue('{broken')).toBeNull()
  })
})
