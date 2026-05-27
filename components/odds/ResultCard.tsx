'use client'
import { useState } from 'react'
import { VERDICT_THEME, getScoreDisplay, type Verdict } from '@/lib/verdict-engine'

// ─── Canvas helpers ────────────────────────────────────────────────────────────
function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arc(x + w - r, y + r, r, -Math.PI / 2, 0)
  ctx.lineTo(x + w, y + h - r)
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI / 2)
  ctx.lineTo(x + r, y + h)
  ctx.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI)
  ctx.lineTo(x, y + r)
  ctx.arc(x + r, y + r, r, Math.PI, -Math.PI / 2)
  ctx.closePath()
}

function pill(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number) {
  const r = h / 2
  ctx.beginPath()
  ctx.arc(cx - w / 2 + r, cy, r, Math.PI / 2, -Math.PI / 2)
  ctx.lineTo(cx + w / 2 - r, cy - r)
  ctx.arc(cx + w / 2 - r, cy, r, -Math.PI / 2, Math.PI / 2)
  ctx.closePath()
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const test = current ? `${current} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines
}

// ─── Verdict emojis & config ───────────────────────────────────────────────────
const VERDICT_EMOJI: Record<string, string> = {
  COMPETITIVE: '🔥', BORDERLINE: '⚡', REACH: '🎯', STRONG_REACH: '💪',
}

// ─── Beautiful share card generator ───────────────────────────────────────────
function generateCard(
  verdict: Verdict,
  uniName: string,
  courseName: string,
  scoreDisplay: string,
  theme: { bg: string; accent: string; label: string },
  format: 'story' | 'square',
): HTMLCanvasElement {
  const W = 1080
  const H = format === 'story' ? 1920 : 1080
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  const FONT = 'system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif'
  const isLong = verdict === 'STRONG_REACH'
  const verdictEmoji = VERDICT_EMOJI[verdict] ?? '✨'

  // ── Full-bleed background gradient ────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0,    theme.bg)
  bg.addColorStop(0.48, theme.bg)
  bg.addColorStop(1,    '#060d1a')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // ── Subtle dot-grid texture ───────────────────────────────────────────────
  ctx.fillStyle = theme.accent
  ctx.globalAlpha = 0.04
  for (let gx = 60; gx < W; gx += 90) {
    for (let gy = 60; gy < H; gy += 90) {
      ctx.beginPath(); ctx.arc(gx, gy, 3, 0, Math.PI * 2); ctx.fill()
    }
  }
  ctx.globalAlpha = 1

  // ── Glowing radial orb behind verdict ─────────────────────────────────────
  const orbY = format === 'story' ? 620 : 390
  const orb = ctx.createRadialGradient(W / 2, orbY, 0, W / 2, orbY, 460)
  orb.addColorStop(0,   theme.accent + '30')
  orb.addColorStop(0.5, theme.accent + '12')
  orb.addColorStop(1,   'rgba(0,0,0,0)')
  ctx.fillStyle = orb
  ctx.fillRect(0, 0, W, H)

  // ── Concentric rings ──────────────────────────────────────────────────────
  ;[400, 300, 200, 110].forEach((r, i) => {
    ctx.beginPath()
    ctx.arc(W / 2, orbY, r, 0, Math.PI * 2)
    ctx.strokeStyle = theme.accent
    ctx.globalAlpha = 0.05 + i * 0.035
    ctx.lineWidth = 1.5
    ctx.stroke()
  })
  ctx.globalAlpha = 1

  // ── Top brand bar ─────────────────────────────────────────────────────────
  const brandY = format === 'story' ? 108 : 70
  ctx.textAlign = 'center'
  ctx.font = `700 26px ${FONT}`
  ctx.fillStyle = theme.accent
  ctx.globalAlpha = 0.5
  ctx.fillText('✦  SORTMYPREP  ·  ODDS CHECK  ✦', W / 2, brandY)
  ctx.globalAlpha = 1

  // ── Big verdict emoji ─────────────────────────────────────────────────────
  const emojiY = format === 'story' ? 300 : 210
  ctx.font = `${format === 'story' ? 130 : 90}px ${FONT}`
  ctx.globalAlpha = 0.88
  ctx.fillText(verdictEmoji, W / 2, emojiY)
  ctx.globalAlpha = 1

  // ── "YOU GOT:" micro-label ────────────────────────────────────────────────
  const gotY = format === 'story' ? 440 : 312
  ctx.font = `800 30px ${FONT}`
  ctx.fillStyle = '#ffffff'
  ctx.globalAlpha = 0.32
  ctx.fillText('Y O U   G O T', W / 2, gotY)
  ctx.globalAlpha = 1

  // ── VERDICT text ──────────────────────────────────────────────────────────
  ctx.fillStyle = theme.accent
  ctx.textAlign = 'center'
  if (isLong) {
    const vSz = format === 'story' ? 162 : 108
    const ln1Y = format === 'story' ? 620 : 428
    const ln2Y = format === 'story' ? 808 : 556
    ctx.font = `900 ${vSz}px ${FONT}`
    ctx.fillText('STRONG', W / 2, ln1Y)
    ctx.fillText('REACH',  W / 2, ln2Y)
  } else {
    const vSz = format === 'story' ? 196 : 134
    const vY  = format === 'story' ? 672 : 460
    ctx.font = `900 ${vSz}px ${FONT}`
    ctx.fillText(theme.label.toUpperCase(), W / 2, vY)
  }

  // ── Score pill ────────────────────────────────────────────────────────────
  const pillCy = format === 'story' ? (isLong ? 940 : 876) : (isLong ? 616 : 560)
  const pillLabel = scoreDisplay.toUpperCase()
  ctx.font = `800 40px ${FONT}`
  const pillTxtW = ctx.measureText(pillLabel).width
  const pH = 66, pW = pillTxtW + 84
  pill(ctx, W / 2, pillCy, pW, pH)
  ctx.fillStyle = 'rgba(255,255,255,0.1)'
  ctx.fill()
  pill(ctx, W / 2, pillCy, pW, pH)
  ctx.strokeStyle = theme.accent + '66'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.fillStyle = '#ffffff'
  ctx.globalAlpha = 0.92
  ctx.fillText(pillLabel, W / 2, pillCy + 14)
  ctx.globalAlpha = 1

  // ── Gradient fade-into-dark separator ─────────────────────────────────────
  const sepY = format === 'story' ? 1040 : 658
  const fade = ctx.createLinearGradient(0, sepY - 60, 0, sepY + 100)
  fade.addColorStop(0, 'rgba(6,13,26,0)')
  fade.addColorStop(1, 'rgba(6,13,26,0.85)')
  ctx.fillStyle = fade
  ctx.fillRect(0, sepY - 60, W, 160)

  // Thin divider line
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(100, sepY + 40)
  ctx.lineTo(W - 100, sepY + 40)
  ctx.stroke()

  // ── Bottom info section ───────────────────────────────────────────────────
  const infoTop = sepY + (format === 'story' ? 100 : 68)

  // "dreaming of" italic
  ctx.font = `italic 500 ${format === 'story' ? 30 : 24}px ${FONT}`
  ctx.fillStyle = '#ffffff'
  ctx.globalAlpha = 0.38
  ctx.fillText('dreaming of', W / 2, infoTop)
  ctx.globalAlpha = 1

  // University name — large and bold
  const uniSz = format === 'story' ? 82 : 60
  const uniLineH = uniSz + 14
  ctx.font = `900 ${uniSz}px ${FONT}`
  ctx.fillStyle = '#ffffff'
  ctx.globalAlpha = 0.95
  const uniLines = wrapText(ctx, uniName, W - 120)
  uniLines.forEach((line, i) => {
    ctx.fillText(line, W / 2, infoTop + 96 + i * uniLineH)
  })
  ctx.globalAlpha = 1

  // Course name — accent-coloured
  const courseTop = infoTop + 96 + uniLines.length * uniLineH + 12
  const courseSz = format === 'story' ? 48 : 36
  ctx.font = `600 ${courseSz}px ${FONT}`
  ctx.fillStyle = theme.accent
  ctx.globalAlpha = 0.78
  const courseLines = wrapText(ctx, courseName, W - 160)
  courseLines.forEach((line, i) => {
    ctx.fillText(line, W / 2, courseTop + i * (courseSz + 14))
  })
  ctx.globalAlpha = 1

  // Three dot separator
  const dotsY = format === 'story' ? H - 290 : H - 178
  ctx.fillStyle = theme.accent
  ;[-24, 0, 24].forEach(offset => {
    ctx.globalAlpha = 0.35
    ctx.beginPath()
    ctx.arc(W / 2 + offset * 2.5, dotsY, 5, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.globalAlpha = 1

  // ── CTA ───────────────────────────────────────────────────────────────────
  const ctaY = format === 'story' ? H - 220 : H - 130
  ctx.font = `700 ${format === 'story' ? 36 : 28}px ${FONT}`
  ctx.fillStyle = '#ffffff'
  ctx.globalAlpha = 0.55
  ctx.fillText('What are YOUR odds?', W / 2, ctaY)
  ctx.globalAlpha = 1

  ctx.font = `800 ${format === 'story' ? 38 : 30}px ${FONT}`
  ctx.fillStyle = theme.accent
  ctx.globalAlpha = 0.9
  ctx.fillText('sortmyprep.com/odds →', W / 2, ctaY + (format === 'story' ? 58 : 46))
  ctx.globalAlpha = 1

  // ── Corner sparkle dots ───────────────────────────────────────────────────
  const sparkles = format === 'story'
    ? [[64, 148], [W - 64, 148], [64, 520], [W - 64, 500]]
    : [[64, 105], [W - 64, 105], [64, 360], [W - 64, 360]]
  ctx.fillStyle = theme.accent
  sparkles.forEach(([sx, sy]) => {
    ctx.globalAlpha = 0.28
    ctx.beginPath(); ctx.arc(sx, sy, 7, 0, Math.PI * 2); ctx.fill()
    ctx.globalAlpha = 0.12
    ctx.beginPath(); ctx.arc(sx, sy, 16, 0, Math.PI * 2); ctx.fill()
  })
  ctx.globalAlpha = 1

  return canvas
}

// ─── Blob → share or download ──────────────────────────────────────────────────
async function shareOrDownload(blob: Blob, filename: string, shareText: string, fallback: string) {
  const file = new File([blob], filename, { type: 'image/png' })
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: 'My University Odds', text: shareText })
  } else {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fallback
    a.click()
    URL.revokeObjectURL(url)
  }
}

// ─── Component ─────────────────────────────────────────────────────────────────
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
  const [copyKey, setCopyKey] = useState(0)
  const [loadingInsta, setLoadingInsta] = useState(false)
  const [loadingWA, setLoadingWA] = useState(false)

  const shareText = `I checked my odds at ${uniName} for ${courseName} — verdict: ${theme.label} (${scoreDisplay}). Check yours 👇`
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://sortmyprep.com/odds'
  const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`

  const handleInstaStory = async () => {
    setLoadingInsta(true)
    try {
      const canvas = generateCard(verdict, uniName, courseName, scoreDisplay, theme, 'story')
      await new Promise<void>(resolve => {
        canvas.toBlob(async blob => {
          if (blob) await shareOrDownload(blob, 'my-odds-story.png', shareText, 'my-odds-story.png')
          resolve()
        }, 'image/png')
      })
    } finally {
      setLoadingInsta(false)
    }
  }

  const handleWhatsApp = async () => {
    setLoadingWA(true)
    try {
      const canvas = generateCard(verdict, uniName, courseName, scoreDisplay, theme, 'square')
      await new Promise<void>(resolve => {
        canvas.toBlob(async blob => {
          if (blob) {
            const file = new File([blob], 'my-odds.png', { type: 'image/png' })
            if (navigator.canShare?.({ files: [file] })) {
              await navigator.share({ files: [file], title: 'My University Odds', text: shareText })
            } else {
              // Desktop fallback: open WhatsApp web with text + download the image
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'my-odds.png'
              a.click()
              URL.revokeObjectURL(url)
              setTimeout(() => {
                window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`, '_blank')
              }, 600)
            }
          }
          resolve()
        }, 'image/png')
      })
    } finally {
      setLoadingWA(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
    setCopied(true)
    setCopyKey(k => k + 1)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm" style={{ animation: 'card-rise 0.5s 0.15s ease both' }}>
      {/* In-app preview card */}
      <div
        className="p-8 flex flex-col items-center text-center relative overflow-hidden"
        style={{ backgroundColor: theme.bg, minHeight: 180 }}
      >
        {/* Decorative rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[300, 220, 140].map((r, i) => (
            <div
              key={i}
              className="absolute rounded-full border"
              style={{
                width: r, height: r,
                borderColor: theme.accent,
                opacity: 0.08 + i * 0.05,
              }}
            />
          ))}
        </div>
        {/* Shine sweep */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.10) 50%, transparent 65%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer-slide 2.5s 0.6s ease both',
          }}
        />
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-2 relative" style={{ color: theme.accent, opacity: 0.55 }}>
          odds check · sortmyprep
        </p>
        <p
          className="text-5xl font-black mb-2 relative"
          style={{
            color: theme.accent,
            animation: 'grade-badge-pop 0.55s 0.2s cubic-bezier(0.34,1.56,0.64,1) both',
          }}
        >
          {theme.label}
        </p>
        <div
          className="px-4 py-1.5 rounded-full text-xs font-bold relative"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.85)' }}
        >
          {scoreDisplay} · {uniName}
        </div>
      </div>

      {/* Share buttons */}
      <div className="px-5 py-4">
        <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-3 text-center">
          Share your result
        </p>
        <div className="grid grid-cols-2 gap-2">
          {/* Instagram Stories */}
          <button
            onClick={handleInstaStory}
            disabled={loadingInsta}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-95 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #f58529 0%, #dd2a7b 50%, #8134af 100%)' }}
          >
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            {loadingInsta ? 'Generating…' : 'Instagram Story'}
          </button>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            disabled={loadingWA}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25d366] text-white rounded-xl text-xs font-bold transition-all hover:opacity-90 hover:scale-[1.02] active:scale-95 disabled:opacity-60"
          >
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {loadingWA ? 'Generating…' : 'WhatsApp Image'}
          </button>

          {/* X / Twitter */}
          <a
            href={twUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-xl text-xs font-bold hover:opacity-80 transition-all hover:scale-[1.02] active:scale-95"
          >
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Post on X
          </a>

          {/* Copy link */}
          <button
            key={copyKey}
            onClick={handleCopy}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all border hover:scale-[1.02] active:scale-95 ${
              copied
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'border-gray-200 text-[#374151] hover:border-[#2d7dd2] hover:text-[#2d7dd2]'
            }`}
            style={copied ? { animation: 'checkmark-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both' } : {}}
          >
            {copied ? '✓ Copied!' : '🔗 Copy Link'}
          </button>
        </div>
        <p className="text-[10px] text-[#94a3b8] text-center mt-3 leading-relaxed">
          On mobile, Instagram &amp; WhatsApp buttons save a card to your photos / open share sheet
        </p>
      </div>
    </div>
  )
}
