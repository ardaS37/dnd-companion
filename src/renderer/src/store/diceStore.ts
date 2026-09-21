import { create } from 'zustand'
import type { RollMode } from '@shared/dice/engine'

interface DiceState {
  mode: RollMode
  setMode: (mode: RollMode) => void
}

export const useDiceStore = create<DiceState>((set) => ({
  mode: 'normal',
  setMode: (mode) => set({ mode })
}))
