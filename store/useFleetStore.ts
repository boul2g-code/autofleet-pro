'use client'
import { create } from 'zustand'
import type { Vehicle, AppSettings, Lang } from '../lib/types'
import {
  dbGetVehicles, dbCreateVehicle, dbUpdateVehicle, dbDeleteVehicle,
  dbGetSettings, dbSaveSettings,
} from '../lib/supabase/db'

let saveTimer: ReturnType<typeof setTimeout> | null = null
let _addLock = false      // prevent double insert
let _loadLock = false     // prevent double load from StrictMode

interface FleetStore {
  vehicles: Vehicle[]
  settings: AppSettings
  loading: boolean
  saving: boolean
  error: string | null
  loadAll: () => Promise<void>
  reload: () => Promise<void>
  addVehicle: (v?: Partial<Vehicle>) => Promise<Vehicle | null>
  updateVehicle: (id: string, patch: Partial<Vehicle>) => void
  deleteVehicle: (id: string) => Promise<boolean>
  setLang: (lang: Lang) => void
  saveSetting: (patch: Partial<AppSettings>) => void
  getVehicle: (id: string) => Vehicle | undefined
  flushSave: (id: string) => Promise<void>
}

export const useFleetStore = create<FleetStore>((set, get) => ({
  vehicles: [],
  settings: { lang: 'el' },
  loading: false,
  saving: false,
  error: null,

  loadAll: async () => {
    if (_loadLock) return
    _loadLock = true
    set({ loading: true, error: null })
    try {
      const [vehicles, settings] = await Promise.all([
        dbGetVehicles(),
        dbGetSettings(),
      ])
      set({ vehicles, settings: settings || { lang: 'el' }, loading: false })
    } catch (e) {
      _loadLock = false
      set({ loading: false, error: String(e) })
    }
  },

  reload: async () => {
    _loadLock = false
    await get().loadAll()
  },

  addVehicle: async (initial = {}) => {
    if (_addLock) return null
    _addLock = true
    try {
      const created = await dbCreateVehicle({
        status: 'purchased',
        category: 'car',
        ...initial,
      })
      if (!created) {
        set({ error: 'Failed to create vehicle. Check Supabase.' })
        return null
      }
      // Prevent duplicate in state
      const exists = get().vehicles.find(v => v.id === created.id)
      if (!exists) {
        set(s => ({ vehicles: [created, ...s.vehicles] }))
      }
      return created
    } finally {
      setTimeout(() => { _addLock = false }, 2000)
    }
  },

  updateVehicle: (id, patch) => {
    set(s => ({
      vehicles: s.vehicles.map(v => v.id === id ? { ...v, ...patch } : v),
      saving: true,
    }))
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(async () => {
      const vehicle = get().vehicles.find(v => v.id === id)
      if (!vehicle) return
      await dbUpdateVehicle(id, vehicle)
      set({ saving: false })
    }, 1500)
  },

  deleteVehicle: async (id) => {
    const ok = await dbDeleteVehicle(id)
    if (ok) set(s => ({ vehicles: s.vehicles.filter(v => v.id !== id) }))
    return ok
  },

  setLang: (lang) => {
    set(s => ({ settings: { ...s.settings, lang } }))
    dbSaveSettings({ ...get().settings, lang })
  },

  saveSetting: (patch) => {
    const updated = { ...get().settings, ...patch }
    set({ settings: updated })
    dbSaveSettings(updated)
  },

  getVehicle: (id) => get().vehicles.find(v => v.id === id),

  flushSave: async (id) => {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null }
    const vehicle = get().vehicles.find(v => v.id === id)
    if (!vehicle) return
    set({ saving: true })
    await dbUpdateVehicle(id, vehicle)
    set({ saving: false })
  },
}))
