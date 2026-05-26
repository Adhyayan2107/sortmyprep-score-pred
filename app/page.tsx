'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Board } from '@/lib/types'
import BoardSwitcher from '@/components/BoardSwitcher'
import IGCSECalculator from '@/components/igcse/IGCSECalculator'
import IBCalculator from '@/components/ib/IBCalculator'

function ShareButton() {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: 'sortmyprep Grade Calculator', url }) } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-[#374151] hover:border-[#2d7dd2] hover:text-[#2d7dd2] transition-colors bg-white"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      {copied ? 'Copied!' : 'Share'}
    </button>
  )
}

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
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="sortmyprep" width={571} height={106} className="h-5 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            <ShareButton />
            <BoardSwitcher active={board} onChange={handleBoardChange} />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-10 pb-8 text-center">
        <a
          href="https://sortmyprep.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs font-semibold text-[#2d7dd2] mb-4 shadow-sm hover:border-[#2d7dd2] hover:shadow-md transition-all"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#2d7dd2] animate-pulse" />
          Level up your prep at sortmyprep.com
        </a>
        <h1 className="text-3xl sm:text-4xl font-black text-[#1a2340] tracking-tight leading-tight">
          Know your grade<br />
          <span className="text-[#2d7dd2]">before results day.</span>
        </h1>
        <p className="text-[#64748b] mt-3 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
          Enter your marks and see your predicted grade instantly.
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
