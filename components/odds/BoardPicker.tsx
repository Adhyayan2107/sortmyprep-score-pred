'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const BOARDS = [
  {
    id: 'ib',
    label: 'IB',
    full: 'International Baccalaureate',
    icon: '🌍',
    desc: 'Score out of 45',
  },
  {
    id: 'alevel',
    label: 'A Level',
    full: 'Cambridge A Level',
    icon: '📘',
    desc: 'Grades A*–E',
  },
  {
    id: 'igcse',
    label: 'IGCSE',
    full: 'Cambridge IGCSE',
    icon: '📗',
    desc: 'Grades A*–G',
  },
  {
    id: 'as',
    label: 'AS Level',
    full: 'Cambridge AS Level',
    icon: '📙',
    desc: 'Grades A–E',
  },
]

export default function BoardPicker() {
  const router = useRouter()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [clickedId, setClickedId] = useState<string | null>(null)

  const handleClick = (id: string) => {
    setClickedId(id)
    setTimeout(() => router.push(`/odds?step=grades&board=${id}`), 220)
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/odds" className="text-xs font-bold text-[#64748b] hover:text-[#1a2340] transition-colors">← Back</Link>
          <Link href="/odds"><Image src="/logo.png" alt="sortmyprep" width={571} height={106} className="h-5 w-auto" /></Link>
          <span className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest">Step 1 of 3</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1
          className="text-2xl sm:text-3xl font-black text-[#1a2340] mb-2 text-center"
          style={{ animation: 'bounce-in 0.5s ease both' }}
        >
          Which board are you on?
        </h1>
        <p
          className="text-[#64748b] text-sm text-center mb-10"
          style={{ animation: 'slide-up-fade 0.5s 0.1s ease both' }}
        >
          We'll match your grade format to university offer requirements.
        </p>

        <div className="grid grid-cols-2 gap-4">
          {BOARDS.map((b, i) => (
            <button
              key={b.id}
              onClick={() => handleClick(b.id)}
              onMouseEnter={() => setHoveredId(b.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`bg-white border-2 rounded-2xl p-6 flex flex-col items-center text-center transition-all group cursor-pointer${BOARDS.length % 2 !== 0 && i === BOARDS.length - 1 ? ' col-span-2 max-w-[calc(50%-0.5rem)] mx-auto w-full' : ''} ${
                clickedId === b.id
                  ? 'border-[#1a2340] bg-[#1a2340] shadow-xl scale-95'
                  : hoveredId === b.id
                  ? 'border-[#2d7dd2] shadow-lg scale-105'
                  : 'border-gray-200 hover:shadow-md'
              }`}
              style={{
                animation: `bounce-in 0.45s ${i * 0.08}s ease both`,
                transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease, border-color 0.15s ease, background-color 0.15s ease',
              }}
            >
              <span
                className="text-3xl block mb-3"
                style={{
                  display: 'inline-block',
                  animation: hoveredId === b.id ? 'float-emoji 1s ease-in-out infinite' : 'none',
                }}
              >
                {b.icon}
              </span>
              <p className={`font-black text-lg transition-colors ${clickedId === b.id ? 'text-white' : 'text-[#1a2340] group-hover:text-[#2d7dd2]'}`}>
                {b.label}
              </p>
              <p className={`text-xs mt-0.5 font-medium transition-colors ${clickedId === b.id ? 'text-white/70' : 'text-[#64748b]'}`}>
                {b.full}
              </p>
              <p className={`text-xs mt-2 transition-colors ${clickedId === b.id ? 'text-white/50' : 'text-[#94a3b8]'}`}>
                {b.desc}
              </p>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
