export interface AbilityScores {
  str: number
  dex: number
  con: number
  int: number
  wis: number
  cha: number
}

export type AbilityKey = keyof AbilityScores

export const ABILITY_LABELS: Record<AbilityKey, string> = {
  str: 'Güç',
  dex: 'Çeviklik',
  con: 'Dayanıklılık',
  int: 'Zeka',
  wis: 'Bilgelik',
  cha: 'Karizma'
}

export interface RaceInfo {
  id: string
  name: string
  size: 'Küçük' | 'Orta'
  speed: number
  abilityBonuses: Partial<AbilityScores>
  traits: string[]
}

export interface ClassInfo {
  id: string
  name: string
  hitDie: number
  primaryAbilities: AbilityKey[]
  savingThrowProficiencies: AbilityKey[]
  skillChoiceCount: number
  skillChoices: string[]
  spellcastingAbility?: AbilityKey
}

export interface BackgroundInfo {
  id: string
  name: string
  skillProficiencies: string[]
  feature: string
  featureDescription: string
}

export interface SkillInfo {
  id: string
  name: string
  ability: AbilityKey
}

export type InventoryItemKind = 'weapon' | 'armor' | 'gear'

export interface InventoryItem {
  itemId: string
  kind: InventoryItemKind
  quantity: number
  equipped: boolean
}

export interface DeathSaves {
  successes: number
  failures: number
}

export interface Character {
  id: string
  name: string
  raceId: string
  classId: string
  backgroundId: string
  alignment: string
  level: number
  abilities: AbilityScores
  skillProficiencies: string[]
  inventory: InventoryItem[]
  currentHp: number
  tempHp: number
  hitDiceUsed: number
  deathSaves: DeathSaves
  exhaustion: number
  spellsKnown: string[]
  spellSlotsUsed: Partial<Record<number, number>>
  backstory: string
  appearance: string
  portraitDataUrl: string | null
  createdAt: number
  updatedAt: number
}

export const ALIGNMENTS = [
  'Lawful Good',
  'Neutral Good',
  'Chaotic Good',
  'Lawful Neutral',
  'True Neutral',
  'Chaotic Neutral',
  'Lawful Evil',
  'Neutral Evil',
  'Chaotic Evil'
] as const

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8] as const

export type LoreNoteType = 'world' | 'location' | 'npc' | 'event' | 'session'

export const LORE_TYPE_LABELS: Record<LoreNoteType, string> = {
  world: 'Dünya',
  location: 'Mekan',
  npc: 'NPC',
  event: 'Olay',
  session: 'Oturum Günlüğü'
}

export interface LoreNote {
  id: string
  type: LoreNoteType
  title: string
  body: string
  linkedMapId: string | null
  createdAt: number
  updatedAt: number
}
