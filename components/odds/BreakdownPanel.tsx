'use client'
import { useState, useEffect } from 'react'
import { getStoredEmail, storeEmail } from '@/lib/email-gate'
import Confetti from '@/components/shared/Confetti'
import { VERDICT_THEME, getGapToNextTier, type Verdict } from '@/lib/verdict-engine'
import type { University } from '@/data/universities'

const COURSE_ADVICE: Record<string, string> = {
  medicine:    'Medicine is highly competitive at most universities. Personal statement quality, interview performance, and UCAT/BMAT scores carry significant weight alongside grades.',
  engineering: 'Maths and Physics grades matter most for engineering. Many universities also value relevant work experience or extracurricular projects.',
  cs:          'A strong Maths background is essential for CS. Coding projects and problem-solving competitions can differentiate borderline applicants.',
  economics:   'Strong quantitative skills are key. Reading widely in economics and current affairs strengthens your personal statement significantly.',
  law:         'LNAT score (for UK universities) can make or break an application. Demonstrating critical thinking and reading legal cases helps.',
  sciences:    'Lab experience and scientific reading stand out. Some universities weigh specific subject grades (e.g. Chemistry for Natural Sciences at Cambridge).',
  humanities:  'Essays and interview performance are decisive. Wide independent reading and a clear intellectual passion in your PS is crucial.',
  business:    'Leadership roles and entrepreneurial experience complement strong grades for business programmes.',
  arts:        'Portfolio quality often outweighs grades for arts programmes. Begin curating your strongest work early.',
}

const NEXT_STEPS: Record<Verdict, string[]> = {
  COMPETITIVE: [
    'Polish your personal statement — at this level, it\'s the differentiator.',
    'Prepare thoroughly for interviews (especially Oxbridge).',
    'Maintain your predicted grades through mocks.',
  ],
  BORDERLINE: [
    'One strong subject result can tip you into competitive range.',
    'Invest extra effort in your weakest subject now.',
    'Write an exceptional personal statement that shows depth of interest.',
  ],
  REACH: [
    'Check if this university accepts contextual offers — your actual grade may matter less.',
    'Strengthen your application in other areas: PS, references, interview.',
    'Apply here, but balance with more likely choices.',
  ],
  STRONG_REACH: [
    'Consider this university as an aspirational choice alongside safer options.',
    'Look at foundation year or pathway programmes if available.',
    'Check if predicted grades can improve before applications close.',
  ],
}

function LockedView({ onUnlock }: { onUnlock: () => void }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@') || !email.includes('.')) {
      setError('Enter a valid email')
      setShakeKey(k => k + 1)
      return
    }
    setLoading(true)
    storeEmail(email)
    setConfetti(true)
    setTimeout(() => {
      setLoading(false)
      onUnlock()
    }, 1400)
  }

  return (
    <div className="relative">
      {confetti && <Confetti active={true} />}

      {/* Blurred teaser */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200">
        <div className="pointer-events-none select-none blur-sm p-6 space-y-4 bg-white">
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded" style={{ width: `${[90, 75, 85, 60][i]}%` }} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px] rounded-2xl px-6 py-8">
          <span className="text-2xl mb-2">🔒</span>
          <h3 className="font-black text-[#1a2340] text-lg mb-1 text-center">Unlock your full breakdown</h3>
          <p className="text-xs text-[#64748b] text-center mb-5 max-w-[220px] leading-relaxed">
            Enter your email to see gap analysis, next steps, and course-specific advice.
          </p>

          <form
            key={shakeKey}
            onSubmit={handleSubmit}
            className="w-full max-w-xs space-y-2"
            style={shakeKey > 0 ? { animation: 'shake 0.38s ease' } : undefined}
          >
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              placeholder="your@email.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1a2340] placeholder:text-[#94a3b8] outline-none focus:border-[#2d7dd2]"
            />
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a2340] text-white font-bold py-2.5 rounded-xl text-sm hover:bg-[#2d7dd2] transition-colors disabled:opacity-60"
            >
              {loading ? 'Unlocking…' : 'Unlock Free →'}
            </button>
          </form>
          <p className="text-[10px] text-[#94a3b8] mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </div>
  )
}

function UnlockedView({
  verdict,
  board,
  uni,
  courseName,
  courseId,
  points,
  grade,
}: {
  verdict: Verdict
  board: string
  uni: University | null
  courseName: string
  courseId: string
  points?: string | null
  grade?: string | null
}) {
  const theme = VERDICT_THEME[verdict]
  const gap = uni ? getGapToNextTier(verdict, board, uni, points) : 0
  const steps = NEXT_STEPS[verdict]
  const courseAdvice = COURSE_ADVICE[courseId] ?? ''

  const tierLabels: Record<Verdict, string> = {
    COMPETITIVE: 'You\'re already in the competitive zone.',
    BORDERLINE: `${gap > 0 ? `+${gap} IB points` : 'Stronger subject grades'} to reach competitive range.`,
    REACH: `${gap > 0 ? `+${gap} IB points` : 'Stronger subject grades'} to reach borderline range.`,
    STRONG_REACH: `${gap > 0 ? `+${gap} IB points` : 'Significantly stronger grades'} needed for a realistic shot.`,
  }

  if (uni) {
    const offerKey = board as 'ib' | 'alevel' | 'igcse' | 'as'
  }

  return (
    <div className="space-y-4" style={{ animation: 'card-rise 0.5s ease both' }}>
      {/* Gap analysis */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-3">Gap Analysis</p>

        <div className="flex items-start gap-3">
          <div
            className="w-2 h-2 rounded-full mt-1.5 shrink-0"
            style={{ backgroundColor: theme.accent, boxShadow: `0 0 6px ${theme.accent}` }}
          />
          <p className="text-sm text-[#374151] font-medium leading-relaxed">{tierLabels[verdict]}</p>
        </div>

        {uni && board !== 'ib' && (
          <div className="mt-4 space-y-2">
            {(['competitive', 'borderline', 'reach'] as const).map(tier => {
              const offerKey = board as 'alevel' | 'igcse' | 'as'
              const thresholds = uni.offers[offerKey]
              if (!thresholds) return null
              const offer = thresholds[tier]
              const isCurrentTier =
                (tier === 'competitive' && verdict === 'COMPETITIVE') ||
                (tier === 'borderline' && verdict === 'BORDERLINE') ||
                (tier === 'reach' && verdict === 'REACH')

              return (
                <div
                  key={tier}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${
                    isCurrentTier ? 'bg-[#1a2340] text-white' : 'bg-gray-50 text-[#64748b]'
                  }`}
                >
                  <span className="capitalize">{tier}</span>
                  <span className="font-black">{offer}</span>
                </div>
              )
            })}
          </div>
        )}

        {uni && board === 'ib' && (
          <div className="mt-4 space-y-2">
            {(['competitive', 'borderline', 'reach'] as const).map(tier => {
              const offer = uni.offers.ib[tier]
              const isCurrentTier =
                (tier === 'competitive' && verdict === 'COMPETITIVE') ||
                (tier === 'borderline' && verdict === 'BORDERLINE') ||
                (tier === 'reach' && verdict === 'REACH')

              return (
                <div
                  key={tier}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${
                    isCurrentTier ? 'bg-[#1a2340] text-white' : 'bg-gray-50 text-[#64748b]'
                  }`}
                >
                  <span className="capitalize">{tier}</span>
                  <span className="font-black">{offer} pts</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Next steps */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-3">Next Steps</p>
        <ul className="space-y-2.5">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-[#374151]">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0 mt-0.5"
                style={{ backgroundColor: theme.accent }}
              >
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ul>
      </div>

      {/* Course advice */}
      {courseAdvice && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-3">{courseName} Insights</p>
          <p className="text-sm text-[#374151] leading-relaxed">{courseAdvice}</p>
        </div>
      )}

      <div className="bg-[#f8fafc] rounded-2xl border border-gray-200 p-4 text-center">
        <p className="text-xs text-[#94a3b8]">Offers are based on historical data and vary by course. Always verify with the university directly.</p>
      </div>
    </div>
  )
}

export default function BreakdownPanel({
  verdict,
  board,
  uni,
  courseName,
  courseId,
  points,
  grade,
}: {
  verdict: Verdict
  board: string
  uni: University | null
  courseName: string
  courseId: string
  points?: string | null
  grade?: string | null
}) {
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    if (getStoredEmail()) setUnlocked(true)
  }, [])

  return (
    <div>
      <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-3">Breakdown</p>
      {unlocked ? (
        <UnlockedView
          verdict={verdict}
          board={board}
          uni={uni}
          courseName={courseName}
          courseId={courseId}
          points={points}
          grade={grade}
        />
      ) : (
        <LockedView onUnlock={() => setUnlocked(true)} />
      )}
    </div>
  )
}
