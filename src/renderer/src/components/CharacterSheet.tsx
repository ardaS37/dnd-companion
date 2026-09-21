import { useRef } from 'react'
import { Icon } from './Icon'
import type { Character } from '@shared/dnd/types'
import { ABILITY_LABELS, type AbilityKey } from '@shared/dnd/types'
import { RACES } from '@shared/dnd/races'
import { CLASSES } from '@shared/dnd/classes'
import { BACKGROUNDS } from '@shared/dnd/backgrounds'
import { SKILLS } from '@shared/dnd/skills'
import { findSpell, maxSpellSlotsForLevel } from '@shared/dnd/spells'
import { EXHAUSTION_EFFECTS } from '@shared/dnd/conditions'
import {
  abilityModifier,
  computeArmorClass,
  diceWithModifier,
  estimateMaxHp,
  findWeapon,
  formatModifier,
  isSpellcaster,
  proficiencyBonus,
  savingThrowBonus,
  spellAttackBonus,
  spellSaveDC,
  spellcastingAbility,
  weaponAttackBonus,
  weaponDamageExpression
} from '@shared/dnd/calc'

const ABILITY_KEYS: AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']

interface Props {
  character: Character
  compact?: boolean
  onRoll?: (label: string, modifier: number) => void
  onDamageRoll?: (label: string, diceExpression: string) => void
  onCastMessage?: (text: string) => void
  onSetHp?: (value: number) => void
  onSetTempHp?: (value: number) => void
  onSlotChange?: (level: number, delta: 1 | -1) => void
  onLongRest?: () => void
  onShortRest?: () => void
  onDeathSaveChange?: (kind: 'successes' | 'failures', delta: 1 | -1) => void
  onExhaustionChange?: (delta: 1 | -1) => void
  onPortraitChange?: (dataUrl: string | null) => void
}

export function CharacterSheet({
  character,
  compact,
  onRoll,
  onDamageRoll,
  onCastMessage,
  onSetHp,
  onSetTempHp,
  onSlotChange,
  onLongRest,
  onShortRest,
  onDeathSaveChange,
  onExhaustionChange,
  onPortraitChange
}: Props): JSX.Element {
  const portraitInputRef = useRef<HTMLInputElement>(null)

  const handlePortraitFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (!file || !onPortraitChange) return
    const reader = new FileReader()
    reader.onload = () => onPortraitChange(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }
  const race = RACES.find((r) => r.id === character.raceId)
  const classInfo = CLASSES.find((c) => c.id === character.classId)
  const background = BACKGROUNDS.find((b) => b.id === character.backgroundId)
  const maxHp = estimateMaxHp(character.classId, character.level, character.abilities.con)
  const profBonus = proficiencyBonus(character.level)
  const ac = computeArmorClass(character)
  const equippedWeapons = character.inventory
    .filter((i) => i.kind === 'weapon' && i.equipped)
    .map((i) => findWeapon(i.itemId))
    .filter((w): w is NonNullable<typeof w> => Boolean(w))

  const spellcaster = isSpellcaster(character.classId)
  const castingAbility = spellcastingAbility(character.classId)
  const castingMod = castingAbility ? abilityModifier(character.abilities[castingAbility]) : 0
  const maxSlots = maxSpellSlotsForLevel(character.level)
  const knownSpells = character.spellsKnown.map((id) => findSpell(id)).filter((s): s is NonNullable<typeof s> => Boolean(s))

  const maxHitDice = character.level
  const remainingHitDice = Math.max(0, maxHitDice - character.hitDiceUsed)

  return (
    <div className={compact ? 'text-sm' : 'text-sm'}>
      <div className="mb-3 flex items-start gap-3">
        {(character.portraitDataUrl || onPortraitChange) && (
          <button
            onClick={() => onPortraitChange && portraitInputRef.current?.click()}
            className={`h-14 w-14 flex-shrink-0 overflow-hidden border border-line bg-panel2 ${onPortraitChange ? 'hover:border-accent' : ''}`}
            title={onPortraitChange ? 'Portre yükle' : undefined}
          >
            {character.portraitDataUrl ? (
              <img src={character.portraitDataUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-[10px] text-fg2">Portre</span>
            )}
          </button>
        )}
        {onPortraitChange && (
          <input ref={portraitInputRef} type="file" accept="image/*" onChange={handlePortraitFile} className="hidden" />
        )}
        <div className="flex-1">
          <div className="font-display text-base text-fg">{character.name}</div>
          <div className="text-xs text-fg2">
            {race?.name} · {classInfo?.name} {character.level} · {background?.name} · {character.alignment}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg2">
            <span className="flex items-center gap-1">
              HP{' '}
              {onSetHp ? (
                <input
                  type="number"
                  value={character.currentHp}
                  onChange={(e) => onSetHp(Math.max(0, Math.min(maxHp, Number(e.target.value) || 0)))}
                  className="w-12 border border-line bg-panel2 px-1 py-0.5 text-center text-fg outline-none focus:border-accent"
                />
              ) : (
                <span className="text-fg">{character.currentHp}</span>
              )}
              / {maxHp}
            </span>
            <span className="flex items-center gap-1">
              Geçici
              {onSetTempHp ? (
                <input
                  type="number"
                  value={character.tempHp}
                  onChange={(e) => onSetTempHp(Math.max(0, Number(e.target.value) || 0))}
                  className="w-10 border border-line bg-panel2 px-1 py-0.5 text-center text-fg outline-none focus:border-accent"
                />
              ) : (
                <span className="text-fg">{character.tempHp}</span>
              )}
            </span>
            <span>
              AC {ac.total} ({ac.label})
            </span>
            <span>Hız {race?.speed}ft</span>
            <span>Uzmanlık +{profBonus}</span>
            {onShortRest && (
              <button
                onClick={onShortRest}
                disabled={remainingHitDice === 0}
                className="flex items-center gap-1 border border-line px-2 py-0.5 text-[10px] uppercase text-fg2 hover:border-accent hover:text-accent disabled:opacity-30"
              >
                <Icon name="potion" className="h-3 w-3" />
                Kısa Dinlenme ({remainingHitDice} zar)
              </button>
            )}
            {onLongRest && (
              <button onClick={onLongRest} className="flex items-center gap-1 border border-line px-2 py-0.5 text-[10px] uppercase text-fg2 hover:border-accent hover:text-accent">
                <Icon name="campfire" className="h-3 w-3" />
                Uzun Dinlenme
              </button>
            )}
          </div>
        </div>
      </div>

      {character.currentHp === 0 && onDeathSaveChange && (
        <div className="mb-3 border border-accent bg-accent/10 p-2">
          <div className="mb-1 text-xs uppercase tracking-wide text-accent">Ölüm Kurtarmaları</div>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1 text-fg">
              Başarı
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() => onDeathSaveChange('successes', i < character.deathSaves.successes ? -1 : 1)}
                  className={`h-4 w-4 border ${i < character.deathSaves.successes ? 'border-accent bg-accent' : 'border-line'}`}
                />
              ))}
            </span>
            <span className="flex items-center gap-1 text-fg">
              Başarısızlık
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() => onDeathSaveChange('failures', i < character.deathSaves.failures ? -1 : 1)}
                  className={`h-4 w-4 border ${i < character.deathSaves.failures ? 'border-accent bg-accent' : 'border-line'}`}
                />
              ))}
            </span>
          </div>
        </div>
      )}

      {onExhaustionChange && (
        <div className="mb-3 flex items-center gap-2 text-xs text-fg2">
          <span>Bitkinlik</span>
          <button onClick={() => onExhaustionChange(-1)} className="border border-line px-1.5 text-fg2 hover:border-accent hover:text-accent">
            −
          </button>
          <span className="w-4 text-center text-fg">{character.exhaustion}</span>
          <button onClick={() => onExhaustionChange(1)} className="border border-line px-1.5 text-fg2 hover:border-accent hover:text-accent">
            +
          </button>
          <span className="text-fg2">({EXHAUSTION_EFFECTS[character.exhaustion]})</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {ABILITY_KEYS.map((key) => {
          const mod = abilityModifier(character.abilities[key])
          const Tag = onRoll ? 'button' : 'div'
          return (
            <Tag
              key={key}
              onClick={onRoll ? () => onRoll(`${ABILITY_LABELS[key]} Kontrolü`, mod) : undefined}
              className={`border border-line bg-panel2 py-2 text-center ${onRoll ? 'hover:border-accent hover:bg-panel' : ''}`}
            >
              <div className="text-[10px] tracking-wide text-fg2">{ABILITY_LABELS[key]}</div>
              <div className="text-base font-semibold text-fg">{character.abilities[key]}</div>
              <div className="text-xs text-fg2">{formatModifier(mod)}</div>
            </Tag>
          )
        })}
      </div>

      <div className="mt-3">
        <div className="mb-1 text-xs uppercase tracking-wide text-fg2">Kurtarma Zarları</div>
        <div className="flex flex-wrap gap-1">
          {ABILITY_KEYS.map((key) => {
            const bonus = savingThrowBonus(character, key)
            return onRoll ? (
              <button
                key={key}
                onClick={() => onRoll(`${ABILITY_LABELS[key]} Kurtarma`, bonus)}
                className="border border-line px-2 py-1 text-xs text-fg hover:border-accent hover:text-accent"
              >
                {ABILITY_LABELS[key]} {formatModifier(bonus)}
              </button>
            ) : (
              <span key={key} className="border border-line px-2 py-1 text-xs text-fg">
                {ABILITY_LABELS[key]} {formatModifier(bonus)}
              </span>
            )
          })}
        </div>
      </div>

      {equippedWeapons.length > 0 && (
        <div className="mt-3">
          <div className="mb-1 text-xs uppercase tracking-wide text-fg2">Kuşanılmış Silahlar</div>
          <div className="space-y-1">
            {equippedWeapons.map((weapon) => {
              const attackBonus = weaponAttackBonus(character, weapon)
              const damageExpr = weaponDamageExpression(character, weapon)
              return (
                <div key={weapon.id} className="flex items-center justify-between border border-line bg-panel2 px-2 py-1.5">
                  <span className="text-fg">{weapon.name}</span>
                  <span className="flex gap-1">
                    {onRoll && (
                      <button
                        onClick={() => onRoll(`${weapon.name} Saldırısı`, attackBonus)}
                        className="border border-line px-2 py-1 text-xs text-fg hover:border-accent hover:text-accent"
                      >
                        Saldır {formatModifier(attackBonus)}
                      </button>
                    )}
                    {onDamageRoll && (
                      <button
                        onClick={() => onDamageRoll(`${weapon.name} Hasarı`, damageExpr)}
                        className="border border-line px-2 py-1 text-xs text-fg hover:border-accent hover:text-accent"
                      >
                        Hasar {damageExpr}
                      </button>
                    )}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {character.skillProficiencies.length > 0 && (
        <div className="mt-3">
          <div className="mb-1 text-xs uppercase tracking-wide text-fg2">Yetenek Uzmanlıkları</div>
          <div className="flex flex-wrap gap-1">
            {Array.from(new Set(character.skillProficiencies)).map((skillName) => {
              const skill = SKILLS.find((s) => s.name === skillName)
              const mod = skill ? abilityModifier(character.abilities[skill.ability]) + profBonus : profBonus
              return onRoll ? (
                <button
                  key={skillName}
                  onClick={() => onRoll(skillName, mod)}
                  className="border border-line px-2 py-1 text-xs text-fg hover:border-accent hover:text-accent"
                >
                  {skillName} {formatModifier(mod)}
                </button>
              ) : (
                <span key={skillName} className="border border-line px-2 py-1 text-xs text-fg">
                  {skillName} {formatModifier(mod)}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {spellcaster && (
        <div className="mt-3">
          <div className="mb-1 text-xs uppercase tracking-wide text-fg2">Büyücülük</div>
          <div className="mb-2 text-xs text-fg2">
            Büyü Kurtarma DC {spellSaveDC(character)} · Büyü Saldırı Bonusu {formatModifier(spellAttackBonus(character))}
          </div>

          {maxSlots.some((n) => n > 0) && (
            <div className="mb-2 flex flex-wrap gap-2">
              {maxSlots.map((max, i) => {
                if (max === 0) return null
                const level = i + 1
                const used = character.spellSlotsUsed[level] ?? 0
                return (
                  <div key={level} className="flex items-center gap-1 border border-line bg-panel2 px-2 py-1 text-xs">
                    <span className="text-fg2">Sv{level}</span>
                    <span className="text-fg">
                      {used}/{max}
                    </span>
                    {onSlotChange && (
                      <>
                        <button onClick={() => onSlotChange(level, -1)} className="px-1 text-fg2 hover:text-accent">
                          −
                        </button>
                        <button onClick={() => onSlotChange(level, 1)} className="px-1 text-fg2 hover:text-accent">
                          +
                        </button>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          <div className="space-y-1">
            {knownSpells.length === 0 && <p className="text-xs text-fg2">Henüz büyü seçilmedi.</p>}
            {knownSpells.map((spell) => {
              const healExpr = spell.healDice ? diceWithModifier(spell.healDice, castingMod) : null
              return (
                <div key={spell.id} className="flex items-center justify-between border border-line bg-panel2 px-2 py-1.5">
                  <span className="text-fg">
                    {spell.name} <span className="text-fg2">{spell.level === 0 ? '(kantrip)' : `(sv.${spell.level})`}</span>
                  </span>
                  <span className="flex flex-wrap justify-end gap-1">
                    {spell.attackRoll && onRoll && (
                      <button
                        onClick={() => onRoll(`${spell.name} Büyü Saldırısı`, spellAttackBonus(character))}
                        className="border border-line px-2 py-1 text-xs text-fg hover:border-accent hover:text-accent"
                      >
                        Saldır {formatModifier(spellAttackBonus(character))}
                      </button>
                    )}
                    {spell.damageDice && onDamageRoll && (
                      <button
                        onClick={() => onDamageRoll(`${spell.name} Hasarı`, spell.damageDice!)}
                        className="border border-line px-2 py-1 text-xs text-fg hover:border-accent hover:text-accent"
                      >
                        Hasar {spell.damageDice}
                      </button>
                    )}
                    {healExpr && onDamageRoll && (
                      <button
                        onClick={() => onDamageRoll(`${spell.name} İyileştirme`, healExpr)}
                        className="border border-line px-2 py-1 text-xs text-fg hover:border-accent hover:text-accent"
                      >
                        İyileştir {healExpr}
                      </button>
                    )}
                    {spell.savingThrow && onCastMessage && (
                      <button
                        onClick={() =>
                          onCastMessage(
                            `${character.name} — ${spell.name}: hedef ${ABILITY_LABELS[spell.savingThrow!]} kurtarma DC ${spellSaveDC(character)}`
                          )
                        }
                        className="border border-line px-2 py-1 text-xs text-fg hover:border-accent hover:text-accent"
                      >
                        DC {spellSaveDC(character)}
                      </button>
                    )}
                    {!spell.attackRoll && !spell.damageDice && !spell.healDice && !spell.savingThrow && onCastMessage && (
                      <button
                        onClick={() => onCastMessage(`${character.name} — ${spell.name} büyüsünü kullandı.`)}
                        className="border border-line px-2 py-1 text-xs text-fg hover:border-accent hover:text-accent"
                      >
                        Kullan
                      </button>
                    )}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!compact && character.backstory && (
        <div className="mt-3">
          <div className="text-xs uppercase tracking-wide text-fg2">Geçmiş Hikaye</div>
          <p className="whitespace-pre-wrap text-sm text-fg">{character.backstory}</p>
        </div>
      )}

      {!compact && character.appearance && (
        <div className="mt-3">
          <div className="text-xs uppercase tracking-wide text-fg2">Görünüm</div>
          <p className="whitespace-pre-wrap text-sm text-fg">{character.appearance}</p>
        </div>
      )}
    </div>
  )
}
