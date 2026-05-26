'use client'
import { useState, useEffect, useRef } from 'react'
import { storeEmail } from '@/lib/email-gate'
import Confetti from './Confetti'

interface Props {
  onComplete: () => void
}

export default function EmailGateModal({ onComplete }: Props) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [shakeKey, setShakeKey] = useState(0)
  const [confetti, setConfetti] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [])

  const submit = () => {
    const trimmed = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address')
      setShakeKey(k => k + 1)
      return
    }
    storeEmail(trimmed)
    setConfetti(true)
    setTimeout(() => onComplete(), 1500)
  }

  return (
    <>
      <Confetti active={confetti} />
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8"
          style={{ animation: 'modal-bounce 0.42s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
        >
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#1a2340] flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-[#1a2340] mb-1">See your score now</h2>
            <p className="text-sm text-[#64748b] leading-relaxed">
              Enter your email to unlock your predicted grade.<br />No spam — just your result, once.
            </p>
          </div>

          <div
            key={shakeKey}
            className="space-y-3"
            style={shakeKey > 0 ? { animation: 'shake 0.42s ease' } : {}}
          >
            <input
              ref={inputRef}
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="you@example.com"
              className={`w-full rounded-xl border-2 px-4 py-3 text-sm font-medium focus:outline-none transition-colors ${
                error
                  ? 'border-red-400 bg-red-50 text-red-700'
                  : 'border-gray-200 focus:border-[#2d7dd2] text-[#1a2340]'
              }`}
            />
            {error && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <span>⚠</span> {error}
              </p>
            )}
            <button
              onClick={submit}
              disabled={confetti}
              className="w-full bg-[#1a2340] text-white rounded-xl py-3 text-sm font-bold hover:bg-[#2d7dd2] transition-colors active:scale-95 disabled:opacity-70"
            >
              {confetti ? '🎉 Unlocking your grade…' : 'See my predicted grade'}
            </button>
          </div>

          <p className="text-[10px] text-center text-[#94a3b8] mt-4">
            Asked once · used only by sortmyprep
          </p>
        </div>
      </div>
    </>
  )
}
