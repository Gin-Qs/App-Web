import { useTheme } from '../theme'

export function ThemeToggle() {
  const [theme, set] = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <button
      className="btn btn-ghost theme-toggle"
      onClick={() => set(next)}
      aria-label={`Cambiar a tema ${next === 'dark' ? 'oscuro' : 'claro'}`}
      title={`Tema ${theme === 'dark' ? 'oscuro' : 'claro'}`}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
