'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// ── Decorative outline cliparts ────────────────────────────────
function GradCap({ w = 56, style }: { w?: number; style?: React.CSSProperties }) {
  return (
    <svg
      aria-hidden="true"
      width={w} height={w}
      viewBox="0 0 56 56"
      fill="none"
      stroke="#1a2340"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ pointerEvents: 'none', userSelect: 'none', ...style }}
    >
      {/* flat board top */}
      <path d="M28 7 L52 19 L28 31 L4 19 Z" />
      {/* hemisphere body */}
      <path d="M14 25 L14 42 Q14 50 28 50 Q42 50 42 42 L42 25" />
      {/* tassel string + bob */}
      <line x1="52" y1="19" x2="52" y2="34" />
      <circle cx="52" cy="37" r="2.5" />
    </svg>
  )
}

function OpenBook({ w = 56, style }: { w?: number; style?: React.CSSProperties }) {
  return (
    <svg
      aria-hidden="true"
      width={w} height={Math.round(w * 0.86)}
      viewBox="0 0 56 48"
      fill="none"
      stroke="#1a2340"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ pointerEvents: 'none', userSelect: 'none', ...style }}
    >
      {/* left page */}
      <path d="M4 8 C4 8 14 6 28 10 L28 44 C28 44 16 40 4 42 Z" />
      {/* right page */}
      <path d="M52 8 C52 8 42 6 28 10 L28 44 C28 44 40 40 52 42 Z" />
      {/* text lines — left */}
      <line x1="10" y1="18" x2="22" y2="16" />
      <line x1="10" y1="24" x2="22" y2="22" />
      <line x1="10" y1="30" x2="22" y2="28" />
      {/* text lines — right */}
      <line x1="34" y1="16" x2="46" y2="18" />
      <line x1="34" y1="22" x2="46" y2="24" />
      <line x1="34" y1="28" x2="46" y2="30" />
    </svg>
  )
}

function StarShape({ w = 38, style }: { w?: number; style?: React.CSSProperties }) {
  return (
    <svg
      aria-hidden="true"
      width={w} height={w}
      viewBox="0 0 38 38"
      fill="none"
      stroke="#1a2340"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ pointerEvents: 'none', userSelect: 'none', ...style }}
    >
      <path d="M19 3 L22.5 13.5 L34 13.5 L25 20 L28.5 31 L19 24.5 L9.5 31 L13 20 L4 13.5 L15.5 13.5 Z" />
    </svg>
  )
}

function PencilShape({ w = 44, style }: { w?: number; style?: React.CSSProperties }) {
  return (
    <svg
      aria-hidden="true"
      width={w} height={w}
      viewBox="0 0 44 44"
      fill="none"
      stroke="#1a2340"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ pointerEvents: 'none', userSelect: 'none', ...style }}
    >
      {/* body */}
      <path d="M38 8 L42 12 L14 40 L10 36 Z" />
      {/* eraser cap */}
      <path d="M38 8 L34 4 L30 8 L34 12 Z" />
      {/* pointed tip */}
      <path d="M10 36 L7 42 L13 40 Z" />
      {/* wood/graphite divider near tip */}
      <line x1="12" y1="38" x2="16" y2="34" />
    </svg>
  )
}

function TrophyShape({ w = 48, style }: { w?: number; style?: React.CSSProperties }) {
  return (
    <svg
      aria-hidden="true"
      width={w} height={w}
      viewBox="0 0 48 52"
      fill="none"
      stroke="#1a2340"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ pointerEvents: 'none', userSelect: 'none', ...style }}
    >
      {/* cup body */}
      <path d="M10 4 L38 4 L36 28 Q36 36 24 36 Q12 36 12 28 Z" />
      {/* left handle */}
      <path d="M10 8 Q2 8 2 18 Q2 24 10 24" />
      {/* right handle */}
      <path d="M38 8 Q46 8 46 18 Q46 24 38 24" />
      {/* stem + base */}
      <line x1="24" y1="36" x2="24" y2="42" />
      <line x1="16" y1="42" x2="32" y2="42" />
      <line x1="14" y1="47" x2="34" y2="47" />
    </svg>
  )
}

// ── Live student count ─────────────────────────────────────────
function getLiveCount(): number {
  const BASE = 4247
  const BASE_DATE = new Date('2025-01-01').getTime()
  const daysSince = Math.max(0, Math.floor((Date.now() - BASE_DATE) / 86_400_000))
  return BASE + daysSince * 9
}


// ── Main component ─────────────────────────────────────────────
export default function OddsLanding() {
  const target = getLiveCount()
  const start  = Math.max(4247, target - 47)
  const [count, setCount] = useState(start)
  const [wiggle, setWiggle] = useState(false)

  useEffect(() => {
    const duration = 1400
    const startTime = performance.now()
    const raf = requestAnimationFrame(function tick(now) {
      const t    = Math.min((now - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(start + (target - start) * ease))  // eslint-disable-line react-hooks/exhaustive-deps
      if (t < 1) requestAnimationFrame(tick)
    })

    const w1 = setTimeout(() => { setWiggle(true);  setTimeout(() => setWiggle(false), 700) }, 2200)
    const w2 = setTimeout(() => { setWiggle(true);  setTimeout(() => setWiggle(false), 700) }, 5000)

    return () => { cancelAnimationFrame(raf); clearTimeout(w1); clearTimeout(w2) }
  }, [])

  return (
    <div className="relative min-h-screen bg-[#f1f5f9] flex flex-col overflow-hidden">

      {/* ── Page-level background cliparts (large, low opacity, static) ── */}
      <GradCap
        w={160}
        style={{ opacity: 0.06, position: 'absolute', top: 72, right: -52, transform: 'rotate(14deg)' }}
      />
      <OpenBook
        w={140}
        style={{ opacity: 0.05, position: 'absolute', bottom: 80, left: -42, transform: 'rotate(-8deg)' }}
      />
      <TrophyShape
        w={96}
        style={{ opacity: 0.05, position: 'absolute', top: '52%', right: -28, transform: 'rotate(6deg)' }}
      />

      {/* ── Header ── */}
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
            {/* Dotted crown */}
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

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">

        {/* Live count badge */}
        <div
          className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs font-semibold text-[#2d7dd2] mb-6 shadow-sm"
          style={{ animation: 'bounce-in 0.5s ease both' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#2d7dd2] animate-pulse" />
          {count.toLocaleString()}+ students have already checked
        </div>

        {/* Headline with floating outline cliparts */}
        <div className="relative">
          {/* left-top: graduation cap */}
          <GradCap
            w={50}
            style={{
              opacity: 0.14,
              position: 'absolute',
              top: '-4px',
              left: '-64px',
              animation: 'float-emoji 3.2s 0s ease-in-out infinite',
            }}
          />
          {/* right-top: star */}
          <StarShape
            w={36}
            style={{
              opacity: 0.14,
              position: 'absolute',
              top: '18px',
              right: '-54px',
              animation: 'float-emoji 2.8s 0.6s ease-in-out infinite',
            }}
          />
          {/* left-bottom: open book */}
          <OpenBook
            w={48}
            style={{
              opacity: 0.13,
              position: 'absolute',
              top: '68px',
              left: '-60px',
              animation: 'float-emoji 3.5s 1.2s ease-in-out infinite',
            }}
          />
          {/* right-bottom: pencil */}
          <PencilShape
            w={40}
            style={{
              opacity: 0.13,
              position: 'absolute',
              top: '80px',
              right: '-56px',
              animation: 'float-emoji 2.6s 0.3s ease-in-out infinite',
            }}
          />

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
          Enter your predicted grade, pick your dream university and course — we&apos;ll tell you your real odds in seconds.
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
