import type { AbilityScores } from './types'

export interface MonsterAction {
  name: string
  description: string
  attackBonus?: number
  damageDice?: string
  damageType?: string
}

export interface MonsterInfo {
  id: string
  name: string
  type: string
  size: 'Küçük' | 'Orta' | 'Büyük' | 'Devasa'
  cr: number
  ac: number
  hp: number
  hitDice: string
  speed: number
  abilities: AbilityScores
  senses: string
  languages: string
  traits: { name: string; description: string }[]
  actions: MonsterAction[]
  custom?: boolean
}

export interface CustomMonster extends MonsterInfo {
  updatedAt: number
}

export function crToXp(cr: number): number {
  const table: Record<number, number> = {
    0: 10,
    0.125: 25,
    0.25: 50,
    0.5: 100,
    1: 200,
    2: 450,
    3: 700,
    4: 1100,
    5: 1800,
    6: 2300,
    7: 2900,
    8: 3900,
    9: 5000,
    10: 5900
  }
  return table[cr] ?? 0
}

export function formatCr(cr: number): string {
  if (cr === 0.125) return '1/8'
  if (cr === 0.25) return '1/4'
  if (cr === 0.5) return '1/2'
  return String(cr)
}

export interface XpThresholds {
  easy: number
  medium: number
  hard: number
  deadly: number
}

const XP_THRESHOLD_TABLE: Record<number, XpThresholds> = {
  1: { easy: 25, medium: 50, hard: 75, deadly: 100 },
  2: { easy: 50, medium: 100, hard: 150, deadly: 200 },
  3: { easy: 75, medium: 150, hard: 225, deadly: 400 },
  4: { easy: 125, medium: 250, hard: 375, deadly: 500 },
  5: { easy: 250, medium: 500, hard: 750, deadly: 1100 },
  6: { easy: 300, medium: 600, hard: 900, deadly: 1400 },
  7: { easy: 350, medium: 750, hard: 1100, deadly: 1700 },
  8: { easy: 450, medium: 900, hard: 1400, deadly: 2100 },
  9: { easy: 550, medium: 1100, hard: 1600, deadly: 2400 },
  10: { easy: 600, medium: 1200, hard: 1900, deadly: 2800 }
}

export function xpThresholdForLevel(level: number): XpThresholds {
  const clamped = Math.min(10, Math.max(1, level))
  return XP_THRESHOLD_TABLE[clamped]
}

export function partyXpThresholds(levels: number[]): XpThresholds {
  return levels.reduce(
    (sum, lvl) => {
      const t = xpThresholdForLevel(lvl)
      return { easy: sum.easy + t.easy, medium: sum.medium + t.medium, hard: sum.hard + t.hard, deadly: sum.deadly + t.deadly }
    },
    { easy: 0, medium: 0, hard: 0, deadly: 0 }
  )
}

export function encounterMultiplier(monsterCount: number): number {
  if (monsterCount <= 1) return 1
  if (monsterCount === 2) return 1.5
  if (monsterCount <= 6) return 2
  if (monsterCount <= 10) return 2.5
  if (monsterCount <= 14) return 3
  return 4
}

export type EncounterDifficulty = 'Kolay' | 'Orta' | 'Zor' | 'Ölümcül' | 'Önemsiz'

export function encounterDifficulty(adjustedXp: number, thresholds: XpThresholds): EncounterDifficulty {
  if (adjustedXp >= thresholds.deadly) return 'Ölümcül'
  if (adjustedXp >= thresholds.hard) return 'Zor'
  if (adjustedXp >= thresholds.medium) return 'Orta'
  if (adjustedXp >= thresholds.easy) return 'Kolay'
  return 'Önemsiz'
}

export const MONSTERS: MonsterInfo[] = [
  {
    id: 'kobold',
    name: 'Kobold',
    type: 'İnsansı (kobold)',
    size: 'Küçük',
    cr: 0.125,
    ac: 12,
    hp: 5,
    hitDice: '2d6-2',
    speed: 30,
    abilities: { str: 7, dex: 15, con: 9, int: 8, wis: 7, cha: 8 },
    senses: 'karanlık görüş 18m',
    languages: 'Kobold Dili',
    traits: [{ name: 'Sürü Taktiği', description: 'Bir müttefiki hedefin 1.5m yakınındaysa saldırıya avantajlı vurur.' }],
    actions: [{ name: 'Hançer', description: 'Yakın/uzak silah saldırısı', attackBonus: 4, damageDice: '1d4+2', damageType: 'delici' }]
  },
  {
    id: 'goblin',
    name: 'Goblin',
    type: 'İnsansı (goblinoid)',
    size: 'Küçük',
    cr: 0.25,
    ac: 15,
    hp: 7,
    hitDice: '2d6',
    speed: 30,
    abilities: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 },
    senses: 'karanlık görüş 18m',
    languages: 'Ortak Dil, Goblin Dili',
    traits: [{ name: 'Fırsatçı Kaçış', description: 'Aksiyonla ayrılma harcamadan hareket edebilir.' }],
    actions: [
      { name: 'Pala', description: 'Yakın silah saldırısı', attackBonus: 4, damageDice: '1d6+2', damageType: 'kesici' },
      { name: 'Kısa Yay', description: 'Uzak silah saldırısı', attackBonus: 4, damageDice: '1d6+2', damageType: 'delici' }
    ]
  },
  {
    id: 'bandit',
    name: 'Haydut',
    type: 'İnsansı (insan)',
    size: 'Orta',
    cr: 0.125,
    ac: 12,
    hp: 11,
    hitDice: '2d8+2',
    speed: 30,
    abilities: { str: 11, dex: 12, con: 12, int: 10, wis: 10, cha: 10 },
    senses: 'normal görüş',
    languages: 'Ortak Dil',
    traits: [],
    actions: [
      { name: 'Palıska', description: 'Yakın silah saldırısı', attackBonus: 3, damageDice: '1d6+1', damageType: 'kesici' },
      { name: 'Hafif Arbalet', description: 'Uzak silah saldırısı', attackBonus: 3, damageDice: '1d8+1', damageType: 'delici' }
    ]
  },
  {
    id: 'wolf',
    name: 'Kurt',
    type: 'Canavar',
    size: 'Orta',
    cr: 0.25,
    ac: 13,
    hp: 11,
    hitDice: '2d8+2',
    speed: 40,
    abilities: { str: 12, dex: 15, con: 12, int: 3, wis: 12, cha: 6 },
    senses: 'keskin koku 9m',
    languages: '—',
    traits: [{ name: 'Sürü Taktiği', description: 'Bir müttefiki hedefin yakınındaysa saldırıya avantajlı vurur.' }],
    actions: [{ name: 'Isırık', description: 'Yakın silah saldırısı, hedef yere düşebilir', attackBonus: 4, damageDice: '2d4+2', damageType: 'delici' }]
  },
  {
    id: 'skeleton',
    name: 'İskelet',
    type: 'Yaşayan Ölü',
    size: 'Orta',
    cr: 0.25,
    ac: 13,
    hp: 13,
    hitDice: '2d8+4',
    speed: 30,
    abilities: { str: 10, dex: 14, con: 15, int: 6, wis: 8, cha: 5 },
    senses: 'karanlık görüş 18m',
    languages: 'yaşarken bildiği diller',
    traits: [{ name: 'Kırılgan İskelet', description: 'Ezici hasara karşı savunmasız.' }],
    actions: [
      { name: 'Kısa Kılıç', description: 'Yakın silah saldırısı', attackBonus: 4, damageDice: '1d6+2', damageType: 'delici' },
      { name: 'Kısa Yay', description: 'Uzak silah saldırısı', attackBonus: 4, damageDice: '1d6+2', damageType: 'delici' }
    ]
  },
  {
    id: 'zombie',
    name: 'Zombi',
    type: 'Yaşayan Ölü',
    size: 'Orta',
    cr: 0.25,
    ac: 8,
    hp: 22,
    hitDice: '3d8+9',
    speed: 20,
    abilities: { str: 13, dex: 6, con: 16, int: 3, wis: 6, cha: 5 },
    senses: 'karanlık görüş 18m',
    languages: 'yaşarken bildiği diller (konuşamaz)',
    traits: [{ name: 'Yaşamı Sürdürme', description: 'Öldürücü hasarda Dayanıklılık kurtarma ile 1 HP kalabilir.' }],
    actions: [{ name: 'Yumruk', description: 'Yakın silah saldırısı', attackBonus: 3, damageDice: '1d6+1', damageType: 'ezici' }]
  },
  {
    id: 'orc',
    name: 'Ork',
    type: 'İnsansı (orkoid)',
    size: 'Orta',
    cr: 0.5,
    ac: 13,
    hp: 15,
    hitDice: '2d8+6',
    speed: 30,
    abilities: { str: 16, dex: 12, con: 16, int: 7, wis: 11, cha: 10 },
    senses: 'karanlık görüş 18m',
    languages: 'Ortak Dil, Ork Dili',
    traits: [{ name: 'Saldırganlık', description: 'Bonus aksiyonla hedefe doğru koşabilir.' }],
    actions: [{ name: 'Büyük Balta', description: 'Yakın silah saldırısı', attackBonus: 5, damageDice: '1d12+3', damageType: 'kesici' }]
  },
  {
    id: 'hobgoblin',
    name: 'Hobgoblin',
    type: 'İnsansı (goblinoid)',
    size: 'Orta',
    cr: 0.5,
    ac: 18,
    hp: 11,
    hitDice: '2d8+2',
    speed: 30,
    abilities: { str: 13, dex: 12, con: 12, int: 10, wis: 10, cha: 9 },
    senses: 'karanlık görüş 18m',
    languages: 'Ortak Dil, Goblin Dili',
    traits: [{ name: 'Askeri Üstünlük', description: 'Bir müttefiki hedefin yakınındaysa saldırıya +2 hasar ekler.' }],
    actions: [{ name: 'Uzun Kılıç', description: 'Yakın silah saldırısı', attackBonus: 3, damageDice: '1d8+1', damageType: 'kesici' }]
  },
  {
    id: 'black-bear',
    name: 'Kara Ayı',
    type: 'Canavar',
    size: 'Orta',
    cr: 0.5,
    ac: 11,
    hp: 19,
    hitDice: '3d8+6',
    speed: 40,
    abilities: { str: 15, dex: 10, con: 14, int: 2, wis: 12, cha: 7 },
    senses: 'keskin koku 9m',
    languages: '—',
    traits: [],
    actions: [
      { name: 'Isırık', description: 'Yakın silah saldırısı', attackBonus: 3, damageDice: '1d6+2', damageType: 'delici' },
      { name: 'Pençeler', description: 'Yakın silah saldırısı', attackBonus: 3, damageDice: '2d4+2', damageType: 'kesici' }
    ]
  },
  {
    id: 'giant-spider',
    name: 'Dev Örümcek',
    type: 'Canavar',
    size: 'Büyük',
    cr: 1,
    ac: 14,
    hp: 26,
    hitDice: '4d10+4',
    speed: 30,
    abilities: { str: 14, dex: 16, con: 12, int: 2, wis: 11, cha: 4 },
    senses: 'karanlık görüş 18m',
    languages: '—',
    traits: [{ name: 'Ağ Yürüyüşü', description: 'Ağlara takılmadan hareket eder.' }],
    actions: [{ name: 'Isırık', description: 'Zehir hasarı ekler, hedef Dayanıklılık kurtarma atar', attackBonus: 5, damageDice: '1d8+3', damageType: 'delici+zehir' }]
  },
  {
    id: 'ghoul',
    name: 'Gulyabani',
    type: 'Yaşayan Ölü',
    size: 'Orta',
    cr: 1,
    ac: 12,
    hp: 22,
    hitDice: '5d8',
    speed: 30,
    abilities: { str: 13, dex: 15, con: 10, int: 7, wis: 10, cha: 6 },
    senses: 'karanlık görüş 18m',
    languages: 'yaşarken bildiği diller',
    traits: [],
    actions: [
      { name: 'Isırık', description: 'Yakın silah saldırısı', attackBonus: 2, damageDice: '2d6', damageType: 'delici' },
      { name: 'Pençeler', description: 'İsabet ederse hedef felç olabilir', attackBonus: 4, damageDice: '2d4+2', damageType: 'kesici' }
    ]
  },
  {
    id: 'dire-wolf',
    name: 'Dev Kurt',
    type: 'Canavar',
    size: 'Büyük',
    cr: 1,
    ac: 14,
    hp: 37,
    hitDice: '5d10+10',
    speed: 50,
    abilities: { str: 17, dex: 15, con: 15, int: 3, wis: 12, cha: 7 },
    senses: 'keskin koku 9m',
    languages: '—',
    traits: [{ name: 'Sürü Taktiği', description: 'Bir müttefiki hedefin yakınındaysa saldırıya avantajlı vurur.' }],
    actions: [{ name: 'Isırık', description: 'Yakın silah saldırısı, hedef yere düşebilir', attackBonus: 5, damageDice: '2d6+3', damageType: 'delici' }]
  },
  {
    id: 'bugbear',
    name: 'Bugbear',
    type: 'İnsansı (goblinoid)',
    size: 'Orta',
    cr: 1,
    ac: 16,
    hp: 27,
    hitDice: '5d8+5',
    speed: 30,
    abilities: { str: 15, dex: 14, con: 13, int: 8, wis: 11, cha: 9 },
    senses: 'karanlık görüş 18m',
    languages: 'Ortak Dil, Goblin Dili',
    traits: [{ name: 'Sinsi Saldırı', description: 'İlk turda ekstra 2d6 hasar verebilir.' }],
    actions: [{ name: 'Sabahyıldızı', description: 'Yakın silah saldırısı', attackBonus: 4, damageDice: '2d8+2', damageType: 'ezici' }]
  },
  {
    id: 'ogre',
    name: 'Ogr',
    type: 'Dev',
    size: 'Büyük',
    cr: 2,
    ac: 11,
    hp: 59,
    hitDice: '7d10+21',
    speed: 40,
    abilities: { str: 19, dex: 8, con: 16, int: 5, wis: 7, cha: 7 },
    senses: 'karanlık görüş 18m',
    languages: 'Dev Dili',
    traits: [],
    actions: [{ name: 'Büyük Sopa', description: 'Yakın silah saldırısı', attackBonus: 6, damageDice: '2d8+4', damageType: 'ezici' }]
  },
  {
    id: 'owlbear',
    name: 'Baykuşayı (Owlbear)',
    type: 'Canavarımsı',
    size: 'Büyük',
    cr: 3,
    ac: 13,
    hp: 59,
    hitDice: '7d10+21',
    speed: 40,
    abilities: { str: 20, dex: 12, con: 17, int: 3, wis: 12, cha: 7 },
    senses: 'karanlık görüş 18m',
    languages: '—',
    traits: [{ name: 'Keskin Duyu', description: 'İşitme ve koku algısına dayalı Algı atışlarında avantajlı.' }],
    actions: [
      { name: 'Gaga', description: 'Yakın silah saldırısı', attackBonus: 7, damageDice: '1d10+5', damageType: 'delici' },
      { name: 'Pençeler', description: 'Yakın silah saldırısı', attackBonus: 7, damageDice: '2d8+5', damageType: 'kesici' }
    ]
  },
  {
    id: 'troll',
    name: 'Trol',
    type: 'Dev',
    size: 'Büyük',
    cr: 5,
    ac: 15,
    hp: 84,
    hitDice: '8d10+40',
    speed: 30,
    abilities: { str: 18, dex: 13, con: 20, int: 7, wis: 9, cha: 7 },
    senses: 'karanlık görüş 18m',
    languages: 'Dev Dili',
    traits: [{ name: 'Yenilenme', description: 'Ateş/asit hasarı almadıysa her tur başında 10 HP iyileşir.' }],
    actions: [
      { name: 'Isırık', description: 'Yakın silah saldırısı', attackBonus: 7, damageDice: '1d6+4', damageType: 'delici' },
      { name: 'Pençeler (x2)', description: 'İki ayrı pençe saldırısı', attackBonus: 7, damageDice: '2d6+4', damageType: 'kesici' }
    ]
  }
]
