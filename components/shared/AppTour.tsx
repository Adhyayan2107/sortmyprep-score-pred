'use client'
import { useState, useEffect } from 'react'

const STORAGE_KEY = 'sortmyprep_tour_v1'

const STEPS = [
  {
    emoji: '🎯',
    title: 'Pick your board & subject',
    body: 'Use the tabs at the top to switch between IGCSE, A Level, AS Level, and IB. Then choose your subject from the dropdown.',
    hint: 'Start with the switcher in the header →',
  },
  {
    emoji: '✏️',
    title: 'Enter your marks',
    body: 'Type in each paper mark and your predicted grade appears instantly — with a boundary map showing exactly where you land.',
    hint: 'Partial marks work too — great for mid-exam estimates',
  },
  {
    emoji: '🎲',
    title: 'Try What If?',
    body: 'Hit the purple What If? tab and slide marks to explore every possible grade outcome. The criss-cross grid shows all combinations at once.',
    hint: 'Perfect for post-exam anxiety — see every scenario',
  },
]

export default function AppTour() {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState<'forward' | 'back'>('forward')
  const [stepKey, setStepKey] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setVisible(true), 1000)
      return () => clearTimeout(t)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  const go = (next: number, direction: 'forward' | 'back') => {
    setDir(direction)
    setStep(next)
    setStepKey(k => k + 1)
  }

  if (!visible) return null

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:w-80 z-40 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
      style={{ animation: 'tour-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
    >
      {/* Progress bar */}
      <div className="h-0.5 bg-gray-100">
        <div
          className="h-full bg-[#1a2340] transition-all duration-500 ease-out"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="p-5">
        {/* Step content */}
        <div
          key={stepKey}
          style={{ animation: `${dir === 'back' ? 'step-in-back' : 'step-in'} 0.22s ease forwards` }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-2xl w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100"
              style={{ fontSize: '20px' }}
            >
              {current.emoji}
            </span>
            <div>
              <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">
                Step {step + 1} of {STEPS.length}
              </p>
              <p className="text-sm font-black text-[#1a2340] leading-tight">{current.title}</p>
            </div>
          </div>

          <p className="text-xs text-[#64748b] leading-relaxed mb-2">{current.body}</p>

          <div className="flex items-center gap-1.5 bg-[#eff6ff] rounded-lg px-3 py-2 mb-4">
            <span className="text-[#2d7dd2] text-xs">💡</span>
            <p className="text-[11px] text-[#2d7dd2] font-medium">{current.hint}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i, i > step ? 'forward' : 'back')}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === step ? '20px' : '6px',
                  height: '6px',
                  backgroundColor: i === step ? '#1a2340' : '#e2e8f0',
                }}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={dismiss}
              className="text-xs text-[#94a3b8] hover:text-[#374151] transition-colors font-medium px-1"
            >
              Skip
            </button>
            {step > 0 && (
              <button
                onClick={() => go(step - 1, 'back')}
                className="px-3 py-1.5 text-xs font-bold text-[#374151] border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                ←
              </button>
            )}
            <button
              onClick={isLast ? dismiss : () => go(step + 1, 'forward')}
              className="px-4 py-1.5 text-xs font-black bg-[#1a2340] text-white rounded-lg hover:bg-[#2d7dd2] transition-colors active:scale-95"
            >
              {isLast ? '✓ Got it!' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
