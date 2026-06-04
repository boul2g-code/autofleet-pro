import { describe, expect, it } from 'vitest'
import { buildSettingsRows, parseSettingsRows } from '../lib/supabase/db'

describe('settings contract helpers', () => {
  it('parses split app/lang rows and legacy app JSON', () => {
    const settings = parseSettingsRows([
      {
        key: 'app',
        value: JSON.stringify({
          companyName: 'AutoFleet Trading GmbH',
          companyDE: 'Berlin',
          companyGR: 'Athens',
          apiKey: 'sk-test',
        }),
      },
      {
        key: 'lang',
        value: 'de',
      },
    ])

    expect(settings).toEqual({
      lang: 'de',
      anthropicKey: 'sk-test',
      org: {
        name: 'AutoFleet Trading GmbH',
        address_de: 'Berlin',
        address_gr: 'Athens',
      },
    })
  })

  it('builds upserts against the user_id,key contract', () => {
    const rows = buildSettingsRows(
      'user-1',
      {
        lang: 'it',
        anthropicKey: 'sk-next',
        org: {
          id: 'default',
          name: 'Rossi Auto',
          address_de: 'Berlin',
        },
      },
      [
        {
          key: 'app',
          value: JSON.stringify({ defaultCurrency: 'EUR' }),
        },
      ],
    )

    expect(rows).toHaveLength(2)
    expect(rows[0]).toMatchObject({
      user_id: 'user-1',
      key: 'app',
      lang: 'it',
      anthropic_key: 'sk-next',
      org_data: {
        id: 'default',
        name: 'Rossi Auto',
        address_de: 'Berlin',
      },
    })
    expect(rows[1]).toMatchObject({
      user_id: 'user-1',
      key: 'lang',
      value: 'it',
      lang: 'it',
    })
    expect(rows[0].value).toBeTruthy()
    expect(rows[1].value).toBe('it')
    expect(Object.keys(rows[0]).sort()).toEqual(Object.keys(rows[1]).sort())
    expect(JSON.parse(String(rows[0].value))).toMatchObject({
      companyName: 'Rossi Auto',
      companyDE: 'Berlin',
      apiKey: 'sk-next',
      defaultCurrency: 'EUR',
    })
  })

  it('keeps app value non-null even when there is no legacy payload to merge', () => {
    const rows = buildSettingsRows('user-2', { lang: 'en' }, [])

    expect(rows[0].key).toBe('app')
    expect(rows[0].value).toBe('{}')
    expect(rows[1].key).toBe('lang')
    expect(rows[1].value).toBe('en')
  })
})
