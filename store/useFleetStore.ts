'use client'
import { create } from 'zustand'
import type { Vehicle, AppSettings, Lang } from '../lib/types'
import {
  dbGetVehicles, dbCreateVehicle, dbUpdateVehicle, dbDeleteVehicle,
  dbGetSettings, dbSaveSettings,
} from '../lib/supabase/db'

// Per-vehicle save timers (not a single shared timer)
const saveTimers: Record<string, ReturnType<typeof setTimeout>> = {}
// Tracks which vehicles have unsaved changes
const pendingSaves: Record<string, Partial<Vehicle>> = {}

let _addLock = false
let _loadLock = false

interface FleetStore {
  vehicles: Vehicle[]
  settings: AppSettings
  loading: boolean
  saving: boolean        // true = at least one vehicle is saving
  savedId: string | null // last saved vehicle id (for ✓ indicator)
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
  flushAll: () => Promise<void>
}

export const useFleetStore = create<FleetStore>((set, get) => ({
  vehicles: [],
  settings: { lang: 'el' },
  loading: false,
  saving: false,
  savedId: null,
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
    // 1. Update UI immediately (optimistic)
    set(s => ({
      vehicles: s.vehicles.map(v => v.id === id ? { ...v, ...patch } : v),
      saving: true,
      savedId: null,
    }))

    // 2. Accumulate all pending changes for this vehicle
    pendingSaves[id] = { ...pendingSaves[id], ...patch }

    // 3. Debounce: reset timer on every keystroke
    if (saveTimers[id]) clearTimeout(saveTimers[id])
    saveTimers[id] = setTimeout(async () => {
      const vehicle = get().vehicles.find(v => v.id === id)
      if (!vehicle) return
      try {
        await dbUpdateVehicle(id, vehicle)
        delete pendingSaves[id]
        delete saveTimers[id]
        // Check if any other vehicles are still saving
        const stillSaving = Object.keys(saveTimers).length > 0
        set({ saving: stillSaving, savedId: id })
        // Clear the ✓ after 2 seconds
        setTimeout(() => set(s => s.savedId === id ? { savedId: null } : {}), 2000)
      } catch (e) {
        console.error('[store] save error:', e)
        set({ saving: false })
      }
    }, 1500)
  },

  deleteVehicle: async (id) => {
    // Cancel any pending save for this vehicle
    if (saveTimers[id]) { clearTimeout(saveTimers[id]); delete saveTimers[id] }
    delete pendingSaves[id]
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

  // Force immediate save for one vehicle (called on tab change / page leave)
  flushSave: async (id) => {
    if (saveTimers[id]) { clearTimeout(saveTimers[id]); delete saveTimers[id] }
    const vehicle = get().vehicles.find(v => v.id === id)
    if (!vehicle) return
    set({ saving: true })
    try {
      await dbUpdateVehicle(id, vehicle)
      delete pendingSaves[id]
      set({ saving: false, savedId: id })
      setTimeout(() => set(s => s.savedId === id ? { savedId: null } : {}), 2000)
    } catch (e) {
      console.error('[store] flushSave error:', e)
      set({ saving: false })
    }
  },

  // Save ALL pending vehicles (called on page unload / navigation)
  flushAll: async () => {
    const ids = Object.keys(pendingSaves)
    if (ids.length === 0) return
    for (const id of ids) {
      if (saveTimers[id]) { clearTimeout(saveTimers[id]); delete saveTimers[id] }
      const vehicle = get().vehicles.find(v => v.id === id)
      if (vehicle) {
        try { await dbUpdateVehicle(id, vehicle) } catch {}
        delete pendingSaves[id]
      }
    }
    set({ saving: false })
  },
}))
