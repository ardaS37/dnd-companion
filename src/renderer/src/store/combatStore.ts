import { create } from 'zustand'

export interface CombatEntry {
  id: string
  name: string
  initiative: number
  ac: number | null
  currentHp: number
  maxHp: number
  conditions: string[]
  isPC: boolean
  level?: number
  xp?: number
}

interface CombatState {
  round: number
  activeEntryId: string | null
  entries: CombatEntry[]
  addEntry: (entry: CombatEntry) => void
  removeEntry: (id: string) => void
  updateEntry: (id: string, patch: Partial<CombatEntry>) => void
  startCombat: () => void
  nextTurn: () => void
  clear: () => void
}

function sortedEntries(entries: CombatEntry[]): CombatEntry[] {
  return [...entries].sort((a, b) => b.initiative - a.initiative)
}

export const useCombatStore = create<CombatState>((set, get) => ({
  round: 0,
  activeEntryId: null,
  entries: [],
  addEntry: (entry) => set((s) => ({ entries: [...s.entries, entry] })),
  removeEntry: (id) =>
    set((s) => ({
      entries: s.entries.filter((e) => e.id !== id),
      activeEntryId: s.activeEntryId === id ? null : s.activeEntryId
    })),
  updateEntry: (id, patch) => set((s) => ({ entries: s.entries.map((e) => (e.id === id ? { ...e, ...patch } : e)) })),
  startCombat: () => {
    const sorted = sortedEntries(get().entries)
    set({ round: 1, activeEntryId: sorted[0]?.id ?? null })
  },
  nextTurn: () => {
    const { entries, activeEntryId, round } = get()
    const sorted = sortedEntries(entries)
    if (sorted.length === 0) return
    const idx = sorted.findIndex((e) => e.id === activeEntryId)
    if (idx === -1 || idx === sorted.length - 1) {
      set({ activeEntryId: sorted[0].id, round: round + 1 })
    } else {
      set({ activeEntryId: sorted[idx + 1].id })
    }
  },
  clear: () => set({ round: 0, activeEntryId: null, entries: [] })
}))
