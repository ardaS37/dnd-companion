export type LootTier = 'low' | 'mid' | 'high' | 'legendary'

export const LOOT_TIER_LABELS: Record<LootTier, string> = {
  low: 'Düşük (CR 0-4)',
  mid: 'Orta (CR 5-10)',
  high: 'Yüksek (CR 11-16)',
  legendary: 'Efsanevi (CR 17+)'
}

interface CoinRoll {
  dice: string
  multiplier: number
}

const COIN_TABLE: Record<LootTier, CoinRoll> = {
  low: { dice: '5d6', multiplier: 1 },
  mid: { dice: '4d6', multiplier: 100 },
  high: { dice: '4d6', multiplier: 1000 },
  legendary: { dice: '12d6', multiplier: 1000 }
}

const MINOR_ITEMS = [
  'Küçük büyülü halka (etkisi belirsiz)',
  'Işıldayan bir taş',
  'Kımıltılı bir pelerin tokası',
  'Asla sönmeyen bir mum',
  'Garip semboller taşıyan bir anahtar',
  'Küçük bir iksir şişesi (etiketsiz)',
  'Eski bir harita parçası',
  'Değerli bir mühür yüzüğü',
  'Ejder pulundan yapılma kolye',
  'Büyülü bir mürekkep hokkası',
  'Kırılmaz görünen bir bardak',
  'Şarkı söyleyen küçük bir kristal',
  'Sahibinin dilini anlayan bir papağan tüyü',
  'Antika bir cep saati, geri geri işliyor'
]

export interface LootResult {
  tier: LootTier
  coinsRolled: string
  coins: number
  item: string | null
}

export function lootTable(tier: LootTier): CoinRoll {
  return COIN_TABLE[tier]
}

export function pickRandomItem(): string {
  return MINOR_ITEMS[Math.floor(Math.random() * MINOR_ITEMS.length)]
}
