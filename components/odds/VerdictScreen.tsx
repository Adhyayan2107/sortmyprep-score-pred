'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { VERDICT_THEME, getVerdictCopy, getScoreDisplay, type Verdict } from '@/lib/verdict-engine'

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

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="w-full px-4 py-12 flex flex-col items-center text-center"
      style={{ backgroundColor: theme.bg }}
    >
      <div
        className="max-w-2xl mx-auto w-full"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        <div className="flex items-center justify-between mb-8">
          <Link href={backUrl} className="text-sm font-bold opacity-60 hover:opacity-100 transition-opacity" style={{ color: theme.accent }}>
            ← Back
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest opacity-40 text-white">
            {uniName} · {courseName}
          </span>
          <div className="w-12" />
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: theme.accent }}>
          Verdict
        </p>

        <h1
          className="text-5xl sm:text-7xl font-black tracking-tight mb-6"
          style={{
            color: theme.accent,
            animation: visible ? 'grade-pop 0.55s cubic-bezier(0.34,1.56,0.64,1) both' : 'none',
          }}
        >
          {theme.label}
        </h1>

        <p className="text-white/70 text-sm sm:text-base max-w-sm mx-auto leading-relaxed mb-8">
          {copy}
        </p>

        <div
          className="inline-flex items-center gap-3 bg-white/10 rounded-2xl px-5 py-3 text-white/80 text-sm font-semibold"
        >
          <span className="text-lg font-black" style={{ color: theme.accent }}>
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
