import { describe, expect, it } from 'vitest'
import { sanitizeWorksheetName, toExcelColumnName } from '@/lib/xlsxExport'

describe('xlsx export helpers', () => {
  it('normalizes worksheet names to valid Excel sheet titles', () => {
    expect(sanitizeWorksheetName(`  Sales:/[Q2]*?  `)).toBe('Sales Q2')
    expect(sanitizeWorksheetName(`'////'`)).toBe('Sheet')
  })

  it('maps column indexes to Excel column labels', () => {
    expect(toExcelColumnName(1)).toBe('A')
    expect(toExcelColumnName(26)).toBe('Z')
    expect(toExcelColumnName(27)).toBe('AA')
    expect(toExcelColumnName(52)).toBe('AZ')
  })
})
