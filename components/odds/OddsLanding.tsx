'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const FLOATING_EMOJIS = [
  { emoji: '🎯', delay: '0s', duration: '3.2s', top: '-8px', side: 'left' as const, offset: '-44px' },
  { emoji: '✨', delay: '0.6s', duration: '2.8s', top: '24px', side: 'right' as const, offset: '-48px' },
  { emoji: '🎓', delay: '1.2s', duration: '3.5s', top: '60px', side: 'left' as const, offset: '-36px' },
  { emoji: '⭐', delay: '0.3s', duration: '2.5s', top: '80px', side: 'right' as const, offset: '-32px' },
]

function getLiveCount(): number {
  // Base count at launch, grows ~9/day from 2025-01-01
  const BASE = 4247
  const BASE_DATE = new Date('2025-01-01').getTime()
  const daysSince = Math.max(0, Math.floor((Date.now() - BASE_DATE) / 86_400_000))
  return BASE + daysSince * 9
}

export default function OddsLanding() {
  const target = getLiveCount()
  const start = Math.max(4247, target - 47)
  const [count, setCount] = useState(start)
  const [wiggle, setWiggle] = useState(false)

  useEffect(() => {
    const duration = 1400
    const startTime = performance.now()
    const raf = requestAnimationFrame(function tick(now) {
      const t = Math.min((now - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(start + (target - start) * ease))  // eslint-disable-line react-hooks/exhaustive-deps
      if (t < 1) requestAnimationFrame(tick)
    })

    const wiggleTimer = setTimeout(() => {
      setWiggle(true)
      setTimeout(() => setWiggle(false), 700)
    }, 2200)

    const wiggleTimer2 = setTimeout(() => {
      setWiggle(true)
      setTimeout(() => setWiggle(false), 700)
    }, 5000)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(wiggleTimer)
      clearTimeout(wiggleTimer2)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col overflow-hidden">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/odds">
            <Image
              src="/logo.png"
              alt="sortmyprep"
              width={571}
              height={106}
              className="h-5 w-auto"
              style={{ animation: 'slide-up-fade 0.4s ease both' }}
            />
          </Link>
          <a
            href="https://sortmyprep.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center bg-[#1a2340] text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-[#2d7dd2] transition-colors"
            style={{ animation: 'slide-up-fade 0.45s 0.15s ease both, nav-shake 3.8s 2.5s ease infinite' }}
          >
            {/* Dotted crown — sits right on the top-right edge of the pill */}
            <span
              className="absolute flex items-end gap-[2px] pointer-events-none"
              style={{
                bottom: 'calc(100% - 8px)',
                right: '-3px',
                transform: 'rotate(41deg)',
                transformOrigin: 'bottom right',
              }}
            >
              <span className="w-[4px] h-[4px] rounded-full bg-[#2d7dd2]" />
              <span className="w-[4px] h-[7px] rounded-full bg-[#2d7dd2]" />
              <span className="w-[4px] h-[4px] rounded-full bg-[#2d7dd2]" />
            </span>
            sortmyprep.com
          </a>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs font-semibold text-[#2d7dd2] mb-6 shadow-sm"
          style={{ animation: 'bounce-in 0.5s ease both' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#2d7dd2] animate-pulse" />
          {count.toLocaleString()}+ students have already checked
        </div>

        {/* Headline with floating emojis */}
        <div className="relative">
          {FLOATING_EMOJIS.map((fe, i) => (
            <span
              key={i}
              className="absolute text-xl pointer-events-none select-none"
              style={{
                top: fe.top,
                [fe.side]: fe.offset,
                animation: `float-emoji ${fe.duration} ${fe.delay} ease-in-out infinite`,
              }}
            >
              {fe.emoji}
            </span>
          ))}

          <h1
            className="text-4xl sm:text-5xl font-black text-[#1a2340] tracking-tight leading-tight max-w-md mb-4"
            style={{ animation: 'bounce-in 0.55s 0.1s ease both' }}
          >
            Will your grade<br />
            <span className="text-[#2d7dd2]">get you in?</span>
          </h1>
        </div>

        <p
          className="text-[#64748b] text-sm sm:text-base max-w-sm leading-relaxed mb-10"
          style={{ animation: 'slide-up-fade 0.5s 0.22s ease both' }}
        >
          Enter your predicted grade, pick your dream university and course — we'll tell you your real odds in seconds.
        </p>

        <Link
          href="/odds?step=board"
          className="inline-flex items-center gap-2 bg-[#1a2340] text-white font-bold px-8 py-4 rounded-2xl text-base hover:bg-[#2d7dd2] transition-colors"
          style={{
            animation: wiggle
              ? 'wiggle-attention 0.6s ease, btn-breathe 2.4s ease infinite'
              : 'bounce-in 0.55s 0.32s cubic-bezier(0.34,1.56,0.64,1) both, btn-breathe 2.4s 1.2s ease infinite',
          }}
        >
          Find Out →
        </Link>

        <a
          href="https://tinyurl.com/sortmyprepwaitlist"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-14 w-full max-w-sm block rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-transform"
          style={{ animation: 'bounce-in 0.5s 0.5s ease both' }}
        >
          <div className="bg-[#1a2340] px-6 pt-5 pb-4 text-left">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Now Open — Free Waitlist
            </p>
            <p className="text-white font-black text-lg leading-snug mb-1">
              Prep smarter.<br />Get into your dream uni.
            </p>
            <p className="text-white/55 text-xs leading-relaxed">
              Real mark schemes, past papers &amp; expert study plans for A Level, IB, IGCSE and more.
            </p>
          </div>
          <div className="bg-[#2d7dd2] px-6 py-3 flex items-center justify-between">
            <span className="text-white font-bold text-sm">Join the Waitlist →</span>
            <span className="text-white/70 text-xs">tinyurl.com/sortmyprepwaitlist</span>
          </div>
        </a>
      </main>
    </div>
  )
}
