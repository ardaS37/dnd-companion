import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { useRelationshipStore } from '../store/relationshipStore'
import { useCharacterStore } from '../store/characterStore'
import { ThemeToggle } from '../components/ThemeToggle'
import type { RelationshipGraph, RelationshipNode } from '@shared/types'

const VB_W = 800
const VB_H = 560

function emptyGraph(name: string): RelationshipGraph {
  const now = Date.now()
  return { id: crypto.randomUUID(), name, nodes: [], edges: [], createdAt: now, updatedAt: now }
}

export function RelationshipScreen(): JSX.Element {
  const goToLobby = useAppStore((s) => s.goToLobby)
  const { graphs, loaded, load, upsert, remove } = useRelationshipStore()
  const { characters, loaded: charsLoaded, load: loadChars } = useCharacterStore()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mode, setMode] = useState<'select' | 'connect'>('select')
  const [newNodeLabel, setNewNodeLabel] = useState('')
  const [newNodeCharId, setNewNodeCharId] = useState('')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [pendingSourceId, setPendingSourceId] = useState<string | null>(null)
  const [pendingTargetId, setPendingTargetId] = useState<string | null>(null)
  const [edgeLabelDraft, setEdgeLabelDraft] = useState('')

  const svgRef = useRef<SVGSVGElement>(null)
  const draggingId = useRef<string | null>(null)
  const dragMoved = useRef(false)

  useEffect(() => {
    if (!loaded) void load()
    if (!charsLoaded) void loadChars()
  }, [loaded, load, charsLoaded, loadChars])

  useEffect(() => {
    if (!selectedId && graphs.length > 0) setSelectedId(graphs[0].id)
  }, [graphs, selectedId])

  const graph = graphs.find((g) => g.id === selectedId) ?? null

  const createGraph = (): void => {
    const g = emptyGraph(`İlişki Ağı ${graphs.length + 1}`)
    void upsert(g)
    setSelectedId(g.id)
  }

  const updateGraph = (patch: Partial<RelationshipGraph>): void => {
    if (!graph) return
    void upsert({ ...graph, ...patch, updatedAt: Date.now() })
  }

  const clientToSvgPoint = (clientX: number, clientY: number): { x: number; y: number } => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const rect = svg.getBoundingClientRect()
    return {
      x: Math.max(20, Math.min(VB_W - 20, ((clientX - rect.left) / rect.width) * VB_W)),
      y: Math.max(20, Math.min(VB_H - 20, ((clientY - rect.top) / rect.height) * VB_H))
    }
  }

  const addNode = (): void => {
    if (!graph) return
    const char = characters.find((c) => c.id === newNodeCharId)
    const label = char ? char.name : newNodeLabel.trim()
    if (!label) return
    const node: RelationshipNode = {
      id: crypto.randomUUID(),
      label,
      characterId: char?.id ?? null,
      x: VB_W / 2 + (Math.random() - 0.5) * 300,
      y: VB_H / 2 + (Math.random() - 0.5) * 200
    }
    updateGraph({ nodes: [...graph.nodes, node] })
    setNewNodeLabel('')
    setNewNodeCharId('')
  }

  const removeNode = (id: string): void => {
    if (!graph) return
    updateGraph({
      nodes: graph.nodes.filter((n) => n.id !== id),
      edges: graph.edges.filter((e) => e.fromId !== id && e.toId !== id)
    })
    setSelectedNodeId(null)
  }

  const renameNode = (id: string, label: string): void => {
    if (!graph) return
    updateGraph({ nodes: graph.nodes.map((n) => (n.id === id ? { ...n, label } : n)) })
  }

  const handleNodeMouseDown = (nodeId: string, e: React.MouseEvent): void => {
    if (mode !== 'select') return
    e.stopPropagation()
    e.preventDefault()
    draggingId.current = nodeId
    dragMoved.current = false
  }

  const handleSvgMouseMove = (e: React.MouseEvent): void => {
    if (!draggingId.current || !graph) return
    const pt = clientToSvgPoint(e.clientX, e.clientY)
    dragMoved.current = true
    updateGraph({ nodes: graph.nodes.map((n) => (n.id === draggingId.current ? { ...n, x: pt.x, y: pt.y } : n)) })
  }

  const handleSvgMouseUp = (nodeId?: string): void => {
    if (nodeId && draggingId.current === nodeId && !dragMoved.current) {
      setSelectedNodeId(nodeId)
    }
    draggingId.current = null
  }

  const handleConnectClick = (nodeId: string): void => {
    if (!pendingSourceId) {
      setPendingSourceId(nodeId)
    } else if (pendingSourceId === nodeId) {
      setPendingSourceId(null)
    } else {
      setPendingTargetId(nodeId)
    }
  }

  const confirmEdge = (): void => {
    if (!graph || !pendingSourceId || !pendingTargetId) return
    updateGraph({
      edges: [
        ...graph.edges,
        { id: crypto.randomUUID(), fromId: pendingSourceId, toId: pendingTargetId, label: edgeLabelDraft.trim() || 'bağlantılı' }
      ]
    })
    setPendingSourceId(null)
    setPendingTargetId(null)
    setEdgeLabelDraft('')
  }

  const removeEdge = (id: string): void => {
    if (!graph) return
    updateGraph({ edges: graph.edges.filter((e) => e.id !== id) })
  }

  const selectedNode = graph?.nodes.find((n) => n.id === selectedNodeId) ?? null
  const sourceNode = graph?.nodes.find((n) => n.id === pendingSourceId) ?? null
  const targetNode = graph?.nodes.find((n) => n.id === pendingTargetId) ?? null

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
          {graphs.length === 0 && <p className="p-4 text-xs text-fg2">Henüz ilişki ağı yok.</p>}
          {graphs.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedId(g.id)}
              className={`flex w-full flex-col border-b border-line px-4 py-3 text-left hover:bg-panel2 ${
                selectedId === g.id ? 'bg-panel2' : ''
              }`}
            >
              <span className="text-sm font-medium text-fg">{g.name}</span>
              <span className="text-xs text-fg2">
                {g.nodes.length} kişi · {g.edges.length} bağlantı
              </span>
            </button>
          ))}
        </div>
        <div className="border-t border-line p-3">
          <button onClick={createGraph} className="w-full border border-accent bg-accent py-2 text-sm font-medium text-accent-fg hover:bg-accent-hover">
            + Yeni İlişki Ağı
          </button>
        </div>
      </div>

      {graph ? (
        <div className="flex h-full flex-col">
          <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2 text-xs">
            <input
              value={graph.name}
              onChange={(e) => updateGraph({ name: e.target.value })}
              className="border border-line bg-panel px-2 py-1 text-sm text-fg outline-none focus:border-accent"
            />
            <button
              onClick={() => {
                void remove(graph.id)
                setSelectedId(null)
              }}
              className="border border-line px-2 py-1 text-fg2 hover:border-accent hover:text-accent"
            >
              Ağı Sil
            </button>
            <button
              onClick={() => {
                setMode('select')
                setPendingSourceId(null)
                setPendingTargetId(null)
              }}
              className={`border px-2 py-1 ${mode === 'select' ? 'border-accent text-accent' : 'border-line text-fg2'}`}
            >
              Seç/Taşı
            </button>
            <button
              onClick={() => setMode('connect')}
              className={`border px-2 py-1 ${mode === 'connect' ? 'border-accent text-accent' : 'border-line text-fg2'}`}
            >
              Bağlantı Kur
            </button>
            <select
              value={newNodeCharId}
              onChange={(e) => setNewNodeCharId(e.target.value)}
              className="border border-line bg-panel2 px-1 py-1 text-fg outline-none"
            >
              <option value="">— karakterden seç —</option>
              {characters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              value={newNodeLabel}
              onChange={(e) => setNewNodeLabel(e.target.value)}
              placeholder="ya da isim yaz (NPC)"
              disabled={!!newNodeCharId}
              className="border border-line bg-panel px-2 py-1 text-fg outline-none focus:border-accent disabled:opacity-40"
            />
            <button onClick={addNode} className="border border-line px-2 py-1 text-fg2 hover:border-accent hover:text-accent">
              + Düğüm Ekle
            </button>
            {mode === 'connect' && (
              <span className="text-fg2">
                {pendingSourceId ? `${sourceNode?.label} → hedef seç` : 'Bağlanacak ilk kişiyi seç'}
              </span>
            )}
          </div>

          <div className="relative min-h-0 flex-1 overflow-hidden bg-app">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              className="h-full w-full select-none"
              onMouseMove={handleSvgMouseMove}
              onMouseUp={() => handleSvgMouseUp()}
              onMouseLeave={() => (draggingId.current = null)}
            >
              {graph.edges.map((edge) => {
                const from = graph.nodes.find((n) => n.id === edge.fromId)
                const to = graph.nodes.find((n) => n.id === edge.toId)
                if (!from || !to) return null
                const mx = (from.x + to.x) / 2
                const my = (from.y + to.y) / 2
                return (
                  <g key={edge.id} className="cursor-pointer" onClick={() => removeEdge(edge.id)}>
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#8a8d97" strokeWidth={1.5} />
                    <rect x={mx - edge.label.length * 3.2 - 4} y={my - 10} width={edge.label.length * 6.4 + 8} height={16} fill="var(--c-app)" />
                    <text x={mx} y={my + 3} textAnchor="middle" fontSize={11} fill="#8a8d97">
                      {edge.label}
                    </text>
                  </g>
                )
              })}

              {pendingSourceId && !pendingTargetId && sourceNode && (
                <circle cx={sourceNode.x} cy={sourceNode.y} r={30} fill="none" stroke="#98292a" strokeWidth={2} strokeDasharray="4,3" />
              )}

              {graph.nodes.map((node) => (
                <g
                  key={node.id}
                  onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                  onMouseUp={() => handleSvgMouseUp(node.id)}
                  onClick={() => mode === 'connect' && handleConnectClick(node.id)}
                  className="cursor-pointer"
                >
                  <circle cx={node.x} cy={node.y} r={24} fill={node.characterId ? '#7f2323' : '#3a3a3a'} stroke={selectedNodeId === node.id ? '#98292a' : 'none'} strokeWidth={3} />
                  <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize={12} fill="#f0f0f2">
                    {node.label.slice(0, 2).toUpperCase()}
                  </text>
                  <text x={node.x} y={node.y + 40} textAnchor="middle" fontSize={11} fill="#8a8d97">
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {pendingSourceId && pendingTargetId && (
            <div className="flex items-center gap-2 border-t border-line bg-panel2 px-3 py-2 text-xs">
              <span className="text-fg">
                {sourceNode?.label} → {targetNode?.label}
              </span>
              <input
                value={edgeLabelDraft}
                onChange={(e) => setEdgeLabelDraft(e.target.value)}
                placeholder="İlişki (ör. kardeşi, eski dostu, düşmanı)"
                autoFocus
                className="flex-1 border border-line bg-panel px-2 py-1 text-fg outline-none focus:border-accent"
              />
              <button onClick={confirmEdge} className="border border-accent bg-accent px-3 py-1 text-accent-fg hover:bg-accent-hover">
                Ekle
              </button>
              <button
                onClick={() => {
                  setPendingSourceId(null)
                  setPendingTargetId(null)
                }}
                className="border border-line px-3 py-1 text-fg2 hover:text-fg"
              >
                İptal
              </button>
            </div>
          )}

          {selectedNode && mode === 'select' && (
            <div className="flex items-center gap-2 border-t border-line bg-panel2 px-3 py-2 text-xs">
              <input
                value={selectedNode.label}
                onChange={(e) => renameNode(selectedNode.id, e.target.value)}
                className="border border-line bg-panel px-2 py-1 text-fg outline-none focus:border-accent"
              />
              {selectedNode.characterId && <span className="text-accent">karakter bağlantılı</span>}
              <button onClick={() => removeNode(selectedNode.id)} className="border border-line px-2 py-1 text-fg2 hover:border-accent hover:text-accent">
                Düğümü Sil
              </button>
              <button onClick={() => setSelectedNodeId(null)} className="border border-line px-2 py-1 text-fg2 hover:text-fg">
                Kapat
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <p className="text-sm text-fg2">Soldan bir ilişki ağı seç, ya da yeni bir tane oluştur.</p>
        </div>
      )}
    </div>
  )
}
