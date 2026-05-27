'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const IB_GRADES = [1, 2, 3, 4, 5, 6, 7]
const IB_SUBJECTS = ['Subject 1', 'Subject 2', 'Subject 3', 'Subject 4', 'Subject 5', 'Subject 6']
const LETTER_GRADES = ['A*', 'A', 'B', 'C', 'D', 'E']

function IBEntry({ board }: { board: string }) {
  const [grades, setGrades] = useState<number[]>(Array(6).fill(4))
  const [bonus, setBonus] = useState(0)
  const router = useRouter()

  const total = grades.reduce((s, g) => s + g, 0) + bonus
  const maxTotal = 6 * 7 + 3
  const pct = Math.round((total / maxTotal) * 100)

  const setGrade = (i: number, v: number) => {
    const next = [...grades]
    next[i] = v
    setGrades(next)
  }

  const handleNext = () => {
    router.push(`/odds?step=target&board=${board}&points=${total}`)
  }

  return (
    <>
      <div className="space-y-3 mb-6">
        {IB_SUBJECTS.map((label, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-[#374151] min-w-[80px]">{label}</span>
            <div className="flex gap-1.5 flex-wrap justify-end">
              {IB_GRADES.map(g => (
                <button
                  key={g}
                  onClick={() => setGrade(i, g)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold transition-all border-2 ${
                    grades[i] === g
                      ? 'bg-[#1a2340] text-white border-[#1a2340] scale-110'
                      : 'bg-gray-50 text-[#374151] border-gray-200 hover:border-[#2d7dd2] hover:text-[#2d7dd2]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between gap-4">
          <div>
            <span className="text-sm font-semibold text-[#374151]">Core Bonus</span>
            <p className="text-xs text-[#94a3b8]">EE + TOK</p>
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map(b => (
              <button
                key={b}
                onClick={() => setBonus(b)}
                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all border-2 ${
                  bonus === b
                    ? 'bg-[#2d7dd2] text-white border-[#2d7dd2] scale-110'
                    : 'bg-gray-50 text-[#374151] border-gray-200 hover:border-[#2d7dd2]'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-[#94a3b8] font-medium uppercase tracking-widest">Predicted Total</p>
          <p className="text-3xl font-black text-[#1a2340] mt-0.5">{total} <span className="text-base font-semibold text-[#94a3b8]">/ {maxTotal}</span></p>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{
            backgroundColor: pct >= 85 ? '#dcfce7' : pct >= 70 ? '#fef9c3' : '#fee2e2',
            color: pct >= 85 ? '#15803d' : pct >= 70 ? '#a16207' : '#b91c1c',
          }}>
            {pct}%
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 pb-6 pt-2 bg-[#f1f5f9]">
        <button
          onClick={handleNext}
          className="w-full bg-[#1a2340] text-white font-bold py-4 rounded-2xl text-base hover:bg-[#2d7dd2] transition-colors shadow-lg"
        >
          Next: Pick my university →
        </button>
      </div>
    </>
  )
}

function LetterEntry({ board }: { board: string }) {
  const [grade, setGrade] = useState<string | null>(null)
  const router = useRouter()

  const handleNext = () => {
    if (!grade) return
    router.push(`/odds?step=target&board=${board}&grade=${encodeURIComponent(grade)}`)
  }

  const gradeColors: Record<string, string> = {
    'A*': '#1a2340', 'A': '#166534', 'B': '#1d4ed8', 'C': '#92400e', 'D': '#7f1d1d', 'E': '#6b7280',
  }

  return (
    <>
      <p className="text-sm text-[#64748b] text-center mb-8">
        Select your predicted overall grade across your {board === 'alevel' ? 'A Level' : board === 'as' ? 'AS Level' : 'IGCSE'} subjects.
      </p>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {LETTER_GRADES.map((g, i) => (
          <button
            key={g}
            onClick={() => setGrade(g)}
            className={`rounded-2xl py-6 text-2xl font-black transition-all border-2 ${
              grade === g
                ? 'text-white border-transparent shadow-lg scale-105'
                : 'bg-white text-[#1a2340] border-gray-200 hover:border-[#2d7dd2] hover:shadow-md'
            }`}
            style={{
              backgroundColor: grade === g ? gradeColors[g] : undefined,
              animation: `card-rise 0.35s ${i * 0.05}s ease both`,
            }}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="sticky bottom-0 pb-6 pt-2 bg-[#f1f5f9]">
        <button
          onClick={handleNext}
          disabled={!grade}
          className={`w-full font-bold py-4 rounded-2xl text-base transition-colors shadow-lg ${
            grade
              ? 'bg-[#1a2340] text-white hover:bg-[#2d7dd2]'
              : 'bg-gray-200 text-[#94a3b8] cursor-not-allowed'
          }`}
        >
          {grade ? `Next: Pick my university →` : 'Select a grade first'}
        </button>
      </div>
    </>
  )
}

export default function OddsGradeEntry({ board }: { board: string }) {
  const boardLabels: Record<string, string> = {
    ib: 'IB', alevel: 'A Level', igcse: 'IGCSE', as: 'AS Level',
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/odds?step=board">
            <Image src="/logo.png" alt="sortmyprep" width={571} height={106} className="h-5 w-auto" />
          </Link>
          <span className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest">Step 2 of 3</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl sm:text-3xl font-black text-[#1a2340] mb-1 text-center">
          Your {boardLabels[board] ?? board} grade
        </h1>

        {board === 'ib' ? <IBEntry board={board} /> : <LetterEntry board={board} />}
      </main>
    </div>
  )
}
