import { create } from 'zustand'

const STORAGE_KEY = 'solbebe-theme'

const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
  } catch {
    // ignore
  }
  return 'light'
}

export const useThemeStore = create((set, get) => ({
  theme: getInitialTheme(), // 'light' | 'dark'

  setTheme: (theme) => {
    if (theme !== 'light' && theme !== 'dark') return

    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // ignore
    }

    set({ theme })
  },

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    get().setTheme(next)
  },
}))



