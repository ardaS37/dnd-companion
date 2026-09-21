import { create } from 'zustand'
import type { Character } from '@shared/dnd/types'

interface CharacterState {
  characters: Character[]
  activeCharacterId: string | null
  loaded: boolean
  load: () => Promise<void>
  upsert: (character: Character) => Promise<void>
  remove: (id: string) => Promise<void>
  setActive: (id: string | null) => void
}

export const useCharacterStore = create<CharacterState>((set) => ({
  characters: [],
  activeCharacterId: null,
  loaded: false,
  load: async () => {
    const characters = await window.api.characters.list()
    set((state) => ({
      characters,
      loaded: true,
      activeCharacterId: state.activeCharacterId ?? characters[0]?.id ?? null
    }))
  },
  upsert: async (character) => {
    await window.api.characters.save(character)
    set((state) => {
      const exists = state.characters.some((c) => c.id === character.id)
      const characters = exists
        ? state.characters.map((c) => (c.id === character.id ? character : c))
        : [character, ...state.characters]
      return { characters, activeCharacterId: state.activeCharacterId ?? character.id }
    })
  },
  remove: async (id) => {
    await window.api.characters.delete(id)
    set((state) => ({
      characters: state.characters.filter((c) => c.id !== id),
      activeCharacterId: state.activeCharacterId === id ? null : state.activeCharacterId
    }))
  },
  setActive: (id) => set({ activeCharacterId: id })
}))
