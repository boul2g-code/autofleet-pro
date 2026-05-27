import { useFleetStore } from '@/store/useFleetStore'
import type { Vehicle } from '@/lib/types'

/**
 * Returns a always-reactive vehicle by id.
 * Re-renders whenever any field on that vehicle changes.
 */
export function useVehicle(id: string): Vehicle | undefined {
  return useFleetStore(state => state.vehicles.find(v => v.id === id))
}
