'use client'
import { useEffect, useRef } from 'react'

const COLORS = [
  '#7c3aed','#1a2340','#2d7dd2','#f59e0b',
  '#10b981','#ec4899','#f97316','#06b6d4',
  '#a3e635','#fb7185','#fbbf24','#34d399',
]

interface Particle {
  x: number; y: number; vx: number; vy: number
  color: string; w: number; h: number
  rotation: number; vr: number; opacity: number
}

interface Props {
  active: boolean
  originY?: number
}

export default function Confetti({ active, originY }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const cx = canvas.width / 2
    const cy = originY ?? canvas.height * 0.46

    const particles: Particle[] = Array.from({ length: 120 }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = 5 + Math.random() * 18
      return {
        x: cx + (Math.random() - 0.5) * 60,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 7,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        w: 7 + Math.random() * 10,
        h: 4 + Math.random() * 5,
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        opacity: 1,
      }
    })

    let startTs = 0

    const animate = (ts: number) => {
      if (!startTs) startTs = ts
      const elapsed = ts - startTs
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = false

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.4
        p.vx *= 0.98
        p.rotation += p.vr
        if (elapsed > 1600) p.opacity = Math.max(0, p.opacity - 0.026)
        if (p.opacity <= 0) continue
        alive = true
        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      }

      rafRef.current = alive ? requestAnimationFrame(animate) : 0
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [active, originY])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[200]"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
