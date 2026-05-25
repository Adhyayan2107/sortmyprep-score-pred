'use client'

import type { DiplomaResult } from '@/lib/types'

interface Props {
  result: DiplomaResult
  subjectCount: number
}

export default function DiplomaPanel({ result, subjectCount }: Props) {
  const { totalPoints, coreBonus, passes, warnings } = result
  const isIncomplete = subjectCount < 6

  if (subjectCount === 0) return null

  return (
    <div className={`bg-white rounded-2xl border-2 p-5 shadow-sm ${
      passes && !isIncomplete
        ? 'border-[#16a34a]'
        : passes && isIncomplete
        ? 'border-amber-300'
        : 'border-red-300'
    }`}>

      {/* Incomplete subjects notice */}
      {isIncomplete && (
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
          <span className="text-amber-500 text-base mt-0.5">⚠</span>
          <div>
            <p className="text-sm font-bold text-amber-800">Not all subjects added</p>
            <p className="text-xs text-amber-700 mt-0.5">
              You have {subjectCount} of 6 subjects — this summary is a partial estimate. Add your remaining{' '}
              {6 - subjectCount} subject{6 - subjectCount > 1 ? 's' : ''} for an accurate diploma total.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#1a2340] uppercase tracking-widest">Diploma Summary</h3>
          <p className="text-xs text-[#94a3b8] mt-0.5">{subjectCount}/6 subjects graded</p>
        </div>
        <div className={`px-5 py-2 rounded-xl font-black text-5xl leading-none ${
          passes ? 'bg-[#16a34a] text-white' : 'bg-[#dc2626] text-white'
        }`}>
          {totalPoints}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#f1f5f9] rounded-xl p-3 border border-gray-200">
          <p className="text-xs text-[#94a3b8] mb-1 font-semibold uppercase tracking-wider">Subject pts</p>
          <p className="font-black text-[#1a2340] text-2xl">{totalPoints - coreBonus}</p>
        </div>
        <div className="bg-[#f1f5f9] rounded-xl p-3 border border-gray-200">
          <p className="text-xs text-[#94a3b8] mb-1 font-semibold uppercase tracking-wider">Core bonus</p>
          <p className={`font-black text-2xl ${coreBonus > 0 ? 'text-[#16a34a]' : 'text-[#94a3b8]'}`}>
            +{coreBonus}
          </p>
        </div>
      </div>

      {passes && !isIncomplete ? (
        <div className="flex items-center gap-2 bg-[#f0fdf4] border border-green-200 rounded-xl px-4 py-3 text-[#16a34a]">
          <span className="text-lg font-black">✓</span>
          <span className="font-bold text-sm">Diploma awarded</span>
        </div>
      ) : passes && isIncomplete ? (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-700">
          <span className="font-bold text-sm">On track so far — add remaining subjects to confirm</span>
        </div>
      ) : (
        <div className="bg-[#fef2f2] border border-red-200 rounded-xl px-4 py-3">
          <p className="text-sm font-bold text-[#dc2626] mb-2">Diploma conditions not met</p>
          <ul className="space-y-1">
            {warnings.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-red-700">
                <span className="mt-0.5 text-red-400 font-bold">✕</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
