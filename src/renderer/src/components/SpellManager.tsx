import { useEffect, useState } from 'react'
import type { Character } from '@shared/dnd/types'
import { findSpell, spellsForClass } from '@shared/dnd/spells'
import { isSpellcaster } from '@shared/dnd/calc'

interface Props {
  character: Character
  onChange: (spellsKnown: string[]) => void
}

export function SpellManager({ character, onChange }: Props): JSX.Element {
  const classSpells = spellsForClass(character.classId)
  const available = classSpells.filter((s) => !character.spellsKnown.includes(s.id))
  const [addId, setAddId] = useState(available[0]?.id ?? '')

  useEffect(() => {
    if (!available.some((s) => s.id === addId)) setAddId(available[0]?.id ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character.spellsKnown, character.classId])

  if (!isSpellcaster(character.classId)) {
    return <p className="text-xs text-fg2">Bu sınıf büyü kullanmıyor.</p>
  }

  const add = (): void => {
    if (!addId) return
    onChange([...character.spellsKnown, addId])
  }

  const remove = (id: string): void => {
    onChange(character.spellsKnown.filter((s) => s !== id))
  }

  return (
    <div>
      <div className="flex gap-2">
        <select
          value={addId}
          onChange={(e) => setAddId(e.target.value)}
          className="flex-1 border border-line bg-panel px-2 py-1.5 text-sm text-fg outline-none focus:border-accent"
        >
          {available.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.level === 0 ? 'kantrip' : `sv.${s.level}`})
            </option>
          ))}
        </select>
        <button onClick={add} className="border border-accent bg-accent px-3 py-1.5 text-xs text-accent-fg hover:bg-accent-hover">
          Ekle
        </button>
      </div>

      <div className="mt-3 space-y-1">
        {character.spellsKnown.length === 0 && <p className="text-xs text-fg2">Henüz büyü seçilmedi.</p>}
        {character.spellsKnown.map((id) => {
          const spell = findSpell(id)
          if (!spell) return null
          return (
            <div key={id} className="flex items-center gap-2 border border-line bg-panel2 px-2 py-1.5 text-sm">
              <span className="flex-1 text-fg">
                {spell.name} <span className="text-fg2">{spell.level === 0 ? '(kantrip)' : `(sv.${spell.level})`}</span>
              </span>
              <button onClick={() => remove(id)} className="border border-line px-2 text-xs text-fg2 hover:border-accent hover:text-accent">
                Sil
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
