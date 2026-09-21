import type { Character } from '../shared/dnd/types'
import { createJsonStore } from './jsonStore'

const store = createJsonStore<Character>('characters')

export const listCharacters = store.list
export const saveCharacter = store.save
export const deleteCharacter = store.remove
