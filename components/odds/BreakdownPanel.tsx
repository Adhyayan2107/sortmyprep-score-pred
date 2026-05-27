'use client'
import { useState, useEffect } from 'react'
import { getStoredEmail, storeEmail } from '@/lib/email-gate'
import Confetti from '@/components/shared/Confetti'
import { VERDICT_THEME, type Verdict } from '@/lib/verdict-engine'
import type { University } from '@/data/universities'

// ─── Grade helpers ────────────────────────────────────────────────────────────
const GRADE_POINTS: Record<string, number> = {
  'A*': 6, 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1, 'U': 0,
}
function avgGradeString(s: string): number {
  const matches = s.match(/A\*|[A-E]/g) ?? []
  if (!matches.length) return 0
  return matches.reduce((sum, g) => sum + (GRADE_POINTS[g] ?? 0), 0) / matches.length
}
function gradeLabel(pts: number): string {
  if (pts >= 5.5) return 'A*'
  if (pts >= 4.5) return 'A'
  if (pts >= 3.5) return 'B'
  if (pts >= 2.5) return 'C'
  if (pts >= 1.5) return 'D'
  return 'E'
}

// ─── Course-specific advice ───────────────────────────────────────────────────
const COURSE_ADVICE: Record<string, { strengths: string; gaps: string; actions: string[] }> = {
  medicine: {
    strengths: 'Medicine values academic excellence across sciences. If you\'re competitive, your grades position you well.',
    gaps: 'Top medschools also heavily weigh UCAT/BMAT scores, personal statement quality, and interview performance — grades alone are rarely enough.',
    actions: ['Start UCAT preparation early — 80th percentile is typically needed', 'Draft your PS around meaningful clinical experience', 'Practice MMI-style interview scenarios'],
  },
  engineering: {
    strengths: 'Strong Maths and Physics grades are the core signal for engineering admissions.',
    gaps: 'If your maths grade is below the competitive threshold, that\'s the single biggest lever to pull.',
    actions: ['Focus any remaining study time on Maths — it\'s weighted most heavily', 'Personal statement: include any coding or building projects', 'Check if the university offers a foundation year as an alternative path'],
  },
  cs: {
    strengths: 'CS programmes value problem-solving and analytical thinking alongside grades.',
    gaps: 'Maths grade is disproportionately important — a weak Maths grade can disqualify even with strong other subjects.',
    actions: ['Build 1-2 visible projects on GitHub before applying', 'Competitive programming (Codeforces, LeetCode) strengthens your PS', 'Maths should be your top revision priority'],
  },
  economics: {
    strengths: 'Strong Maths + Economics grades are the core signal. Data literacy is increasingly valued.',
    gaps: 'LSE and Oxbridge weigh quantitative ability heavily — Economics grade alone isn\'t enough without Maths.',
    actions: ['Read The Economist weekly and reference it in your PS', 'Study Maths even if your school treats it as optional', 'Demonstrate awareness of current economic events in your personal statement'],
  },
  law: {
    strengths: 'Strong analytical writing grades (English, History, Economics) signal well for Law.',
    gaps: 'Most top law schools require a high LNAT score. Without it, grades alone won\'t get you through.',
    actions: ['Register and prepare for LNAT (target 27+/42)', 'Read legal judgements and case summaries to build awareness', 'Personal statement should demonstrate critical thinking, not just interest in law'],
  },
  sciences: {
    strengths: 'Natural Sciences requires excellence across multiple sciences simultaneously.',
    gaps: 'Cambridge Natural Sciences is the most competitive STEM programme in the UK — borderline grades need exceptional interview performance.',
    actions: ['Read beyond the syllabus: scientific journals, popular science books', 'Prepare for interviews: think-out-loud problem solving', 'Lab experience and scientific projects make your PS stand out'],
  },
  humanities: {
    strengths: 'Strong essay-based subject grades (History, English, Philosophy) signal well.',
    gaps: 'Top universities place enormous weight on the personal statement and interview for humanities. Grades are a floor, not a ceiling.',
    actions: ['Read widely and independently — have specific books to reference', 'Draft a PS that shows genuine intellectual curiosity, not just love of the subject', 'Prepare to discuss and debate your ideas in interview'],
  },
  business: {
    strengths: 'Business programmes value leadership experience alongside academic performance.',
    gaps: 'Maths and Economics grades tend to matter most — even for business courses.',
    actions: ['Highlight entrepreneurial or leadership activities in your PS', 'Demonstrate commercial awareness: read business news regularly', 'Consider relevant work experience or competitions (e.g., Young Enterprise)'],
  },
  arts: {
    strengths: 'Arts programmes weigh portfolio quality heavily alongside academic grades.',
    gaps: 'For top arts schools, portfolio quality often matters more than grades. Start curating your best work now.',
    actions: ['Build a cohesive, high-quality portfolio — choose depth over breadth', 'Document your creative process: sketchbooks, research, iterations', 'Visit galleries and exhibitions — reference specific works in your PS'],
  },
  dentistry: {
    strengths: 'Dentistry shares much of its entry requirements with Medicine — strong science grades across Biology and Chemistry are the foundation.',
    gaps: 'UCAT (or BMAT for some) is required alongside strong sciences. Manual dexterity and patient care experience is weighted heavily in interviews.',
    actions: ['Book UCAT preparation early — the dental sections heavily weight spatial reasoning', 'Secure work shadowing at a dental practice (minimum 1 week recommended)', 'Chemistry and Biology are non-negotiable — prioritise these above all else'],
  },
  pharmacy: {
    strengths: 'Chemistry is the core science for Pharmacy. Strong grades here signal readiness for the pharmacological content of the degree.',
    gaps: 'Many pharmacy programmes also require Biology or Maths. Check each university\'s specific requirements carefully.',
    actions: ['Chemistry A-Level (or IB HL) is typically mandatory — make it your top priority', 'Volunteer or work in a community pharmacy before applying', 'GCSE Maths at top grade is often a hidden requirement'],
  },
  biomedical: {
    strengths: 'Biology and Chemistry together form the core academic requirement. Research experience significantly strengthens your application.',
    gaps: 'Biomedical Science is competitive at research-led universities. A strong personal statement showing research interest is critical.',
    actions: ['Aim for top grades in Biology and Chemistry', 'Reference specific research areas you\'re interested in within your PS', 'Extended Project Qualification (EPQ) or equivalent can demonstrate independent research'],
  },
  nursing: {
    strengths: 'Nursing programmes prioritise caring experience and interpersonal skills alongside academic performance.',
    gaps: 'Entry requirements are typically lower than Medicine but hands-on experience is essential and often mandatory.',
    actions: ['Secure substantial volunteering experience in a healthcare setting', 'Personal statement should lead with specific patient care experiences', 'Check individual university requirements — some require specific GCSE grades in English and Maths'],
  },
  psychology: {
    strengths: 'Psychology values strong analytical and statistical thinking. Biology and Maths are valuable supporting subjects.',
    gaps: 'Top programmes (UCL, Edinburgh, Bristol) are increasingly competitive. A strong PS showing genuine research interest makes the difference.',
    actions: ['Read widely in psychology research — reference specific studies in your PS', 'Maths or Statistics at A-Level is increasingly valued for quantitative psychology programmes', 'Laboratory research or fieldwork experience strengthens your application significantly'],
  },
  mathematics: {
    strengths: 'Pure Mathematics programmes reward deep problem-solving ability. Your Maths grade is the single most important signal.',
    gaps: 'Further Mathematics (A-Level) or Maths AA HL (IB) is strongly preferred or required at top universities. Without it, competition is harder.',
    actions: ['If not already taking Further Maths, explore self-study resources for the gap areas', 'Enter Maths Olympiad or competition mathematics to demonstrate interest', 'Oxford/Cambridge require interview performance — practice proof-based reasoning under pressure'],
  },
  architecture: {
    strengths: 'Architecture values both technical ability (Maths/Physics) and creative portfolio. Neither alone is sufficient.',
    gaps: 'Most top architecture schools require a portfolio submission. Grades alone won\'t get you in without exceptional portfolio work.',
    actions: ['Begin building your design portfolio now — include process work, not just final pieces', 'Maths is typically required; Physics is valued for structural understanding', 'Visit buildings you find inspiring and be ready to discuss them in interview'],
  },
  environmental: {
    strengths: 'Science subjects (Biology, Chemistry, Geography) provide a strong foundation for Environmental Science.',
    gaps: 'Interdisciplinary programmes value breadth — both science rigour and awareness of policy/social dimensions.',
    actions: ['Geography or Biology A-Level is typically preferred alongside Chemistry', 'Demonstrate awareness of current environmental policy and science in your PS', 'Field experience or conservation volunteering significantly strengthens applications'],
  },
  politics: {
    strengths: 'Strong essay-writing subjects (History, Economics, English) are the typical background for Politics & IR.',
    gaps: 'Top programmes (Oxford PPE, LSE Government) are exceptionally competitive. Personal statement quality and interview performance are decisive.',
    actions: ['Read The Economist and a quality daily newspaper regularly — reference specific events', 'History and Economics are the most valued A-Level/IB subjects for this field', 'Oxford PPE requires HAT test — prepare specifically for it'],
  },
  sociology: {
    strengths: 'Humanities and Social Science subjects align well. Writing quality and critical thinking are central.',
    gaps: 'Sociology is broad — demonstrate a specific focus area in your PS (crime, inequality, education, etc.) rather than general interest.',
    actions: ['Read key sociological works (Durkheim, Weber, Bourdieu) and reference them', 'Demonstrate awareness of current social issues with sociological framing', 'Strong GCSE and A-Level grades in essay subjects are the baseline'],
  },
  geography: {
    strengths: 'Geography bridges sciences and humanities. Both physical and human geography content matters.',
    gaps: 'Top Geography programmes value fieldwork experience and quantitative skills increasingly.',
    actions: ['Geography A-Level or IB is typically required', 'Maths/Statistics is increasingly valued for human and physical geography research', 'Fieldwork experience — even school trips — should be highlighted in PS'],
  },
  finance: {
    strengths: 'Mathematics is the most important subject for Finance. Strong Maths/Further Maths signals readiness for quantitative finance content.',
    gaps: 'Top finance programmes at LSE, Imperial, Warwick are highly competitive. Work experience in finance differentiates borderline applicants.',
    actions: ['Mathematics grade is the primary filter — prioritise it above all others', 'Seek out finance internships or virtual experiences (Goldman Sachs, J.P. Morgan programmes)', 'Demonstrate commercial awareness: follow financial markets, read FT'],
  },
  history: {
    strengths: 'Strong essay-writing ability across humanities subjects signals well. Breadth of reading is particularly valued.',
    gaps: 'Oxbridge History is interview-led — exceptional grades are table stakes, but intellectual curiosity shown in PS and interview is decisive.',
    actions: ['Read beyond the syllabus: academic history books, historical journals', 'Develop a specific historical period or theme you can discuss with genuine depth', 'Practice forming and defending historical arguments under examination-style pressure'],
  },
  philosophy: {
    strengths: 'For Philosophy: strong analytical writing (English, Maths) is valued. For PPE: Maths and Economics are central alongside writing.',
    gaps: 'Oxford PPE is one of the most competitive courses globally. The HAT aptitude test and interview are decisive at this level.',
    actions: ['Read introductory philosophy texts (Russell, Nagel, Singer) and engage critically', 'For PPE: Economics and History are the most valued A-Level/IB subjects', 'Oxford HAT requires specific preparation — practise unseen text analysis'],
  },
  languages: {
    strengths: 'Native or near-native proficiency in the language you\'re studying is expected at top programmes. Having studied it formally matters.',
    gaps: 'Some universities require the language at A-Level or IB HL. Ab initio students face a steeper learning curve.',
    actions: ['Demonstrate language use beyond the classroom: pen pals, exchanges, media consumption', 'Year abroad placements are a major draw — research programmes that offer them', 'Literature knowledge in the target language strengthens applications significantly'],
  },
  media: {
    strengths: 'Media & Film programmes value creative thinking, critical analysis, and awareness of the industry.',
    gaps: 'Portfolio or showreel quality matters at specialist arts schools. Critical writing ability matters at research-led universities.',
    actions: ['Build a portfolio of creative work — short films, photography, written criticism', 'Reference specific directors, films, or media theorists you engage with deeply', 'Demonstrate awareness of the contemporary media landscape in your PS'],
  },
}

// ─── Course subject requirements ──────────────────────────────────────────────
const COURSE_REQUIRED_SUBJECTS: Record<string, { required: string[]; helpful: string[] }> = {
  medicine:    { required: ['Chemistry', 'Biology'], helpful: ['Mathematics', 'Physics'] },
  dentistry:   { required: ['Chemistry', 'Biology'], helpful: ['Mathematics'] },
  pharmacy:    { required: ['Chemistry'], helpful: ['Biology', 'Mathematics'] },
  biomedical:  { required: ['Biology', 'Chemistry'], helpful: ['Mathematics', 'Physics'] },
  psychology:  { required: [], helpful: ['Biology', 'Mathematics', 'Psychology'] },
  engineering: { required: ['Mathematics', 'Physics'], helpful: ['Further Mathematics', 'Chemistry', 'Design Technology'] },
  cs:          { required: ['Mathematics'], helpful: ['Further Mathematics', 'Computer Science', 'Physics'] },
  mathematics: { required: ['Mathematics'], helpful: ['Further Mathematics', 'Physics'] },
  architecture:{ required: ['Mathematics'], helpful: ['Physics', 'Art & Design'] },
  sciences:    { required: ['Mathematics'], helpful: ['Biology', 'Chemistry', 'Physics'] },
  economics:   { required: ['Mathematics'], helpful: ['Economics', 'Further Mathematics'] },
  politics:    { required: [], helpful: ['History', 'Economics', 'English Literature'] },
  finance:     { required: ['Mathematics'], helpful: ['Economics', 'Further Mathematics', 'Statistics'] },
  law:         { required: [], helpful: ['English Literature', 'History', 'Philosophy'] },
  history:     { required: [], helpful: ['History', 'English Literature', 'Politics'] },
  philosophy:  { required: [], helpful: ['Mathematics', 'History', 'English Literature', 'Philosophy'] },
  languages:   { required: ['A Language Subject'], helpful: ['Literature in target language'] },
  arts:        { required: [], helpful: ['Art & Design', 'Art History'] },
  media:       { required: [], helpful: ['Media Studies', 'Film Studies', 'English Literature'] },
}

// ─── Verdict-specific messages ────────────────────────────────────────────────
const VERDICT_MESSAGES: Record<Verdict, { headline: string; subtext: string }> = {
  COMPETITIVE: {
    headline: 'You\'re in a strong position — maintain it.',
    subtext: 'Your predicted grade clears the competitive threshold. The focus now shifts to the non-academic parts of your application.',
  },
  BORDERLINE: {
    headline: 'You\'re close — one push can tip it.',
    subtext: 'Your grade sits right at their typical offer. A slight improvement in your weakest subject, or a standout PS, can make the difference.',
  },
  REACH: {
    headline: 'Achievable — but you\'ll need to work on the gap.',
    subtext: 'There\'s a meaningful gap between your predicted grade and what they typically offer. It\'s closeable, but it requires targeted effort.',
  },
  STRONG_REACH: {
    headline: 'A long shot — but long shots do land.',
    subtext: 'Your grade is significantly below the typical offer. This university should be one aspirational choice balanced with more realistic options.',
  },
}

// ─── Threshold bar ────────────────────────────────────────────────────────────
function ThresholdBar({
  studentScore,
  competitive,
  borderline,
  reach,
  isIB,
  board,
}: {
  studentScore: number
  competitive: number | string
  borderline: number | string
  reach: number | string
  isIB: boolean
  board: string
}) {
  const toNum = (v: number | string) =>
    isIB ? Number(v) : avgGradeString(String(v))

  const compN = toNum(competitive)
  const borderN = toNum(borderline)
  const reachN = toNum(reach)
  const maxN = isIB ? 45 : 6

  const pct = (v: number) => Math.min(100, Math.max(0, (v / maxN) * 100))

  const studentPct = pct(studentScore)
  const compPct = pct(compN)
  const borderPct = pct(borderN)
  const reachPct = pct(reachN)

  const zones = [
    { from: compPct, to: 100, color: '#166534', label: 'Competitive' },
    { from: borderPct, to: compPct, color: '#92400e', label: 'Borderline' },
    { from: reachPct, to: borderPct, color: '#991b1b', label: 'Reach' },
    { from: 0, to: reachPct, color: '#1f2937', label: 'Strong Reach' },
  ]

  return (
    <div className="mt-4">
      <div className="relative h-4 rounded-full overflow-hidden bg-gray-100 mb-3">
        {zones.map((z, i) => (
          <div
            key={i}
            className="absolute top-0 h-full"
            style={{ left: `${z.from}%`, width: `${z.to - z.from}%`, backgroundColor: z.color }}
          />
        ))}
        {/* Student marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#1a2340] shadow-md z-10"
          style={{ left: `${studentPct}%` }}
        />
      </div>
      {/* Labels */}
      <div className="flex justify-between text-[10px] font-bold text-[#94a3b8]">
        <span>Strong Reach</span>
        <span>Reach</span>
        <span>Borderline</span>
        <span>Competitive</span>
      </div>
    </div>
  )
}

// ─── Unlocked breakdown ───────────────────────────────────────────────────────
const NEXT_STEPS: Record<Verdict, string[]> = {
  COMPETITIVE: [
    'Polish your personal statement — at this level, it\'s the differentiator.',
    'Prepare thoroughly for interviews if required (especially Oxbridge).',
    'Maintain predicted grades through mocks — unconditional offers are rare.',
  ],
  BORDERLINE: [
    'Identify your weakest subject and put extra effort there first.',
    'A standout personal statement can compensate where grades fall short.',
    'Ask your teachers for a strong, specific reference letter early.',
  ],
  REACH: [
    'This university can still be on your list — but balance it with safer choices.',
    'Check if contextual admissions apply (school background, first-gen, etc.).',
    'Invest significantly in your personal statement and any required admissions tests.',
  ],
  STRONG_REACH: [
    'Apply here as your one aspirational choice — but have realistic backups.',
    'Look into foundation year or international pathway options.',
    'Speak to your teachers about whether your predicted grades can be revised upward.',
  ],
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
  const msg = VERDICT_MESSAGES[verdict]
  const steps = NEXT_STEPS[verdict]
  const advice = COURSE_ADVICE[courseId]

  const isIB = board === 'ib'
  const studentScore = isIB
    ? parseInt(points ?? '0', 10)
    : avgGradeString(grade ?? '')

  const offers = uni ? (isIB
    ? uni.offers.ib
    : uni.offers[board as 'alevel' | 'igcse' | 'as'])
    : null

  const compScore   = offers ? (isIB ? (offers as any).competitive : avgGradeString((offers as any).competitive)) : 0
  const borderScore = offers ? (isIB ? (offers as any).borderline  : avgGradeString((offers as any).borderline))  : 0
  const reachScore  = offers ? (isIB ? (offers as any).reach       : avgGradeString((offers as any).reach))       : 0

  const gapToComp   = compScore   - studentScore
  const gapToBorder = borderScore - studentScore
  const gapToReach  = reachScore  - studentScore

  const formatGap = (gap: number) => {
    if (isIB) return `${Math.abs(Math.round(gap))} IB point${Math.abs(Math.round(gap)) !== 1 ? 's' : ''}`
    const gLabel = gradeLabel(Math.abs(gap))
    return `${Math.abs(gap).toFixed(1)} grade points (≈ ${gLabel})`
  }

  return (
    <div className="space-y-4" style={{ animation: 'card-rise 0.5s ease both' }}>

      {/* Verdict summary */}
      <div className="rounded-2xl border border-gray-200 p-5 bg-white">
        <div className="flex items-start gap-3">
          <div
            className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
            style={{ backgroundColor: theme.accent, boxShadow: `0 0 8px ${theme.accent}80` }}
          />
          <div>
            <p className="font-black text-[#1a2340] text-sm">{msg.headline}</p>
            <p className="text-xs text-[#64748b] mt-1 leading-relaxed">{msg.subtext}</p>
          </div>
        </div>
      </div>

      {/* Subject requirements */}
      {COURSE_REQUIRED_SUBJECTS[courseId] && (
        <div className="rounded-2xl border border-gray-200 p-5 bg-white">
          <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-3">Subject Requirements for {courseName}</p>
          <div className="space-y-2">
            {COURSE_REQUIRED_SUBJECTS[courseId].required.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-1">Typically Required</p>
                <div className="flex flex-wrap gap-1.5">
                  {COURSE_REQUIRED_SUBJECTS[courseId].required.map(s => (
                    <span key={s} className="px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-bold">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {COURSE_REQUIRED_SUBJECTS[courseId].helpful.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#2d7dd2] mb-1">Helpful / Preferred</p>
                <div className="flex flex-wrap gap-1.5">
                  {COURSE_REQUIRED_SUBJECTS[courseId].helpful.map(s => (
                    <span key={s} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Visual gauge */}
      {offers && (
        <div className="rounded-2xl border border-gray-200 p-5 bg-white">
          <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-1">Where You Stand</p>
          <ThresholdBar
            studentScore={studentScore}
            competitive={(offers as any).competitive}
            borderline={(offers as any).borderline}
            reach={(offers as any).reach}
            isIB={isIB}
            board={board}
          />
        </div>
      )}

      {/* Gap analysis table */}
      {offers && (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-5 pt-4 pb-2">
            <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest">Gap to Each Tier</p>
          </div>
          {[
            {
              tier: 'Competitive',
              offer: isIB ? `${(offers as any).competitive} pts` : (offers as any).competitive,
              gap: gapToComp,
              hit: verdict === 'COMPETITIVE',
              color: '#166534', bg: '#f0fdf4',
            },
            {
              tier: 'Borderline',
              offer: isIB ? `${(offers as any).borderline} pts` : (offers as any).borderline,
              gap: gapToBorder,
              hit: verdict === 'COMPETITIVE' || verdict === 'BORDERLINE',
              color: '#92400e', bg: '#fefce8',
            },
            {
              tier: 'Reach',
              offer: isIB ? `${(offers as any).reach} pts` : (offers as any).reach,
              gap: gapToReach,
              hit: verdict !== 'STRONG_REACH',
              color: '#991b1b', bg: '#fef2f2',
            },
          ].map(row => (
            <div key={row.tier} className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
              <div className="flex items-center gap-2.5">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: row.hit ? row.bg : '#f9fafb', color: row.hit ? row.color : '#9ca3af' }}
                >
                  {row.tier}
                </span>
                <span className="text-xs font-black text-[#1a2340]">{row.offer}</span>
              </div>
              <div className="text-right">
                {row.hit ? (
                  <span className="text-xs font-bold text-emerald-600">✓ Cleared</span>
                ) : (
                  <span className="text-xs font-semibold text-[#64748b]">
                    +{formatGap(row.gap)} needed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* What you need to do */}
      <div className="rounded-2xl border border-gray-200 p-5 bg-white">
        <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-3">What To Do Next</p>
        <ul className="space-y-3">
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

      {/* Course-specific deep-dive */}
      {advice && (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-5 pt-4 pb-3 border-b border-gray-100">
            <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest">{courseName} — Deep Dive</p>
          </div>
          <div className="px-5 py-4 space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-1">Where You Could Be Strong</p>
              <p className="text-sm text-[#374151] leading-relaxed">{advice.strengths}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-1">Where You Might Be Lacking</p>
              <p className="text-sm text-[#374151] leading-relaxed">{advice.gaps}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#2d7dd2] mb-2">Specific Actions</p>
              <ul className="space-y-1.5">
                {advice.actions.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#374151]">
                    <span className="text-[#2d7dd2] font-bold mt-0.5 shrink-0">→</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 p-4 text-center bg-[#f8fafc]">
        <p className="text-xs text-[#94a3b8]">Offers are based on historical data and vary by course. Always verify with the university directly.</p>
      </div>
    </div>
  )
}

// ─── Email gate (locked view) ─────────────────────────────────────────────────
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
    setTimeout(() => { setLoading(false); onUnlock() }, 1400)
  }

  return (
    <div className="relative">
      {confetti && <Confetti active={true} />}

      {/* Blurred teaser rows */}
      <div className="relative rounded-2xl border border-gray-200" style={{ minHeight: 400 }}>
        <div className="pointer-events-none select-none blur-sm p-5 space-y-3 bg-white rounded-2xl">
          <div className="h-3 bg-gray-200 rounded w-4/5" />
          <div className="h-3 bg-gray-200 rounded w-3/5" />
          <div className="h-10 bg-gray-100 rounded-xl" />
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}
          </div>
          <div className="h-3 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-200 rounded w-4/5" />
          <div className="h-10 bg-gray-100 rounded-xl" />
          <div className="h-3 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-10 bg-gray-100 rounded-xl" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>

        {/* Gate overlay — justify-start prevents clipping on short screens */}
        <div className="absolute inset-0 flex flex-col items-center justify-start bg-white/88 backdrop-blur-[3px] rounded-2xl px-6 pt-10 pb-6">
          <div
            className="w-14 h-14 rounded-2xl bg-[#1a2340] flex items-center justify-center mb-4 shrink-0"
            style={{ animation: 'float-emoji 3s ease-in-out infinite' }}
          >
            <span className="text-2xl">🔒</span>
          </div>
          <h3 className="font-black text-[#1a2340] text-base mb-1 text-center">Unlock your full breakdown</h3>
          <p className="text-xs text-[#64748b] text-center mb-5 max-w-[240px] leading-relaxed">
            See exactly where you're lacking, gap analysis to each tier, and course-specific actions.
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
              autoFocus
            />
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a2340] text-white font-bold py-2.5 rounded-xl text-sm hover:bg-[#2d7dd2] transition-colors disabled:opacity-60"
            >
              {loading ? 'Unlocking…' : 'Get My Full Breakdown →'}
            </button>
          </form>
          <p className="text-[10px] text-[#94a3b8] mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
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
      <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-3">Detailed Breakdown</p>
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
