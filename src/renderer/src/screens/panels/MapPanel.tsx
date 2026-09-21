import { useEffect } from 'react'
import { useMapStore } from '../../store/mapStore'
import { useAppStore } from '../../store/appStore'
import { MapCanvas } from '../../components/MapCanvas'

export function MapPanel(): JSX.Element {
  const { maps, activeMapId, loaded, load, upsert } = useMapStore()
  const goToMaps = useAppStore((s) => s.goToMaps)

  useEffect(() => {
    if (!loaded) void load()
  }, [loaded, load])

  const active = maps.find((m) => m.id === activeMapId) ?? null

  if (!active) {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-2 bg-app bg-[linear-gradient(var(--c-line)_1px,transparent_1px),linear-gradient(90deg,var(--c-line)_1px,transparent_1px)] bg-[size:40px_40px]"
      >
        <p className="border border-line bg-panel px-3 py-1.5 text-sm text-fg2">Aktif harita yok.</p>
        <button
          onClick={goToMaps}
          className="border border-accent bg-accent px-3 py-1.5 text-xs text-accent-fg hover:bg-accent-hover"
        >
          Harita Oluştur
        </button>
      </div>
    )
  }

  return <MapCanvas map={active} onChange={(map) => void upsert(map)} />
}
