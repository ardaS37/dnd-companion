import type { RelationshipGraph } from '../shared/types'
import { createJsonStore } from './jsonStore'

const store = createJsonStore<RelationshipGraph>('relationships')

export const listRelationshipGraphs = store.list
export const saveRelationshipGraph = store.save
export const deleteRelationshipGraph = store.remove
