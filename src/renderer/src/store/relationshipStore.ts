import { create } from 'zustand'
import type { RelationshipGraph } from '@shared/types'

interface RelationshipState {
  graphs: RelationshipGraph[]
  loaded: boolean
  load: () => Promise<void>
  upsert: (graph: RelationshipGraph) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const useRelationshipStore = create<RelationshipState>((set) => ({
  graphs: [],
  loaded: false,
  load: async () => {
    const graphs = await window.api.relationships.list()
    set({ graphs, loaded: true })
  },
  upsert: async (graph) => {
    await window.api.relationships.save(graph)
    set((state) => {
      const exists = state.graphs.some((g) => g.id === graph.id)
      const graphs = exists ? state.graphs.map((g) => (g.id === graph.id ? graph : g)) : [graph, ...state.graphs]
      return { graphs }
    })
  },
  remove: async (id) => {
    await window.api.relationships.delete(id)
    set((state) => ({ graphs: state.graphs.filter((g) => g.id !== id) }))
  }
}))
