import { useEffect, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { useMapStore } from '../store/mapStore'
import { MapCanvas } from '../components/MapCanvas'
import { ThemeToggle } from '../components/ThemeToggle'
import type { GameMap } from '@shared/types'

export function MapsScreen(): JSX.Element {
  const goToLobby = useAppStore((s) => s.goToLobby)
  const { maps, activeMapId, loaded, load, upsert, remove, setActive } = useMapStore()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (!loaded) void load()
  }, [loaded, load])

  useEffect(() => {
    if (!selectedId && maps.length > 0) setSelectedId(maps[0].id)
  }, [maps, selectedId])

  const selected = maps.find((m) => m.id === selectedId) ?? null

  const createMap = (): void => {
    const now = Date.now()
    const map: GameMap = {
      id: crypto.randomUUID(),
      name: `Harita ${maps.length + 1}`,
      imageDataUrl: null,
      cols: 20,
      rows: 15,
      fogEnabled: false,
      revealedCells: [],
      tokens: [],
      createdAt: now,
      updatedAt: now
    }
    void upsert(map)
    setSelectedId(map.id)
  }

  return (
    <div className="grid h-full grid-cols-[260px_1fr]">
      <div className="flex flex-col border-r border-line bg-app">
        <div className="flex items-center justify-between border-b border-line px-3 py-2">
          <button onClick={goToLobby} className="text-xs text-fg2 hover:text-fg">
            ← Lobi
          </button>
          <ThemeToggle />
        </div>
        <div className="flex-1 overflow-y-auto">
          {maps.length === 0 && <p className="p-4 text-xs text-fg2">Henüz harita yok. Aşağıdan yeni bir harita oluştur.</p>}
          {maps.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedId(m.id)}
              className={`flex w-full flex-col border-b border-line px-4 py-3 text-left hover:bg-panel2 ${
                selectedId === m.id ? 'bg-panel2' : ''
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-medium text-fg">
                {m.name}
                {activeMapId === m.id && <span className="border border-accent px-1 text-[10px] uppercase text-accent">aktif</span>}
              </span>
              <span className="text-xs text-fg2">
                {m.cols}×{m.rows} · {m.tokens.length} token
              </span>
            </button>
          ))}
        </div>
        <div className="border-t border-line p-3">
          <button
            onClick={createMap}
            className="w-full border border-accent bg-accent py-2 text-sm font-medium text-accent-fg hover:bg-accent-hover"
          >
            + Yeni Harita
          </button>
        </div>
      </div>

      {selected ? (
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2">
            <input
              value={selected.name}
              onChange={(e) => void upsert({ ...selected, name: e.target.value, updatedAt: Date.now() })}
              className="border border-line bg-panel px-2 py-1 text-sm text-fg outline-none focus:border-accent"
            />
            <label className="flex items-center gap-1 text-xs text-fg2">
              Sütun
              <input
                type="number"
                min={5}
                max={60}
                value={selected.cols}
                onChange={(e) => void upsert({ ...selected, cols: Math.max(5, Number(e.target.value) || 5), updatedAt: Date.now() })}
                className="w-14 border border-line bg-panel px-1 py-1 text-fg outline-none focus:border-accent"
              />
            </label>
            <label className="flex items-center gap-1 text-xs text-fg2">
              Satır
              <input
                type="number"
                min={5}
                max={60}
                value={selected.rows}
                onChange={(e) => void upsert({ ...selected, rows: Math.max(5, Number(e.target.value) || 5), updatedAt: Date.now() })}
                className="w-14 border border-line bg-panel px-1 py-1 text-fg outline-none focus:border-accent"
              />
            </label>
            <button
              onClick={() => setActive(selected.id)}
              disabled={activeMapId === selected.id}
              className="border border-accent bg-accent px-3 py-1.5 text-xs text-accent-fg hover:bg-accent-hover disabled:opacity-30"
            >
              Aktif Harita Yap
            </button>
            <button
              onClick={() => {
                void remove(selected.id)
                setSelectedId(null)
              }}
              className="border border-line px-3 py-1.5 text-xs text-fg2 hover:border-accent hover:text-accent"
            >
              Sil
            </button>
          </div>
          <div className="min-h-0 flex-1">
            <MapCanvas map={selected} onChange={(map) => void upsert(map)} />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <p className="text-sm text-fg2">Soldan bir harita seç, ya da yeni bir tane oluştur.</p>
        </div>
      )}
    </div>
  )
}
