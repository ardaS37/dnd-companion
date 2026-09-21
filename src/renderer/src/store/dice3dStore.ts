import { create } from 'zustand'

interface Dice3DState {
  pendingNotation: string | null
  nonce: number
  roll: (notation: string) => void
  clearPending: () => void
}

export const useDice3DStore = create<Dice3DState>((set) => ({
  pendingNotation: null,
  nonce: 0,
  roll: (notation) => set((s) => ({ pendingNotation: notation, nonce: s.nonce + 1 })),
  clearPending: () => set({ pendingNotation: null })
}))
