import { useEffect, useState } from 'react'
import { useCombatStore, type CombatEntry } from '../../store/combatStore'
import { useCharacterStore } from '../../store/characterStore'
import { useCustomMonsterStore } from '../../store/customMonsterStore'
import { MONSTERS, crToXp, encounterDifficulty, encounterMultiplier, partyXpThresholds } from '@shared/dnd/monsters'
import { CONDITIONS } from '@shared/dnd/conditions'
import { computeArmorClass, estimateMaxHp, abilityModifier } from '@shared/dnd/calc'
import { rollDie } from '@shared/dice/engine'

export function InitiativePanel(): JSX.Element {
  const { round, activeEntryId, entries, addEntry, removeEntry, updateEntry, startCombat, nextTurn, clear } = useCombatStore()
  const { characters, loaded: charsLoaded, load: loadChars } = useCharacterStore()
  const { monsters: customMonsters, loaded: monstersLoaded, load: loadMonsters } = useCustomMonsterStore()
  const [charToAdd, setCharToAdd] = useState('')
  const [monsterToAdd, setMonsterToAdd] = useState(MONSTERS[0]?.id ?? '')
  const [monsterQty, setMonsterQty] = useState(1)

  useEffect(() => {
    if (!charsLoaded) void loadChars()
    if (!monstersLoaded) void loadMonsters()
  }, [charsLoaded, loadChars, monstersLoaded, loadMonsters])

  const allMonsters = [...MONSTERS, ...customMonsters]
  const sorted = [...entries].sort((a, b) => b.initiative - a.initiative)

  const addCharacter = (): void => {
    const character = characters.find((c) => c.id === charToAdd)
    if (!character) return
    const dexMod = abilityModifier(character.abilities.dex)
    const maxHp = estimateMaxHp(character.classId, character.level, character.abilities.con)
    addEntry({
      id: crypto.randomUUID(),
      name: character.name,
      initiative: rollDie(20) + dexMod,
      ac: computeArmorClass(character).total,
      currentHp: character.currentHp,
      maxHp,
      conditions: [],
      isPC: true,
      level: character.level
    })
  }

  const addMonster = (): void => {
    const monster = allMonsters.find((m) => m.id === monsterToAdd)
    if (!monster) return
    const dexMod = abilityModifier(monster.abilities.dex)
    const existingCount = entries.filter((e) => e.name.startsWith(monster.name)).length
    for (let i = 0; i < monsterQty; i++) {
      addEntry({
        id: crypto.randomUUID(),
        name: monsterQty > 1 || existingCount > 0 ? `${monster.name} ${existingCount + i + 1}` : monster.name,
        initiative: rollDie(20) + dexMod,
        ac: monster.ac,
        currentHp: monster.hp,
        maxHp: monster.hp,
        conditions: [],
        isPC: false,
        xp: crToXp(monster.cr)
      })
    }
  }

  const partyLevels = entries.filter((e) => e.isPC && e.level).map((e) => e.level as number)
  const monsterXpTotal = entries.filter((e) => !e.isPC).reduce((sum, e) => sum + (e.xp ?? 0), 0)
  const monsterCount = entries.filter((e) => !e.isPC).length
  const adjustedXp = monsterXpTotal * encounterMultiplier(monsterCount)
  const thresholds = partyLevels.length > 0 ? partyXpThresholds(partyLevels) : null

  const addCondition = (entry: CombatEntry, conditionId: string): void => {
    if (!conditionId || entry.conditions.includes(conditionId)) return
    updateEntry(entry.id, { conditions: [...entry.conditions, conditionId] })
  }

  const removeCondition = (entry: CombatEntry, conditionId: string): void => {
    updateEntry(entry.id, { conditions: entry.conditions.filter((c) => c !== conditionId) })
  }

  return (
    <div className="h-full overflow-y-auto bg-panel p-2 text-sm">
      <div className="mb-2 flex flex-wrap items-center gap-2 border-b border-line pb-2">
        <span className="text-xs text-fg2">Tur {round}</span>
        <button onClick={startCombat} className="border border-accent bg-accent px-2 py-1 text-xs text-accent-fg hover:bg-accent-hover">
          Savaşı Başlat
        </button>
        <button onClick={nextTurn} className="border border-line px-2 py-1 text-xs text-fg2 hover:border-accent hover:text-accent">
          Sıradaki Tur
        </button>
        <button onClick={clear} className="border border-line px-2 py-1 text-xs text-fg2 hover:border-accent hover:text-accent">
          Temizle
        </button>
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-1 border-b border-line pb-2 text-xs">
        <select value={charToAdd} onChange={(e) => setCharToAdd(e.target.value)} className="border border-line bg-panel2 px-1 py-1 text-fg outline-none">
          <option value="">— karakter —</option>
          {characters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button onClick={addCharacter} className="border border-line px-2 py-1 text-fg2 hover:border-accent hover:text-accent">
          + Ekle
        </button>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-1 border-b border-line pb-2 text-xs">
        <select value={monsterToAdd} onChange={(e) => setMonsterToAdd(e.target.value)} className="border border-line bg-panel2 px-1 py-1 text-fg outline-none">
          {allMonsters.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          max={20}
          value={monsterQty}
          onChange={(e) => setMonsterQty(Math.max(1, Number(e.target.value) || 1))}
          className="w-10 border border-line bg-panel2 px-1 py-1 text-center text-fg outline-none"
        />
        <button onClick={addMonster} className="border border-line px-2 py-1 text-fg2 hover:border-accent hover:text-accent">
          + Ekle
        </button>
      </div>

      {thresholds && monsterCount > 0 && (
        <div className="mb-3 border border-line bg-panel2 px-2 py-1.5 text-xs text-fg2">
          <div>
            Canavar XP: {monsterXpTotal} × {encounterMultiplier(monsterCount)} = {adjustedXp} (ayarlı)
          </div>
          <div>
            Eşikler — Kolay {thresholds.easy} · Orta {thresholds.medium} · Zor {thresholds.hard} · Ölümcül {thresholds.deadly}
          </div>
          <div className="mt-0.5 text-fg">Zorluk: {encounterDifficulty(adjustedXp, thresholds)}</div>
        </div>
      )}

      <div className="space-y-1">
        {sorted.length === 0 && <p className="text-xs text-fg2">Savaşa katılımcı yok.</p>}
        {sorted.map((entry) => (
          <div
            key={entry.id}
            className={`border px-2 py-1.5 ${activeEntryId === entry.id ? 'border-accent bg-accent/10' : 'border-line bg-panel2'}`}
          >
            <div className="flex flex-wrap items-center gap-1">
              <input
                type="number"
                value={entry.initiative}
                onChange={(e) => updateEntry(entry.id, { initiative: Number(e.target.value) || 0 })}
                className="w-10 border border-line bg-panel px-1 py-0.5 text-center text-fg outline-none"
              />
              <span className={`flex-1 truncate ${entry.isPC ? 'text-fg' : 'text-fg2'}`}>{entry.name}</span>
              {entry.ac !== null && <span className="text-xs text-fg2">AC{entry.ac}</span>}
              <input
                type="number"
                value={entry.currentHp}
                onChange={(e) => updateEntry(entry.id, { currentHp: Number(e.target.value) || 0 })}
                className="w-12 border border-line bg-panel px-1 py-0.5 text-center text-fg outline-none"
              />
              <span className="text-xs text-fg2">/{entry.maxHp}</span>
              <button onClick={() => removeEntry(entry.id)} className="px-1 text-xs text-fg2 hover:text-accent">
                ✕
              </button>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-1">
              {entry.conditions.map((cid) => {
                const cond = CONDITIONS.find((c) => c.id === cid)
                return (
                  <button
                    key={cid}
                    onClick={() => removeCondition(entry, cid)}
                    title={cond?.description}
                    className="border border-accent px-1 text-[10px] text-accent hover:bg-accent hover:text-accent-fg"
                  >
                    {cond?.name ?? cid} ✕
                  </button>
                )
              })}
              <select
                value=""
                onChange={(e) => addCondition(entry, e.target.value)}
                className="border border-line bg-panel px-1 py-0.5 text-[10px] text-fg2 outline-none"
              >
                <option value="">+ durum</option>
                {CONDITIONS.filter((c) => !entry.conditions.includes(c.id)).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
