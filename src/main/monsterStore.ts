import type { CustomMonster } from '../shared/dnd/monsters'
import { createJsonStore } from './jsonStore'

const store = createJsonStore<CustomMonster>('monsters')

export const listCustomMonsters = store.list
export const saveCustomMonster = store.save
export const deleteCustomMonster = store.remove
