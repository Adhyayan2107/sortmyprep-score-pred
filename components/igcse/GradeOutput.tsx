'use client'
import { useState, useEffect, useRef } from 'react'
import type { IGCSEResult, IGCSEGrade } from '@/lib/types'

const GRADE_THEMES: Record<IGCSEGrade, { gradient: string }> = {
  'A*': { gradient: 'from-emerald-400 to-green-500' },
  'A':  { gradient: 'from-green-400 to-emerald-500' },
  'B':  { gradient: 'from-blue-400 to-[#2d7dd2]' },
  'C':  { gradient: 'from-yellow-400 to-amber-400' },
  'D':  { gradient: 'from-orange-400 to-orange-500' },
  'E':  { gradient: 'from-red-400 to-red-500' },
  'F':  { gradient: 'from-red-500 to-red-600' },
  'G':  { gradient: 'from-red-600 to-rose-600' },
  'U':  { gradient: 'from-gray-400 to-gray-500' },
}

interface Props {
  result: IGCSEResult
  isPartial: boolean
}

export default function GradeOutput({ result, isPartial }: Props) {
  const { predictedGrade, conservativeGrade, optimisticGrade, weightedScore } = result
  const theme = GRADE_THEMES[predictedGrade]
  const sameRange = conservativeGrade === predictedGrade && optimisticGrade === predictedGrade
  const isTop = predictedGrade === 'A*' || predictedGrade === 'A'

  const [displayScore, setDisplayScore] = useState(0)
  const rafRef = useRef<number>(0)
  const fromRef = useRef(0)

  useEffect(() => {
    cancelAnimationFrame(rafRef.current)
    const from = fromRef.current
    const to = weightedScore
    const startTs = performance.now()
    const duration = 700

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTs) / duration)
      const ease = 1 - (1 - t) ** 3
      setDisplayScore(from + (to - from) * ease)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
      else fromRef.current = to
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [weightedScore])

  return (
    <div
      className={`rounded-2xl bg-gradient-to-br ${theme.gradient} p-6 mb-4 shadow-md`}
      style={{ animation: 'card-rise 0.38s ease forwards' }}
    >
      {isTop && (
        <div className="flex justify-center gap-2 mb-2">
          {['✦', '✦', '✦'].map((s, i) => (
            <span
              key={i}
              className="text-white text-sm"
              style={{ animation: `float-star ${0.8 + i * 0.25}s ease-in-out infinite` }}
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {isPartial && (
        <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 w-fit mb-4 text-xs font-semibold text-white">
          <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
          Partial result — not all papers entered
        </div>
      )}

      <div className="text-center">
        <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Predicted grade</p>
        <div
          key={predictedGrade}
          className="text-[96px] font-black text-white leading-none mb-1 inline-block"
          style={{ animation: 'grade-pop 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
        >
          {predictedGrade}
        </div>
        <p className="text-white/80 text-sm font-semibold mb-5">
          likely grade · {displayScore.toFixed(1)}/100
        </p>

        {!sameRange && (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="rounded-xl bg-white/15 border border-white/20 px-4 py-2 text-center">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Conservative</p>
              <p className="text-white text-xl font-black">{conservativeGrade}</p>
            </div>
            <div className="rounded-xl bg-white/30 border border-white/40 px-5 py-2.5 text-center shadow-sm">
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider">Most likely</p>
              <p className="text-white text-2xl font-black">{predictedGrade}</p>
            </div>
            <div className="rounded-xl bg-white/15 border border-white/20 px-4 py-2 text-center">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Optimistic</p>
              <p className="text-white text-xl font-black">{optimisticGrade}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
