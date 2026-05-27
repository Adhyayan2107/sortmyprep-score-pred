'use client'
import Image from 'next/image'
import Link from 'next/link'
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
    id: 'ap',
    label: 'AP',
    full: 'Advanced Placement (US)',
    icon: '🇺🇸',
    desc: 'Scores 1–5',
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
        <h1 className="text-2xl sm:text-3xl font-black text-[#1a2340] mb-2 text-center">
          Which board are you on?
        </h1>
        <p className="text-[#64748b] text-sm text-center mb-10">
          We'll match your grade format to university offer requirements.
        </p>

        <div className="grid grid-cols-2 gap-4">
          {BOARDS.map((b, i) => (
            <button
              key={b.id}
              onClick={() => router.push(`/odds?step=grades&board=${b.id}`)}
              className={`bg-white border-2 border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center hover:border-[#2d7dd2] hover:shadow-lg transition-all group cursor-pointer${BOARDS.length % 2 !== 0 && i === BOARDS.length - 1 ? ' col-span-2 max-w-[calc(50%-0.5rem)] mx-auto w-full' : ''}`}
              style={{ animation: `card-rise 0.4s ${i * 0.07}s ease both` }}
            >
              <span className="text-3xl block mb-3">{b.icon}</span>
              <p className="font-black text-[#1a2340] text-lg group-hover:text-[#2d7dd2] transition-colors">{b.label}</p>
              <p className="text-xs text-[#64748b] mt-0.5 font-medium">{b.full}</p>
              <p className="text-xs text-[#94a3b8] mt-2">{b.desc}</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
