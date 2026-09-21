import { create } from 'zustand'
import type { GameMap } from '@shared/types'

interface MapState {
  maps: GameMap[]
  activeMapId: string | null
  loaded: boolean
  load: () => Promise<void>
  upsert: (map: GameMap) => Promise<void>
  remove: (id: string) => Promise<void>
  setActive: (id: string | null) => void
}

export const useMapStore = create<MapState>((set) => ({
  maps: [],
  activeMapId: null,
  loaded: false,
  load: async () => {
    const maps = await window.api.maps.list()
    set((state) => ({
      maps,
      loaded: true,
      activeMapId: state.activeMapId ?? maps[0]?.id ?? null
    }))
  },
  upsert: async (map) => {
    await window.api.maps.save(map)
    set((state) => {
      const exists = state.maps.some((m) => m.id === map.id)
      const maps = exists ? state.maps.map((m) => (m.id === map.id ? map : m)) : [map, ...state.maps]
      return { maps, activeMapId: state.activeMapId ?? map.id }
    })
  },
  remove: async (id) => {
    await window.api.maps.delete(id)
    set((state) => ({
      maps: state.maps.filter((m) => m.id !== id),
      activeMapId: state.activeMapId === id ? null : state.activeMapId
    }))
  },
  setActive: (id) => set({ activeMapId: id })
}))
