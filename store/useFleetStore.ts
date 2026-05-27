'use client'

import { create } from 'zustand'
import type { Vehicle, AppSettings, Lang, TabKey, VehicleStatus } from '@/lib/types'
import { createVehicle } from '@/lib/defaults'
import { DEFAULT_APP_SETTINGS } from '@/lib/appSettings'
import {
  fetchAllVehicles, upsertVehicle, removeVehicle,
  fetchSettings, saveSettingsToDB, fetchLang, saveLangToDB,
  subscribeToVehicles,
} from '@/lib/supabase/db'
import { logActivity } from '@/lib/supabase/activityLog'

interface FleetState {
  vehicles: Vehicle[]
  settings: AppSettings
  lang: Lang
  user: { email: string; id: string } | null
  activeTab: TabKey
  searchQuery: string
  filterStatus: 'all' | VehicleStatus
  sidebarOpen: boolean
  toast: { msg: string; type: 'success' | 'error' | 'info' } | null
  loading: boolean

  init: () => Promise<void>
  setUser: (u: { email: string; id: string } | null) => void
  addVehicle: () => Promise<string>
  updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>
  updateVehicleSection: <K extends keyof Vehicle>(id: string, section: K, data: Vehicle[K]) => Promise<void>
  deleteVehicle: (id: string) => Promise<void>
  getVehicle: (id: string) => Vehicle | undefined
  saveSettings: (s: AppSettings) => Promise<void>
  setLang: (lang: Lang) => void
  setActiveTab: (tab: TabKey) => void
  setSearchQuery: (q: string) => void
  setFilterStatus: (s: 'all' | VehicleStatus) => void
  setSidebarOpen: (open: boolean) => void
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void
}

const DEFAULT_SETTINGS: AppSettings = DEFAULT_APP_SETTINGS

const VEHICLE_SAVE_DEBOUNCE_MS = 450

let unsubRealtime: (() => void) | null = null
const pendingVehicleSaves = new Map<string, ReturnType<typeof setTimeout>>()

function getVehicleTimestamp(value?: string): number {
  const parsed = value ? Date.parse(value) : Number.NaN
  return Number.isFinite(parsed) ? parsed : 0
}

function shouldApplyIncomingVehicle(current: Vehicle | undefined, incoming: Vehicle): boolean {
  if (!current) return true
  return getVehicleTimestamp(incoming.updatedAt) >= getVehicleTimestamp(current.updatedAt)
}

function clearPendingVehicleSave(id: string) {
  const timer = pendingVehicleSaves.get(id)
  if (!timer) return
  clearTimeout(timer)
  pendingVehicleSaves.delete(id)
}

export const useFleetStore = create<FleetState>((set, get) => {
  const scheduleVehicleSave = (id: string) => {
    clearPendingVehicleSave(id)

    pendingVehicleSaves.set(id, setTimeout(() => {
      pendingVehicleSaves.delete(id)
      const latest = get().vehicles.find(v => v.id === id)
      if (!latest) return

      void upsertVehicle(latest).catch(error => {
        console.error('vehicle save error:', error)
      })
    }, VEHICLE_SAVE_DEBOUNCE_MS))
  }

  return {
    vehicles: [],
    settings: DEFAULT_SETTINGS,
    lang: 'el',
    user: null,
    activeTab: 'info',
    searchQuery: '',
    filterStatus: 'all',
    sidebarOpen: false,
    toast: null,
    loading: true,

    init: async () => {
      set({ loading: true })
      try {
        const [vehicles, settings, lang] = await Promise.all([
          fetchAllVehicles(), fetchSettings(), fetchLang(),
        ])
        set({ vehicles, settings: settings ?? DEFAULT_SETTINGS, lang: (lang as Lang) ?? 'el', loading: false })

        if (unsubRealtime) unsubRealtime()
        unsubRealtime = subscribeToVehicles(
          (updated) => set(s => {
            const current = s.vehicles.find(v => v.id === updated.id)
            if (current && !shouldApplyIncomingVehicle(current, updated)) {
              return { vehicles: s.vehicles }
            }

            return {
              vehicles: current
                ? s.vehicles.map(v => v.id === updated.id ? updated : v)
                : [updated, ...s.vehicles],
            }
          }),
          (id) => set(s => ({ vehicles: s.vehicles.filter(v => v.id !== id) })),
        )
      } catch (e) {
        console.error('store init error:', e)
        set({ loading: false })
      }
    },

    setUser: (user) => set({ user }),

    addVehicle: async () => {
      const v = createVehicle()
      await upsertVehicle(v)
      await logActivity(v.id, 'create', 'vehicle', `New vehicle created: ${v.businessId}`, undefined, undefined, {
        businessId: v.businessId,
        category: v.category,
        status: v.status,
      })
      set(s => ({ vehicles: [v, ...s.vehicles], activeTab: 'info' }))
      return v.id
    },

    updateVehicle: async (id, updates) => {
      const previous = get().vehicles.find(v => v.id === id)
      const updatedAt = new Date().toISOString()

      set(s => ({
        vehicles: s.vehicles.map(v =>
          v.id === id ? { ...v, ...updates, updatedAt } : v,
        ),
      }))

      scheduleVehicleSave(id)

      if (updates.status && previous?.status !== updates.status) {
        void logActivity(id, 'status_change', 'vehicle',
          `Status: ${previous?.status} â†’ ${updates.status}`,
          { status: previous?.status }, { status: updates.status }, {
            businessId: previous?.businessId,
            fromStatus: previous?.status,
            toStatus: updates.status,
          })
      }
    },

    updateVehicleSection: async (id, section, data) => {
      const previous = get().vehicles.find(v => v.id === id)
      const updatedAt = new Date().toISOString()

      set(s => ({
        vehicles: s.vehicles.map(v =>
          v.id === id ? { ...v, [section]: data, updatedAt } : v,
        ),
      }))

      scheduleVehicleSave(id)

      const importantSections = ['purchase', 'sale', 'importTransport', 'exportTransport']
      if (importantSections.includes(section as string)) {
        void logActivity(id, 'update', section as string,
          `Updated ${String(section)} section`,
          previous?.[section], data, {
            businessId: previous?.businessId,
            section,
          })
      }
    },

    deleteVehicle: async (id) => {
      clearPendingVehicleSave(id)
      const v = get().vehicles.find(x => x.id === id)
      await logActivity(id, 'delete', 'vehicle',
        `Deleted: ${v?.make || ''} ${v?.model || ''} ${v?.plate || ''} (${v?.businessId || id})`,
        undefined, undefined, {
          businessId: v?.businessId,
          make: v?.make,
          model: v?.model,
          plate: v?.plate,
        })
      await removeVehicle(id)
      set(s => ({ vehicles: s.vehicles.filter(v => v.id !== id) }))
    },

    getVehicle: (id) => get().vehicles.find(v => v.id === id),

    saveSettings: async (s) => {
      await saveSettingsToDB(s)
      set({ settings: s })
    },

    setLang: (lang) => {
      set({ lang })
      saveLangToDB(lang).catch(console.error)
    },

    setActiveTab: (tab) => set({ activeTab: tab }),
    setSearchQuery: (q) => set({ searchQuery: q }),
    setFilterStatus: (s) => set({ filterStatus: s }),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),

    showToast: (msg, type = 'success') => {
      set({ toast: { msg, type } })
      setTimeout(() => set({ toast: null }), 3000)
    },
  }
})
