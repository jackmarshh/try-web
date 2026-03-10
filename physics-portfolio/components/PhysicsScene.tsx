'use client'

import React, { useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'
import { PhysicsTag } from './PhysicsTag'
import { useTheme } from './ThemeContext'
import { RefreshCw, Zap } from 'lucide-react'

const TAGS = [
  { label: 'React', color: 'bg-cyan-500/30 border-cyan-400/30' },
  { label: 'Next.js', color: 'bg-neutral-800/40 border-neutral-600/30' },
  { label: 'TypeScript', color: 'bg-blue-600/30 border-blue-500/30' },
  { label: 'Tailwind CSS', color: 'bg-sky-400/30 border-sky-300/30' },
  { label: 'Matter.js', color: 'bg-red-500/30 border-red-400/30' },
  { label: 'Framer Motion', color: 'bg-purple-500/30 border-purple-400/30' },
  { label: 'Node.js', color: 'bg-green-600/30 border-green-500/30' },
  { label: 'PostgreSQL', color: 'bg-indigo-500/30 border-indigo-400/30' },
  { label: 'Docker', color: 'bg-blue-500/30 border-blue-400/30' },
  { label: 'AWS', color: 'bg-orange-500/30 border-orange-400/30' },
  { label: 'GraphQL', color: 'bg-pink-600/30 border-pink-500/30' },
  { label: 'Prisma', color: 'bg-teal-500/30 border-teal-400/30' },
  { label: 'Rust', color: 'bg-orange-700/30 border-orange-600/30' },
  { label: 'Golang', color: 'bg-cyan-600/30 border-cyan-500/30' },
  { label: 'WebAssembly', color: 'bg-violet-600/30 border-violet-500/30' },
  { label: 'Three.js', color: 'bg-slate-700/30 border-slate-600/30' },
  { label: 'WebGL', color: 'bg-red-700/30 border-red-600/30' },
  { label: 'UI/UX', color: 'bg-rose-500/30 border-rose-400/30' },
  { label: 'Figma', color: 'bg-fuchsia-500/30 border-fuchsia-400/30' },
  { label: 'Vite', color: 'bg-yellow-500/30 border-yellow-400/30' },
  { label: 'Turborepo', color: 'bg-red-500/30 border-red-400/30' },
  { label: 'CI/CD', color: 'bg-green-500/30 border-green-400/30' },
  { label: 'Git', color: 'bg-orange-600/30 border-orange-500/30' },
  { label: 'Linux', color: 'bg-yellow-600/30 border-yellow-500/30' }
]

export default function PhysicsScene() {
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const runnerRef = useRef<Matter.Runner | null>(null)
  
  const tagRefs = useRef<(HTMLDivElement | null)[]>([])
  const bodiesRef = useRef<Matter.Body[]>([])

  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [gravityEnabled, setGravityEnabled] = useState(true)

  // Handle responsive state
  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initialize Physics Engine
  useEffect(() => {
    if (!mounted || isMobile) return

    const container = containerRef.current
    if (!container) return

    // Cleanup previous instance if any
    if (engineRef.current) {
      Matter.Engine.clear(engineRef.current)
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current)
    }

    // Create engine
    const engine = Matter.Engine.create()
    const world = engine.world
    engineRef.current = engine

    // Adjust gravity based on theme
    if (theme === 'ocean') {
        engine.gravity.y = gravityEnabled ? 0.3 : 0 // Slower gravity
    } else {
        engine.gravity.y = gravityEnabled ? 0.6 : 0
    }
    engine.gravity.x = 0
    engine.gravity.scale = 0.001

    // Create boundaries
    const ground = Matter.Bodies.rectangle(
      container.clientWidth / 2,
      container.clientHeight + 60,
      container.clientWidth * 2,
      120,
      { isStatic: true, label: 'Ground', render: { visible: false } }
    )
    const wallThickness = 100
    const leftWall = Matter.Bodies.rectangle(
      -wallThickness / 2,
      container.clientHeight / 2,
      wallThickness,
      container.clientHeight * 4,
      { isStatic: true, label: 'LeftWall', render: { visible: false } }
    )
    const rightWall = Matter.Bodies.rectangle(
      container.clientWidth + wallThickness / 2,
      container.clientHeight / 2,
      wallThickness,
      container.clientHeight * 4,
      { isStatic: true, label: 'RightWall', render: { visible: false } }
    )
    // Ceiling (useful for zero gravity)
    const ceiling = Matter.Bodies.rectangle(
        container.clientWidth / 2,
        -container.clientHeight * 2, // Way up high initially
        container.clientWidth * 2,
        100,
        { isStatic: true, label: 'Ceiling', render: { visible: false } }
    )

    Matter.World.add(world, [ground, leftWall, rightWall, ceiling])

    // Create bodies for tags
    const bodies: Matter.Body[] = []
    TAGS.forEach((tag, index) => {
      const el = tagRefs.current[index]
      if (el) {
        // Force a layout read to ensure we have correct dimensions after theme change
        const width = el.offsetWidth
        const height = el.offsetHeight
        
        // Random starting position above the screen
        const x = Math.random() * (container.clientWidth - width) + width / 2
        const y = -Math.random() * container.clientHeight * 1.5 - 100

        // Physics properties based on theme
        let chamferRadius = height / 2
        let frictionAir = 0.02
        let restitution = 0.5

        if (theme === 'ocean') {
            frictionAir = 0.05 // Water resistance
            restitution = 0.8 // Bouncy
            chamferRadius = height / 2 // Capsule
        } else if (theme === 'retro') {
            chamferRadius = 0 // Sharp corners
            restitution = 0.2 // Heavy/Solid
            frictionAir = 0.01
        }

        const body = Matter.Bodies.rectangle(x, y, width, height, {
          chamfer: { radius: chamferRadius },
          restitution: restitution,
          friction: 0.5,
          frictionAir: frictionAir,
          plugin: { tagIndex: index }
        })
        bodies.push(body)
      }
    })
    
    bodiesRef.current = bodies
    Matter.World.add(world, bodies)

    // Mouse control
    const mouse = Matter.Mouse.create(container)
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    })
    
    // Allow scrolling if not dragging body
    mouseConstraint.mouse.element.removeEventListener("mousewheel", (mouseConstraint.mouse as any).mousewheel);
    mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", (mouseConstraint.mouse as any).mousewheel);

    Matter.World.add(world, mouseConstraint)

    // Run the engine
    const runner = Matter.Runner.create()
    runnerRef.current = runner
    Matter.Runner.run(runner, engine)

    // Sync loop
    let animationFrameId: number
    const update = () => {
      if (!engineRef.current) return

      bodies.forEach((body) => {
        // Theme-specific dynamic behaviors
        if (theme === 'ocean') {
            // Apply gentle random force for water turbulence
            // Only apply if moving slowly to prevent adding energy to fast moving objects
            if (body.speed < 2) {
                Matter.Body.applyForce(body, body.position, {
                    x: (Math.random() - 0.5) * 0.0005,
                    y: (Math.random() - 0.5) * 0.0002 - 0.0001 // Slight upward drift bias
                })
            }
        }

        const index = body.plugin.tagIndex
        const el = tagRefs.current[index]
        if (el) {
          const { x, y } = body.position
          const angle = body.angle
          el.style.transform = `translate3d(${x - el.offsetWidth / 2}px, ${y - el.offsetHeight / 2}px, 0) rotate(${angle}rad)`
          el.style.visibility = 'visible'
        }
      })
      
      animationFrameId = requestAnimationFrame(update)
    }
    
    update()

    // Handle resize
    const handleResize = () => {
        if (!container) return
        
        Matter.Body.setPosition(ground, {
            x: container.clientWidth / 2,
            y: container.clientHeight + 60
        })
        Matter.Body.setPosition(rightWall, {
            x: container.clientWidth + wallThickness / 2,
            y: container.clientHeight / 2
        })
        Matter.Body.setPosition(ceiling, {
            x: container.clientWidth / 2,
            y: -container.clientHeight // Bring ceiling closer if needed, but let's keep it high for now
        })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current)
      if (engineRef.current) Matter.Engine.clear(engineRef.current)
      engineRef.current = null
      runnerRef.current = null
    }
  }, [mounted, isMobile, gravityEnabled, theme])

  // Explode function
  const handleExplode = () => {
    if (!engineRef.current) return
    const bodies = bodiesRef.current
    const container = containerRef.current
    if (!container) return

    const centerX = container.clientWidth / 2
    const centerY = container.clientHeight / 2

    bodies.forEach(body => {
      const forceMagnitude = 0.05 * body.mass
      const angle = Math.atan2(body.position.y - centerY, body.position.x - centerX)
      
      Matter.Body.applyForce(body, body.position, {
        x: Math.cos(angle) * forceMagnitude,
        y: Math.sin(angle) * forceMagnitude
      })
    })
  }

  const toggleGravity = () => {
    setGravityEnabled(!gravityEnabled)
  }

  if (!mounted) return <div className="w-full h-screen bg-transparent" />
  
  if (isMobile) {
    return (
      <div className="w-full min-h-screen p-8 flex flex-wrap gap-3 content-start justify-center pt-32">
        {TAGS.map((tag) => (
          <PhysicsTag 
            key={tag.label}
            label={tag.label}
            color={tag.color}
            className="relative transform-none !top-auto !left-auto m-1"
            style={{ position: 'relative', visibility: 'visible' }}
          />
        ))}
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-transparent cursor-default">
      {TAGS.map((tag, index) => (
        <PhysicsTag
          key={tag.label}
          label={tag.label}
          color={tag.color}
          ref={(el) => { tagRefs.current[index] = el }}
          style={{ 
            left: 0, 
            top: 0, 
            position: 'absolute',
            visibility: 'hidden',
            willChange: 'transform'
          }}
        />
      ))}
      
      {/* Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-20 pointer-events-none">
         <button 
           onClick={handleExplode}
           className="pointer-events-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full font-medium transition-all active:scale-95 flex items-center gap-2 border border-white/20"
         >
           <Zap className="w-4 h-4" />
           Explode
         </button>
         <button 
           onClick={toggleGravity}
           className="pointer-events-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full font-medium transition-all active:scale-95 flex items-center gap-2 border border-white/20"
         >
           <RefreshCw className={`w-4 h-4 transition-transform ${!gravityEnabled ? 'rotate-180' : ''}`} />
           {gravityEnabled ? 'Zero Gravity' : 'Enable Gravity'}
         </button>
      </div>
      
      <div className="absolute bottom-2 left-0 right-0 text-center text-white/30 text-sm pointer-events-none">
        Drag to throw • Click buttons to interact
      </div>
    </div>
  )
}
