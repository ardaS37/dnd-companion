import { useThemeStore } from '../store/themeStore'

export function ThemeToggle(): JSX.Element {
  const mode = useThemeStore((s) => s.mode)
  const toggle = useThemeStore((s) => s.toggle)

  return (
    <button
      onClick={toggle}
      title={mode === 'dark' ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
      className="border border-line px-2 py-1 text-xs uppercase tracking-wide text-fg2 hover:border-fg2 hover:text-fg"
    >
      {mode === 'dark' ? 'Aydınlık' : 'Karanlık'}
    </button>
  )
}
