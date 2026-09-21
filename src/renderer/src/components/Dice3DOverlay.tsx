import { useEffect, useRef, useState } from 'react'
import type DiceBox from '@3d-dice/dice-box'
import { useDice3DStore } from '../store/dice3dStore'

const CONTAINER_ID = 'dice-box-root'

export function Dice3DOverlay(): JSX.Element {
  const pendingNotation = useDice3DStore((s) => s.pendingNotation)
  const nonce = useDice3DStore((s) => s.nonce)
  const clearPending = useDice3DStore((s) => s.clearPending)
  const boxRef = useRef<DiceBox | null>(null)
  const [ready, setReady] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let cancelled = false
    import('@3d-dice/dice-box')
      .then(({ default: DiceBoxCtor }) => {
        if (cancelled) return
        const box = new DiceBoxCtor({
          container: `#${CONTAINER_ID}`,
          assetPath: '/assets/dice-box/',
          theme: 'default',
          scale: 6
        })
        return box.init().then(() => {
          if (cancelled) return
          boxRef.current = box
          setReady(true)
        })
      })
      .catch((err) => {
        // 3D dice couldn't load (e.g. WASM/GPU unavailable) — text rolls keep working regardless
        console.warn('3D dice unavailable:', err)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!ready || !pendingNotation || !boxRef.current) return
    const box = boxRef.current
    setVisible(true)
    box.clear()
    box
      .roll(pendingNotation)
      .catch(() => undefined)
      .finally(() => {
        clearPending()
        window.setTimeout(() => setVisible(false), 1800)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce, ready])

  return (
    <div
      className={`pointer-events-none fixed bottom-4 right-4 z-50 border-2 border-accent bg-black shadow-lg transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ width: 320, height: 170 }}
    >
      <div id={CONTAINER_ID} className="h-full w-full" />
    </div>
  )
}
