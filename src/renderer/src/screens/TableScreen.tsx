import { DockviewReact, type DockviewReadyEvent } from 'dockview-react'
import 'dockview-react/dist/styles/dockview.css'
import { useAppStore } from '../store/appStore'
import { useThemeStore } from '../store/themeStore'
import { MapPanel } from './panels/MapPanel'
import { CharacterPanel } from './panels/CharacterPanel'
import { InitiativePanel } from './panels/InitiativePanel'
import { ChatPanel } from '../components/ChatPanel'
import { ThemeToggle } from '../components/ThemeToggle'

const components = {
  map: MapPanel,
  character: CharacterPanel,
  initiative: InitiativePanel,
  chat: ChatPanel
}

function onReady(event: DockviewReadyEvent): void {
  const { api } = event

  api.addPanel({ id: 'map', component: 'map', title: 'Harita' })
  const character = api.addPanel({
    id: 'character',
    component: 'character',
    title: 'Karakter',
    position: { direction: 'right', referencePanel: 'map' }
  })
  api.addPanel({
    id: 'initiative',
    component: 'initiative',
    title: 'Sıra Takibi',
    position: { direction: 'below', referencePanel: character.id }
  })
  api.addPanel({
    id: 'chat',
    component: 'chat',
    title: 'Sohbet & Zar Log',
    position: { direction: 'below', referencePanel: 'map' }
  })
}

export function TableScreen(): JSX.Element {
  const activeRoomName = useAppStore((s) => s.activeRoomName)
  const leaveRoom = useAppStore((s) => s.leaveRoom)
  const goToCharacters = useAppStore((s) => s.goToCharacters)
  const goToLore = useAppStore((s) => s.goToLore)
  const goToMaps = useAppStore((s) => s.goToMaps)
  const goToBestiary = useAppStore((s) => s.goToBestiary)
  const goToRelationships = useAppStore((s) => s.goToRelationships)
  const goToCompendium = useAppStore((s) => s.goToCompendium)
  const themeMode = useThemeStore((s) => s.mode)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line bg-app px-3 py-1.5">
        <div className="flex items-center gap-2">
          <button onClick={leaveRoom} className="px-2 py-1 text-xs text-fg2 hover:bg-panel2 hover:text-fg">
            ← Lobi
          </button>
          <span className="text-sm text-fg">{activeRoomName}</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button onClick={goToCharacters} className="border border-line px-2 py-1 text-xs text-fg2 hover:border-accent hover:text-accent">
            Karakterlerim
          </button>
          <button onClick={goToLore} className="border border-line px-2 py-1 text-xs text-fg2 hover:border-accent hover:text-accent">
            Hikaye Notları
          </button>
          <button onClick={goToMaps} className="border border-line px-2 py-1 text-xs text-fg2 hover:border-accent hover:text-accent">
            Haritalarım
          </button>
          <button onClick={goToBestiary} className="border border-line px-2 py-1 text-xs text-fg2 hover:border-accent hover:text-accent">
            Canavarlar
          </button>
          <button onClick={goToRelationships} className="border border-line px-2 py-1 text-xs text-fg2 hover:border-accent hover:text-accent">
            İlişkiler
          </button>
          <button onClick={goToCompendium} className="border border-line px-2 py-1 text-xs text-fg2 hover:border-accent hover:text-accent">
            Compendium
          </button>
          <ThemeToggle />
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <DockviewReact
          components={components}
          onReady={onReady}
          className={themeMode === 'dark' ? 'dockview-theme-dark h-full' : 'dockview-theme-light h-full'}
        />
      </div>
    </div>
  )
}
