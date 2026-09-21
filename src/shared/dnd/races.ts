import type { RaceInfo } from './types'

export const RACES: RaceInfo[] = [
  {
    id: 'human',
    name: 'İnsan',
    size: 'Orta',
    speed: 30,
    abilityBonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
    traits: ['Ekstra dil bilgisi', 'Çok yönlü']
  },
  {
    id: 'hill-dwarf',
    name: 'Tepe Cücesi',
    size: 'Orta',
    speed: 25,
    abilityBonuses: { con: 2, wis: 1 },
    traits: ['Karanlık görüş 60ft', 'Zehir direnci', 'Ekstra can (seviye başı +1)']
  },
  {
    id: 'wood-elf',
    name: 'Orman Elfi',
    size: 'Orta',
    speed: 35,
    abilityBonuses: { dex: 2, wis: 1 },
    traits: ['Karanlık görüş 60ft', 'Büyülü uykuya bağışıklık', 'Bitki örtüsünde gizlenme']
  },
  {
    id: 'lightfoot-halfling',
    name: 'Hafif Ayak Halfling',
    size: 'Küçük',
    speed: 25,
    abilityBonuses: { dex: 2, cha: 1 },
    traits: ['Şanslı (1 atınca yeniden at)', 'Cesur (korku direnci)', 'Doğal gizlenme']
  },
  {
    id: 'dragonborn',
    name: 'Ejderdoğan',
    size: 'Orta',
    speed: 30,
    abilityBonuses: { str: 2, cha: 1 },
    traits: ['Nefes Silahı (soluma alanı hasar)', 'Element Direnci (soy tipine göre)']
  },
  {
    id: 'gnome',
    name: 'Cin (Gnome)',
    size: 'Küçük',
    speed: 25,
    abilityBonuses: { int: 2 },
    traits: ['Karanlık görüş 60ft', 'Cin Kurnazlığı (büyüye karşı Zeka/Bilgelik/Karizma kurtarmalarda avantaj)']
  },
  {
    id: 'half-elf',
    name: 'Yarı-Elf',
    size: 'Orta',
    speed: 30,
    abilityBonuses: { cha: 2, con: 1, wis: 1 },
    traits: ['Karanlık görüş 60ft', 'Büyülü uykuya bağışıklık', 'Ekstra beceri uzmanlığı (2)']
  },
  {
    id: 'half-orc',
    name: 'Yarı-Ork',
    size: 'Orta',
    speed: 30,
    abilityBonuses: { str: 2, con: 1 },
    traits: ['Karanlık görüş 60ft', 'Yılmaz Dayanıklılık (0 HP\'ye düşünce 1 HP\'de kalabilir)', 'Vahşi Saldırılar (ekstra kritik zar)']
  },
  {
    id: 'tiefling',
    name: 'Tiefling',
    size: 'Orta',
    speed: 30,
    abilityBonuses: { cha: 2, int: 1 },
    traits: ['Karanlık görüş 60ft', 'Cehennemi Direnç (ateş hasarına direnç)', 'Doğuştan büyüler (Thaumaturgy vb.)']
  }
]
