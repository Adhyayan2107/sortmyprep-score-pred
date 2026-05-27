import Image from 'next/image'
import Link from 'next/link'
import OddsLanding from '@/components/odds/OddsLanding'
import BoardPicker from '@/components/odds/BoardPicker'
import OddsGradeEntry from '@/components/odds/OddsGradeEntry'
import UniCoursePicker from '@/components/odds/UniCoursePicker'
import VerdictScreen from '@/components/odds/VerdictScreen'
import ResultCard from '@/components/odds/ResultCard'
import BreakdownPanel from '@/components/odds/BreakdownPanel'
import { UNIVERSITIES, COURSE_LABELS } from '@/data/universities'
import { computeVerdict } from '@/lib/verdict-engine'

function sp(p: { [k: string]: string | string[] | undefined }, key: string): string | null {
  const v = p[key]
  return typeof v === 'string' ? v : null
}

export default async function OddsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const p = await searchParams
  const step   = sp(p, 'step')
  const board  = sp(p, 'board')
  const uni    = sp(p, 'uni')
  const course = sp(p, 'course')
  const points = sp(p, 'points')
  const grade  = sp(p, 'grade')

  if (step === 'board') return <BoardPicker />

  if (step === 'grades' && board) {
    return <OddsGradeEntry board={board} />
  }

  if (step === 'target') {
    return <UniCoursePicker board={board ?? ''} points={points} grade={grade} />
  }

  if (step === 'result' && uni && course && board) {
    const uniData  = UNIVERSITIES.find(u => u.id === uni) ?? null
    const verdict  = uniData
      ? computeVerdict(board, uniData, points, grade)
      : 'STRONG_REACH'
    const uniName  = uniData?.name ?? uni
    const courseName = COURSE_LABELS[course] ?? course

    const backParams = new URLSearchParams({ step: 'target', board })
    if (points) backParams.set('points', points)
    if (grade)  backParams.set('grade', grade)
    const backUrl = `/odds?${backParams.toString()}`

    return (
      <div className="min-h-screen bg-[#f1f5f9]">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href={backUrl} className="text-xs font-bold text-[#64748b] hover:text-[#1a2340] transition-colors">← Back</Link>
            <Link href="/odds"><Image src="/logo.png" alt="sortmyprep" width={571} height={106} className="h-5 w-auto" /></Link>
            <Link href="/odds?step=board" className="text-xs font-bold text-[#64748b] hover:text-[#1a2340] transition-colors">Try Again</Link>
          </div>
        </header>

        <VerdictScreen
          verdict={verdict}
          uniName={uniName}
          uniLocation={uniData?.location ?? ''}
          courseName={courseName}
          board={board}
          points={points}
          grade={grade}
          backUrl={backUrl}
        />

        <div className="max-w-2xl mx-auto px-4 py-8 pb-16 space-y-6">
          {/* Waitlist banner */}
          <a
            href="https://tinyurl.com/sortmyprepwaitlist"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            style={{ animation: 'card-rise 0.4s 0.1s ease both' }}
          >
            <div className="bg-[#1a2340] px-5 py-4 flex items-center gap-4">
              <div className="text-2xl shrink-0">🎓</div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-black text-sm leading-tight">
                  Want to actually get in? Prep here.
                </p>
                <p className="text-white/55 text-xs mt-0.5 leading-snug">
                  Mark schemes, past papers &amp; study plans for A Level, IB, IGCSE &amp; more.
                </p>
              </div>
              <span className="shrink-0 bg-[#2d7dd2] text-white text-xs font-bold px-3 py-2 rounded-xl whitespace-nowrap">
                Join Waitlist →
              </span>
            </div>
          </a>

          <ResultCard
            verdict={verdict}
            uniName={uniName}
            courseName={courseName}
            board={board}
            points={points}
            grade={grade}
          />
          <BreakdownPanel
            verdict={verdict}
            board={board}
            uni={uniData}
            courseName={courseName}
            courseId={course}
            points={points}
            grade={grade}
          />
        </div>
      </div>
    )
  }

  return <OddsLanding />
}
