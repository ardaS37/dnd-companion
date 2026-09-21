import { create } from 'zustand'
import type { CustomMonster } from '@shared/dnd/monsters'

interface CustomMonsterState {
  monsters: CustomMonster[]
  loaded: boolean
  load: () => Promise<void>
  upsert: (monster: CustomMonster) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const useCustomMonsterStore = create<CustomMonsterState>((set) => ({
  monsters: [],
  loaded: false,
  load: async () => {
    const monsters = await window.api.monsters.list()
    set({ monsters, loaded: true })
  },
  upsert: async (monster) => {
    await window.api.monsters.save(monster)
    set((state) => {
      const exists = state.monsters.some((m) => m.id === monster.id)
      const monsters = exists ? state.monsters.map((m) => (m.id === monster.id ? monster : m)) : [monster, ...state.monsters]
      return { monsters }
    })
  },
  remove: async (id) => {
    await window.api.monsters.delete(id)
    set((state) => ({ monsters: state.monsters.filter((m) => m.id !== id) }))
  }
}))
