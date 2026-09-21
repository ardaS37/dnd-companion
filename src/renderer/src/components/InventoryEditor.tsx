import { useEffect, useState } from 'react'
import type { Character, InventoryItem, InventoryItemKind } from '@shared/dnd/types'
import { WEAPONS, ARMOR, GEAR } from '@shared/dnd/equipment'

const KIND_LABELS: Record<InventoryItemKind, string> = {
  weapon: 'Silah',
  armor: 'Zırh',
  gear: 'Eşya'
}

function catalogFor(kind: InventoryItemKind): { id: string; name: string }[] {
  if (kind === 'weapon') return WEAPONS
  if (kind === 'armor') return ARMOR
  return GEAR
}

function itemName(item: InventoryItem): string {
  return catalogFor(item.kind).find((entry) => entry.id === item.itemId)?.name ?? item.itemId
}

interface Props {
  character: Character
  onChange: (inventory: InventoryItem[]) => void
}

export function InventoryEditor({ character, onChange }: Props): JSX.Element {
  const [addKind, setAddKind] = useState<InventoryItemKind>('weapon')
  const [addItemId, setAddItemId] = useState(WEAPONS[0].id)

  useEffect(() => {
    setAddItemId(catalogFor(addKind)[0]?.id ?? '')
  }, [addKind])

  const addItem = (): void => {
    if (!addItemId) return
    const existing = character.inventory.find((i) => i.itemId === addItemId)
    if (existing) {
      onChange(character.inventory.map((i) => (i.itemId === addItemId ? { ...i, quantity: i.quantity + 1 } : i)))
      return
    }
    onChange([...character.inventory, { itemId: addItemId, kind: addKind, quantity: 1, equipped: false }])
  }

  const setQuantity = (itemId: string, quantity: number): void => {
    if (quantity < 1) {
      onChange(character.inventory.filter((i) => i.itemId !== itemId))
      return
    }
    onChange(character.inventory.map((i) => (i.itemId === itemId ? { ...i, quantity } : i)))
  }

  const toggleEquip = (item: InventoryItem): void => {
    let next = character.inventory.map((i) => (i.itemId === item.itemId ? { ...i, equipped: !i.equipped } : i))
    const isBodyArmor = item.kind === 'armor' && item.itemId !== 'shield'
    if (!item.equipped && isBodyArmor) {
      next = next.map((i) => (i.kind === 'armor' && i.itemId !== 'shield' && i.itemId !== item.itemId ? { ...i, equipped: false } : i))
    }
    onChange(next)
  }

  const removeItem = (itemId: string): void => {
    onChange(character.inventory.filter((i) => i.itemId !== itemId))
  }

  return (
    <div>
      <div className="flex gap-2">
        {(['weapon', 'armor', 'gear'] as InventoryItemKind[]).map((k) => (
          <button
            key={k}
            onClick={() => setAddKind(k)}
            className={`border px-2 py-1 text-xs ${addKind === k ? 'border-accent text-accent' : 'border-line text-fg2'}`}
          >
            {KIND_LABELS[k]}
          </button>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <select
          value={addItemId}
          onChange={(e) => setAddItemId(e.target.value)}
          className="flex-1 border border-line bg-panel px-2 py-1.5 text-sm text-fg outline-none focus:border-accent"
        >
          {catalogFor(addKind).map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.name}
            </option>
          ))}
        </select>
        <button onClick={addItem} className="border border-accent bg-accent px-3 py-1.5 text-xs text-accent-fg hover:bg-accent-hover">
          Ekle
        </button>
      </div>

      <div className="mt-3 space-y-1">
        {character.inventory.length === 0 && <p className="text-xs text-fg2">Envanter boş.</p>}
        {character.inventory.map((item) => (
          <div key={item.itemId} className="flex items-center gap-2 border border-line bg-panel2 px-2 py-1.5 text-sm">
            {(item.kind === 'weapon' || item.kind === 'armor') && (
              <input type="checkbox" checked={item.equipped} onChange={() => toggleEquip(item)} title="Kuşanılmış" />
            )}
            <span className="flex-1 text-fg">{itemName(item)}</span>
            <button
              onClick={() => setQuantity(item.itemId, item.quantity - 1)}
              className="border border-line px-1.5 text-fg2 hover:border-accent hover:text-accent"
            >
              −
            </button>
            <span className="w-6 text-center text-fg2">{item.quantity}</span>
            <button
              onClick={() => setQuantity(item.itemId, item.quantity + 1)}
              className="border border-line px-1.5 text-fg2 hover:border-accent hover:text-accent"
            >
              +
            </button>
            <button onClick={() => removeItem(item.itemId)} className="border border-line px-2 text-xs text-fg2 hover:border-accent hover:text-accent">
              Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
