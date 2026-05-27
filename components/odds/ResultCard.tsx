'use client'
import { useState } from 'react'
import { VERDICT_THEME, getScoreDisplay, type Verdict } from '@/lib/verdict-engine'

function generateStoryCard(
  verdict: Verdict,
  uniName: string,
  courseName: string,
  scoreDisplay: string,
  theme: { bg: string; accent: string; label: string },
): HTMLCanvasElement {
  const W = 1080, H = 1920
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // Background
  ctx.fillStyle = theme.bg
  ctx.fillRect(0, 0, W, H)

  // Subtle large circle decoration
  ctx.beginPath()
  ctx.arc(W / 2, H * 0.42, 460, 0, Math.PI * 2)
  ctx.fillStyle = theme.accent + '12'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(W / 2, H * 0.42, 320, 0, Math.PI * 2)
  ctx.fillStyle = theme.accent + '18'
  ctx.fill()

  // Top label
  ctx.fillStyle = theme.accent
  ctx.globalAlpha = 0.6
  ctx.font = 'bold 36px -apple-system, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('YOUR ODDS CHECK', W / 2, 160)
  ctx.globalAlpha = 1

  // Verdict word
  ctx.fillStyle = theme.accent
  ctx.font = `900 ${verdict === 'STRONG_REACH' ? '118' : '148'}px -apple-system, system-ui, sans-serif`
  ctx.textAlign = 'center'
  if (verdict === 'STRONG_REACH') {
    ctx.fillText('STRONG', W / 2, H * 0.38)
    ctx.fillText('REACH', W / 2, H * 0.38 + 140)
  } else {
    ctx.fillText(theme.label, W / 2, H * 0.40)
  }

  // Divider line
  ctx.strokeStyle = theme.accent
  ctx.globalAlpha = 0.25
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(W * 0.25, H * 0.52)
  ctx.lineTo(W * 0.75, H * 0.52)
  ctx.stroke()
  ctx.globalAlpha = 1

  // Score display
  ctx.fillStyle = '#ffffff'
  ctx.globalAlpha = 0.5
  ctx.font = 'bold 42px -apple-system, system-ui, sans-serif'
  ctx.fillText(scoreDisplay.toUpperCase(), W / 2, H * 0.565)
  ctx.globalAlpha = 1

  // University
  ctx.fillStyle = '#ffffff'
  ctx.globalAlpha = 0.9
  ctx.font = `900 64px -apple-system, system-ui, sans-serif`
  ctx.fillText(uniName, W / 2, H * 0.62)
  ctx.globalAlpha = 0.55
  ctx.font = 'bold 44px -apple-system, system-ui, sans-serif'
  ctx.fillText(courseName, W / 2, H * 0.67)
  ctx.globalAlpha = 1

  // Bottom CTA
  ctx.fillStyle = theme.accent
  ctx.globalAlpha = 0.85
  ctx.font = 'bold 38px -apple-system, system-ui, sans-serif'
  ctx.fillText('Check yours →', W / 2, H * 0.88)
  ctx.globalAlpha = 0.5
  ctx.font = 'bold 34px -apple-system, system-ui, sans-serif'
  ctx.fillText('sortmyprep.com/odds', W / 2, H * 0.92)
  ctx.globalAlpha = 1

  return canvas
}

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
  const [generatingStory, setGeneratingStory] = useState(false)

  const shareText = `I checked my odds at ${uniName} for ${courseName} — verdict: ${theme.label} (${scoreDisplay}). Check yours 👇`
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://sortmyprep.com/odds'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInstaStory = async () => {
    setGeneratingStory(true)
    try {
      const canvas = generateStoryCard(verdict, uniName, courseName, scoreDisplay, theme)
      canvas.toBlob(async (blob) => {
        if (!blob) return
        const file = new File([blob], 'my-odds.png', { type: 'image/png' })
        // Try native share with file (works on mobile — opens share sheet incl. Instagram)
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: 'My University Odds', text: shareText })
        } else {
          // Fallback: download the image
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'my-odds-story.png'
          a.click()
          URL.revokeObjectURL(url)
        }
      }, 'image/png')
    } finally {
      setGeneratingStory(false)
    }
  }

  const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`
  const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`

  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm" style={{ animation: 'card-rise 0.5s 0.15s ease both' }}>
      {/* Preview card */}
      <div
        className="p-8 flex flex-col items-center text-center"
        style={{ backgroundColor: theme.bg, minHeight: 170 }}
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: theme.accent, opacity: 0.6 }}>
          sortmyprep.com/odds
        </p>
        <p className="text-5xl font-black mb-2" style={{ color: theme.accent }}>{theme.label}</p>
        <p style={{ color: 'rgba(255,255,255,0.55)' }} className="text-sm font-medium">
          {uniName} · {courseName} · {scoreDisplay}
        </p>
      </div>

      {/* Share buttons */}
      <div className="px-5 py-4">
        <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-3 text-center">Challenge a friend</p>
        <div className="grid grid-cols-2 gap-2">
          {/* Instagram Stories */}
          <button
            onClick={handleInstaStory}
            disabled={generatingStory}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #f58529 0%, #dd2a7b 50%, #8134af 100%)' }}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            {generatingStory ? 'Generating…' : 'Instagram Story'}
          </button>

          {/* WhatsApp */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#25d366] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>

          {/* X / Twitter */}
          <a
            href={twUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:opacity-80 transition-opacity"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Post on X
          </a>

          {/* Copy link */}
          <button
            onClick={handleCopy}
            className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              copied
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'border-gray-200 text-[#374151] hover:border-[#2d7dd2] hover:text-[#2d7dd2]'
            }`}
          >
            {copied ? '✓ Copied!' : '🔗 Copy Link'}
          </button>
        </div>
        <p className="text-[10px] text-[#94a3b8] text-center mt-2">Instagram Story saves a card to your photos — then share to Stories</p>
      </div>
    </div>
  )
}
