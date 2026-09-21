import type { RoomSummary } from '@shared/types'
import { useAppStore } from '../store/appStore'
import { ChatPanel } from '../components/ChatPanel'
import { ThemeToggle } from '../components/ThemeToggle'
import { Icon } from '../components/Icon'

const mockRooms: RoomSummary[] = [
  { id: 'r1', name: 'Kayıp Maden — Phandelver', system: 'D&D 5e', playerCount: 3, maxPlayers: 5 },
  { id: 'r2', name: 'Test Masası', system: 'D&D 5e', playerCount: 1, maxPlayers: 6 }
]

export function LobbyScreen(): JSX.Element {
  const enterRoom = useAppStore((s) => s.enterRoom)
  const goToCharacters = useAppStore((s) => s.goToCharacters)
  const goToLore = useAppStore((s) => s.goToLore)
  const goToMaps = useAppStore((s) => s.goToMaps)
  const goToBestiary = useAppStore((s) => s.goToBestiary)
  const goToRelationships = useAppStore((s) => s.goToRelationships)
  const goToCompendium = useAppStore((s) => s.goToCompendium)

  return (
    <div className="grid h-full grid-cols-[320px_1fr]">
      <div className="flex flex-col border-r border-line bg-app">
        <div className="flex items-start justify-between border-b border-line px-4 py-3">
          <div className="flex items-center gap-2">
            <Icon name="d20" className="h-6 w-6 text-accent" />
            <div>
              <h1 className="font-display text-lg text-fg">D&D Companion</h1>
              <p className="text-xs text-fg2">Yerel oturumlar · LAN desteği yakında</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <div className="grid grid-cols-3 gap-2 border-b border-line p-3 text-xs">
          <button onClick={goToCharacters} className="flex flex-col items-center gap-1 border border-line py-2 text-fg hover:border-accent hover:text-accent">
            <Icon name="sword" className="h-4 w-4" />
            Karakterlerim
          </button>
          <button onClick={goToLore} className="flex flex-col items-center gap-1 border border-line py-2 text-fg hover:border-accent hover:text-accent">
            <Icon name="quill" className="h-4 w-4" />
            Hikaye Notları
          </button>
          <button onClick={goToMaps} className="flex flex-col items-center gap-1 border border-line py-2 text-fg hover:border-accent hover:text-accent">
            <Icon name="shield" className="h-4 w-4" />
            Haritalarım
          </button>
          <button onClick={goToBestiary} className="flex flex-col items-center gap-1 border border-line py-2 text-fg hover:border-accent hover:text-accent">
            <Icon name="skull" className="h-4 w-4" />
            Canavarlar
          </button>
          <button onClick={goToRelationships} className="flex flex-col items-center gap-1 border border-line py-2 text-fg hover:border-accent hover:text-accent">
            <Icon name="campfire" className="h-4 w-4" />
            İlişkiler
          </button>
          <button onClick={goToCompendium} className="flex flex-col items-center gap-1 border border-line py-2 text-fg hover:border-accent hover:text-accent">
            <Icon name="book" className="h-4 w-4" />
            Compendium
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => enterRoom(room.name)}
              className="flex w-full flex-col border-b border-line px-4 py-3 text-left hover:bg-panel2"
            >
              <span className="text-sm font-medium text-fg">{room.name}</span>
              <span className="text-xs text-fg2">
                {room.system} · {room.playerCount}/{room.maxPlayers} oyuncu
              </span>
            </button>
          ))}
        </div>
        <div className="border-t border-line p-3">
          <button
            onClick={() => enterRoom('Yeni Masa')}
            className="w-full border border-accent bg-accent py-2 text-sm font-medium text-accent-fg hover:bg-accent-hover"
          >
            + Yeni Masa Oluştur
          </button>
          <p className="mt-2 text-center text-[10px] text-fg2">
            İkonlar: Lorc & Delapouite / game-icons.net (CC BY 3.0)
          </p>
        </div>
      </div>
      <ChatPanel />
    </div>
  )
}
