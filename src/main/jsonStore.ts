import { app } from 'electron'
import { promises as fs } from 'fs'
import { join } from 'path'

interface Identifiable {
  id: string
  updatedAt: number
}

export function createJsonStore<T extends Identifiable>(folderName: string) {
  function dir(): string {
    return join(app.getPath('userData'), folderName)
  }

  async function ensureDir(): Promise<void> {
    await fs.mkdir(dir(), { recursive: true })
  }

  async function list(): Promise<T[]> {
    await ensureDir()
    const files = await fs.readdir(dir())
    const items: T[] = []

    for (const file of files) {
      if (!file.endsWith('.json')) continue
      try {
        const raw = await fs.readFile(join(dir(), file), 'utf-8')
        items.push(JSON.parse(raw) as T)
      } catch {
        // skip a corrupt file rather than failing the whole list
      }
    }

    return items.sort((a, b) => b.updatedAt - a.updatedAt)
  }

  async function save(item: T): Promise<void> {
    await ensureDir()
    await fs.writeFile(join(dir(), `${item.id}.json`), JSON.stringify(item, null, 2), 'utf-8')
  }

  async function remove(id: string): Promise<void> {
    await ensureDir()
    await fs.rm(join(dir(), `${id}.json`), { force: true })
  }

  return { list, save, remove }
}
