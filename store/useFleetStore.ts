'use client'
import { create } from 'zustand'
import type { Vehicle, AppSettings, Lang } from '../lib/types'
import {
  dbGetVehicles, dbCreateVehicle, dbUpdateVehicle, dbDeleteVehicle,
  dbGetSettings, dbSaveSettings,
} from '../lib/supabase/db'

let saveTimer: ReturnType<typeof setTimeout> | null = null
let addingVehicle = false   // prevent double insert
let loadedOnce = false       // prevent double loadAll from StrictMode

interface FleetStore {
  vehicles: Vehicle[]
  settings: AppSettings
  loading: boolean
  saving: boolean
  error: string | null

  // Actions
  loadAll: () => Promise<void>
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
    if (loadedOnce) return   // StrictMode calls this twice — ignore second call
    loadedOnce = true
    set({ loading: true, error: null })
    try {
      const [vehicles, settings] = await Promise.all([
        dbGetVehicles(),
        dbGetSettings(),
      ])
      set({
        vehicles,
        settings: settings || { lang: 'el' },
        loading: false,
      })
    } catch (e) {
      loadedOnce = false  // allow retry on error
      set({ loading: false, error: String(e) })
    }
  },

  addVehicle: async (initial = {}) => {
    if (addingVehicle) return null  // prevent double insert
    addingVehicle = true
    const newV: Partial<Vehicle> = {
      status: 'purchased',
      category: 'car',
      ...initial,
    }
    const created = await dbCreateVehicle(newV)
    addingVehicle = false
    if (!created) {
      set({ error: 'Failed to create vehicle. Check Supabase connection.' })
      return null
    }
    set(s => ({ vehicles: [created, ...s.vehicles] }))
    return created
  },

  // Optimistic update locally, debounce DB write
  updateVehicle: (id, patch) => {
    // Update locally immediately (fast UI)
    set(s => ({
      vehicles: s.vehicles.map(v => v.id === id ? { ...v, ...patch } : v),
      saving: true,
    }))

    // Debounce: wait 1.5s after last keystroke before saving
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
