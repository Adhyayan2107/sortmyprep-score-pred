'use client'
import { useState } from 'react'

export default function WaitlistCapture({
  board,
  score,
  university,
  course,
  verdict,
}: {
  board: string
  score: string
  university: string
  course: string
  verdict: string
}) {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status !== 'idle') return
    setStatus('loading')
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, board, score, university, course, verdict, source: 'result' }),
      })
    } catch {}
    setStatus('done')
  }

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-sm"
      style={{ animation: 'card-rise 0.4s 0.1s ease both' }}
    >
      <div className="bg-[#1a2340] px-5 py-4">
        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
          Free Waitlist — Now Open
        </p>

        {status === 'done' ? (
          <div className="py-1">
            <p className="text-white font-black text-base">You're on the list ✓</p>
            <p className="text-white/55 text-xs mt-1 leading-relaxed">
              We'll send you personalised study tips for {course} at {university}.
            </p>
          </div>
        ) : (
          <>
            <p className="text-white font-black text-sm leading-tight mb-1">
              Want personalised tips for {course} at {university}?
            </p>
            <p className="text-white/55 text-xs mb-3 leading-snug">
              Mark schemes, past papers &amp; expert study plans — free, tailored to your target.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 min-w-0 bg-white/10 text-white placeholder:text-white/40 text-sm rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#2d7dd2]"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="shrink-0 bg-[#2d7dd2] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#2563eb] transition-colors"
              >
                {status === 'loading' ? '…' : 'Join →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
