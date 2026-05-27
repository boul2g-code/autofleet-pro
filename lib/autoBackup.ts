/**
 * AutoFleet Pro — Automatic Backup System
 * 
 * How it works:
 * 1. On app load, checks last backup date (stored in localStorage)
 * 2. If >7 days since last backup → triggers automatic download
 * 3. Saves as JSON file on client's PC with date in filename
 * 4. User can also trigger manual backup anytime from Settings
 * 
 * The backup file contains ALL vehicle data + settings.
 * It can be re-imported to restore everything.
 */

import type { Vehicle, AppSettings } from './types'

const BACKUP_KEY = 'autofleet_last_backup'
const BACKUP_INTERVAL_DAYS = 7

export interface BackupData {
  version: string
  exportDate: string
  appName: 'AutoFleet Pro'
  vehicleCount: number
  settings: AppSettings
  vehicles: Vehicle[]
}

// ── Check if backup is needed ──────────────────────────────────────────────
export function isBackupDue(): boolean {
  try {
    const last = localStorage.getItem(BACKUP_KEY)
    if (!last) return true // never backed up
    const daysSince = (Date.now() - parseInt(last)) / (1000 * 60 * 60 * 24)
    return daysSince >= BACKUP_INTERVAL_DAYS
  } catch {
    return false
  }
}

export function getLastBackupDate(): string | null {
  try {
    const last = localStorage.getItem(BACKUP_KEY)
    if (!last) return null
    return new Date(parseInt(last)).toLocaleDateString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return null
  }
}

export function getDaysSinceBackup(): number {
  try {
    const last = localStorage.getItem(BACKUP_KEY)
    if (!last) return 999
    return Math.round((Date.now() - parseInt(last)) / (1000 * 60 * 60 * 24))
  } catch {
    return 999
  }
}

// ── Create backup file ─────────────────────────────────────────────────────
export function createBackup(vehicles: Vehicle[], settings: AppSettings): BackupData {
  return {
    version: '2.0',
    exportDate: new Date().toISOString(),
    appName: 'AutoFleet Pro',
    vehicleCount: vehicles.length,
    settings,
    // Strip base64 photo data to keep file small (photos are optional in backup)
    vehicles: vehicles.map(v => ({
      ...v,
      photo: v.photo ? '[photo-omitted]' : undefined,
      documents: v.documents || [],
    })),
  }
}

// ── Download backup to PC ──────────────────────────────────────────────────
export function downloadBackup(vehicles: Vehicle[], settings: AppSettings): void {
  const backup = createBackup(vehicles, settings)
  const dateStr = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const filename = `AutoFleet_Backup_${dateStr}_${vehicles.length}vehicles.json`

  const json = JSON.stringify(backup, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  // Record backup time
  try {
    localStorage.setItem(BACKUP_KEY, Date.now().toString())
  } catch { /* ignore */ }
}

// ── Download backup as XLSX (Excel) ───────────────────────────────────────
export async function downloadBackupXLSX(vehicles: Vehicle[], settings: AppSettings): Promise<void> {
  const { exportVehiclesXLSX } = await import('./xlsxExport')
  await exportVehiclesXLSX(vehicles, settings.companyName)
  try {
    localStorage.setItem(BACKUP_KEY, Date.now().toString())
  } catch { /* ignore */ }
}

// ── Auto-trigger if due ────────────────────────────────────────────────────
export function autoBackupIfDue(vehicles: Vehicle[], settings: AppSettings): boolean {
  if (!isBackupDue()) return false
  if (vehicles.length === 0) return false
  downloadBackup(vehicles, settings)
  return true
}

// ── Restore from backup file ───────────────────────────────────────────────
export interface RestoreResult {
  success: boolean
  vehicleCount: number
  exportDate: string
  error?: string
}

export function parseBackupFile(file: File): Promise<BackupData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target!.result as string) as BackupData
        if (data.appName !== 'AutoFleet Pro') {
          reject(new Error('Not a valid AutoFleet Pro backup file'))
          return
        }
        if (!Array.isArray(data.vehicles)) {
          reject(new Error('Backup file is corrupted (no vehicles array)'))
          return
        }
        resolve(data)
      } catch {
        reject(new Error('Invalid JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsText(file)
  })
}
