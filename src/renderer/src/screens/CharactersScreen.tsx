import { useEffect, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { useCharacterStore } from '../store/characterStore'
import { useDice3DStore } from '../store/dice3dStore'
import { CharacterCreator } from './CharacterCreator'
import { CharacterSheet } from '../components/CharacterSheet'
import { InventoryEditor } from '../components/InventoryEditor'
import { SpellManager } from '../components/SpellManager'
import { ThemeToggle } from '../components/ThemeToggle'
import { RACES } from '@shared/dnd/races'
import { CLASSES } from '@shared/dnd/classes'
import { maxSpellSlotsForLevel } from '@shared/dnd/spells'
import { ABILITY_LABELS, type AbilityKey, type InventoryItem } from '@shared/dnd/types'
import { abilityModifier, classHitDie, estimateMaxHp, isSpellcaster } from '@shared/dnd/calc'
import { rollDie } from '@shared/dice/engine'

const ABILITY_KEYS: AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']

export function CharactersScreen(): JSX.Element {
  const goToLobby = useAppStore((s) => s.goToLobby)
  const { characters, activeCharacterId, loaded, load, upsert, remove, setActive } = useCharacterStore()
  const roll3D = useDice3DStore((s) => s.roll)
  const [creating, setCreating] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (!loaded) void load()
  }, [loaded, load])

  useEffect(() => {
    if (!selectedId && characters.length > 0) setSelectedId(characters[0].id)
  }, [characters, selectedId])

  if (creating) {
    return (
      <CharacterCreator
        onCancel={() => setCreating(false)}
        onDone={() => {
          setCreating(false)
        }}
      />
    )
  }

  const selected = characters.find((c) => c.id === selectedId) ?? null

  return (
    <div className="grid h-full grid-cols-[280px_1fr]">
      <div className="flex flex-col border-r border-line bg-app">
        <div className="flex items-center justify-between border-b border-line px-3 py-2">
          <button onClick={goToLobby} className="text-xs text-fg2 hover:text-fg">
            ← Lobi
          </button>
          <ThemeToggle />
        </div>
        <div className="flex-1 overflow-y-auto">
          {characters.length === 0 && (
            <p className="p-4 text-xs text-fg2">Henüz karakter yok. Aşağıdan yeni bir karakter oluştur.</p>
          )}
          {characters.map((c) => {
            const race = RACES.find((r) => r.id === c.raceId)
            const classInfo = CLASSES.find((k) => k.id === c.classId)
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`flex w-full flex-col border-b border-line px-4 py-3 text-left hover:bg-panel2 ${
                  selectedId === c.id ? 'bg-panel2' : ''
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-medium text-fg">
                  {c.name}
                  {activeCharacterId === c.id && (
                    <span className="border border-accent px-1 text-[10px] uppercase text-accent">aktif</span>
                  )}
                </span>
                <span className="text-xs text-fg2">
                  {race?.name} · {classInfo?.name} {c.level}
                </span>
              </button>
            )
          })}
        </div>
        <div className="border-t border-line p-3">
          <button
            onClick={() => setCreating(true)}
            className="w-full border border-accent bg-accent py-2 text-sm font-medium text-accent-fg hover:bg-accent-hover"
          >
            + Yeni Karakter
          </button>
        </div>
      </div>

      <div className="overflow-y-auto p-6">
        {selected ? (
          <div className="mx-auto max-w-xl">
            <div id="printable-character-sheet">
              <CharacterSheet
                character={selected}
                onSetHp={(value) => void upsert({ ...selected, currentHp: value, updatedAt: Date.now() })}
                onSetTempHp={(value) => void upsert({ ...selected, tempHp: value, updatedAt: Date.now() })}
                onSlotChange={(level, delta) => {
                  const used = selected.spellSlotsUsed[level] ?? 0
                  const max = maxSpellSlotsForLevel(selected.level)[level - 1] ?? 0
                  const next = Math.max(0, Math.min(max, used + delta))
                  void upsert({ ...selected, spellSlotsUsed: { ...selected.spellSlotsUsed, [level]: next }, updatedAt: Date.now() })
                }}
                onLongRest={() =>
                  void upsert({
                    ...selected,
                    currentHp: estimateMaxHp(selected.classId, selected.level, selected.abilities.con),
                    tempHp: 0,
                    hitDiceUsed: 0,
                    deathSaves: { successes: 0, failures: 0 },
                    spellSlotsUsed: {},
                    updatedAt: Date.now()
                  })
                }
                onShortRest={() => {
                  const maxHp = estimateMaxHp(selected.classId, selected.level, selected.abilities.con)
                  const conMod = abilityModifier(selected.abilities.con)
                  const hitDie = classHitDie(selected.classId)
                  roll3D(`1d${hitDie}`)
                  const healed = Math.max(1, rollDie(hitDie) + conMod)
                  void upsert({
                    ...selected,
                    currentHp: Math.min(maxHp, selected.currentHp + healed),
                    hitDiceUsed: selected.hitDiceUsed + 1,
                    updatedAt: Date.now()
                  })
                }}
                onDeathSaveChange={(kind, delta) =>
                  void upsert({
                    ...selected,
                    deathSaves: {
                      ...selected.deathSaves,
                      [kind]: Math.max(0, Math.min(3, selected.deathSaves[kind] + delta))
                    },
                    updatedAt: Date.now()
                  })
                }
                onExhaustionChange={(delta) =>
                  void upsert({ ...selected, exhaustion: Math.max(0, Math.min(6, selected.exhaustion + delta)), updatedAt: Date.now() })
                }
                onPortraitChange={(dataUrl) => void upsert({ ...selected, portraitDataUrl: dataUrl, updatedAt: Date.now() })}
              />
            </div>

            <div className="mt-4">
              <div className="mb-1 text-xs uppercase tracking-wide text-fg2">Seviye & Yetenek Puanları</div>
              <div className="flex flex-wrap items-center gap-2 border border-line bg-panel2 px-3 py-2 text-sm">
                <span className="text-fg2">Seviye</span>
                <button
                  onClick={() => void upsert({ ...selected, level: Math.max(1, selected.level - 1), updatedAt: Date.now() })}
                  className="border border-line px-2 text-fg2 hover:border-accent hover:text-accent"
                >
                  −
                </button>
                <span className="w-6 text-center text-fg">{selected.level}</span>
                <button
                  onClick={() => void upsert({ ...selected, level: Math.min(20, selected.level + 1), updatedAt: Date.now() })}
                  className="border border-line px-2 text-fg2 hover:border-accent hover:text-accent"
                >
                  +
                </button>
                <span className="text-xs text-fg2">
                  4/8/12/16/19. seviyelerde bir yeteneği +2 (veya iki yeteneği +1) artırabilirsin — aşağıdan elle güncelle.
                </span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {ABILITY_KEYS.map((key) => (
                  <div key={key} className="border border-line bg-panel2 px-2 py-1.5 text-center">
                    <div className="text-[10px] text-fg2">{ABILITY_LABELS[key]}</div>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() =>
                          void upsert({
                            ...selected,
                            abilities: { ...selected.abilities, [key]: Math.max(1, selected.abilities[key] - 1) },
                            updatedAt: Date.now()
                          })
                        }
                        className="text-fg2 hover:text-accent"
                      >
                        −
                      </button>
                      <span className="w-6 text-fg">{selected.abilities[key]}</span>
                      <button
                        onClick={() =>
                          void upsert({
                            ...selected,
                            abilities: { ...selected.abilities, [key]: Math.min(30, selected.abilities[key] + 1) },
                            updatedAt: Date.now()
                          })
                        }
                        className="text-fg2 hover:text-accent"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-1 text-xs uppercase tracking-wide text-fg2">Envanter</div>
              <InventoryEditor
                character={selected}
                onChange={(inventory: InventoryItem[]) => void upsert({ ...selected, inventory, updatedAt: Date.now() })}
              />
            </div>

            {isSpellcaster(selected.classId) && (
              <div className="mt-4">
                <div className="mb-1 text-xs uppercase tracking-wide text-fg2">Büyüler</div>
                <SpellManager
                  character={selected}
                  onChange={(spellsKnown) => void upsert({ ...selected, spellsKnown, updatedAt: Date.now() })}
                />
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setActive(selected.id)}
                disabled={activeCharacterId === selected.id}
                className="border border-accent bg-accent px-3 py-1.5 text-xs text-accent-fg hover:bg-accent-hover disabled:opacity-30"
              >
                Aktif Karakter Yap
              </button>
              <button onClick={() => window.print()} className="border border-line px-3 py-1.5 text-xs text-fg2 hover:border-accent hover:text-accent">
                Yazdır
              </button>
              <button
                onClick={() => {
                  void remove(selected.id)
                  setSelectedId(null)
                }}
                className="border border-line px-3 py-1.5 text-xs text-fg2 hover:border-accent hover:text-accent"
              >
                Sil
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-fg2">Soldan bir karakter seç, ya da yeni bir tane oluştur.</p>
        )}
      </div>
    </div>
  )
}
