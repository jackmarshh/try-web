import React, { forwardRef } from 'react'
import { useTheme } from './ThemeContext'

interface PhysicsTagProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  color?: string
}

export const PhysicsTag = forwardRef<HTMLDivElement, PhysicsTagProps>(
  ({ label, color = 'bg-white/10', className = '', ...props }, ref) => {
    const { theme } = useTheme()

    // Determine styles based on theme
    let themeStyles = ''
    
    switch (theme) {
      case 'ocean':
        themeStyles = `
          bg-blue-400/10 border-blue-300/30 text-blue-100
          shadow-[inset_0_0_15px_rgba(56,189,248,0.2)]
          backdrop-blur-sm
        `
        break
      case 'retro':
        themeStyles = `
          rounded-none border-2 border-black bg-[#ffcc00] text-black
          shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
          font-bold tracking-tight font-mono
        `
        break
      case 'cyberpunk':
      default:
        themeStyles = `
          ${color} backdrop-blur-md border border-white/20 text-white
          shadow-lg
        `
        break
    }

    return (
      <div
        ref={ref}
        className={`absolute select-none cursor-grab active:cursor-grabbing
          px-6 py-3 text-base transition-all duration-500
          whitespace-nowrap z-10 flex items-center gap-2
          ${theme !== 'retro' ? 'rounded-full hover:scale-105' : 'hover:-translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:translate-x-0 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}
          ${themeStyles}
          ${className}`}
        {...props}
      >
        {theme !== 'retro' && <span className={`w-2 h-2 rounded-full ${theme === 'ocean' ? 'bg-blue-200/60 shadow-[0_0_5px_rgba(186,230,253,0.8)]' : 'bg-white/50'}`} />}
        {theme === 'retro' && <span className="w-2 h-2 bg-black" />}
        {label}
      </div>
    )
  }
)

PhysicsTag.displayName = 'PhysicsTag'
