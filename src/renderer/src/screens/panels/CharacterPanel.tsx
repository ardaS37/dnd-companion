import { useEffect } from 'react'
import { useCharacterStore } from '../../store/characterStore'
import { useAppStore } from '../../store/appStore'
import { useChatStore } from '../../store/chatStore'
import { useDiceStore } from '../../store/diceStore'
import { CharacterSheet } from '../../components/CharacterSheet'
import { rollD20Check, parseAndRoll, formatRollResult, rollDie } from '@shared/dice/engine'
import { maxSpellSlotsForLevel } from '@shared/dnd/spells'
import { abilityModifier, classHitDie, estimateMaxHp } from '@shared/dnd/calc'

export function CharacterPanel(): JSX.Element {
  const { characters, activeCharacterId, loaded, load, upsert } = useCharacterStore()
  const goToCharacters = useAppStore((s) => s.goToCharacters)
  const pushRoll = useChatStore((s) => s.pushRoll)
  const rollMode = useDiceStore((s) => s.mode)

  useEffect(() => {
    if (!loaded) void load()
  }, [loaded, load])

  const active = characters.find((c) => c.id === activeCharacterId) ?? null

  if (!active) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 bg-panel p-4 text-center">
        <p className="text-sm text-fg2">Aktif karakter yok.</p>
        <button
          onClick={goToCharacters}
          className="border border-accent bg-accent px-3 py-1.5 text-xs text-accent-fg hover:bg-accent-hover"
        >
          Karakter Oluştur
        </button>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto bg-panel p-3">
      <CharacterSheet
        character={active}
        compact
        onRoll={(label, modifier) =>
          pushRoll(formatRollResult(`${active.name} — ${label}`, rollD20Check(modifier, rollMode)), rollMode === 'normal' ? '1d20' : '2d20')
        }
        onDamageRoll={(label, expression) => {
          const result = parseAndRoll(expression)
          if (result) pushRoll(formatRollResult(`${active.name} — ${label}`, result), result.expression)
        }}
        onCastMessage={(text) => pushRoll(text)}
        onSetHp={(value) => void upsert({ ...active, currentHp: value, updatedAt: Date.now() })}
        onSetTempHp={(value) => void upsert({ ...active, tempHp: value, updatedAt: Date.now() })}
        onSlotChange={(level, delta) => {
          const used = active.spellSlotsUsed[level] ?? 0
          const max = maxSpellSlotsForLevel(active.level)[level - 1] ?? 0
          const next = Math.max(0, Math.min(max, used + delta))
          void upsert({ ...active, spellSlotsUsed: { ...active.spellSlotsUsed, [level]: next }, updatedAt: Date.now() })
        }}
        onLongRest={() => {
          void upsert({
            ...active,
            currentHp: estimateMaxHp(active.classId, active.level, active.abilities.con),
            tempHp: 0,
            hitDiceUsed: 0,
            deathSaves: { successes: 0, failures: 0 },
            spellSlotsUsed: {},
            updatedAt: Date.now()
          })
          pushRoll(`${active.name} uzun dinlenmeye çekildi. Can ve büyü yuvaları yenilendi.`)
        }}
        onShortRest={() => {
          const maxHp = estimateMaxHp(active.classId, active.level, active.abilities.con)
          const conMod = abilityModifier(active.abilities.con)
          const hitDie = classHitDie(active.classId)
          const roll = rollDie(hitDie)
          const healed = Math.max(1, roll + conMod)
          void upsert({
            ...active,
            currentHp: Math.min(maxHp, active.currentHp + healed),
            hitDiceUsed: active.hitDiceUsed + 1,
            updatedAt: Date.now()
          })
          pushRoll(
            `${active.name} kısa dinlenme aldı: can zarı (${roll}) ${conMod >= 0 ? '+' : ''}${conMod} = ${healed} HP iyileşti.`,
            `1d${hitDie}`
          )
        }}
        onDeathSaveChange={(kind, delta) =>
          void upsert({
            ...active,
            deathSaves: { ...active.deathSaves, [kind]: Math.max(0, Math.min(3, active.deathSaves[kind] + delta)) },
            updatedAt: Date.now()
          })
        }
        onExhaustionChange={(delta) =>
          void upsert({ ...active, exhaustion: Math.max(0, Math.min(6, active.exhaustion + delta)), updatedAt: Date.now() })
        }
      />
    </div>
  )
}
