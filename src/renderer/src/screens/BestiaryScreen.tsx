import { useEffect, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { useCombatStore } from '../store/combatStore'
import { useCustomMonsterStore } from '../store/customMonsterStore'
import { ThemeToggle } from '../components/ThemeToggle'
import { LootGenerator } from '../components/LootGenerator'
import { MONSTERS, crToXp, formatCr, type MonsterInfo } from '@shared/dnd/monsters'
import { abilityModifier, formatModifier } from '@shared/dnd/calc'
import { ABILITY_LABELS, type AbilityKey } from '@shared/dnd/types'
import { rollDie } from '@shared/dice/engine'

const ABILITY_KEYS: AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']
const CR_OPTIONS = [0, 0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function emptyDraft(): MonsterInfo {
  return {
    id: '',
    name: '',
    type: 'İnsansı',
    size: 'Orta',
    cr: 0.25,
    ac: 12,
    hp: 10,
    hitDice: '2d8+2',
    speed: 30,
    abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    senses: 'normal görüş',
    languages: '—',
    traits: [],
    actions: [{ name: 'Saldırı', description: 'Yakın silah saldırısı', attackBonus: 3, damageDice: '1d6+1', damageType: 'ezici' }],
    custom: true
  }
}

export function BestiaryScreen(): JSX.Element {
  const goToLobby = useAppStore((s) => s.goToLobby)
  const addEntry = useCombatStore((s) => s.addEntry)
  const { monsters: customMonsters, loaded, load, upsert, remove } = useCustomMonsterStore()
  const [selectedId, setSelectedId] = useState<string | null>(MONSTERS[0]?.id ?? null)
  const [search, setSearch] = useState('')
  const [creating, setCreating] = useState(false)
  const [tab, setTab] = useState<'bestiary' | 'loot'>('bestiary')
  const [draft, setDraft] = useState<MonsterInfo>(emptyDraft())

  useEffect(() => {
    if (!loaded) void load()
  }, [loaded, load])

  const allMonsters = [...MONSTERS, ...customMonsters]
  const filtered = allMonsters.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
  const selected = allMonsters.find((m) => m.id === selectedId) ?? null

  const startCreate = (): void => {
    setDraft(emptyDraft())
    setCreating(true)
  }

  const saveCustom = async (): Promise<void> => {
    const monster = { ...draft, id: draft.id || crypto.randomUUID() }
    await upsert({ ...monster, updatedAt: Date.now() })
    setCreating(false)
    setSelectedId(monster.id)
  }

  const addToCombat = (monster: MonsterInfo): void => {
    const dexMod = abilityModifier(monster.abilities.dex)
    addEntry({
      id: crypto.randomUUID(),
      name: monster.name,
      initiative: rollDie(20) + dexMod,
      ac: monster.ac,
      currentHp: monster.hp,
      maxHp: monster.hp,
      conditions: [],
      isPC: false,
      xp: crToXp(monster.cr)
    })
  }

  return (
    <div className="grid h-full grid-cols-[280px_1fr]">
      <div className="flex flex-col border-r border-line bg-app">
        <div className="flex items-center justify-between border-b border-line px-3 py-2">
          <button onClick={goToLobby} className="text-xs text-fg2 hover:text-fg">
            ← Lobi
          </button>
          <ThemeToggle />
        </div>
        <div className="flex border-b border-line">
          <button
            onClick={() => setTab('bestiary')}
            className={`flex-1 py-2 text-xs ${tab === 'bestiary' ? 'border-b-2 border-accent text-accent' : 'text-fg2'}`}
          >
            Canavarlar
          </button>
          <button
            onClick={() => setTab('loot')}
            className={`flex-1 py-2 text-xs ${tab === 'loot' ? 'border-b-2 border-accent text-accent' : 'text-fg2'}`}
          >
            Loot Üretici
          </button>
        </div>
        <div className="border-b border-line p-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Canavar ara..."
            className="w-full border border-line bg-panel px-2 py-1.5 text-sm text-fg outline-none focus:border-accent"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedId(m.id)}
              className={`flex w-full flex-col border-b border-line px-4 py-2.5 text-left hover:bg-panel2 ${
                selectedId === m.id ? 'bg-panel2' : ''
              }`}
            >
              <span className="text-sm font-medium text-fg">
                {m.name} {m.custom && <span className="text-[10px] text-accent">özel</span>}
              </span>
              <span className="text-xs text-fg2">
                CR {formatCr(m.cr)} · AC {m.ac} · HP {m.hp}
              </span>
            </button>
          ))}
        </div>
        <div className="border-t border-line p-3">
          <button onClick={startCreate} className="w-full border border-accent bg-accent py-2 text-sm font-medium text-accent-fg hover:bg-accent-hover">
            + Özel Canavar
          </button>
        </div>
      </div>

      <div className="overflow-y-auto p-6">
        {tab === 'loot' ? (
          <LootGenerator />
        ) : creating ? (
          <div className="mx-auto max-w-xl space-y-3">
            <h2 className="font-display text-lg text-fg">Özel Canavar Oluştur</h2>
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="İsim"
              className="w-full border border-line bg-panel px-3 py-2 text-fg outline-none focus:border-accent"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                value={draft.type}
                onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                placeholder="Tür (ör. İnsansı, Canavar)"
                className="border border-line bg-panel px-2 py-1.5 text-sm text-fg outline-none focus:border-accent"
              />
              <select
                value={draft.size}
                onChange={(e) => setDraft({ ...draft, size: e.target.value as MonsterInfo['size'] })}
                className="border border-line bg-panel px-2 py-1.5 text-sm text-fg outline-none focus:border-accent"
              >
                {['Küçük', 'Orta', 'Büyük', 'Devasa'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <label className="text-xs text-fg2">
                CR
                <select
                  value={draft.cr}
                  onChange={(e) => setDraft({ ...draft, cr: Number(e.target.value) })}
                  className="mt-1 w-full border border-line bg-panel px-2 py-1.5 text-sm text-fg outline-none focus:border-accent"
                >
                  {CR_OPTIONS.map((cr) => (
                    <option key={cr} value={cr}>
                      {formatCr(cr)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-fg2">
                AC
                <input
                  type="number"
                  value={draft.ac}
                  onChange={(e) => setDraft({ ...draft, ac: Number(e.target.value) || 0 })}
                  className="mt-1 w-full border border-line bg-panel px-2 py-1.5 text-sm text-fg outline-none focus:border-accent"
                />
              </label>
              <label className="text-xs text-fg2">
                HP
                <input
                  type="number"
                  value={draft.hp}
                  onChange={(e) => setDraft({ ...draft, hp: Number(e.target.value) || 0 })}
                  className="mt-1 w-full border border-line bg-panel px-2 py-1.5 text-sm text-fg outline-none focus:border-accent"
                />
              </label>
              <label className="text-xs text-fg2">
                Hız
                <input
                  type="number"
                  value={draft.speed}
                  onChange={(e) => setDraft({ ...draft, speed: Number(e.target.value) || 0 })}
                  className="mt-1 w-full border border-line bg-panel px-2 py-1.5 text-sm text-fg outline-none focus:border-accent"
                />
              </label>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {ABILITY_KEYS.map((key) => (
                <label key={key} className="text-center text-[10px] text-fg2">
                  {ABILITY_LABELS[key]}
                  <input
                    type="number"
                    value={draft.abilities[key]}
                    onChange={(e) => setDraft({ ...draft, abilities: { ...draft.abilities, [key]: Number(e.target.value) || 0 } })}
                    className="mt-1 w-full border border-line bg-panel px-1 py-1 text-center text-sm text-fg outline-none focus:border-accent"
                  />
                </label>
              ))}
            </div>
            <div className="border border-line bg-panel2 p-3">
              <div className="mb-2 text-xs uppercase tracking-wide text-fg2">Saldırı</div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={draft.actions[0]?.name ?? ''}
                  onChange={(e) => setDraft({ ...draft, actions: [{ ...draft.actions[0], name: e.target.value }] })}
                  placeholder="Saldırı adı"
                  className="border border-line bg-panel px-2 py-1.5 text-sm text-fg outline-none focus:border-accent"
                />
                <input
                  type="number"
                  value={draft.actions[0]?.attackBonus ?? 0}
                  onChange={(e) =>
                    setDraft({ ...draft, actions: [{ ...draft.actions[0], attackBonus: Number(e.target.value) || 0 }] })
                  }
                  placeholder="Saldırı bonusu"
                  className="border border-line bg-panel px-2 py-1.5 text-sm text-fg outline-none focus:border-accent"
                />
                <input
                  value={draft.actions[0]?.damageDice ?? ''}
                  onChange={(e) => setDraft({ ...draft, actions: [{ ...draft.actions[0], damageDice: e.target.value }] })}
                  placeholder="Hasar zarı (ör. 1d8+2)"
                  className="border border-line bg-panel px-2 py-1.5 text-sm text-fg outline-none focus:border-accent"
                />
                <input
                  value={draft.actions[0]?.damageType ?? ''}
                  onChange={(e) => setDraft({ ...draft, actions: [{ ...draft.actions[0], damageType: e.target.value }] })}
                  placeholder="Hasar türü"
                  className="border border-line bg-panel px-2 py-1.5 text-sm text-fg outline-none focus:border-accent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={saveCustom} className="border border-accent bg-accent px-4 py-1.5 text-sm text-accent-fg hover:bg-accent-hover">
                Kaydet
              </button>
              <button onClick={() => setCreating(false)} className="border border-line px-4 py-1.5 text-sm text-fg2 hover:text-fg">
                Vazgeç
              </button>
            </div>
          </div>
        ) : selected ? (
          <div className="mx-auto max-w-xl">
            <div className="font-display text-lg text-fg">{selected.name}</div>
            <div className="text-xs text-fg2">
              {selected.size} {selected.type} · CR {formatCr(selected.cr)} ({crToXp(selected.cr)} XP)
            </div>
            <div className="mt-2 text-xs text-fg2">
              AC {selected.ac} · HP {selected.hp} ({selected.hitDice}) · Hız {selected.speed}ft
            </div>
            <div className="mt-3 grid grid-cols-6 gap-2">
              {ABILITY_KEYS.map((key) => (
                <div key={key} className="border border-line bg-panel2 py-2 text-center">
                  <div className="text-[10px] text-fg2">{ABILITY_LABELS[key]}</div>
                  <div className="text-sm font-semibold text-fg">{selected.abilities[key]}</div>
                  <div className="text-xs text-fg2">{formatModifier(abilityModifier(selected.abilities[key]))}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-fg2">
              Duyular: {selected.senses} · Diller: {selected.languages}
            </div>
            {selected.traits.length > 0 && (
              <div className="mt-3">
                <div className="text-xs uppercase tracking-wide text-fg2">Özellikler</div>
                {selected.traits.map((t) => (
                  <p key={t.name} className="text-sm text-fg">
                    <span className="font-semibold">{t.name}.</span> {t.description}
                  </p>
                ))}
              </div>
            )}
            <div className="mt-3">
              <div className="text-xs uppercase tracking-wide text-fg2">Aksiyonlar</div>
              {selected.actions.map((a) => (
                <p key={a.name} className="text-sm text-fg">
                  <span className="font-semibold">{a.name}.</span> {a.description}
                  {a.attackBonus !== undefined && ` Saldırı ${formatModifier(a.attackBonus)},`}
                  {a.damageDice && ` Hasar: ${a.damageDice} ${a.damageType ?? ''}`}
                </p>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => addToCombat(selected)}
                className="border border-accent bg-accent px-3 py-1.5 text-xs text-accent-fg hover:bg-accent-hover"
              >
                Sıraya Ekle
              </button>
              {selected.custom && (
                <button
                  onClick={() => void remove(selected.id)}
                  className="border border-line px-3 py-1.5 text-xs text-fg2 hover:border-accent hover:text-accent"
                >
                  Sil
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-fg2">Soldan bir canavar seç.</p>
        )}
      </div>
    </div>
  )
}
