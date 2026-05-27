'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function OddsLanding() {
  const [count, setCount] = useState(4200)

  useEffect(() => {
    const target = 4247
    const start = 4200
    const duration = 1200
    const startTime = performance.now()
    const raf = requestAnimationFrame(function tick(now) {
      const t = Math.min((now - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(start + (target - start) * ease))
      if (t < 1) requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
          <Link href="/odds">
            <Image src="/logo.png" alt="sortmyprep" width={571} height={106} className="h-5 w-auto" />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs font-semibold text-[#2d7dd2] mb-6 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2d7dd2] animate-pulse" />
          {count.toLocaleString()}+ students have already checked
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-[#1a2340] tracking-tight leading-tight max-w-md mb-4">
          Will your grade<br />
          <span className="text-[#2d7dd2]">get you in?</span>
        </h1>

        <p className="text-[#64748b] text-sm sm:text-base max-w-sm leading-relaxed mb-10">
          Enter your predicted grade, pick your dream university and course — we'll tell you your real odds in seconds.
        </p>

        <Link
          href="/odds?step=board"
          className="inline-flex items-center gap-2 bg-[#1a2340] text-white font-bold px-8 py-4 rounded-2xl text-base shadow-lg hover:bg-[#2d7dd2] transition-colors"
          style={{ animation: 'card-rise 0.5s ease both' }}
        >
          Find Out →
        </Link>

        <div className="mt-16 grid grid-cols-3 gap-6 max-w-sm text-center">
          {[
            { label: 'Universities', value: '14+' },
            { label: 'Boards', value: '4' },
            { label: 'Instant', value: '100%' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-2xl font-black text-[#1a2340]">{value}</p>
              <p className="text-xs text-[#64748b] font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
