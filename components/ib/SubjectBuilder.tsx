'use client'
import { useState } from 'react'
import type { IBSubjectData, Level } from '@/lib/types'

const IB_SUBJECTS: { label: string; file: string; levels: Level[] }[] = [
  { label: 'Maths AA', file: 'maths-aa', levels: ['HL', 'SL'] },
  { label: 'Maths AI', file: 'maths-ai', levels: ['HL', 'SL'] },
  { label: 'Physics', file: 'physics', levels: ['HL', 'SL'] },
  { label: 'Chemistry', file: 'chemistry', levels: ['HL', 'SL'] },
  { label: 'Biology', file: 'biology', levels: ['HL', 'SL'] },
  { label: 'Economics', file: 'economics', levels: ['HL', 'SL'] },
  { label: 'History', file: 'history', levels: ['HL', 'SL'] },
  { label: 'English A', file: 'english-a', levels: ['HL'] },
]

export interface SelectedSubject {
  data: IBSubjectData
  level: Level
  file: string
}

interface Props {
  selected: SelectedSubject[]
  onAdd: (subject: SelectedSubject) => void
  onRemove: (index: number) => void
}

export default function SubjectBuilder({ selected, onAdd, onRemove }: Props) {
  const [chosen, setChosen] = useState('')
  const [adding, setAdding] = useState(false)

  const hlCount = selected.filter(s => s.level === 'HL').length

  const availableOptions: { value: string; label: string; wouldExceedHL: boolean }[] = []
  for (const s of IB_SUBJECTS) {
    for (const level of s.levels) {
      const alreadyAdded = selected.some(sel => sel.file === s.file && sel.level === level)
      if (!alreadyAdded) {
        availableOptions.push({
          value: `${s.file}|${level}`,
          label: `${s.label} ${level}`,
          wouldExceedHL: level === 'HL' && hlCount >= 3,
        })
      }
    }
  }

  const canAdd = !!chosen && !adding && selected.length < 6 && !(chosen.endsWith('|HL') && hlCount >= 3)

  const handleAdd = async () => {
    if (!canAdd) return
    const [file, level] = chosen.split('|') as [string, Level]
    setAdding(true)
    const data = await import(`@/data/ib/${file}-${level.toLowerCase()}.json`)
    onAdd({ data: data.default as IBSubjectData, level, file })
    setChosen('')
    setAdding(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <label className="text-xs font-bold text-[#1a2340] uppercase tracking-widest">Subjects</label>
        <div className="flex gap-2 ml-auto">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            selected.length >= 6 ? 'bg-[#1a2340] text-white' : 'bg-[#dbeafe] text-[#1d4ed8]'
          }`}>
            {selected.length}/6 subjects
          </span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            hlCount >= 3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {hlCount}/3 HL
          </span>
        </div>
      </div>

      {selected.length < 6 && availableOptions.length > 0 && (
        <div className="flex gap-2">
          <select
            value={chosen}
            onChange={e => setChosen(e.target.value)}
            className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1a2340] focus:outline-none focus:border-[#2d7dd2] transition-colors cursor-pointer appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '18px',
              paddingRight: '40px',
            }}
          >
            <option value="">Choose subject + level…</option>
            {availableOptions.map(opt => (
              <option key={opt.value} value={opt.value} disabled={opt.wouldExceedHL}>
                {opt.label}{opt.wouldExceedHL ? ' (HL limit reached)' : ''}
              </option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              canAdd
                ? 'bg-[#2d7dd2] text-white hover:bg-[#1e6bbf] shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {adding ? '…' : '+ Add'}
          </button>
        </div>
      )}

      {hlCount >= 3 && chosen.endsWith('|HL') && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl mt-3">
          Max 3 HL subjects — select SL instead
        </p>
      )}

      {selected.length >= 6 && (
        <p className="text-xs text-[#94a3b8] mt-2 text-center">All 6 subject slots filled</p>
      )}
    </div>
  )
}
