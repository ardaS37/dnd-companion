import { create } from 'zustand'
import type { ChatMessage } from '@shared/types'
import { parseAndRoll, formatRollResult } from '@shared/dice/engine'
import { useDice3DStore } from './dice3dStore'

interface ChatState {
  messages: ChatMessage[]
  send: (author: string, body: string) => void
  pushSystem: (body: string) => void
  pushRoll: (text: string, notation?: string) => void
}

let counter = 0
const nextId = (): string => `${Date.now()}-${counter++}`

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      id: nextId(),
      author: 'sistem',
      body: 'Lobiye hoş geldin. Bu sohbet ileride LAN/online oda senkronizasyonuna bağlanacak. Zar atmak için /roll 2d6+3 yaz.',
      kind: 'system',
      timestamp: Date.now()
    }
  ],
  send: (author, body) => {
    const trimmed = body.trim()
    const rollMatch = trimmed.match(/^\/(roll|r)\s+(.+)/i)

    if (rollMatch) {
      const expr = rollMatch[2]
      const result = parseAndRoll(expr)
      if (!result) {
        set((state) => ({
          messages: [
            ...state.messages,
            { id: nextId(), author: 'sistem', body: `Geçersiz zar ifadesi: "${expr}"`, kind: 'system', timestamp: Date.now() }
          ]
        }))
        return
      }
      useDice3DStore.getState().roll(result.expression)
      set((state) => ({
        messages: [
          ...state.messages,
          { id: nextId(), author, body: formatRollResult(author, result), kind: 'roll', timestamp: Date.now() }
        ]
      }))
      return
    }

    set((state) => ({
      messages: [...state.messages, { id: nextId(), author, body: trimmed, kind: 'chat', timestamp: Date.now() }]
    }))
  },
  pushSystem: (body) =>
    set((state) => ({
      messages: [...state.messages, { id: nextId(), author: 'sistem', body, kind: 'system', timestamp: Date.now() }]
    })),
  pushRoll: (text, notation) => {
    if (notation) useDice3DStore.getState().roll(notation)
    set((state) => ({
      messages: [...state.messages, { id: nextId(), author: 'zar', body: text, kind: 'roll', timestamp: Date.now() }]
    }))
  }
}))
