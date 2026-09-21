import type { Character, LoreNote } from '../shared/dnd/types'
import type { GameMap, RelationshipGraph } from '../shared/types'
import type { CustomMonster } from '../shared/dnd/monsters'

export interface ExposedApi {
  appVersion: string
  characters: {
    list: () => Promise<Character[]>
    save: (character: Character) => Promise<void>
    delete: (id: string) => Promise<void>
  }
  lore: {
    list: () => Promise<LoreNote[]>
    save: (note: LoreNote) => Promise<void>
    delete: (id: string) => Promise<void>
  }
  maps: {
    list: () => Promise<GameMap[]>
    save: (map: GameMap) => Promise<void>
    delete: (id: string) => Promise<void>
  }
  monsters: {
    list: () => Promise<CustomMonster[]>
    save: (monster: CustomMonster) => Promise<void>
    delete: (id: string) => Promise<void>
  }
  relationships: {
    list: () => Promise<RelationshipGraph[]>
    save: (graph: RelationshipGraph) => Promise<void>
    delete: (id: string) => Promise<void>
  }
}

declare global {
  interface Window {
    api: ExposedApi
  }
}
