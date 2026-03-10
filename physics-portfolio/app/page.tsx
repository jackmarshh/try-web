'use client'

import PhysicsScene from '@/components/PhysicsScene'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { useTheme } from '@/components/ThemeContext'

export default function Home() {
  const { theme } = useTheme()

  return (
    <main className="relative min-h-screen w-full overflow-hidden flex flex-col selection:bg-cyan-500/30">
       <div className="bg-layer transition-all duration-500" />
       
       {theme === 'retro' && <div className="sun transition-all duration-500" />}
       {theme === 'ocean' && (
         <>
           <div className="bubbles" />
           <div className="bubbles" />
           <div className="bubbles" />
           <div className="bubbles" />
           <div className="bubbles" />
           <div className="bubbles" />
           <div className="bubbles" />
         </>
       )}
       
       <div className="z-10 w-full items-center justify-between font-mono text-sm lg:flex p-8 absolute top-0 left-0 pointer-events-none">
          <div className="fixed left-0 top-0 flex w-full justify-center border-b border-white/10 bg-gradient-to-b from-black/50 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-white/5 lg:p-4 pointer-events-auto">
            <span className="mr-2">Physics Portfolio</span>
            <code className="font-mono font-bold opacity-70">Prototype</code>
          </div>
          
          <div className="fixed top-4 right-4 lg:static pointer-events-auto">
            <ThemeSwitcher />
          </div>

          <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-black/80 via-black/50 lg:static lg:h-auto lg:w-auto lg:bg-none pointer-events-auto">
            <a
              className="flex place-items-center gap-2 p-8 lg:p-0 hover:opacity-80 transition-opacity"
              href="https://github.com/shaohuihui"
              target="_blank"
              rel="noopener noreferrer"
            >
              By <span className="font-bold">Shaohuihui</span>
            </a>
          </div>
       </div>
       
       <PhysicsScene />
    </main>
  )
}
