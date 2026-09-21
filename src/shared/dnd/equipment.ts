import type { AbilityKey } from './types'

export type WeaponCategory = 'simple-melee' | 'martial-melee' | 'simple-ranged' | 'martial-ranged'

export interface WeaponInfo {
  id: string
  name: string
  category: WeaponCategory
  damageDice: string
  damageType: string
  ability: AbilityKey
  finesse?: boolean
  properties: string[]
}

export type ArmorCategory = 'light' | 'medium' | 'heavy' | 'shield'

export interface ArmorInfo {
  id: string
  name: string
  category: ArmorCategory
  baseAC: number
  strRequirement?: number
  stealthDisadvantage?: boolean
}

export interface GearInfo {
  id: string
  name: string
}

export const WEAPONS: WeaponInfo[] = [
  { id: 'dagger', name: 'Hançer', category: 'simple-melee', damageDice: '1d4', damageType: 'delici', ability: 'str', finesse: true, properties: ['hafif', 'fırlatılabilir'] },
  { id: 'mace', name: 'Topuz', category: 'simple-melee', damageDice: '1d6', damageType: 'ezici', ability: 'str', properties: [] },
  { id: 'quarterstaff', name: 'Asa', category: 'simple-melee', damageDice: '1d6', damageType: 'ezici', ability: 'str', properties: ['çok yönlü (1d8)'] },
  { id: 'shortbow', name: 'Kısa Yay', category: 'simple-ranged', damageDice: '1d6', damageType: 'delici', ability: 'dex', properties: ['menzilli'] },
  { id: 'shortsword', name: 'Kısa Kılıç', category: 'martial-melee', damageDice: '1d6', damageType: 'delici', ability: 'dex', finesse: true, properties: ['hafif'] },
  { id: 'longsword', name: 'Uzun Kılıç', category: 'martial-melee', damageDice: '1d8', damageType: 'kesici', ability: 'str', properties: ['çok yönlü (1d10)'] },
  { id: 'rapier', name: 'Flöre', category: 'martial-melee', damageDice: '1d8', damageType: 'delici', ability: 'dex', finesse: true, properties: [] },
  { id: 'greataxe', name: 'Büyük Balta', category: 'martial-melee', damageDice: '1d12', damageType: 'kesici', ability: 'str', properties: ['iki elli', 'ağır'] },
  { id: 'warhammer', name: 'Savaş Çekici', category: 'martial-melee', damageDice: '1d8', damageType: 'ezici', ability: 'str', properties: ['çok yönlü (1d10)'] },
  { id: 'longbow', name: 'Uzun Yay', category: 'martial-ranged', damageDice: '1d8', damageType: 'delici', ability: 'dex', properties: ['menzilli', 'iki elli', 'ağır'] },
  { id: 'sling', name: 'Sapan', category: 'simple-ranged', damageDice: '1d4', damageType: 'ezici', ability: 'dex', properties: ['menzilli'] },
  { id: 'javelin', name: 'Cirit', category: 'simple-melee', damageDice: '1d6', damageType: 'delici', ability: 'str', properties: ['fırlatılabilir'] },
  { id: 'handaxe', name: 'El Baltası', category: 'simple-melee', damageDice: '1d6', damageType: 'kesici', ability: 'str', finesse: false, properties: ['hafif', 'fırlatılabilir'] },
  { id: 'greatsword', name: 'Büyük Kılıç', category: 'martial-melee', damageDice: '2d6', damageType: 'kesici', ability: 'str', properties: ['iki elli', 'ağır'] },
  { id: 'whip', name: 'Kırbaç', category: 'martial-melee', damageDice: '1d4', damageType: 'kesici', ability: 'dex', finesse: true, properties: ['menzil 3m'] },
  { id: 'light-crossbow', name: 'Hafif Arbalet', category: 'simple-ranged', damageDice: '1d8', damageType: 'delici', ability: 'dex', properties: ['menzilli', 'iki elli'] }
]

export const ARMOR: ArmorInfo[] = [
  { id: 'leather', name: 'Deri Zırh', category: 'light', baseAC: 11 },
  { id: 'studded-leather', name: 'Perçinli Deri', category: 'light', baseAC: 12 },
  { id: 'hide', name: 'Post Zırh', category: 'medium', baseAC: 12 },
  { id: 'chain-shirt', name: 'Zincir Gömlek', category: 'medium', baseAC: 13 },
  { id: 'breastplate', name: 'Göğüs Zırhı', category: 'medium', baseAC: 14 },
  { id: 'ring-mail', name: 'Halka Zırh', category: 'heavy', baseAC: 14, stealthDisadvantage: true },
  { id: 'chain-mail', name: 'Zincir Zırh', category: 'heavy', baseAC: 16, strRequirement: 13, stealthDisadvantage: true },
  { id: 'splint', name: 'Yekpare Zırh', category: 'heavy', baseAC: 17, strRequirement: 15, stealthDisadvantage: true },
  { id: 'padded', name: 'Vatkalı Zırh', category: 'light', baseAC: 11, stealthDisadvantage: true },
  { id: 'shield', name: 'Kalkan', category: 'shield', baseAC: 2 }
]

export const GEAR: GearInfo[] = [
  { id: 'backpack', name: 'Sırt Çantası' },
  { id: 'bedroll', name: 'Uyku Tulumu' },
  { id: 'rope-50ft', name: 'İp (15m)' },
  { id: 'torch', name: 'Meşale' },
  { id: 'rations', name: 'Erzak (1 gün)' },
  { id: 'waterskin', name: 'Su Tulumu' },
  { id: 'healers-kit', name: 'Sağlık Çantası' },
  { id: 'thieves-tools', name: 'Hırsız Aletleri' },
  { id: 'torch-bundle', name: 'Meşale Demeti' },
  { id: 'gold-pouch', name: 'Altın Kesesi' }
]
