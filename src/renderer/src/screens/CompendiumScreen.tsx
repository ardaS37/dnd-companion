import { useState } from 'react'
import { useAppStore } from '../store/appStore'
import { ThemeToggle } from '../components/ThemeToggle'
import { SPELLS, SCHOOL_LABELS } from '@shared/dnd/spells'
import { WEAPONS, ARMOR, GEAR } from '@shared/dnd/equipment'
import { RACES } from '@shared/dnd/races'
import { CLASSES } from '@shared/dnd/classes'
import { BACKGROUNDS } from '@shared/dnd/backgrounds'
import { MONSTERS, formatCr } from '@shared/dnd/monsters'
import { ABILITY_LABELS, type AbilityKey } from '@shared/dnd/types'

type Category = 'spells' | 'weapons' | 'armor' | 'gear' | 'monsters' | 'races' | 'classes' | 'backgrounds'

const CATEGORY_LABELS: Record<Category, string> = {
  spells: 'Büyüler',
  weapons: 'Silahlar',
  armor: 'Zırhlar',
  gear: 'Eşyalar',
  monsters: 'Canavarlar',
  races: 'Irklar',
  classes: 'Sınıflar',
  backgrounds: 'Geçmişler'
}

export function CompendiumScreen(): JSX.Element {
  const goToLobby = useAppStore((s) => s.goToLobby)
  const [category, setCategory] = useState<Category>('spells')
  const [search, setSearch] = useState('')

  const q = search.toLowerCase()

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-line bg-app px-3 py-2">
        <button onClick={goToLobby} className="text-xs text-fg2 hover:text-fg">
          ← Lobi
        </button>
        <h1 className="font-display text-base text-fg">Compendium</h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ara..."
          className="ml-2 flex-1 max-w-xs border border-line bg-panel px-2 py-1 text-sm text-fg outline-none focus:border-accent"
        />
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-line bg-panel px-3 py-2">
        {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`border px-3 py-1 text-xs ${category === c ? 'border-accent bg-panel2 text-accent' : 'border-line text-fg2'}`}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl space-y-1">
          {category === 'spells' &&
            SPELLS.filter((s) => s.name.toLowerCase().includes(q)).map((s) => (
              <div key={s.id} className="border border-line bg-panel2 px-3 py-2 text-sm">
                <div className="flex items-center justify-between text-fg">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-xs text-fg2">
                    {s.level === 0 ? 'Kantrip' : `${s.level}. seviye`} · {SCHOOL_LABELS[s.school]}
                  </span>
                </div>
                <div className="text-xs text-fg2">{s.description}</div>
                <div className="mt-0.5 text-xs text-fg2">
                  {s.castingTime} · {s.range} · {s.duration}
                  {s.damageDice && ` · Hasar ${s.damageDice} ${s.damageType ?? ''}`}
                  {s.healDice && ` · İyileştirme ${s.healDice}`}
                </div>
              </div>
            ))}

          {category === 'weapons' &&
            WEAPONS.filter((w) => w.name.toLowerCase().includes(q)).map((w) => (
              <div key={w.id} className="flex items-center justify-between border border-line bg-panel2 px-3 py-2 text-sm">
                <span className="text-fg">{w.name}</span>
                <span className="text-xs text-fg2">
                  {w.damageDice} {w.damageType} · {ABILITY_LABELS[w.ability as AbilityKey]}
                  {w.finesse ? ' (finesse)' : ''} · {w.properties.join(', ')}
                </span>
              </div>
            ))}

          {category === 'armor' &&
            ARMOR.filter((a) => a.name.toLowerCase().includes(q)).map((a) => (
              <div key={a.id} className="flex items-center justify-between border border-line bg-panel2 px-3 py-2 text-sm">
                <span className="text-fg">{a.name}</span>
                <span className="text-xs text-fg2">
                  AC {a.baseAC} · {a.category}
                  {a.strRequirement ? ` · Güç ${a.strRequirement} gerekir` : ''}
                  {a.stealthDisadvantage ? ' · Gizlenmede dezavantaj' : ''}
                </span>
              </div>
            ))}

          {category === 'gear' &&
            GEAR.filter((g) => g.name.toLowerCase().includes(q)).map((g) => (
              <div key={g.id} className="border border-line bg-panel2 px-3 py-2 text-sm text-fg">
                {g.name}
              </div>
            ))}

          {category === 'monsters' &&
            MONSTERS.filter((m) => m.name.toLowerCase().includes(q)).map((m) => (
              <div key={m.id} className="flex items-center justify-between border border-line bg-panel2 px-3 py-2 text-sm">
                <span className="text-fg">{m.name}</span>
                <span className="text-xs text-fg2">
                  CR {formatCr(m.cr)} · AC {m.ac} · HP {m.hp} · {m.type}
                </span>
              </div>
            ))}

          {category === 'races' &&
            RACES.filter((r) => r.name.toLowerCase().includes(q)).map((r) => (
              <div key={r.id} className="border border-line bg-panel2 px-3 py-2 text-sm">
                <div className="text-fg">{r.name}</div>
                <div className="text-xs text-fg2">
                  Hız {r.speed}ft ·{' '}
                  {Object.entries(r.abilityBonuses)
                    .map(([k, v]) => `${ABILITY_LABELS[k as AbilityKey]} +${v}`)
                    .join(', ')}
                </div>
                <div className="text-xs text-fg2">{r.traits.join(' · ')}</div>
              </div>
            ))}

          {category === 'classes' &&
            CLASSES.filter((c) => c.name.toLowerCase().includes(q)).map((c) => (
              <div key={c.id} className="border border-line bg-panel2 px-3 py-2 text-sm">
                <div className="text-fg">{c.name}</div>
                <div className="text-xs text-fg2">
                  Can Zarı d{c.hitDie} · Kurtarma: {c.savingThrowProficiencies.map((k) => ABILITY_LABELS[k]).join(', ')}
                  {c.spellcastingAbility && ` · Büyü yeteneği: ${ABILITY_LABELS[c.spellcastingAbility]}`}
                </div>
              </div>
            ))}

          {category === 'backgrounds' &&
            BACKGROUNDS.filter((b) => b.name.toLowerCase().includes(q)).map((b) => (
              <div key={b.id} className="border border-line bg-panel2 px-3 py-2 text-sm">
                <div className="text-fg">{b.name}</div>
                <div className="text-xs text-fg2">
                  {b.skillProficiencies.join(', ')} · {b.feature}: {b.featureDescription}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
