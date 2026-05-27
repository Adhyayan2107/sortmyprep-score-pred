'use client'
import { useRef, useState } from 'react'
import { VERDICT_THEME, getScoreDisplay, type Verdict } from '@/lib/verdict-engine'

export default function ResultCard({
  verdict,
  uniName,
  courseName,
  board,
  points,
  grade,
}: {
  verdict: Verdict
  uniName: string
  courseName: string
  board: string
  points?: string | null
  grade?: string | null
}) {
  const theme = VERDICT_THEME[verdict]
  const scoreDisplay = getScoreDisplay(board, points, grade)
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const shareText = `I checked my odds at ${uniName} for ${courseName} — verdict: ${theme.label} (${scoreDisplay}). Check yours at sortmyprep.com/odds`
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://sortmyprep.com/odds'

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My University Odds', text: shareText, url: shareUrl })
      } catch {}
    } else {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`
  const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`

  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm" style={{ animation: 'card-rise 0.5s 0.15s ease both' }}>
      {/* Card visual */}
      <div
        ref={cardRef}
        className="p-6 flex flex-col items-center text-center"
        style={{ backgroundColor: theme.bg, minHeight: 160 }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2" style={{ color: theme.accent, opacity: 0.8 }}>
          sortmyprep.com/odds
        </p>
        <p className="text-4xl font-black mb-1" style={{ color: theme.accent }}>{theme.label}</p>
        <p className="text-white/60 text-sm">
          {uniName} · {courseName} · {scoreDisplay}
        </p>
      </div>

      {/* Share buttons */}
      <div className="px-5 py-4">
        <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-3 text-center">Challenge a friend</p>
        <div className="flex gap-2 flex-wrap justify-center">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1a2340] text-white rounded-xl text-xs font-bold hover:bg-[#2d7dd2] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#25d366] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>

          <a
            href={twUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:opacity-80 transition-opacity"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            X
          </a>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              copied
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'border-gray-200 text-[#374151] hover:border-[#2d7dd2] hover:text-[#2d7dd2]'
            }`}
          >
            {copied ? '✓ Copied' : 'Copy link'}
          </button>
        </div>
      </div>
    </div>
  )
}
