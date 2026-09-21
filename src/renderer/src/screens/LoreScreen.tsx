import { useEffect, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { useLoreStore } from '../store/loreStore'
import { useMapStore } from '../store/mapStore'
import { ThemeToggle } from '../components/ThemeToggle'
import { LORE_TYPE_LABELS, type LoreNote, type LoreNoteType } from '@shared/dnd/types'
import { generateNpc, formatNpcBody } from '@shared/dnd/npcGenerator'

const TYPES: LoreNoteType[] = ['world', 'location', 'npc', 'event', 'session']
const MAP_LINKABLE_TYPES: LoreNoteType[] = ['world', 'location']

export function LoreScreen(): JSX.Element {
  const goToLobby = useAppStore((s) => s.goToLobby)
  const { notes, loaded, load, upsert, remove } = useLoreStore()
  const { maps, loaded: mapsLoaded, load: loadMaps } = useMapStore()
  const [filter, setFilter] = useState<'all' | LoreNoteType>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [draftType, setDraftType] = useState<LoreNoteType>('world')
  const [draftTitle, setDraftTitle] = useState('')
  const [draftBody, setDraftBody] = useState('')
  const [draftMapId, setDraftMapId] = useState<string | null>(null)

  useEffect(() => {
    if (!loaded) void load()
    if (!mapsLoaded) void loadMaps()
  }, [loaded, load, mapsLoaded, loadMaps])

  const filtered = filter === 'all' ? notes : notes.filter((n) => n.type === filter)
  const selected = notes.find((n) => n.id === selectedId) ?? null

  const startNew = (): void => {
    setSelectedId(null)
    setEditing(true)
    setDraftType('world')
    setDraftTitle('')
    setDraftBody('')
    setDraftMapId(null)
  }

  const startEdit = (note: LoreNote): void => {
    setSelectedId(note.id)
    setEditing(true)
    setDraftType(note.type)
    setDraftTitle(note.title)
    setDraftBody(note.body)
    setDraftMapId(note.linkedMapId)
  }

  const generateAndEditNpc = (): void => {
    const npc = generateNpc()
    setSelectedId(null)
    setEditing(true)
    setDraftType('npc')
    setDraftTitle(npc.name)
    setDraftBody(formatNpcBody(npc))
    setDraftMapId(null)
  }

  const save = async (): Promise<void> => {
    const now = Date.now()
    const note: LoreNote = {
      id: selectedId ?? crypto.randomUUID(),
      type: draftType,
      title: draftTitle.trim() || 'İsimsiz Not',
      body: draftBody,
      linkedMapId: MAP_LINKABLE_TYPES.includes(draftType) ? draftMapId : null,
      createdAt: selected?.createdAt ?? now,
      updatedAt: now
    }
    await upsert(note)
    setSelectedId(note.id)
    setEditing(false)
  }

  const linkedMap = selected?.linkedMapId ? maps.find((m) => m.id === selected.linkedMapId) : null

  return (
    <div className="grid h-full grid-cols-[280px_1fr]">
      <div className="flex flex-col border-r border-line bg-app">
        <div className="flex items-center justify-between border-b border-line px-3 py-2">
          <button onClick={goToLobby} className="text-xs text-fg2 hover:text-fg">
            ← Lobi
          </button>
          <ThemeToggle />
        </div>
        <div className="flex flex-wrap gap-1 border-b border-line p-2">
          <button
            onClick={() => setFilter('all')}
            className={`border px-2 py-1 text-xs ${filter === 'all' ? 'border-accent text-accent' : 'border-line text-fg2'}`}
          >
            Tümü
          </button>
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`border px-2 py-1 text-xs ${filter === t ? 'border-accent text-accent' : 'border-line text-fg2'}`}
            >
              {LORE_TYPE_LABELS[t]}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && <p className="p-4 text-xs text-fg2">Bu kategoride not yok.</p>}
          {filtered.map((note) => (
            <button
              key={note.id}
              onClick={() => {
                setSelectedId(note.id)
                setEditing(false)
              }}
              className={`flex w-full flex-col border-b border-line px-4 py-3 text-left hover:bg-panel2 ${
                selectedId === note.id ? 'bg-panel2' : ''
              }`}
            >
              <span className="text-sm font-medium text-fg">{note.title}</span>
              <span className="text-xs text-fg2">{LORE_TYPE_LABELS[note.type]}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2 border-t border-line p-3">
          <button
            onClick={startNew}
            className="flex-1 border border-accent bg-accent py-2 text-sm font-medium text-accent-fg hover:bg-accent-hover"
          >
            + Yeni Not
          </button>
          <button onClick={generateAndEditNpc} className="flex-1 border border-line py-2 text-sm text-fg hover:border-accent hover:text-accent">
            🎲 NPC Üret
          </button>
        </div>
      </div>

      <div className="overflow-y-auto p-6">
        {editing ? (
          <div className="mx-auto max-w-xl space-y-3">
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setDraftType(t)}
                  className={`border px-3 py-1.5 text-xs ${
                    draftType === t ? 'border-accent bg-panel2 text-accent' : 'border-line text-fg2'
                  }`}
                >
                  {LORE_TYPE_LABELS[t]}
                </button>
              ))}
            </div>
            <input
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              placeholder="Başlık"
              className="w-full border border-line bg-panel px-3 py-2 text-fg outline-none focus:border-accent"
            />
            {MAP_LINKABLE_TYPES.includes(draftType) && maps.length > 0 && (
              <label className="block text-xs text-fg2">
                Bağlı Harita
                <select
                  value={draftMapId ?? ''}
                  onChange={(e) => setDraftMapId(e.target.value || null)}
                  className="mt-1 w-full border border-line bg-panel px-3 py-2 text-sm text-fg outline-none focus:border-accent"
                >
                  <option value="">— yok —</option>
                  {maps.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <textarea
              value={draftBody}
              onChange={(e) => setDraftBody(e.target.value)}
              rows={14}
              placeholder="Hikaye metni..."
              className="w-full border border-line bg-panel px-3 py-2 text-fg outline-none focus:border-accent"
            />
            <div className="flex gap-2">
              <button onClick={save} className="border border-accent bg-accent px-4 py-1.5 text-sm text-accent-fg hover:bg-accent-hover">
                Kaydet
              </button>
              <button
                onClick={() => setEditing(false)}
                className="border border-line px-4 py-1.5 text-sm text-fg2 hover:text-fg"
              >
                Vazgeç
              </button>
            </div>
          </div>
        ) : selected ? (
          <div className="mx-auto max-w-xl">
            <div className="mb-1 text-xs uppercase tracking-wide text-fg2">{LORE_TYPE_LABELS[selected.type]}</div>
            <div className="font-display text-lg text-fg">{selected.title}</div>
            {linkedMap && <div className="mt-1 text-xs text-accent">Bağlı harita: {linkedMap.name}</div>}
            <p className="mt-3 whitespace-pre-wrap text-sm text-fg">{selected.body || '(boş)'}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => startEdit(selected)}
                className="border border-line px-3 py-1.5 text-xs text-fg2 hover:border-accent hover:text-accent"
              >
                Düzenle
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
          </div>
        ) : (
          <p className="text-sm text-fg2">Soldan bir not seç, ya da yeni bir tane oluştur.</p>
        )}
      </div>
    </div>
  )
}
