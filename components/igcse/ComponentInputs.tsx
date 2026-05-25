'use client'
import type { IGCSEComponent } from '@/lib/types'

interface Props {
  components: IGCSEComponent[]
  marks: (number | null)[]
  onChange: (index: number, value: number | null) => void
  lockedIndices?: number[]
}

export default function ComponentInputs({ components, marks, onChange, lockedIndices = [] }: Props) {
  const enteredCount = marks.filter(m => m !== null).length

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <label className="text-xs font-bold text-[#1a2340] uppercase tracking-widest">Your Marks</label>
        {enteredCount > 0 && enteredCount < components.length && (
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            {enteredCount}/{components.length} papers
          </span>
        )}
      </div>

      <div className="space-y-3">
        {components.map((comp, i) => {
          const isLocked = lockedIndices.includes(i)
          const mark = marks[i]
          const isError = mark !== null && (mark < 0 || mark > comp.maxMark)
          const pct = mark !== null ? Math.round((mark / comp.maxMark) * 100) : null

          return (
            <div key={i}>
              <div className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 transition-colors ${
                isError
                  ? 'border-red-300 bg-red-50'
                  : isLocked
                  ? 'border-gray-100 bg-gray-50'
                  : 'border-gray-200 hover:border-[#2d7dd2]/40 bg-white'
              }`}>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${isLocked ? 'text-gray-400' : 'text-[#1a2340]'}`}>
                    {comp.name}
                  </p>
                  <p className="text-xs text-[#94a3b8] mt-0.5">
                    Weight: <span className="font-semibold">{Math.round(comp.weight * 100)}%</span>
                    {pct !== null && !isLocked && (
                      <span className="ml-2 text-[#2d7dd2] font-semibold">{pct}%</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    min={0}
                    max={comp.maxMark}
                    disabled={isLocked}
                    value={mark ?? ''}
                    onChange={e => onChange(i, e.target.value === '' ? null : Number(e.target.value))}
                    placeholder="—"
                    className={`w-16 text-center rounded-lg border-2 px-2 py-2 text-base font-black focus:outline-none transition-colors ${
                      isLocked
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : isError
                        ? 'border-red-400 bg-red-50 text-red-700'
                        : 'border-gray-200 text-[#1a2340] focus:border-[#2d7dd2]'
                    }`}
                  />
                  <span className="text-sm text-[#94a3b8] font-medium">/{comp.maxMark}</span>
                </div>
              </div>
              {isError && (
                <p className="text-xs text-red-500 mt-1 ml-4">Max is {comp.maxMark}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
