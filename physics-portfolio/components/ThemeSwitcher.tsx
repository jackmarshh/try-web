'use client'

import { useTheme, Theme } from './ThemeContext'
import { Monitor, Droplets, Disc } from 'lucide-react'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const themes: { id: Theme; label: string; icon: React.ReactNode }[] = [
    { id: 'cyberpunk', label: 'Cyberpunk', icon: <Monitor className="w-4 h-4" /> },
    { id: 'ocean', label: 'Ocean', icon: <Droplets className="w-4 h-4" /> },
    { id: 'retro', label: 'Retro', icon: <Disc className="w-4 h-4" /> },
  ]

  return (
    <div className="flex bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20 pointer-events-auto">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
            ${theme === t.id 
              ? 'bg-white/20 text-white shadow-sm' 
              : 'text-white/60 hover:text-white hover:bg-white/10'}
          `}
        >
          {t.icon}
          <span className="hidden sm:inline">{t.label}</span>
        </button>
      ))}
    </div>
  )
}
