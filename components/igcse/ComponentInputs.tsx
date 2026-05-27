'use client'
import type { IGCSEComponent } from '@/lib/types'

interface Props {
  components: IGCSEComponent[]
  marks: (number | null)[]
  onChange: (index: number, value: number | null) => void
  lockedIndices?: number[]
  label?: string
  note?: string
}

function numericOnly(e: React.KeyboardEvent) {
  if (['e', 'E', '+', '-', '.', ','].includes(e.key)) e.preventDefault()
}

export default function ComponentInputs({ components, marks, onChange, lockedIndices = [], label = 'Your Marks', note }: Props) {
  const enteredCount = marks.filter(m => m !== null).length

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <label className="text-xs font-bold text-[#1a2340] uppercase tracking-widest">{label}</label>
          {note && <p className="text-xs text-[#94a3b8] mt-0.5">{note}</p>}
        </div>
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
          const pct = mark !== null ? Math.round((mark / comp.maxMark) * 100) : null

          return (
            <div key={i}>
              <div className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 transition-colors ${
                isLocked
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
                    value={mark ?? ''}
                    disabled={isLocked}
                    onKeyDown={numericOnly}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^0-9]/g, '')
                      if (raw === '') { onChange(i, null); return }
                      onChange(i, Math.min(Number(raw), comp.maxMark))
                    }}
                    placeholder="—"
                    className="w-16 text-center rounded-lg border-2 px-2 py-2 text-base font-black focus:outline-none transition-colors border-gray-200 text-[#1a2340] focus:border-[#2d7dd2]"
                  />
                  <span className="text-sm text-[#94a3b8] font-medium">/{comp.maxMark}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
