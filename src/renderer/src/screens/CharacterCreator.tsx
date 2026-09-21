import { useEffect, useMemo, useState } from 'react'
import { RACES } from '@shared/dnd/races'
import { CLASSES } from '@shared/dnd/classes'
import { BACKGROUNDS } from '@shared/dnd/backgrounds'
import { ALIGNMENTS, ABILITY_LABELS, STANDARD_ARRAY, type AbilityKey, type Character } from '@shared/dnd/types'
import {
  abilityModifier,
  applyRaceBonuses,
  estimateMaxHp,
  formatModifier,
  isSpellcaster,
  pointBuyCost,
  POINT_BUY_BUDGET
} from '@shared/dnd/calc'
import { useCharacterStore } from '../store/characterStore'

const ABILITY_KEYS: AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']
const STEPS = ['Kimlik', 'Yetenekler', 'Geçmiş', 'Büyüler', 'Hikaye', 'Özet'] as const

interface Props {
  onDone: () => void
  onCancel: () => void
}

export function CharacterCreator({ onDone, onCancel }: Props): JSX.Element {
  const upsert = useCharacterStore((s) => s.upsert)
  const [step, setStep] = useState(0)

  const [name, setName] = useState('')
  const [raceId, setRaceId] = useState(RACES[0].id)
  const [classId, setClassId] = useState(CLASSES[0].id)
  const [method, setMethod] = useState<'standard' | 'pointbuy'>('standard')
  const [assigned, setAssigned] = useState<Record<AbilityKey, number | null>>({
    str: null,
    dex: null,
    con: null,
    int: null,
    wis: null,
    cha: null
  })
  const [pointBuy, setPointBuy] = useState<Record<AbilityKey, number>>({
    str: 8,
    dex: 8,
    con: 8,
    int: 8,
    wis: 8,
    cha: 8
  })
  const [alignment, setAlignment] = useState<string>(ALIGNMENTS[4])
  const [backgroundId, setBackgroundId] = useState(BACKGROUNDS[0].id)
  const [chosenSkills, setChosenSkills] = useState<string[]>([])
  const [backstory, setBackstory] = useState('')
  const [appearance, setAppearance] = useState('')

  const race = RACES.find((r) => r.id === raceId)!
  const classInfo = CLASSES.find((c) => c.id === classId)!
  const background = BACKGROUNDS.find((b) => b.id === backgroundId)!

  const usedValues = Object.values(assigned).filter((v): v is number => v !== null)
  const standardAllAssigned = usedValues.length === 6
  const pointBuySpent = ABILITY_KEYS.reduce((sum, k) => sum + pointBuyCost(pointBuy[k]), 0)
  const pointBuyRemaining = POINT_BUY_BUDGET - pointBuySpent
  const allAssigned = method === 'standard' ? standardAllAssigned : true

  const availableClassSkills = classInfo.skillChoices.filter((s) => !background.skillProficiencies.includes(s))

  useEffect(() => {
    setChosenSkills((prev) => prev.filter((s) => availableClassSkills.includes(s)))
  }, [backgroundId, classId]) // eslint: availableClassSkills is derived from these each render

  const baseAbilities = useMemo(
    () =>
      method === 'standard'
        ? {
            str: assigned.str ?? 10,
            dex: assigned.dex ?? 10,
            con: assigned.con ?? 10,
            int: assigned.int ?? 10,
            wis: assigned.wis ?? 10,
            cha: assigned.cha ?? 10
          }
        : { ...pointBuy },
    [method, assigned, pointBuy]
  )
  const totalAbilities = useMemo(() => applyRaceBonuses(baseAbilities, raceId), [baseAbilities, raceId])

  const setAbility = (key: AbilityKey, value: string): void => {
    const num = value === '' ? null : Number(value)
    setAssigned((prev) => ({ ...prev, [key]: num }))
  }

  const adjustPointBuy = (key: AbilityKey, delta: 1 | -1): void => {
    setPointBuy((prev) => {
      const next = prev[key] + delta
      if (next < 8 || next > 15) return prev
      const deltaCost = pointBuyCost(next) - pointBuyCost(prev[key])
      if (delta > 0 && deltaCost > pointBuyRemaining) return prev
      return { ...prev, [key]: next }
    })
  }

  const toggleSkill = (skillName: string): void => {
    setChosenSkills((prev) => {
      if (prev.includes(skillName)) return prev.filter((s) => s !== skillName)
      if (prev.length >= requiredSkillCount) return prev
      return [...prev, skillName]
    })
  }

  const requiredSkillCount = Math.min(classInfo.skillChoiceCount, availableClassSkills.length)

  const canAdvance = (): boolean => {
    if (step === 0) return name.trim().length > 0
    if (step === 1) return allAssigned
    if (step === 2) return chosenSkills.length === requiredSkillCount
    return true
  }

  const save = async (): Promise<void> => {
    const now = Date.now()
    const character: Character = {
      id: crypto.randomUUID(),
      name: name.trim(),
      raceId,
      classId,
      backgroundId,
      alignment,
      level: 1,
      abilities: totalAbilities,
      skillProficiencies: Array.from(new Set([...background.skillProficiencies, ...chosenSkills])),
      inventory: [],
      currentHp: estimateMaxHp(classId, 1, totalAbilities.con),
      tempHp: 0,
      hitDiceUsed: 0,
      deathSaves: { successes: 0, failures: 0 },
      exhaustion: 0,
      spellsKnown: [],
      spellSlotsUsed: {},
      backstory,
      appearance,
      portraitDataUrl: null,
      createdAt: now,
      updatedAt: now
    }
    await upsert(character)
    onDone()
  }

  return (
    <div className="flex h-full flex-col bg-app">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <button onClick={onCancel} className="text-xs text-fg2 hover:text-fg">
          ← Vazgeç
        </button>
        <div className="flex gap-1 text-xs">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={`border px-2 py-1 ${i === step ? 'border-accent text-fg' : 'border-line text-fg2'}`}
            >
              {i + 1}. {label}
            </span>
          ))}
        </div>
        <div className="w-16" />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {step === 0 && (
          <div className="mx-auto max-w-xl space-y-4">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-fg2">Karakter Adı</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ör. Kael Ateşbıçak"
                className="w-full border border-line bg-panel px-3 py-2 text-fg outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-fg2">Irk</label>
              <div className="grid grid-cols-2 gap-2">
                {RACES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRaceId(r.id)}
                    className={`border px-3 py-2 text-left ${
                      raceId === r.id ? 'border-accent bg-panel2' : 'border-line bg-panel hover:bg-panel2'
                    }`}
                  >
                    <div className="text-sm text-fg">{r.name}</div>
                    <div className="text-xs text-fg2">
                      Hız {r.speed}ft ·{' '}
                      {Object.entries(r.abilityBonuses)
                        .map(([k, v]) => `${ABILITY_LABELS[k as AbilityKey]} +${v}`)
                        .join(', ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-fg2">Sınıf</label>
              <div className="grid grid-cols-2 gap-2">
                {CLASSES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setClassId(c.id)}
                    className={`border px-3 py-2 text-left ${
                      classId === c.id ? 'border-accent bg-panel2' : 'border-line bg-panel hover:bg-panel2'
                    }`}
                  >
                    <div className="text-sm text-fg">{c.name}</div>
                    <div className="text-xs text-fg2">Can Zarı d{c.hitDie}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="mx-auto max-w-xl space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => setMethod('standard')}
                className={`border px-3 py-1.5 text-xs ${method === 'standard' ? 'border-accent bg-panel2 text-accent' : 'border-line text-fg2'}`}
              >
                Standart Dizi
              </button>
              <button
                onClick={() => setMethod('pointbuy')}
                className={`border px-3 py-1.5 text-xs ${method === 'pointbuy' ? 'border-accent bg-panel2 text-accent' : 'border-line text-fg2'}`}
              >
                Puan Alışverişi
              </button>
            </div>

            {method === 'standard' ? (
              <>
                <p className="text-xs text-fg2">
                  Standart diziyi ({STANDARD_ARRAY.join(', ')}) altı yeteneğe dağıt. Her değer yalnızca bir kez
                  kullanılabilir; {race.name} ırk bonusları otomatik eklenir.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {ABILITY_KEYS.map((key) => {
                    const current = assigned[key]
                    const bonus = race.abilityBonuses[key] ?? 0
                    const total = (current ?? 10) + bonus
                    return (
                      <div key={key} className="border border-line bg-panel p-3">
                        <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-wide text-fg2">
                          <span>{ABILITY_LABELS[key]}</span>
                          {bonus > 0 && <span className="text-accent">+{bonus} ırk</span>}
                        </div>
                        <select
                          value={current ?? ''}
                          onChange={(e) => setAbility(key, e.target.value)}
                          className="w-full border border-line bg-panel2 px-2 py-1.5 text-fg outline-none focus:border-accent"
                        >
                          <option value="">— seç —</option>
                          {STANDARD_ARRAY.map((v) => (
                            <option key={v} value={v} disabled={usedValues.includes(v) && current !== v}>
                              {v}
                            </option>
                          ))}
                        </select>
                        {current !== null && (
                          <div className="mt-1 text-xs text-fg2">
                            Toplam {total} ({formatModifier(abilityModifier(total))})
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <>
                <p className="text-xs text-fg2">
                  27 puanlık bütçeyle 8-15 arası puan satın al (14 ve 15 daha pahalı). Kalan puan:{' '}
                  <span className={pointBuyRemaining < 0 ? 'text-accent' : 'text-fg'}>{pointBuyRemaining}</span>
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {ABILITY_KEYS.map((key) => {
                    const bonus = race.abilityBonuses[key] ?? 0
                    const total = pointBuy[key] + bonus
                    return (
                      <div key={key} className="border border-line bg-panel p-3">
                        <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-wide text-fg2">
                          <span>{ABILITY_LABELS[key]}</span>
                          {bonus > 0 && <span className="text-accent">+{bonus} ırk</span>}
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => adjustPointBuy(key, -1)}
                            className="border border-line px-2 text-fg2 hover:border-accent hover:text-accent"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-fg">{pointBuy[key]}</span>
                          <button
                            onClick={() => adjustPointBuy(key, 1)}
                            className="border border-line px-2 text-fg2 hover:border-accent hover:text-accent"
                          >
                            +
                          </button>
                        </div>
                        <div className="mt-1 text-center text-xs text-fg2">
                          Toplam {total} ({formatModifier(abilityModifier(total))})
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="mx-auto max-w-xl space-y-4">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-fg2">Geçmiş (Background)</label>
              <div className="grid grid-cols-1 gap-2">
                {BACKGROUNDS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBackgroundId(b.id)}
                    className={`border px-3 py-2 text-left ${
                      backgroundId === b.id ? 'border-accent bg-panel2' : 'border-line bg-panel hover:bg-panel2'
                    }`}
                  >
                    <div className="text-sm text-fg">{b.name}</div>
                    <div className="text-xs text-fg2">
                      Yetenek uzmanlığı: {b.skillProficiencies.join(', ')} · {b.feature}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-fg2">Hizalanma (Alignment)</label>
              <select
                value={alignment}
                onChange={(e) => setAlignment(e.target.value)}
                className="w-full border border-line bg-panel px-3 py-2 text-fg outline-none focus:border-accent"
              >
                {ALIGNMENTS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-fg2">
                {classInfo.name} Yetenek Uzmanlığı ({chosenSkills.length}/{requiredSkillCount})
              </label>
              <div className="grid grid-cols-2 gap-1">
                {availableClassSkills.map((skill) => (
                  <label key={skill} className="flex items-center gap-2 border border-line bg-panel px-2 py-1.5 text-sm text-fg">
                    <input type="checkbox" checked={chosenSkills.includes(skill)} onChange={() => toggleSkill(skill)} />
                    {skill}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mx-auto max-w-xl space-y-4">
            {isSpellcaster(classId) ? (
              <p className="text-sm text-fg2">
                {classInfo.name}, büyü kullanabilen bir sınıf. Bildiği/hazırladığı büyüleri ve büyü yuvalarını
                karakter oluşturulduktan sonra <span className="text-fg">Karakterlerim</span> ekranındaki büyü
                bölümünden seçebilirsin.
              </p>
            ) : (
              <p className="text-sm text-fg2">{classInfo.name} sınıfı büyü kullanmıyor.</p>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="mx-auto max-w-xl space-y-4">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-fg2">Geçmiş Hikaye</label>
              <textarea
                value={backstory}
                onChange={(e) => setBackstory(e.target.value)}
                rows={8}
                placeholder="Karakterin nereden geliyor, neden maceraya atıldı, kimleri tanıyor..."
                className="w-full border border-line bg-panel px-3 py-2 text-fg outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-fg2">Görünüm</label>
              <textarea
                value={appearance}
                onChange={(e) => setAppearance(e.target.value)}
                rows={4}
                placeholder="Boy, kıyafet, belirgin özellikler..."
                className="w-full border border-line bg-panel px-3 py-2 text-fg outline-none focus:border-accent"
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="mx-auto max-w-xl space-y-3">
            <div className="border border-line bg-panel p-4">
              <div className="font-display text-lg text-fg">{name || '(isimsiz)'}</div>
              <div className="text-xs text-fg2">
                {race.name} · {classInfo.name} · {background.name} · {alignment}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {ABILITY_KEYS.map((key) => (
                  <div key={key} className="border border-line bg-panel2 py-2 text-center">
                    <div className="text-[10px] uppercase text-fg2">{ABILITY_LABELS[key]}</div>
                    <div className="text-base font-semibold text-fg">{totalAbilities[key]}</div>
                    <div className="text-xs text-fg2">{formatModifier(abilityModifier(totalAbilities[key]))}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-fg2">
                Yetenek uzmanlıkları: {[...background.skillProficiencies, ...chosenSkills].join(', ')}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-line px-4 py-3">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="border border-line px-4 py-1.5 text-sm text-fg2 hover:text-fg disabled:opacity-30"
        >
          Geri
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={!canAdvance()}
            className="border border-accent bg-accent px-4 py-1.5 text-sm text-accent-fg hover:bg-accent-hover disabled:opacity-30"
          >
            İleri
          </button>
        ) : (
          <button onClick={save} className="border border-accent bg-accent px-4 py-1.5 text-sm text-accent-fg hover:bg-accent-hover">
            Karakteri Kaydet
          </button>
        )}
      </div>
    </div>
  )
}
