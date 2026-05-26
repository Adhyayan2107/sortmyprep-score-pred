'use client'
import type { Board } from '@/lib/types'

interface Props {
  active: Board
  onChange: (board: Board) => void
}

export default function BoardSwitcher({ active, onChange }: Props) {
  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
      {([
        { key: 'igcse', label: 'IGCSE' },
        { key: 'as', label: 'AS Level' },
        { key: 'ib', label: 'IB Diploma' },
      ] as { key: Board; label: string }[]).map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
            active === key
              ? 'bg-[#1a2340] text-white shadow-sm'
              : 'text-gray-500 hover:text-[#1a2340]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
