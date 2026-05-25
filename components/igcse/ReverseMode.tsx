'use client'
import { useState } from 'react'
import type { IGCSEComponent, IGCSESession, IGCSEGrade } from '@/lib/types'
import { calculateRequiredMark } from '@/lib/igcse-calc'

const GRADES: IGCSEGrade[] = ['A*', 'A', 'B', 'C', 'D', 'E']

const GRADE_COLORS: Partial<Record<IGCSEGrade, { bg: string; text: string }>> = {
  'A*': { bg: '#f0fdf4', text: '#16a34a' },
  'A':  { bg: '#f0fdf4', text: '#22c55e' },
  'B':  { bg: '#eff6ff', text: '#2563eb' },
  'C':  { bg: '#fefce8', text: '#854d0e' },
  'D':  { bg: '#fff7ed', text: '#c2410c' },
  'E':  { bg: '#fef2f2', text: '#dc2626' },
}

interface Props {
  components: IGCSEComponent[]
  enteredMarks: (number | null)[]
  sessions: IGCSESession[]
}

export default function ReverseMode({ components, enteredMarks, sessions }: Props) {
  const [targetGrade, setTargetGrade] = useState<IGCSEGrade>('A')
  const results = calculateRequiredMark(components, enteredMarks, targetGrade, sessions)

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm text-[#94a3b8] text-center">All papers entered — nothing left to calculate.</p>
      </div>
    )
  }

  const colors = GRADE_COLORS[targetGrade]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <label className="block text-xs font-bold text-[#1a2340] uppercase tracking-widest mb-4">Target Grade</label>

      <div className="flex gap-2 mb-5 flex-wrap">
        {GRADES.map(g => {
          const c = GRADE_COLORS[g]
          return (
            <button
              key={g}
              onClick={() => setTargetGrade(g)}
              className={`flex-1 min-w-[40px] py-2.5 rounded-xl text-sm font-black border-2 transition-all ${
                targetGrade === g
                  ? 'shadow-sm scale-105 border-transparent'
                  : 'border-gray-200 text-gray-400 hover:border-gray-300 bg-white'
              }`}
              style={targetGrade === g && c ? { backgroundColor: c.bg, color: c.text } : {}}
            >
              {g}
            </button>
          )
        })}
      </div>

      <div className="space-y-3">
        {results.map(r => (
          <div
            key={r.index}
            className={`rounded-xl border-2 p-4 flex items-center justify-between ${
              r.achievable ? 'border-[#dbeafe] bg-[#eff6ff]' : 'border-red-200 bg-[#fef2f2]'
            }`}
          >
            <div>
              <p className="text-sm font-bold text-[#1a2340]">{r.component.name}</p>
              {r.achievable && (
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  {Math.round((r.requiredMark / r.maxMark) * 100)}% of marks needed
                </p>
              )}
            </div>
            {r.achievable ? (
              <div className="text-right">
                <span className="text-3xl font-black text-[#1a2340]">{r.requiredMark}</span>
                <span className="text-sm text-[#94a3b8] ml-1">/{r.maxMark}</span>
              </div>
            ) : (
              <span className="text-sm font-bold text-[#dc2626]">Not achievable</span>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-[#94a3b8] mt-4 text-center">
        Using median boundaries across {sessions.length} sessions
      </p>
    </div>
  )
}
