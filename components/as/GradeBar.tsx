'use client'
import { useState, useEffect, useRef } from 'react'
import type { ASResult, ASGrade } from '@/lib/types'

const SEGMENT_COLORS: Record<ASGrade, string> = {
  'A': '#22c55e',
  'B': '#60a5fa',
  'C': '#fbbf24',
  'D': '#fb923c',
  'E': '#f87171',
  'U': '#e5e7eb',
}

interface Props {
  result: ASResult
  score: number
}

export default function GradeBar({ result, score }: Props) {
  const displayRanges = [...result.boundaryRanges].reverse()
  const scorePercent = Math.min(100, Math.max(0, score))

  const [pinPos, setPinPos] = useState(0)
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      const raf = requestAnimationFrame(() => setPinPos(scorePercent))
      return () => cancelAnimationFrame(raf)
    }
    setPinPos(scorePercent)
  }, [scorePercent])

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
      <label className="block text-xs font-bold text-[#1a2340] uppercase tracking-widest mb-4">
        Grade Boundary Map
      </label>

      <div className="flex mb-1.5">
        {displayRanges.map(r => (
          <div
            key={r.grade}
            className="text-center text-[11px] font-black text-[#374151]"
            style={{ flex: Math.max(r.max - r.min, 4) }}
          >
            {r.grade}
          </div>
        ))}
      </div>

      <div className="flex h-5 rounded-xl overflow-hidden gap-0.5 mb-1">
        {displayRanges.map(r => (
          <div
            key={r.grade}
            className="h-full first:rounded-l-xl last:rounded-r-xl"
            style={{ flex: Math.max(r.max - r.min, 4), backgroundColor: SEGMENT_COLORS[r.grade] }}
          />
        ))}
      </div>

      <div className="relative h-8 mb-1">
        <div
          className="absolute -translate-x-1/2 flex flex-col items-center"
          style={{
            left: `${pinPos}%`,
            transition: 'left 0.65s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#1a2340]" />
          <div className="bg-[#1a2340] text-white text-[10px] font-black px-2 py-0.5 rounded-lg mt-0.5 whitespace-nowrap shadow-sm">
            {score.toFixed(1)}
          </div>
        </div>
      </div>

      <div className="relative h-4">
        {displayRanges.slice(1).map(r => (
          <div
            key={r.grade}
            className="absolute flex flex-col items-center -translate-x-1/2"
            style={{ left: `${r.min}%` }}
          >
            <div className="w-px h-2 bg-gray-300" />
            <span className="text-[9px] text-[#94a3b8] font-semibold">{r.min}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
