'use client'

import type { TOKEEGrade, IBCoreMatrix } from '@/lib/types'

const GRADES: TOKEEGrade[] = ['A', 'B', 'C', 'D', 'E']

interface Props {
  matrix: IBCoreMatrix
  tokGrade: TOKEEGrade | null
  eeGrade: TOKEEGrade | null
  onTokChange: (g: TOKEEGrade | null) => void
  onEeChange: (g: TOKEEGrade | null) => void
}

export default function CoreCalculator({ matrix, tokGrade, eeGrade, onTokChange, onEeChange }: Props) {
  const bonus = tokGrade && eeGrade ? matrix.matrix[tokGrade][eeGrade] : null
  const isFail = bonus === 'fail'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 mb-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-xs font-bold text-[#1a2340] uppercase tracking-widest w-24 shrink-0">TOK / EE</p>

        <div className="flex flex-1 gap-3">
          <div className="flex-1">
            <p className="text-xs text-[#94a3b8] mb-1.5 font-semibold">TOK</p>
            <div className="flex gap-1">
              {GRADES.map(g => (
                <button
                  key={g}
                  onClick={() => onTokChange(tokGrade === g ? null : g)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                    tokGrade === g
                      ? g === 'E'
                        ? 'bg-red-500 text-white border-red-500 shadow-sm'
                        : 'bg-[#1a2340] text-white border-[#1a2340] shadow-sm'
                      : 'border-gray-200 text-[#94a3b8] hover:border-[#2d7dd2] hover:text-[#374151] bg-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <p className="text-xs text-[#94a3b8] mb-1.5 font-semibold">EE</p>
            <div className="flex gap-1">
              {GRADES.map(g => (
                <button
                  key={g}
                  onClick={() => onEeChange(eeGrade === g ? null : g)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                    eeGrade === g
                      ? g === 'E'
                        ? 'bg-red-500 text-white border-red-500 shadow-sm'
                        : 'bg-[#1a2340] text-white border-[#1a2340] shadow-sm'
                      : 'border-gray-200 text-[#94a3b8] hover:border-[#2d7dd2] hover:text-[#374151] bg-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Bonus chip */}
          <div className="flex items-end pb-0.5">
            {bonus !== null ? (
              <div className={`rounded-xl px-4 py-2 text-sm font-black shadow-sm ${
                isFail
                  ? 'bg-red-100 text-red-600 border-2 border-red-200'
                  : 'bg-[#f0fdf4] text-[#16a34a] border-2 border-green-200'
              }`}>
                {isFail ? 'FAIL' : `+${bonus}`}
              </div>
            ) : (
              <div className="rounded-xl px-4 py-2 text-sm font-black bg-gray-100 text-gray-400 border-2 border-gray-200">
                +?
              </div>
            )}
          </div>
        </div>
      </div>

      {isFail && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mt-3">
          E in TOK or EE — diploma not awarded regardless of points total
        </p>
      )}
    </div>
  )
}
