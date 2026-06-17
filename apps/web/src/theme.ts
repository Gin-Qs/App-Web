import { useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'
const KEY = 'fleeter-theme'

export function getTheme(): Theme {
  return (document.documentElement.dataset.theme as Theme) || 'dark'
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* ignore storage failures */
  }
  window.dispatchEvent(new CustomEvent('themechange', { detail: theme }))
}

/** Subscribe to the current theme; updates when the toggle fires. */
export function useTheme(): [Theme, (t: Theme) => void] {
  const [theme, setLocal] = useState<Theme>(getTheme)
  useEffect(() => {
    const handler = () => setLocal(getTheme())
    window.addEventListener('themechange', handler)
    return () => window.removeEventListener('themechange', handler)
  }, [])
  return [theme, setTheme]
}
