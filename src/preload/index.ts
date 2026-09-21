import { contextBridge, ipcRenderer } from 'electron'
import type { Character, LoreNote } from '../shared/dnd/types'
import type { GameMap, RelationshipGraph } from '../shared/types'
import type { CustomMonster } from '../shared/dnd/monsters'

const api = {
  appVersion: process.env.npm_package_version ?? '0.1.0',
  characters: {
    list: (): Promise<Character[]> => ipcRenderer.invoke('characters:list'),
    save: (character: Character): Promise<void> => ipcRenderer.invoke('characters:save', character),
    delete: (id: string): Promise<void> => ipcRenderer.invoke('characters:delete', id)
  },
  lore: {
    list: (): Promise<LoreNote[]> => ipcRenderer.invoke('lore:list'),
    save: (note: LoreNote): Promise<void> => ipcRenderer.invoke('lore:save', note),
    delete: (id: string): Promise<void> => ipcRenderer.invoke('lore:delete', id)
  },
  maps: {
    list: (): Promise<GameMap[]> => ipcRenderer.invoke('maps:list'),
    save: (map: GameMap): Promise<void> => ipcRenderer.invoke('maps:save', map),
    delete: (id: string): Promise<void> => ipcRenderer.invoke('maps:delete', id)
  },
  monsters: {
    list: (): Promise<CustomMonster[]> => ipcRenderer.invoke('monsters:list'),
    save: (monster: CustomMonster): Promise<void> => ipcRenderer.invoke('monsters:save', monster),
    delete: (id: string): Promise<void> => ipcRenderer.invoke('monsters:delete', id)
  },
  relationships: {
    list: (): Promise<RelationshipGraph[]> => ipcRenderer.invoke('relationships:list'),
    save: (graph: RelationshipGraph): Promise<void> => ipcRenderer.invoke('relationships:save', graph),
    delete: (id: string): Promise<void> => ipcRenderer.invoke('relationships:delete', id)
  }
}

contextBridge.exposeInMainWorld('api', api)
