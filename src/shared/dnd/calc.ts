import type { AbilityKey, AbilityScores, Character } from './types'
import { RACES } from './races'
import { CLASSES } from './classes'
import { ARMOR, WEAPONS, type WeaponInfo } from './equipment'

export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`
}

export function applyRaceBonuses(base: AbilityScores, raceId: string): AbilityScores {
  const race = RACES.find((r) => r.id === raceId)
  if (!race) return base
  const result = { ...base }
  for (const key of Object.keys(race.abilityBonuses) as AbilityKey[]) {
    result[key] = result[key] + (race.abilityBonuses[key] ?? 0)
  }
  return result
}

export function proficiencyBonus(level: number): number {
  return 2 + Math.floor((Math.max(1, level) - 1) / 4)
}

export function estimateMaxHp(classId: string, level: number, conScore: number): number {
  const classInfo = CLASSES.find((c) => c.id === classId)
  if (!classInfo) return 0
  const conMod = abilityModifier(conScore)
  const firstLevel = classInfo.hitDie + conMod
  const perExtraLevel = Math.floor(classInfo.hitDie / 2) + 1 + conMod
  return firstLevel + Math.max(0, level - 1) * perExtraLevel
}

export interface ArmorClassResult {
  total: number
  label: string
}

export function computeArmorClass(character: Character): ArmorClassResult {
  const dexMod = abilityModifier(character.abilities.dex)
  const equippedBody = character.inventory.find((i) => i.equipped && i.kind === 'armor' && i.itemId !== 'shield')
  const hasShield = character.inventory.some((i) => i.equipped && i.itemId === 'shield')
  const shieldBonus = hasShield ? (ARMOR.find((a) => a.id === 'shield')?.baseAC ?? 0) : 0

  if (!equippedBody) {
    return { total: 10 + dexMod + shieldBonus, label: hasShield ? 'Zırhsız + Kalkan' : 'Zırhsız' }
  }

  const armor = ARMOR.find((a) => a.id === equippedBody.itemId)
  if (!armor) return { total: 10 + dexMod + shieldBonus, label: 'Zırhsız' }

  let dexContribution = dexMod
  if (armor.category === 'medium') dexContribution = Math.min(dexMod, 2)
  if (armor.category === 'heavy') dexContribution = 0

  return {
    total: armor.baseAC + dexContribution + shieldBonus,
    label: armor.name + (hasShield ? ' + Kalkan' : '')
  }
}

export function weaponAbilityModifier(character: Character, weapon: WeaponInfo): number {
  const strMod = abilityModifier(character.abilities.str)
  const dexMod = abilityModifier(character.abilities.dex)
  if (weapon.finesse) return Math.max(strMod, dexMod)
  return abilityModifier(character.abilities[weapon.ability])
}

export function weaponAttackBonus(character: Character, weapon: WeaponInfo): number {
  return weaponAbilityModifier(character, weapon) + proficiencyBonus(character.level)
}

export function weaponDamageExpression(character: Character, weapon: WeaponInfo): string {
  return diceWithModifier(weapon.damageDice, weaponAbilityModifier(character, weapon))
}

export function findWeapon(itemId: string): WeaponInfo | undefined {
  return WEAPONS.find((w) => w.id === itemId)
}

export function savingThrowBonus(character: Character, ability: AbilityKey): number {
  const classInfo = CLASSES.find((c) => c.id === character.classId)
  const isProficient = classInfo?.savingThrowProficiencies.includes(ability) ?? false
  return abilityModifier(character.abilities[ability]) + (isProficient ? proficiencyBonus(character.level) : 0)
}

export function spellcastingAbility(classId: string): AbilityKey | null {
  return CLASSES.find((c) => c.id === classId)?.spellcastingAbility ?? null
}

export function isSpellcaster(classId: string): boolean {
  return spellcastingAbility(classId) !== null
}

export function spellSaveDC(character: Character): number {
  const ability = spellcastingAbility(character.classId)
  if (!ability) return 8
  return 8 + proficiencyBonus(character.level) + abilityModifier(character.abilities[ability])
}

export function spellAttackBonus(character: Character): number {
  const ability = spellcastingAbility(character.classId)
  if (!ability) return 0
  return proficiencyBonus(character.level) + abilityModifier(character.abilities[ability])
}

export function diceWithModifier(dice: string, mod: number): string {
  if (mod === 0) return dice
  return `${dice}${mod > 0 ? '+' : ''}${mod}`
}

export const POINT_BUY_BUDGET = 27

const POINT_BUY_COSTS: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 }

export function pointBuyCost(score: number): number {
  return POINT_BUY_COSTS[score] ?? 0
}

export function classHitDie(classId: string): number {
  return CLASSES.find((c) => c.id === classId)?.hitDie ?? 8
}
