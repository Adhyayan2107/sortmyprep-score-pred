'use client'
import type { ALevelComponent, ALevelSession, ALevelGrade } from '@/lib/types'
import { calculateALevelRequiredMark } from '@/lib/alevel-calc'

interface Props {
  components: ALevelComponent[]
  enteredMarks: (number | null)[]
  sessions: ALevelSession[]
  targetGrade: ALevelGrade
}

export default function ReverseMode({ components, enteredMarks, sessions, targetGrade }: Props) {
  const results = calculateALevelRequiredMark(components, enteredMarks, targetGrade, sessions)

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm text-[#94a3b8] text-center">All papers entered — nothing left to calculate.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
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
