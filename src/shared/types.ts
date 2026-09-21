export interface ChatMessage {
  id: string
  author: string
  body: string
  kind: 'chat' | 'system' | 'roll'
  timestamp: number
}

export interface RoomSummary {
  id: string
  name: string
  system: string
  playerCount: number
  maxPlayers: number
}

export interface Token {
  id: string
  name: string
  x: number
  y: number
  size: number
  color: string
  imageDataUrl?: string
  characterId?: string
  currentHp?: number
  maxHp?: number
  hidden: boolean
}

export interface GameMap {
  id: string
  name: string
  imageDataUrl: string | null
  cols: number
  rows: number
  fogEnabled: boolean
  revealedCells: string[]
  tokens: Token[]
  createdAt: number
  updatedAt: number
}

export interface RelationshipNode {
  id: string
  label: string
  characterId: string | null
  x: number
  y: number
}

export interface RelationshipEdge {
  id: string
  fromId: string
  toId: string
  label: string
}

export interface RelationshipGraph {
  id: string
  name: string
  nodes: RelationshipNode[]
  edges: RelationshipEdge[]
  createdAt: number
  updatedAt: number
}
