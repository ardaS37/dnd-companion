import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Image as KonvaImage, Rect, Line, Circle, Text, Group } from 'react-konva'
import type Konva from 'konva'
import type { GameMap, Token } from '@shared/types'
import { useThemeStore } from '../store/themeStore'

const CELL_PX = 48
const TOKEN_COLORS = ['#7f2323', '#2b5f8a', '#2b7a4b', '#8a6d2b', '#5b3a8a', '#3a3a3a']
const ACCENT_COLOR = '#98292a'

type Mode = 'select' | 'fog' | 'measure'

function useHtmlImage(src: string | null): HTMLImageElement | null {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  useEffect(() => {
    if (!src) {
      setImg(null)
      return
    }
    const image = new window.Image()
    image.onload = () => setImg(image)
    image.src = src
    return () => {
      image.onload = null
    }
  }, [src])
  return img
}

function cellKey(x: number, y: number): string {
  return `${x},${y}`
}

interface Props {
  map: GameMap
  onChange: (map: GameMap) => void
}

export function MapCanvas({ map, onChange }: Props): JSX.Element {
  const [mode, setMode] = useState<Mode>('select')
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null)
  const [measureStart, setMeasureStart] = useState<{ x: number; y: number } | null>(null)
  const [measureEnd, setMeasureEnd] = useState<{ x: number; y: number } | null>(null)
  const bgImage = useHtmlImage(map.imageDataUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const themeMode = useThemeStore((s) => s.mode)
  const gridColor = themeMode === 'dark' ? '#2c2e35' : '#d2cfc6'
  const fgColor = themeMode === 'dark' ? '#eef0f2' : '#18181a'

  const width = map.cols * CELL_PX
  const height = map.rows * CELL_PX
  const revealed = new Set(map.revealedCells)
  const selectedToken = map.tokens.find((t) => t.id === selectedTokenId) ?? null

  const updateMap = (patch: Partial<GameMap>): void => {
    onChange({ ...map, ...patch, updatedAt: Date.now() })
  }

  const addToken = (): void => {
    const color = TOKEN_COLORS[map.tokens.length % TOKEN_COLORS.length]
    const token: Token = {
      id: crypto.randomUUID(),
      name: `Token ${map.tokens.length + 1}`,
      x: Math.floor(map.cols / 2),
      y: Math.floor(map.rows / 2),
      size: 1,
      color,
      hidden: false
    }
    updateMap({ tokens: [...map.tokens, token] })
    setSelectedTokenId(token.id)
  }

  const updateToken = (id: string, patch: Partial<Token>): void => {
    updateMap({ tokens: map.tokens.map((t) => (t.id === id ? { ...t, ...patch } : t)) })
  }

  const removeToken = (id: string): void => {
    updateMap({ tokens: map.tokens.filter((t) => t.id !== id) })
    setSelectedTokenId(null)
  }

  const toggleFogCell = (x: number, y: number): void => {
    const key = cellKey(x, y)
    const next = revealed.has(key) ? map.revealedCells.filter((k) => k !== key) : [...map.revealedCells, key]
    updateMap({ revealedCells: next })
  }

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>): void => {
    const stage = e.target.getStage()
    const pos = stage?.getPointerPosition()
    if (!pos) return
    const cellX = Math.floor(pos.x / CELL_PX)
    const cellY = Math.floor(pos.y / CELL_PX)

    if (mode === 'fog') {
      toggleFogCell(cellX, cellY)
    } else if (mode === 'measure') {
      setMeasureStart({ x: pos.x, y: pos.y })
      setMeasureEnd({ x: pos.x, y: pos.y })
    } else if (e.target === stage) {
      setSelectedTokenId(null)
    }
  }

  const handleStageMouseMove = (e: Konva.KonvaEventObject<MouseEvent>): void => {
    if (mode !== 'measure' || !measureStart) return
    const stage = e.target.getStage()
    const pos = stage?.getPointerPosition()
    if (pos) setMeasureEnd(pos)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateMap({ imageDataUrl: reader.result as string })
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const measureDistance =
    measureStart && measureEnd
      ? Math.hypot((measureEnd.x - measureStart.x) / CELL_PX, (measureEnd.y - measureStart.y) / CELL_PX)
      : 0

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-line bg-panel2 px-2 py-1.5 text-xs">
        {(['select', 'fog', 'measure'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`border px-2 py-1 ${mode === m ? 'border-accent text-accent' : 'border-line text-fg2'}`}
          >
            {m === 'select' ? 'Seç/Taşı' : m === 'fog' ? 'Sis Boya' : 'Ölçüm'}
          </button>
        ))}
        <button onClick={addToken} className="border border-accent bg-accent px-2 py-1 text-accent-fg hover:bg-accent-hover">
          + Token
        </button>
        <button
          onClick={() => updateMap({ fogEnabled: !map.fogEnabled })}
          className={`border px-2 py-1 ${map.fogEnabled ? 'border-accent text-accent' : 'border-line text-fg2'}`}
        >
          Sis {map.fogEnabled ? 'Açık' : 'Kapalı'}
        </button>
        <button onClick={() => fileInputRef.current?.click()} className="border border-line px-2 py-1 text-fg2 hover:border-accent hover:text-accent">
          Harita Resmi Yükle
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        <span className="ml-auto text-fg2">
          {map.cols}×{map.rows} kare
        </span>
      </div>

      <div className="relative min-h-0 flex-1 overflow-auto bg-app">
        <Stage
          width={width}
          height={height}
          onMouseDown={handleStageMouseDown}
          onMouseMove={handleStageMouseMove}
        >
          <Layer listening={false}>
            {bgImage && <KonvaImage image={bgImage} width={width} height={height} />}
            {Array.from({ length: map.cols + 1 }).map((_, i) => (
              <Line key={`v${i}`} points={[i * CELL_PX, 0, i * CELL_PX, height]} stroke={gridColor} strokeWidth={1} />
            ))}
            {Array.from({ length: map.rows + 1 }).map((_, i) => (
              <Line key={`h${i}`} points={[0, i * CELL_PX, width, i * CELL_PX]} stroke={gridColor} strokeWidth={1} />
            ))}
          </Layer>

          {map.fogEnabled && (
            <Layer listening={false}>
              {Array.from({ length: map.cols }).map((_, x) =>
                Array.from({ length: map.rows }).map((_, y) => {
                  if (revealed.has(cellKey(x, y))) return null
                  return (
                    <Rect
                      key={cellKey(x, y)}
                      x={x * CELL_PX}
                      y={y * CELL_PX}
                      width={CELL_PX}
                      height={CELL_PX}
                      fill="#0a0a0a"
                      opacity={0.88}
                    />
                  )
                })
              )}
            </Layer>
          )}

          <Layer>
            {map.tokens.map((token) => {
              const radius = (token.size * CELL_PX) / 2 - 3
              const cx = token.x * CELL_PX + (token.size * CELL_PX) / 2
              const cy = token.y * CELL_PX + (token.size * CELL_PX) / 2
              return (
                <Group
                  key={token.id}
                  x={cx}
                  y={cy}
                  draggable={mode === 'select'}
                  opacity={token.hidden ? 0.4 : 1}
                  onClick={() => mode === 'select' && setSelectedTokenId(token.id)}
                  onDragEnd={(e) => {
                    const snappedX = Math.round((e.target.x() - (token.size * CELL_PX) / 2) / CELL_PX)
                    const snappedY = Math.round((e.target.y() - (token.size * CELL_PX) / 2) / CELL_PX)
                    const clampedX = Math.max(0, Math.min(map.cols - token.size, snappedX))
                    const clampedY = Math.max(0, Math.min(map.rows - token.size, snappedY))
                    e.target.position({
                      x: clampedX * CELL_PX + (token.size * CELL_PX) / 2,
                      y: clampedY * CELL_PX + (token.size * CELL_PX) / 2
                    })
                    updateToken(token.id, { x: clampedX, y: clampedY })
                  }}
                >
                  <Circle
                    radius={radius}
                    fill={token.color}
                    stroke={selectedTokenId === token.id ? ACCENT_COLOR : 'transparent'}
                    strokeWidth={3}
                  />
                  <Text
                    text={token.name.slice(0, 2).toUpperCase()}
                    fontSize={14}
                    fill="white"
                    width={radius * 2}
                    height={radius * 2}
                    offsetX={radius}
                    offsetY={radius}
                    align="center"
                    verticalAlign="middle"
                  />
                  {token.maxHp !== undefined && (
                    <Text
                      text={`${token.currentHp ?? token.maxHp}/${token.maxHp}`}
                      fontSize={10}
                      fill={fgColor}
                      y={radius + 4}
                      offsetX={radius}
                      width={radius * 2}
                      align="center"
                    />
                  )}
                </Group>
              )
            })}
          </Layer>

          {mode === 'measure' && measureStart && measureEnd && (
            <Layer listening={false}>
              <Line points={[measureStart.x, measureStart.y, measureEnd.x, measureEnd.y]} stroke={ACCENT_COLOR} strokeWidth={2} dash={[6, 4]} />
              <Text
                text={`${Math.round(measureDistance * 5)}ft`}
                x={measureEnd.x + 8}
                y={measureEnd.y + 8}
                fontSize={13}
                fill={ACCENT_COLOR}
              />
            </Layer>
          )}
        </Stage>
      </div>

      {selectedToken && (
        <div className="flex flex-wrap items-center gap-2 border-t border-line bg-panel2 px-3 py-2 text-xs">
          <input
            value={selectedToken.name}
            onChange={(e) => updateToken(selectedToken.id, { name: e.target.value })}
            className="w-32 border border-line bg-panel px-2 py-1 text-fg outline-none focus:border-accent"
          />
          <label className="flex items-center gap-1 text-fg2">
            Boyut
            <input
              type="number"
              min={1}
              max={4}
              value={selectedToken.size}
              onChange={(e) => updateToken(selectedToken.id, { size: Math.max(1, Number(e.target.value) || 1) })}
              className="w-12 border border-line bg-panel px-1 py-1 text-fg outline-none focus:border-accent"
            />
          </label>
          <label className="flex items-center gap-1 text-fg2">
            HP
            <input
              type="number"
              value={selectedToken.currentHp ?? ''}
              placeholder="—"
              onChange={(e) => updateToken(selectedToken.id, { currentHp: e.target.value === '' ? undefined : Number(e.target.value) })}
              className="w-14 border border-line bg-panel px-1 py-1 text-fg outline-none focus:border-accent"
            />
            /
            <input
              type="number"
              value={selectedToken.maxHp ?? ''}
              placeholder="—"
              onChange={(e) => updateToken(selectedToken.id, { maxHp: e.target.value === '' ? undefined : Number(e.target.value) })}
              className="w-14 border border-line bg-panel px-1 py-1 text-fg outline-none focus:border-accent"
            />
          </label>
          <button
            onClick={() => updateToken(selectedToken.id, { hidden: !selectedToken.hidden })}
            className="border border-line px-2 py-1 text-fg2 hover:border-accent hover:text-accent"
          >
            {selectedToken.hidden ? 'Gizli' : 'Görünür'}
          </button>
          <button
            onClick={() => removeToken(selectedToken.id)}
            className="border border-line px-2 py-1 text-fg2 hover:border-accent hover:text-accent"
          >
            Sil
          </button>
        </div>
      )}
    </div>
  )
}
