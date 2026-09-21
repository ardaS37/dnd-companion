import { create } from 'zustand'

export type Screen = 'lobby' | 'table' | 'characters' | 'lore' | 'maps' | 'bestiary' | 'relationships' | 'compendium'

interface AppState {
  screen: Screen
  activeRoomName: string | null
  enterRoom: (roomName: string) => void
  leaveRoom: () => void
  goToCharacters: () => void
  goToLore: () => void
  goToMaps: () => void
  goToBestiary: () => void
  goToRelationships: () => void
  goToCompendium: () => void
  goToLobby: () => void
}

export const useAppStore = create<AppState>((set) => ({
  screen: 'lobby',
  activeRoomName: null,
  enterRoom: (roomName) => set({ screen: 'table', activeRoomName: roomName }),
  leaveRoom: () => set({ screen: 'lobby', activeRoomName: null }),
  goToCharacters: () => set({ screen: 'characters' }),
  goToLore: () => set({ screen: 'lore' }),
  goToMaps: () => set({ screen: 'maps' }),
  goToBestiary: () => set({ screen: 'bestiary' }),
  goToRelationships: () => set({ screen: 'relationships' }),
  goToCompendium: () => set({ screen: 'compendium' }),
  goToLobby: () => set({ screen: 'lobby' })
}))
