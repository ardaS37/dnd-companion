import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { is } from './is'
import { listCharacters, saveCharacter, deleteCharacter } from './characterStore'
import { listLoreNotes, saveLoreNote, deleteLoreNote } from './loreStore'
import { listMaps, saveMap, deleteMap } from './mapStore'
import { listCustomMonsters, saveCustomMonster, deleteCustomMonster } from './monsterStore'
import { listRelationshipGraphs, saveRelationshipGraph, deleteRelationshipGraph } from './relationshipStore'
import type { Character, LoreNote } from '../shared/dnd/types'
import type { GameMap, RelationshipGraph } from '../shared/types'
import type { CustomMonster } from '../shared/dnd/monsters'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#15161c',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  ipcMain.handle('characters:list', () => listCharacters())
  ipcMain.handle('characters:save', (_event, character: Character) => saveCharacter(character))
  ipcMain.handle('characters:delete', (_event, id: string) => deleteCharacter(id))

  ipcMain.handle('lore:list', () => listLoreNotes())
  ipcMain.handle('lore:save', (_event, note: LoreNote) => saveLoreNote(note))
  ipcMain.handle('lore:delete', (_event, id: string) => deleteLoreNote(id))

  ipcMain.handle('maps:list', () => listMaps())
  ipcMain.handle('maps:save', (_event, map: GameMap) => saveMap(map))
  ipcMain.handle('maps:delete', (_event, id: string) => deleteMap(id))

  ipcMain.handle('monsters:list', () => listCustomMonsters())
  ipcMain.handle('monsters:save', (_event, monster: CustomMonster) => saveCustomMonster(monster))
  ipcMain.handle('monsters:delete', (_event, id: string) => deleteCustomMonster(id))

  ipcMain.handle('relationships:list', () => listRelationshipGraphs())
  ipcMain.handle('relationships:save', (_event, graph: RelationshipGraph) => saveRelationshipGraph(graph))
  ipcMain.handle('relationships:delete', (_event, id: string) => deleteRelationshipGraph(id))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
