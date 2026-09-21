import { useState, useRef, useEffect } from 'react'
import { useChatStore } from '../store/chatStore'
import { useDiceStore } from '../store/diceStore'
import { Icon } from './Icon'
import { parseAndRoll, rollD20Check, formatRollResult, type RollMode } from '@shared/dice/engine'

const kindColor: Record<string, string> = {
  chat: 'text-fg',
  system: 'text-fg2 italic',
  roll: 'text-accent'
}

const QUICK_DICE = [4, 6, 8, 10, 12, 20, 100]

const MODE_LABELS: Record<RollMode, string> = {
  normal: 'Normal',
  advantage: 'Avantaj',
  disadvantage: 'Dezavantaj'
}

export function ChatPanel(): JSX.Element {
  const messages = useChatStore((s) => s.messages)
  const send = useChatStore((s) => s.send)
  const pushRoll = useChatStore((s) => s.pushRoll)
  const mode = useDiceStore((s) => s.mode)
  const setMode = useDiceStore((s) => s.setMode)
  const [draft, setDraft] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages.length])

  const submit = (): void => {
    const body = draft.trim()
    if (!body) return
    send('sen', body)
    setDraft('')
  }

  const quickRoll = (sides: number): void => {
    if (sides === 20 && mode !== 'normal') {
      pushRoll(formatRollResult('Hızlı Zar', rollD20Check(0, mode)), '2d20')
      return
    }
    const result = parseAndRoll(`1d${sides}`)
    if (result) pushRoll(formatRollResult('Hızlı Zar', result), `1d${sides}`)
  }

  return (
    <div className="flex h-full flex-col bg-panel text-sm">
      <div ref={listRef} className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {messages.map((m) => (
          <div key={m.id} className={`${kindColor[m.kind]} ${m.kind === 'roll' ? 'roll-enter flex items-start gap-1' : ''}`}>
            {m.kind === 'chat' ? (
              <>
                <span className="font-semibold text-fg">{m.author}: </span>
                {m.body}
              </>
            ) : m.kind === 'roll' ? (
              <>
                <Icon name="d20" className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                <span>{m.body}</span>
              </>
            ) : (
              m.body
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 border-t border-line bg-panel2 px-2 py-1.5">
        {QUICK_DICE.map((sides) => (
          <button
            key={sides}
            onClick={() => quickRoll(sides)}
            className="flex items-center gap-1 border border-line px-2 py-1 text-xs text-fg2 hover:border-accent hover:text-accent"
          >
            {sides === 20 && <Icon name="d20" className="h-3 w-3" />}
            d{sides}
          </button>
        ))}
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as RollMode)}
          className="ml-auto border border-line bg-panel px-2 py-1 text-xs text-fg2 outline-none focus:border-accent"
        >
          {(Object.keys(MODE_LABELS) as RollMode[]).map((m) => (
            <option key={m} value={m}>
              {MODE_LABELS[m]}
            </option>
          ))}
        </select>
      </div>
      <div className="flex border-t border-line">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Mesaj yaz... (/roll 2d6+3)"
          className="flex-1 bg-panel2 px-3 py-2 text-fg placeholder:text-fg2 outline-none"
        />
        <button onClick={submit} className="px-4 text-xs uppercase tracking-wide text-fg2 hover:bg-panel2 hover:text-fg">
          Gönder
        </button>
      </div>
    </div>
  )
}
