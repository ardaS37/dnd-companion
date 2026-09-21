import type { ClassInfo } from './types'

export const CLASSES: ClassInfo[] = [
  {
    id: 'fighter',
    name: 'Savaşçı',
    hitDie: 10,
    primaryAbilities: ['str', 'dex'],
    savingThrowProficiencies: ['str', 'con'],
    skillChoiceCount: 2,
    skillChoices: ['Akrobasi', 'Hayvan İdaresi', 'Atletizm', 'Tarih', 'İçgörü', 'Yıldırma', 'Algı', 'Hayatta Kalma']
  },
  {
    id: 'wizard',
    name: 'Büyücü',
    hitDie: 6,
    primaryAbilities: ['int'],
    savingThrowProficiencies: ['int', 'wis'],
    skillChoiceCount: 2,
    skillChoices: ['Büyü Bilgisi', 'Tarih', 'İçgörü', 'Araştırma', 'Din', 'Algı'],
    spellcastingAbility: 'int'
  },
  {
    id: 'cleric',
    name: 'Rahip',
    hitDie: 8,
    primaryAbilities: ['wis'],
    savingThrowProficiencies: ['wis', 'cha'],
    skillChoiceCount: 2,
    skillChoices: ['Tarih', 'İçgörü', 'Tıp', 'İkna', 'Din'],
    spellcastingAbility: 'wis'
  },
  {
    id: 'rogue',
    name: 'Hırsız',
    hitDie: 8,
    primaryAbilities: ['dex'],
    savingThrowProficiencies: ['dex', 'int'],
    skillChoiceCount: 4,
    skillChoices: [
      'Akrobasi',
      'Atletizm',
      'Kandırma',
      'İçgörü',
      'Yıldırma',
      'Araştırma',
      'Algı',
      'Gösteri',
      'El Çabukluğu',
      'Gizlenme'
    ]
  },
  {
    id: 'barbarian',
    name: 'Barbar',
    hitDie: 12,
    primaryAbilities: ['str'],
    savingThrowProficiencies: ['str', 'con'],
    skillChoiceCount: 2,
    skillChoices: ['Hayvan İdaresi', 'Atletizm', 'Yıldırma', 'Doğa', 'Algı', 'Hayatta Kalma']
  },
  {
    id: 'monk',
    name: 'Keşiş',
    hitDie: 8,
    primaryAbilities: ['dex', 'wis'],
    savingThrowProficiencies: ['str', 'dex'],
    skillChoiceCount: 2,
    skillChoices: ['Akrobasi', 'Atletizm', 'Tarih', 'İçgörü', 'Din', 'Gizlenme']
  },
  {
    id: 'bard',
    name: 'Ozan',
    hitDie: 8,
    primaryAbilities: ['cha'],
    savingThrowProficiencies: ['dex', 'cha'],
    skillChoiceCount: 3,
    skillChoices: [
      'Akrobasi',
      'Hayvan İdaresi',
      'Atletizm',
      'Büyü Bilgisi',
      'Kandırma',
      'Tarih',
      'İçgörü',
      'Yıldırma',
      'Araştırma',
      'Tıp',
      'Doğa',
      'Algı',
      'Gösteri',
      'İkna',
      'Din',
      'El Çabukluğu',
      'Gizlenme',
      'Hayatta Kalma'
    ],
    spellcastingAbility: 'cha'
  },
  {
    id: 'druid',
    name: 'Druid',
    hitDie: 8,
    primaryAbilities: ['wis'],
    savingThrowProficiencies: ['int', 'wis'],
    skillChoiceCount: 2,
    skillChoices: ['Büyü Bilgisi', 'Hayvan İdaresi', 'İçgörü', 'Tıp', 'Doğa', 'Algı', 'Din', 'Hayatta Kalma'],
    spellcastingAbility: 'wis'
  },
  {
    id: 'paladin',
    name: 'Paladin',
    hitDie: 10,
    primaryAbilities: ['str', 'cha'],
    savingThrowProficiencies: ['wis', 'cha'],
    skillChoiceCount: 2,
    skillChoices: ['Atletizm', 'İçgörü', 'Yıldırma', 'Tıp', 'İkna', 'Din'],
    spellcastingAbility: 'cha'
  },
  {
    id: 'ranger',
    name: 'Ranger',
    hitDie: 10,
    primaryAbilities: ['dex', 'wis'],
    savingThrowProficiencies: ['str', 'dex'],
    skillChoiceCount: 3,
    skillChoices: ['Hayvan İdaresi', 'Atletizm', 'İçgörü', 'Araştırma', 'Doğa', 'Algı', 'Gizlenme', 'Hayatta Kalma'],
    spellcastingAbility: 'wis'
  },
  {
    id: 'sorcerer',
    name: 'Sihirbaz (Sorcerer)',
    hitDie: 6,
    primaryAbilities: ['cha'],
    savingThrowProficiencies: ['con', 'cha'],
    skillChoiceCount: 2,
    skillChoices: ['Büyü Bilgisi', 'Kandırma', 'İçgörü', 'Yıldırma', 'İkna', 'Din'],
    spellcastingAbility: 'cha'
  },
  {
    id: 'warlock',
    name: 'Warlock',
    hitDie: 8,
    primaryAbilities: ['cha'],
    savingThrowProficiencies: ['wis', 'cha'],
    skillChoiceCount: 2,
    skillChoices: ['Büyü Bilgisi', 'Kandırma', 'Tarih', 'Yıldırma', 'Araştırma', 'Doğa', 'Din'],
    spellcastingAbility: 'cha'
  }
]
