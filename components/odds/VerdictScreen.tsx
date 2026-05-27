'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { VERDICT_THEME, getVerdictCopy, getScoreDisplay, type Verdict } from '@/lib/verdict-engine'

const VERDICT_EMOJIS: Record<Verdict, { floating: string[]; burst: string[] }> = {
  COMPETITIVE: { floating: ['🎉', '🏆', '⭐', '✨', '🎊'], burst: ['🌟', '🎯', '💫', '🥳', '🎉'] },
  BORDERLINE:  { floating: ['💪', '🔥', '⚡'], burst: ['🎯', '💪', '🔥'] },
  REACH:       { floating: ['🚀', '📚', '💡'], burst: ['🚀', '📖', '💡'] },
  STRONG_REACH:{ floating: ['🎯', '💡', '📖'], burst: ['🎯', '📚', '💡'] },
}

const BURST_POSITIONS = [
  { x: -60, y: -40, delay: 0 },
  { x: 60, y: -50, delay: 0.08 },
  { x: -80, y: 10, delay: 0.12 },
  { x: 80, y: 5, delay: 0.06 },
  { x: -30, y: -70, delay: 0.04 },
  { x: 30, y: -65, delay: 0.1 },
]

export default function VerdictScreen({
  verdict,
  uniName,
  uniLocation,
  courseName,
  board,
  points,
  grade,
  backUrl,
}: {
  verdict: Verdict
  uniName: string
  uniLocation: string
  courseName: string
  board: string
  points?: string | null
  grade?: string | null
  backUrl: string
}) {
  const theme = VERDICT_THEME[verdict]
  const scoreDisplay = getScoreDisplay(board, points, grade)
  const copy = getVerdictCopy(verdict, uniName, scoreDisplay)
  const [visible, setVisible] = useState(false)
  const [burst, setBurst] = useState(false)
  const emojis = VERDICT_EMOJIS[verdict]

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true)
      if (verdict === 'COMPETITIVE' || verdict === 'BORDERLINE') {
        setTimeout(() => setBurst(true), 400)
      }
    }, 80)
    return () => clearTimeout(t)
  }, [verdict])

  return (
    <div
      className="w-full px-4 py-12 flex flex-col items-center text-center relative overflow-hidden"
      style={{ backgroundColor: theme.bg }}
    >
      {/* Floating background emojis */}
      {emojis.floating.map((e, i) => (
        <span
          key={i}
          className="absolute text-2xl pointer-events-none select-none"
          style={{
            top: `${10 + i * 16}%`,
            left: i % 2 === 0 ? `${5 + i * 3}%` : `${75 + (i % 3) * 6}%`,
            animation: `float-emoji ${2.8 + i * 0.4}s ${i * 0.5}s ease-in-out infinite`,
            opacity: 0.35,
          }}
        >
          {e}
        </span>
      ))}

      <div
        className="max-w-2xl mx-auto w-full relative"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: theme.accent }}>
          Verdict
        </p>

        {/* Verdict word with burst emojis */}
        <div className="relative inline-block">
          <h1
            className="text-5xl sm:text-7xl font-black tracking-tight mb-6"
            style={{
              color: theme.accent,
              animation: visible ? 'verdict-entrance 0.65s cubic-bezier(0.34,1.56,0.64,1) both' : 'none',
            }}
          >
            {theme.label}
          </h1>

          {/* Burst emojis for competitive/borderline */}
          {burst && verdict !== 'STRONG_REACH' && BURST_POSITIONS.slice(0, emojis.burst.length).map((pos, i) => (
            <span
              key={i}
              className="absolute top-1/2 left-1/2 text-xl pointer-events-none"
              style={{
                transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                animation: `confetti-star 0.9s ${pos.delay}s ease-out both`,
              }}
            >
              {emojis.burst[i % emojis.burst.length]}
            </span>
          ))}
        </div>

        <p className="text-white/70 text-sm sm:text-base max-w-sm mx-auto leading-relaxed mb-8">
          {copy}
        </p>

        <div
          className="inline-flex items-center gap-3 bg-white/10 rounded-2xl px-5 py-3 text-white/80 text-sm font-semibold"
          style={{ animation: visible ? 'bounce-in 0.5s 0.35s ease both' : 'none' }}
        >
          <span
            className="text-lg font-black"
            style={{
              color: theme.accent,
              animation: visible ? 'score-bounce 0.5s 0.5s ease both' : 'none',
            }}
          >
            {board === 'ib' ? `${points} pts` : grade}
          </span>
          <span className="opacity-50">·</span>
          <span>{uniName}</span>
          <span className="opacity-50">·</span>
          <span>{courseName}</span>
        </div>

        {uniLocation && (
          <p className="text-white/30 text-xs mt-3">{uniLocation}</p>
        )}
      </div>
    </div>
  )
}
