import type { Vehicle, FinancialSummary } from './types'

export function computeFin(v: Vehicle): FinancialSummary {
  const pp = parseFloat(v.purchase?.priceGross ?? '') || 0
  const ic = parseFloat(v.importTransport?.cost ?? '') || 0
  const ec = (v.purchase?.extraCosts || []).reduce((s, c) => s + (parseFloat(c.amt ?? '') || 0), 0)

  let sc = 0
  let storageDays = 0
  if (v.storage?.entryDate && v.storage?.cpd) {
    const end = v.storage.exitDate ? new Date(v.storage.exitDate) : new Date()
    storageDays = Math.max(0, Math.round((end.getTime() - new Date(v.storage.entryDate).getTime()) / 86_400_000))
    sc = storageDays * (parseFloat(v.storage.cpd ?? '') || 0)
  }

  const wc = (v.storage?.workDone || []).reduce((s, w) => s + (parseFloat(w.cost ?? '') || 0), 0)
  const xc = parseFloat(v.exportTransport?.cost ?? '') || 0
  const total = pp + ic + sc + wc + xc + ec

  const sp = parseFloat(v.sale?.priceGross ?? '') || 0
  const profit = sp ? sp - total : null
  const margin = profit !== null && total > 0 ? (profit / total) * 100 : null

  return { pp, ic, sc, wc, xc, ec, total, sp, profit, margin, storageDays }
}
