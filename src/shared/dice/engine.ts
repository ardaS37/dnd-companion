export type RollMode = 'normal' | 'advantage' | 'disadvantage'

export interface DiceRollResult {
  expression: string
  rolls: number[]
  kept?: number
  modifier: number
  total: number
  mode?: RollMode
}

const DICE_PATTERN = /^(\d*)d(\d+)\s*([+-]\s*\d+)?$/i

export function rollDie(sides: number): number {
  return 1 + Math.floor(Math.random() * sides)
}

export function parseAndRoll(expression: string): DiceRollResult | null {
  const trimmed = expression.trim().toLowerCase().replace(/\s+/g, '')
  const match = trimmed.match(DICE_PATTERN)
  if (!match) return null

  const count = match[1] ? parseInt(match[1], 10) : 1
  const sides = parseInt(match[2], 10)
  const modifier = match[3] ? parseInt(match[3].replace(/\s/g, ''), 10) : 0

  if (count < 1 || count > 100 || sides < 2 || sides > 1000) return null

  const rolls = Array.from({ length: count }, () => rollDie(sides))
  const total = rolls.reduce((a, b) => a + b, 0) + modifier

  return { expression: `${count}d${sides}`, rolls, modifier, total }
}

export function rollD20Check(modifier: number, mode: RollMode = 'normal'): DiceRollResult {
  if (mode === 'normal') {
    const roll = rollDie(20)
    return { expression: '1d20', rolls: [roll], modifier, total: roll + modifier, mode }
  }
  const a = rollDie(20)
  const b = rollDie(20)
  const kept = mode === 'advantage' ? Math.max(a, b) : Math.min(a, b)
  return { expression: '1d20', rolls: [a, b], kept, modifier, total: kept + modifier, mode }
}

export function formatModifierSuffix(modifier: number): string {
  if (modifier === 0) return ''
  return modifier > 0 ? ` +${modifier}` : ` ${modifier}`
}

export function formatRollResult(label: string, result: DiceRollResult): string {
  const rollsText =
    result.mode && result.mode !== 'normal'
      ? `${result.mode === 'advantage' ? 'avantaj' : 'dezavantaj'} [${result.rolls.join(', ')}] → ${result.kept}`
      : `${result.expression} (${result.rolls.join(' + ')})`

  return `${label}: ${rollsText}${formatModifierSuffix(result.modifier)} = ${result.total}`
}
