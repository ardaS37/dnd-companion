import type { AbilityKey } from './types'

export type SpellSchool =
  | 'abjuration'
  | 'conjuration'
  | 'divination'
  | 'enchantment'
  | 'evocation'
  | 'illusion'
  | 'necromancy'
  | 'transmutation'

export const SCHOOL_LABELS: Record<SpellSchool, string> = {
  abjuration: 'Koruma',
  conjuration: 'Çağırma',
  divination: 'Kehanet',
  enchantment: 'Büyüleme',
  evocation: 'Yaratma',
  illusion: 'Yanılsama',
  necromancy: 'Ölü Büyüsü',
  transmutation: 'Dönüştürme'
}

export interface SpellInfo {
  id: string
  name: string
  level: number
  school: SpellSchool
  classIds: string[]
  castingTime: string
  range: string
  duration: string
  description: string
  damageDice?: string
  damageType?: string
  healDice?: string
  savingThrow?: AbilityKey
  attackRoll?: boolean
}

export const SPELLS: SpellInfo[] = [
  {
    id: 'fire-bolt',
    name: 'Ateş Oku',
    level: 0,
    school: 'evocation',
    classIds: ['wizard', 'sorcerer'],
    castingTime: '1 aksiyon',
    range: '36m',
    duration: 'Anlık',
    description: 'Hedefe ateş fırlatırsın.',
    damageDice: '1d10',
    damageType: 'ateş',
    attackRoll: true
  },
  {
    id: 'ray-of-frost',
    name: 'Don Işını',
    level: 0,
    school: 'evocation',
    classIds: ['wizard', 'sorcerer'],
    castingTime: '1 aksiyon',
    range: '18m',
    duration: 'Anlık',
    description: 'Hedefe soğuk enerji fırlatırsın, hızı 3m azalır.',
    damageDice: '1d8',
    damageType: 'soğuk',
    attackRoll: true
  },
  {
    id: 'mage-hand',
    name: 'Büyücü Eli',
    level: 0,
    school: 'conjuration',
    classIds: ['wizard'],
    castingTime: '1 aksiyon',
    range: '9m',
    duration: '1 dakika',
    description: 'Hayalet bir el küçük eşyaları taşıyabilir.'
  },
  {
    id: 'prestidigitation',
    name: 'El Çabukluğu Büyüsü',
    level: 0,
    school: 'transmutation',
    classIds: ['wizard'],
    castingTime: '1 aksiyon',
    range: '3m',
    duration: 'Değişken',
    description: 'Küçük büyülü numaralar: kıvılcım, koku, renk değiştirme.'
  },
  {
    id: 'magic-missile',
    name: 'Büyülü Mermi',
    level: 1,
    school: 'evocation',
    classIds: ['wizard', 'sorcerer'],
    castingTime: '1 aksiyon',
    range: '36m',
    duration: 'Anlık',
    description: '3 parlak enerji oku otomatik isabet eder.',
    damageDice: '3d4+3',
    damageType: 'force'
  },
  {
    id: 'burning-hands',
    name: 'Yanan Eller',
    level: 1,
    school: 'evocation',
    classIds: ['wizard', 'sorcerer'],
    castingTime: '1 aksiyon',
    range: 'Kendisi (4,5m koni)',
    duration: 'Anlık',
    description: 'Önündeki koni alana ateş püskürtürsün.',
    damageDice: '3d6',
    damageType: 'ateş',
    savingThrow: 'dex'
  },
  {
    id: 'shield',
    name: 'Kalkan Büyüsü',
    level: 1,
    school: 'abjuration',
    classIds: ['wizard', 'sorcerer'],
    castingTime: '1 tepki',
    range: 'Kendisi',
    duration: '1 tur',
    description: 'AC +5 kazanırsın, büyülü mermilere bağışık olursun.'
  },
  {
    id: 'detect-magic',
    name: 'Büyü Tespiti',
    level: 1,
    school: 'divination',
    classIds: ['wizard', 'cleric'],
    castingTime: '1 aksiyon',
    range: 'Kendisi',
    duration: '10 dakika',
    description: '9m içindeki büyülü eşya ve etkileri algılarsın.'
  },
  {
    id: 'misty-step',
    name: 'Sisli Adım',
    level: 2,
    school: 'conjuration',
    classIds: ['wizard', 'sorcerer', 'warlock'],
    castingTime: '1 bonus aksiyon',
    range: 'Kendisi',
    duration: 'Anlık',
    description: '9m içinde görebildiğin bir noktaya ışınlanırsın.'
  },
  {
    id: 'scorching-ray',
    name: 'Kavurucu Işın',
    level: 2,
    school: 'evocation',
    classIds: ['wizard', 'sorcerer'],
    castingTime: '1 aksiyon',
    range: '36m',
    duration: 'Anlık',
    description: '3 ayrı ateş ışını fırlatırsın (her biri için ayrı at).',
    damageDice: '2d6',
    damageType: 'ateş',
    attackRoll: true
  },
  {
    id: 'sacred-flame',
    name: 'Kutsal Alev',
    level: 0,
    school: 'evocation',
    classIds: ['cleric'],
    castingTime: '1 aksiyon',
    range: '18m',
    duration: 'Anlık',
    description: 'Gökten kutsal ışık iner, hedef siper alamaz.',
    damageDice: '1d8',
    damageType: 'kutsal',
    savingThrow: 'dex'
  },
  {
    id: 'guidance',
    name: 'Rehberlik',
    level: 0,
    school: 'divination',
    classIds: ['cleric'],
    castingTime: '1 aksiyon',
    range: 'Dokunma',
    duration: '1 dakika',
    description: 'Hedef bir yetenek kontrolüne 1d4 ekler.'
  },
  {
    id: 'light',
    name: 'Işık',
    level: 0,
    school: 'evocation',
    classIds: ['cleric', 'wizard'],
    castingTime: '1 aksiyon',
    range: 'Dokunma',
    duration: '1 saat',
    description: 'Dokunduğun eşya 6m yarıçapında ışık saçar.'
  },
  {
    id: 'cure-wounds',
    name: 'Yara İyileştirme',
    level: 1,
    school: 'evocation',
    classIds: ['cleric', 'druid', 'paladin', 'ranger', 'bard'],
    castingTime: '1 aksiyon',
    range: 'Dokunma',
    duration: 'Anlık',
    description: 'Dokunduğun yaratık can puanı kazanır.',
    healDice: '1d8'
  },
  {
    id: 'healing-word',
    name: 'İyileştirme Sözü',
    level: 1,
    school: 'evocation',
    classIds: ['cleric', 'druid', 'bard'],
    castingTime: '1 bonus aksiyon',
    range: '18m',
    duration: 'Anlık',
    description: 'Uzaktaki bir müttefik can puanı kazanır.',
    healDice: '1d4'
  },
  {
    id: 'guiding-bolt',
    name: 'Yol Gösteren Cisim',
    level: 1,
    school: 'evocation',
    classIds: ['cleric'],
    castingTime: '1 aksiyon',
    range: '36m',
    duration: 'Anlık',
    description: 'Parlak enerji hedefi vurur, sonraki atış avantajlı olur.',
    damageDice: '4d6',
    damageType: 'kutsal',
    attackRoll: true
  },
  {
    id: 'bless',
    name: 'Kutsama',
    level: 1,
    school: 'enchantment',
    classIds: ['cleric', 'paladin'],
    castingTime: '1 aksiyon',
    range: '9m',
    duration: '1 dakika (konsantrasyon)',
    description: 'En fazla 3 müttefik atış ve kurtarma zarlarına 1d4 ekler.'
  },
  {
    id: 'spiritual-weapon',
    name: 'Ruhani Silah',
    level: 2,
    school: 'evocation',
    classIds: ['cleric'],
    castingTime: '1 bonus aksiyon',
    range: '18m',
    duration: '1 dakika',
    description: 'Yüzen silahsı bir güç oluşturup saldırtırsın.',
    damageDice: '1d8',
    damageType: 'force',
    attackRoll: true
  },
  {
    id: 'hold-person',
    name: 'Kişiyi Durdurma',
    level: 2,
    school: 'enchantment',
    classIds: ['cleric', 'wizard', 'sorcerer', 'warlock', 'bard', 'druid'],
    castingTime: '1 aksiyon',
    range: '18m',
    duration: '1 dakika (konsantrasyon)',
    description: 'Hedef felç olur (Bilgelik kurtarma ile direnebilir).',
    savingThrow: 'wis'
  },
  {
    id: 'lesser-restoration',
    name: 'Küçük İyileştirme',
    level: 2,
    school: 'abjuration',
    classIds: ['cleric'],
    castingTime: '1 aksiyon',
    range: 'Dokunma',
    duration: 'Anlık',
    description: 'Dokunduğun yaratıktan bir hastalık ya da zayıflatan etki kaldırırsın.'
  },
  {
    id: 'vicious-mockery',
    name: 'Acımasız Alay',
    level: 0,
    school: 'enchantment',
    classIds: ['bard'],
    castingTime: '1 aksiyon',
    range: '18m',
    duration: 'Anlık',
    description: 'Büyülü hakaretler savurursun, hedef sonraki saldırısında dezavantajlı olabilir.',
    damageDice: '1d4',
    damageType: 'psişik',
    savingThrow: 'wis'
  },
  {
    id: 'eldritch-blast',
    name: 'Karanlık Patlama',
    level: 0,
    school: 'evocation',
    classIds: ['warlock'],
    castingTime: '1 aksiyon',
    range: '36m',
    duration: 'Anlık',
    description: 'Çatırdayan karanlık enerji ışını fırlatırsın.',
    damageDice: '1d10',
    damageType: 'force',
    attackRoll: true
  },
  {
    id: 'produce-flame',
    name: 'Alev Yarat',
    level: 0,
    school: 'conjuration',
    classIds: ['druid'],
    castingTime: '1 aksiyon',
    range: 'Kendisi',
    duration: '10 dakika',
    description: 'Avucunda alev topu belirir, aydınlatır ya da fırlatılabilir.',
    damageDice: '1d8',
    damageType: 'ateş',
    attackRoll: true
  },
  {
    id: 'entangle',
    name: 'Dolanma',
    level: 1,
    school: 'conjuration',
    classIds: ['druid', 'ranger'],
    castingTime: '1 aksiyon',
    range: '27m',
    duration: '1 dakika (konsantrasyon)',
    description: 'Bitkiler alandaki yaratıkları kısıtlar.',
    savingThrow: 'str'
  },
  {
    id: 'hunters-mark',
    name: 'Avcı İşareti',
    level: 1,
    school: 'divination',
    classIds: ['ranger'],
    castingTime: '1 bonus aksiyon',
    range: '27m',
    duration: '1 saat (konsantrasyon)',
    description: 'İşaretlediğin hedefe yaptığın saldırılara +1d6 hasar eklersin.'
  },
  {
    id: 'charm-person',
    name: 'Kişiyi Büyüleme',
    level: 1,
    school: 'enchantment',
    classIds: ['wizard', 'sorcerer', 'warlock', 'bard', 'druid'],
    castingTime: '1 aksiyon',
    range: '9m',
    duration: '1 saat',
    description: 'Hedef seni dost olarak görür (Bilgelik kurtarma ile direnebilir).',
    savingThrow: 'wis'
  },
  {
    id: 'thunderwave',
    name: 'Gök Gürültüsü Dalgası',
    level: 1,
    school: 'evocation',
    classIds: ['wizard', 'sorcerer', 'druid', 'bard'],
    castingTime: '1 aksiyon',
    range: 'Kendisi (4,5m küp)',
    duration: 'Anlık',
    description: 'Görünmez bir güç dalgası çevreni sarsar, hedefler geri itilebilir.',
    damageDice: '2d8',
    damageType: 'gök gürültüsü',
    savingThrow: 'con'
  },
  {
    id: 'dissonant-whispers',
    name: 'Uyumsuz Fısıltılar',
    level: 1,
    school: 'enchantment',
    classIds: ['bard'],
    castingTime: '1 aksiyon',
    range: '18m',
    duration: 'Anlık',
    description: 'Hedefin zihninde tüyler ürpertici bir melodi çınlar, kaçmak zorunda kalabilir.',
    damageDice: '3d6',
    damageType: 'psişik',
    savingThrow: 'wis'
  }
]

export function spellsForClass(classId: string): SpellInfo[] {
  return SPELLS.filter((s) => s.classIds.includes(classId)).sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
}

export function findSpell(id: string): SpellInfo | undefined {
  return SPELLS.find((s) => s.id === id)
}

// Full-caster spell slot table (SRD): index = character level - 1, value = slots per spell level 1-9
export const FULL_CASTER_SLOT_TABLE: number[][] = [
  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  [4, 3, 2, 0, 0, 0, 0, 0, 0],
  [4, 3, 3, 0, 0, 0, 0, 0, 0],
  [4, 3, 3, 1, 0, 0, 0, 0, 0],
  [4, 3, 3, 2, 0, 0, 0, 0, 0],
  [4, 3, 3, 3, 1, 0, 0, 0, 0],
  [4, 3, 3, 3, 2, 0, 0, 0, 0],
  [4, 3, 3, 3, 2, 1, 0, 0, 0],
  [4, 3, 3, 3, 2, 1, 0, 0, 0],
  [4, 3, 3, 3, 2, 1, 1, 0, 0],
  [4, 3, 3, 3, 2, 1, 1, 0, 0],
  [4, 3, 3, 3, 2, 1, 1, 1, 0],
  [4, 3, 3, 3, 2, 1, 1, 1, 0],
  [4, 3, 3, 3, 2, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 2, 1, 1]
]

export function maxSpellSlotsForLevel(characterLevel: number): number[] {
  const row = FULL_CASTER_SLOT_TABLE[Math.min(Math.max(characterLevel, 1), 20) - 1]
  return row ? [...row] : [0, 0, 0, 0, 0, 0, 0, 0, 0]
}

export function maxCantripsKnown(characterLevel: number): number {
  if (characterLevel >= 10) return 5
  if (characterLevel >= 4) return 4
  return 3
}
