'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const THEME_STORAGE_KEY = 'theme_preference'

export type ThemeMode = 'device' | 'light' | 'dark'

interface ThemeContextType {
  themeMode: ThemeMode
  setThemeMode: (mode: ThemeMode) => void
  colorScheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark')
  const [mounted, setMounted] = useState(false)

  // Load theme preference on mount
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null
    if (stored) {
      setThemeModeState(stored)
    }
  }, [])

  const setThemeMode = (mode: ThemeMode) => {
    localStorage.setItem(THEME_STORAGE_KEY, mode)
    setThemeModeState(mode)
  }

  // Determine color scheme
  const colorScheme: 'light' | 'dark' = 
    themeMode === 'device'
      ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : themeMode

  // Apply theme to HTML element
  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('dark', colorScheme === 'dark')
    }
  }, [colorScheme, mounted])

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
