import type { LoreNote } from '../shared/dnd/types'
import { createJsonStore } from './jsonStore'

const store = createJsonStore<LoreNote>('lore')

export const listLoreNotes = store.list
export const saveLoreNote = store.save
export const deleteLoreNote = store.remove
