import type { GameMap } from '../shared/types'
import { createJsonStore } from './jsonStore'

const store = createJsonStore<GameMap>('maps')

export const listMaps = store.list
export const saveMap = store.save
export const deleteMap = store.remove
