import { useEffect } from 'react'
import { useAppStore } from './store/appStore'
import { useThemeStore } from './store/themeStore'
import { LobbyScreen } from './screens/LobbyScreen'
import { TableScreen } from './screens/TableScreen'
import { CharactersScreen } from './screens/CharactersScreen'
import { LoreScreen } from './screens/LoreScreen'
import { MapsScreen } from './screens/MapsScreen'
import { BestiaryScreen } from './screens/BestiaryScreen'
import { RelationshipScreen } from './screens/RelationshipScreen'
import { CompendiumScreen } from './screens/CompendiumScreen'
import { Dice3DOverlay } from './components/Dice3DOverlay'

function App(): JSX.Element {
  const screen = useAppStore((s) => s.screen)
  const themeMode = useThemeStore((s) => s.mode)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode)
  }, [themeMode])

  return (
    <div className="h-screen w-screen overflow-hidden">
      {screen === 'lobby' && <LobbyScreen />}
      {screen === 'table' && <TableScreen />}
      {screen === 'characters' && <CharactersScreen />}
      {screen === 'lore' && <LoreScreen />}
      {screen === 'maps' && <MapsScreen />}
      {screen === 'bestiary' && <BestiaryScreen />}
      {screen === 'relationships' && <RelationshipScreen />}
      {screen === 'compendium' && <CompendiumScreen />}
      <Dice3DOverlay />
    </div>
  )
}

export default App
