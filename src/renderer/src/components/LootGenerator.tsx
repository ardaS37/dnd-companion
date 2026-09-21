import { useState } from 'react'
import { useChatStore } from '../store/chatStore'
import { useDice3DStore } from '../store/dice3dStore'
import { LOOT_TIER_LABELS, lootTable, pickRandomItem, type LootTier } from '@shared/dnd/lootGenerator'
import { parseAndRoll } from '@shared/dice/engine'

const TIERS: LootTier[] = ['low', 'mid', 'high', 'legendary']

interface Result {
  tier: LootTier
  coins: number
  coinsExpr: string
  item: string | null
}

export function LootGenerator(): JSX.Element {
  const pushRoll = useChatStore((s) => s.pushRoll)
  const roll3D = useDice3DStore((s) => s.roll)
  const [tier, setTier] = useState<LootTier>('low')
  const [result, setResult] = useState<Result | null>(null)

  const roll = (): void => {
    const table = lootTable(tier)
    roll3D(table.dice)
    const rolled = parseAndRoll(table.dice)
    const coins = (rolled?.total ?? 0) * table.multiplier
    const hasItem = Math.random() < 0.3
    setResult({
      tier,
      coins,
      coinsExpr: `${table.dice} × ${table.multiplier}`,
      item: hasItem ? pickRandomItem() : null
    })
  }

  const sendToChat = (): void => {
    if (!result) return
    const text = result.item
      ? `Hazine (${LOOT_TIER_LABELS[result.tier]}): ${result.coins} altın + ${result.item}`
      : `Hazine (${LOOT_TIER_LABELS[result.tier]}): ${result.coins} altın`
    pushRoll(text)
  }

  return (
    <div className="mx-auto max-w-xl">
      <h2 className="font-display text-lg text-fg">Loot Üretici</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {TIERS.map((t) => (
          <button
            key={t}
            onClick={() => setTier(t)}
            className={`border px-3 py-1.5 text-xs ${tier === t ? 'border-accent bg-panel2 text-accent' : 'border-line text-fg2'}`}
          >
            {LOOT_TIER_LABELS[t]}
          </button>
        ))}
      </div>
      <button onClick={roll} className="mt-3 border border-accent bg-accent px-4 py-1.5 text-sm text-accent-fg hover:bg-accent-hover">
        Hazine Üret
      </button>

      {result && (
        <div className="mt-4 border border-line bg-panel2 p-4">
          <div className="text-sm text-fg2">{LOOT_TIER_LABELS[result.tier]}</div>
          <div className="mt-1 text-lg text-fg">{result.coins} altın</div>
          <div className="text-xs text-fg2">({result.coinsExpr})</div>
          {result.item && <div className="mt-2 text-sm text-fg">Eşya: {result.item}</div>}
          <button
            onClick={sendToChat}
            className="mt-3 border border-line px-3 py-1.5 text-xs text-fg2 hover:border-accent hover:text-accent"
          >
            Sohbete Gönder
          </button>
        </div>
      )}
    </div>
  )
}
