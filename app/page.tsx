'use client'
import { useState, useEffect } from 'react'
import type { Board } from '@/lib/types'
import BoardSwitcher from '@/components/BoardSwitcher'
import IGCSECalculator from '@/components/igcse/IGCSECalculator'
import IBCalculator from '@/components/ib/IBCalculator'

export default function Home() {
  const [board, setBoard] = useState<Board>('igcse')

  useEffect(() => {
    const b = new URLSearchParams(window.location.search).get('board')
    if (b === 'ib' || b === 'igcse') setBoard(b)
  }, [])

  const handleBoardChange = (b: Board) => {
    setBoard(b)
    const url = new URL(window.location.href)
    url.searchParams.set('board', b)
    window.history.pushState({}, '', url.toString())
  }

  return (
    <div className="min-h-screen">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-[#1a2340] tracking-tight">sortmyprep</span>
            <span className="text-[10px] font-bold text-[#2d7dd2] bg-[#dbeafe] px-1.5 py-0.5 rounded-md uppercase tracking-wider">beta</span>
          </div>
          <BoardSwitcher active={board} onChange={handleBoardChange} />
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-10 pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs font-semibold text-[#2d7dd2] mb-4 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2d7dd2] animate-pulse" />
          Free for all students · No signup needed
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#1a2340] tracking-tight leading-tight">
          Know your grade<br />
          <span className="text-[#2d7dd2]">before results day.</span>
        </h1>
        <p className="text-[#64748b] mt-3 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
          Enter your marks. See your predicted grade instantly — with honest ranges, not fake single numbers.
        </p>
      </section>

      {/* Calculator */}
      <main className="max-w-2xl mx-auto px-4 pb-16">
        {board === 'igcse' ? <IGCSECalculator /> : <IBCalculator />}
      </main>

      <footer className="text-center py-8 text-xs text-[#94a3b8] border-t border-gray-200">
        <p>Boundaries are estimates based on historical Cambridge &amp; IBO data. Always verify with your school.</p>
      </footer>
    </div>
  )
}
