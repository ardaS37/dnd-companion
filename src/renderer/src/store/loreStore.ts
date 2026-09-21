import { create } from 'zustand'
import type { LoreNote } from '@shared/dnd/types'

interface LoreState {
  notes: LoreNote[]
  loaded: boolean
  load: () => Promise<void>
  upsert: (note: LoreNote) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const useLoreStore = create<LoreState>((set) => ({
  notes: [],
  loaded: false,
  load: async () => {
    const notes = await window.api.lore.list()
    set({ notes, loaded: true })
  },
  upsert: async (note) => {
    await window.api.lore.save(note)
    set((state) => {
      const exists = state.notes.some((n) => n.id === note.id)
      const notes = exists ? state.notes.map((n) => (n.id === note.id ? note : n)) : [note, ...state.notes]
      return { notes }
    })
  },
  remove: async (id) => {
    await window.api.lore.delete(id)
    set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }))
  }
}))
