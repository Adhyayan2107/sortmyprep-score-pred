'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ComponentInputs from '@/components/igcse/ComponentInputs'
import { calculateALevelGrade } from '@/lib/alevel-calc'
import { calculateASGrade } from '@/lib/as-calc'
import { calculateIGCSEGrade } from '@/lib/igcse-calc'
import { calculateIBGrade } from '@/lib/ib-calc'
import type { IBSubjectData } from '@/lib/types'
import CustomSelect from '@/components/shared/CustomSelect'
import { getIBSubjectData } from '@/lib/ib-data-loader'

// ─── Grade ordering ───────────────────────────────────────────────────────────
const GRADE_POINTS: Record<string, number> = {
  'A*': 6, 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1, 'U': 0,
}
const GRADE_COLORS: Record<string, { bg: string; text: string }> = {
  'A*': { bg: '#f5f3ff', text: '#7c3aed' },
  'A':  { bg: '#f0fdf4', text: '#16a34a' },
  'B':  { bg: '#eff6ff', text: '#2563eb' },
  'C':  { bg: '#fefce8', text: '#854d0e' },
  'D':  { bg: '#fff7ed', text: '#c2410c' },
  'E':  { bg: '#fef2f2', text: '#dc2626' },
  'U':  { bg: '#f9fafb', text: '#6b7280' },
}

// ─── Subject lists ────────────────────────────────────────────────────────────
const ALEVEL_SUBJECTS = [
  { label: 'Mathematics',        file: 'mathematics' },
  { label: 'Further Mathematics',file: 'further-mathematics' },
  { label: 'Physics',            file: 'physics' },
  { label: 'Chemistry',          file: 'chemistry' },
  { label: 'Biology',            file: 'biology' },
  { label: 'Computer Science',   file: 'computer-science' },
  { label: 'Economics',          file: 'economics' },
  { label: 'Business',           file: 'business' },
  { label: 'Accounting',         file: 'accounting' },
  { label: 'History',            file: 'history' },
  { label: 'Geography',          file: 'geography' },
  { label: 'Sociology',          file: 'sociology' },
  { label: 'Psychology',         file: 'psychology' },
  { label: 'Law',                file: 'law' },
  { label: 'English Language',   file: 'english-language' },
  { label: 'English Literature', file: 'english-literature' },
  { label: 'French',             file: 'french' },
  { label: 'Spanish',            file: 'spanish' },
]

const AS_SUBJECTS = [
  { label: 'Mathematics',        file: 'mathematics' },
  { label: 'Further Mathematics',file: 'further-mathematics' },
  { label: 'Physics',            file: 'physics' },
  { label: 'Chemistry',          file: 'chemistry' },
  { label: 'Biology',            file: 'biology' },
  { label: 'Computer Science',   file: 'computer-science' },
  { label: 'Economics',          file: 'economics' },
  { label: 'Business',           file: 'business' },
  { label: 'Accounting',         file: 'accounting' },
  { label: 'History',            file: 'history' },
  { label: 'Geography',          file: 'geography' },
  { label: 'Sociology',          file: 'sociology' },
  { label: 'Psychology',         file: 'psychology' },
  { label: 'Law',                file: 'law' },
  { label: 'English Language',   file: 'english-language' },
  { label: 'English Literature', file: 'english-literature' },
  { label: 'French',             file: 'french' },
  { label: 'Spanish',            file: 'spanish' },
]

const IGCSE_SUBJECTS = [
  { label: 'Mathematics',           file: 'mathematics' },
  { label: 'Additional Mathematics',file: 'additional-mathematics' },
  { label: 'Physics',               file: 'physics' },
  { label: 'Chemistry',             file: 'chemistry' },
  { label: 'Biology',               file: 'biology' },
  { label: 'Computer Science',      file: 'computer-science' },
  { label: 'ICT',                   file: 'ict' },
  { label: 'Economics',             file: 'economics' },
  { label: 'Business Studies',      file: 'business' },
  { label: 'Accounting',            file: 'accounting' },
  { label: 'History',               file: 'history' },
  { label: 'Geography',             file: 'geography' },
  { label: 'Sociology',             file: 'sociology' },
  { label: 'Global Perspectives',   file: 'global-perspectives' },
  { label: 'English Language',      file: 'english-language' },
  { label: 'English Literature',    file: 'english-literature' },
  { label: 'French',                file: 'french' },
  { label: 'Spanish',               file: 'spanish' },
  { label: 'Arabic',                file: 'arabic' },
  { label: 'Hindi',                 file: 'hindi' },
  { label: 'Urdu',                  file: 'urdu' },
  { label: 'Art & Design',          file: 'art-design' },
  { label: 'Design & Technology',   file: 'design-technology' },
  { label: 'Environmental Mgmt',    file: 'environmental-management' },
]

// ─── IB data file map ─────────────────────────────────────────────────────────
const IB_FILE_MAP: Record<string, string | null> = {
  'English A: Literature': 'english-a',
  'English A: Language & Literature': 'english-a',
  'English B': 'english-b',
  'French B': 'french-b',
  'Spanish B': 'spanish-b',
  'German B': 'german-b',
  'Mandarin B': 'mandarin-b',
  'Business Management': 'business-management',
  'Economics': 'economics',
  'Geography': 'geography',
  'Global Politics': 'global-politics',
  'History': 'history',
  'Psychology': 'psychology',
  'Biology': 'biology',
  'Chemistry': 'chemistry',
  'Computer Science': 'computer-science',
  'Environmental Systems & Societies': 'ess',
  'Physics': 'physics',
  'Mathematics: Analysis & Approaches (AA)': 'maths-aa',
  'Mathematics: Applications & Interpretation (AI)': 'maths-ai',
  'Film': 'film',
  'Music': 'music',
  'Theatre': 'theatre',
  'Visual Arts': 'visual-arts',
  // no data files for these:
  'French A: Literature': null,
  'Spanish A: Literature': null,
  'Hindi A: Literature': null,
  'Language A: Literature (Other)': null,
  'Japanese B': null,
  'Arabic B': null,
  'Hindi B': null,
  'Korean B': null,
  'ITGS': null,
  'Philosophy': null,
  'Social & Cultural Anthropology': null,
  'Design Technology': null,
  'Sports, Exercise & Health Science': null,
  'Dance': null,
}
const IB_SL_ONLY = new Set(['Environmental Systems & Societies'])

function subjectsForBoard(board: string) {
  if (board === 'alevel') return ALEVEL_SUBJECTS
  if (board === 'as')     return AS_SUBJECTS
  return IGCSE_SUBJECTS
}

// ─── Grade calculation helper ─────────────────────────────────────────────────
function calcSubjectGrade(board: string, data: any, marks: (number | null)[]): string | null {
  if (!data?.components || !data?.sessions) return null
  if (!marks.some(m => m !== null)) return null

  if (board === 'alevel') return calculateALevelGrade(data.components, marks, data.sessions).predictedGrade
  if (board === 'as')     return calculateASGrade(data.components, marks, data.sessions).predictedGrade
  return calculateIGCSEGrade(data.components, marks, data.sessions).predictedGrade
}

function computeOverall(grades: (string | null)[]): string {
  const valid = grades.filter(g => g && g !== 'U') as string[]
  return [...valid]
    .sort((a, b) => (GRADE_POINTS[b] ?? 0) - (GRADE_POINTS[a] ?? 0))
    .slice(0, 3)
    .join('')
}

// ─── Single subject card ──────────────────────────────────────────────────────
interface SubjectEntry {
  id: string
  file: string
  label: string
  data: any
  marks: (number | null)[]
  grade: string | null
}

function SubjectCard({
  entry,
  board,
  onMarksChange,
  onRemove,
}: {
  entry: SubjectEntry
  board: string
  onMarksChange: (id: string, marks: (number | null)[]) => void
  onRemove: (id: string) => void
}) {
  const colors = entry.grade ? GRADE_COLORS[entry.grade] : null

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden" style={{ animation: 'card-rise 0.35s ease both' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <p className="font-bold text-[#1a2340] text-sm">{entry.label}</p>
        <div className="flex items-center gap-3">
          {entry.grade && colors && (
            <span
              key={entry.grade}
              className="text-sm font-black px-2.5 py-1 rounded-lg"
              style={{
                backgroundColor: colors.bg,
                color: colors.text,
                animation: 'grade-badge-pop 0.45s cubic-bezier(0.34,1.56,0.64,1) both',
                display: 'inline-block',
              }}
            >
              {entry.grade}
            </span>
          )}
          <button
            onClick={() => onRemove(entry.id)}
            className="text-[#94a3b8] hover:text-red-400 transition-colors text-xs font-bold"
          >
            ✕ Remove
          </button>
        </div>
      </div>

      {entry.data?.components && (
        <div className="px-4 py-3">
          <ComponentInputs
            components={entry.data.components}
            marks={entry.marks}
            onChange={(i, val) => {
              const next = [...entry.marks]
              next[i] = val
              onMarksChange(entry.id, next)
            }}
          />
        </div>
      )}
    </div>
  )
}

// ─── Multi-subject entry (A Level / AS / IGCSE) ───────────────────────────────
function MultiSubjectEntry({ board }: { board: string }) {
  const router = useRouter()
  const subjects = subjectsForBoard(board)
  const [entries, setEntries] = useState<SubjectEntry[]>([])
  const [showPicker, setShowPicker] = useState(false)
  const [loadingFile, setLoadingFile] = useState('')

  const usedFiles = entries.map(e => e.file)

  // Restore saved state on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(`odds_multi_${board}`)
    if (!saved) return
    try {
      const parsed: Array<{ file: string; label: string; marks: (number | null)[]; grade: string | null }> = JSON.parse(saved)
      if (!Array.isArray(parsed) || parsed.length === 0) return
      Promise.all(
        parsed.map(async (p) => {
          const data = await import(`@/data/${board}/${p.file}.json`)
          return { id: `${p.file}-restored`, file: p.file, label: p.label, data: data.default, marks: p.marks, grade: p.grade } as SubjectEntry
        })
      ).then(restored => setEntries(restored))
    } catch {}
  }, [board])

  const handleAddSubject = useCallback(async (file: string, label: string) => {
    if (usedFiles.includes(file)) return
    setLoadingFile(file)
    const data = await import(`@/data/${board}/${file}.json`)
    const id = `${file}-${Date.now()}`
    setEntries(prev => [...prev, {
      id,
      file,
      label,
      data: data.default,
      marks: Array((data.default as any).components?.length ?? 0).fill(null),
      grade: null,
    }])
    setLoadingFile('')
    setShowPicker(false)
  }, [board, usedFiles])

  const handleMarksChange = useCallback((id: string, marks: (number | null)[]) => {
    setEntries(prev => prev.map(e => {
      if (e.id !== id) return e
      const grade = calcSubjectGrade(board, e.data, marks)
      return { ...e, marks, grade }
    }))
  }, [board])

  const handleRemove = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }, [])

  const grades = entries.map(e => e.grade)
  const overallGrade = computeOverall(grades)
  const gradedCount = grades.filter(Boolean).length
  const canProceed = overallGrade.length > 0

  const [prevCanProceed, setPrevCanProceed] = useState(false)
  const [nextBtnKey, setNextBtnKey] = useState(0)

  useEffect(() => {
    if (canProceed && !prevCanProceed) setNextBtnKey(k => k + 1)
    setPrevCanProceed(canProceed)
  }, [canProceed, prevCanProceed])

  const handleNext = () => {
    try {
      sessionStorage.setItem(`odds_multi_${board}`, JSON.stringify(
        entries.map(e => ({ file: e.file, label: e.label, marks: e.marks, grade: e.grade }))
      ))
    } catch {}
    router.push(`/odds?step=target&board=${board}&grade=${encodeURIComponent(overallGrade)}`)
  }

  const boardLabel: Record<string, string> = { alevel: 'A Level', as: 'AS Level', igcse: 'IGCSE' }
  const overallColors = overallGrade ? GRADE_COLORS[overallGrade[0] + (overallGrade[1] === '*' ? '*' : '')] : null

  return (
    <>
      <p className="text-sm text-[#64748b] text-center mb-6">
        Add your {boardLabel[board] ?? board} subjects, enter your marks — we'll calculate your predicted grade for each and your overall.
      </p>

      {/* Subject cards */}
      <div className="space-y-3 mb-4">
        {entries.map(entry => (
          <SubjectCard
            key={entry.id}
            entry={entry}
            board={board}
            onMarksChange={handleMarksChange}
            onRemove={handleRemove}
          />
        ))}
      </div>

      {/* Add subject button / picker */}
      {!showPicker ? (
        <button
          onClick={() => setShowPicker(true)}
          className="w-full border-2 border-dashed border-gray-300 rounded-2xl py-4 text-sm font-bold text-[#64748b] hover:border-[#2d7dd2] hover:text-[#2d7dd2] transition-all mb-6"
        >
          + Add Subject
        </button>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-4">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-bold text-[#1a2340] uppercase tracking-widest">Add a Subject</p>
            <button onClick={() => setShowPicker(false)} className="text-xs text-[#94a3b8] hover:text-[#1a2340] font-semibold">✕ Close</button>
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-3">
            {subjects.map(s => {
              const used = usedFiles.includes(s.file)
              const loading = loadingFile === s.file
              return (
                <button
                  key={s.file}
                  onClick={() => !used && handleAddSubject(s.file, s.label)}
                  disabled={used || !!loadingFile}
                  className={`relative flex flex-col items-center justify-center text-center px-2 py-3 rounded-xl text-xs font-semibold transition-all border gap-1 ${
                    used
                      ? 'bg-gray-50 text-[#94a3b8] border-gray-100 cursor-not-allowed'
                      : loading
                      ? 'bg-[#2d7dd2] text-white border-[#2d7dd2]'
                      : 'bg-white text-[#374151] border-gray-200 hover:border-[#2d7dd2] hover:text-[#2d7dd2] hover:bg-blue-50'
                  }`}
                >
                  <span className="leading-tight">{loading ? 'Loading…' : s.label}</span>
                  {used && <span className="text-[10px] text-emerald-600 font-bold">✓ Added</span>}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Overall grade display */}
      {entries.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
          <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-3">Your Overall (Top 3)</p>
          <div className="flex items-center gap-4">
            <div>
              {overallGrade ? (
                <p className="text-3xl font-black tracking-wide text-[#1a2340]">
                  {(overallGrade.match(/A\*|[A-E]/g) ?? []).map((g, i) => (
                    <span
                      key={i}
                      className="inline-block mr-0.5"
                      style={{ color: GRADE_COLORS[g]?.text ?? '#1a2340' }}
                    >
                      {g}
                    </span>
                  ))}
                </p>
              ) : (
                <p className="text-2xl font-black text-[#94a3b8]">—</p>
              )}
            </div>
            <div className="flex-1 text-xs text-[#64748b] leading-relaxed">
              {gradedCount === 0 && 'Enter marks to see predicted grades.'}
              {gradedCount > 0 && gradedCount < 3 && `${gradedCount} subject${gradedCount > 1 ? 's' : ''} calculated. Add more for a full comparison.`}
              {gradedCount >= 3 && 'Overall calculated from your top 3 grades.'}
            </div>
          </div>
        </div>
      )}

      {/* Sticky bottom bar */}
      <div className="sticky bottom-0 pb-6 pt-2 bg-[#f1f5f9]">
        <button
          key={nextBtnKey}
          onClick={handleNext}
          disabled={!canProceed}
          className={`w-full font-bold py-4 rounded-2xl text-base transition-colors shadow-lg ${
            canProceed
              ? 'bg-[#1a2340] text-white hover:bg-[#2d7dd2]'
              : 'bg-gray-200 text-[#94a3b8] cursor-not-allowed'
          }`}
          style={nextBtnKey > 0 && canProceed ? { animation: 'bounce-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both' } : {}}
        >
          {canProceed ? 'Next: Pick my university →' : 'Add subjects & enter marks to continue'}
        </button>
      </div>
    </>
  )
}

// ─── IB inline mark calculator ────────────────────────────────────────────────
function SubjectCalcPanel({
  subjectName,
  level,
  onGradeComputed,
}: {
  subjectName: string
  level: 'HL' | 'SL'
  onGradeComputed: (grade: number) => void
}) {
  const [data, setData] = useState<IBSubjectData | null>(null)
  const [iaMark, setIaMark] = useState('')
  const [paperMarks, setPaperMarks] = useState<string[]>([])
  const [computedGrade, setComputedGrade] = useState<number | null>(null)

  const fileBase = IB_FILE_MAP[subjectName] ?? null
  const levelStr = IB_SL_ONLY.has(subjectName) ? 'sl' : level.toLowerCase()

  useEffect(() => {
    setIaMark('')
    setPaperMarks([])
    setComputedGrade(null)
    if (!fileBase) { setData(null); return }
    const d = getIBSubjectData(fileBase, levelStr)
    setData(d)
    setPaperMarks(d ? Array(d.papers.length).fill('') : [])
  }, [fileBase, levelStr])

  useEffect(() => {
    if (!data) return
    const iaNum = iaMark !== '' ? Number(iaMark) : null
    const paperNums = paperMarks.map(m => m !== '' ? Number(m) : null)
    if (iaNum === null && paperNums.every(m => m === null)) return
    const r = calculateIBGrade(data.ia, data.papers, iaNum, paperNums, data.sessions)
    setComputedGrade(r.likelyGrade)
    onGradeComputed(r.likelyGrade)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iaMark, paperMarks, data])

  if (!data) return (
    <p className="text-xs text-amber-600 mt-3 bg-amber-50 rounded-xl px-3 py-2 text-center">
      No mark scheme available — select your grade manually above.
    </p>
  )

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-2.5">Enter marks to auto-fill</p>
      <div className="space-y-2">
        {/* IA row */}
        <div className="flex items-center gap-3 bg-[#f8fafc] rounded-xl px-3 py-2.5">
          <span className="text-xs font-semibold text-[#64748b] flex-1">Internal Assessment (IA)</span>
          <input
            type="number" min={0} max={data.ia.maxMark}
            value={iaMark}
            onKeyDown={e => ['e','E','+','-','.'].includes(e.key) && e.preventDefault()}
            onChange={e => {
              const raw = e.target.value.replace(/[^0-9]/g, '')
              setIaMark(raw === '' ? '' : String(Math.min(Number(raw), data.ia.maxMark)))
            }}
            placeholder="—"
            className="w-16 bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-bold text-[#1a2340] text-center outline-none focus:border-[#2d7dd2] transition-colors"
          />
          <span className="text-[10px] text-[#94a3b8] font-medium w-10 text-right shrink-0">/ {data.ia.maxMark}</span>
        </div>
        {/* Paper rows */}
        {data.papers.map((paper, pi) => (
          <div key={pi} className="flex items-center gap-3 bg-[#f8fafc] rounded-xl px-3 py-2.5">
            <span className="text-xs font-semibold text-[#64748b] flex-1 truncate">{paper.name}</span>
            <input
              type="number" min={0} max={paper.maxMark}
              value={paperMarks[pi] ?? ''}
              onKeyDown={e => ['e','E','+','-','.'].includes(e.key) && e.preventDefault()}
              onChange={e => {
                const raw = e.target.value.replace(/[^0-9]/g, '')
                const next = [...paperMarks]
                next[pi] = raw === '' ? '' : String(Math.min(Number(raw), paper.maxMark))
                setPaperMarks(next)
              }}
              placeholder="—"
              className="w-16 bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-bold text-[#1a2340] text-center outline-none focus:border-[#2d7dd2] transition-colors shrink-0"
            />
            <span className="text-[10px] text-[#94a3b8] font-medium w-10 text-right shrink-0">/ {paper.maxMark}</span>
          </div>
        ))}
      </div>
      {computedGrade !== null && (
        <div
          className="mt-2 py-2 px-3 bg-blue-50 rounded-xl text-center"
          style={{ animation: 'bounce-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both' }}
        >
          <p className="text-xs font-black text-[#2d7dd2]">Grade {computedGrade} calculated ✓</p>
        </div>
      )}
    </div>
  )
}

// ─── IB Entry — named subjects with HL/SL ─────────────────────────────────────
const IB_ALL_SUBJECTS = [
  // Group 1: Language A
  'English A: Literature', 'English A: Language & Literature',
  'French A: Literature', 'Spanish A: Literature', 'Hindi A: Literature',
  'Language A: Literature (Other)',
  // Group 2: Language B
  'English B', 'French B', 'Spanish B', 'German B',
  'Mandarin B', 'Japanese B', 'Arabic B', 'Hindi B', 'Korean B',
  // Group 3: Individuals & Societies
  'Business Management', 'Economics', 'Geography', 'Global Politics',
  'History', 'ITGS', 'Philosophy', 'Psychology', 'Social & Cultural Anthropology',
  // Group 4: Sciences
  'Biology', 'Chemistry', 'Computer Science', 'Design Technology',
  'Environmental Systems & Societies', 'Physics', 'Sports, Exercise & Health Science',
  // Group 5: Mathematics
  'Mathematics: Analysis & Approaches (AA)',
  'Mathematics: Applications & Interpretation (AI)',
  // Group 6: Arts / extra
  'Dance', 'Film', 'Music', 'Theatre', 'Visual Arts',
]

interface IBSubjectEntry { name: string; level: 'HL' | 'SL'; grade: number; showCalc: boolean }

function IBEntry({ board }: { board: string }) {
  const router = useRouter()
  const [subjects, setSubjects] = useState<IBSubjectEntry[]>([
    { name: '', level: 'HL', grade: 4, showCalc: false },
    { name: '', level: 'HL', grade: 4, showCalc: false },
    { name: '', level: 'HL', grade: 4, showCalc: false },
    { name: '', level: 'SL', grade: 4, showCalc: false },
    { name: '', level: 'SL', grade: 4, showCalc: false },
    { name: '', level: 'SL', grade: 4, showCalc: false },
  ])
  const [bonus, setBonus] = useState(0)

  // Restore saved state on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('odds_ib_state')
      if (!saved) return
      const { subjects: s, bonus: b } = JSON.parse(saved)
      if (Array.isArray(s) && s.length === 6) {
        setSubjects(s.map((sub: IBSubjectEntry) => ({ ...sub, showCalc: false })))
        if (typeof b === 'number') setBonus(b)
      }
    } catch {}
  }, [])

  const hlCount = subjects.filter(s => s.level === 'HL').length
  const total = subjects.reduce((s, sub) => s + sub.grade, 0) + bonus
  const pct = Math.round((total / 45) * 100)
  const canProceed = subjects.every(s => s.name !== '')

  const usedNames = subjects.map(s => s.name).filter(Boolean)
  const subjectOptions = IB_ALL_SUBJECTS.map(s => ({ value: s, label: s, disabled: usedNames.includes(s) }))

  const setLevel = (i: number, level: 'HL' | 'SL') => {
    const willBeHL = subjects.filter((s, idx) => (idx === i ? level === 'HL' : s.level === 'HL')).length
    if (level === 'HL' && willBeHL > 4) return
    setSubjects(prev => prev.map((s, idx) => idx === i ? { ...s, level } : s))
  }
  const setSubjectName = (i: number, name: string) => setSubjects(prev => prev.map((s, idx) => idx === i ? { ...s, name } : s))
  const setGrade = (i: number, grade: number) => setSubjects(prev => prev.map((s, idx) => idx === i ? { ...s, grade } : s))
  const toggleCalc = (i: number) => setSubjects(prev => prev.map((s, idx) => idx === i ? { ...s, showCalc: !s.showCalc } : s))
  const setGradeFromCalc = useCallback((i: number, grade: number) => {
    setSubjects(prev => prev.map((s, idx) => idx === i ? { ...s, grade } : s))
  }, [])

  return (
    <>
      {/* HL counter */}
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest">Your 6 Subjects</p>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
          hlCount < 3 ? 'bg-red-50 text-red-600' : hlCount === 4 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
        }`}>
          {hlCount} HL · {6 - hlCount} SL
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {subjects.map((sub, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Subject name + HL/SL */}
            <div className="flex items-center gap-2 px-3 pt-3 pb-2">
              <div className="flex-1 min-w-0">
                <CustomSelect
                  value={sub.name}
                  onChange={v => setSubjectName(i, v)}
                  options={subjectOptions}
                  placeholder={`Subject ${i + 1}…`}
                />
              </div>
              <div className="flex rounded-lg border border-gray-200 overflow-hidden shrink-0">
                {(['HL', 'SL'] as const).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setLevel(i, lvl)}
                    className={`px-3 py-1.5 text-xs font-black transition-colors ${
                      sub.level === lvl
                        ? lvl === 'HL' ? 'bg-[#1a2340] text-white' : 'bg-[#64748b] text-white'
                        : 'bg-white text-[#94a3b8] hover:bg-gray-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
            {/* Compact grade buttons */}
            <div className="flex gap-1 px-3 pb-3">
              {[1, 2, 3, 4, 5, 6, 7].map(g => (
                <button
                  key={g}
                  onClick={() => setGrade(i, g)}
                  className={`flex-1 h-9 rounded-lg text-sm font-black transition-all border ${
                    sub.grade === g
                      ? 'bg-[#1a2340] text-white border-[#1a2340] shadow-sm'
                      : 'bg-[#f8fafc] text-[#64748b] border-gray-200 hover:border-[#2d7dd2] hover:text-[#2d7dd2] hover:bg-blue-50'
                  }`}
                  style={sub.grade === g ? {
                    animation: 'grade-badge-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
                  } : {}}
                >
                  {g}
                </button>
              ))}
            </div>
            {sub.name && (
              <div className="px-3 pb-3 border-t border-gray-100 pt-2">
                <button
                  onClick={() => toggleCalc(i)}
                  className="text-[10px] font-bold text-[#2d7dd2] hover:underline flex items-center gap-1"
                >
                  {sub.showCalc ? '▲ Hide mark calculator' : '▼ Calculate from marks'}
                </button>
                {sub.showCalc && (
                  <SubjectCalcPanel
                    subjectName={sub.name}
                    level={sub.level}
                    onGradeComputed={g => setGradeFromCalc(i, g)}
                  />
                )}
              </div>
            )}
            {sub.level === 'HL' && hlCount > 4 && (
              <p className="text-xs text-red-500 px-3 pb-2 font-medium">Max 4 HL subjects allowed</p>
            )}
          </div>
        ))}

        {/* Core bonus */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#374151]">Core Bonus</p>
            <p className="text-xs text-[#94a3b8]">Extended Essay + Theory of Knowledge</p>
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map(b => (
              <button
                key={b}
                onClick={() => setBonus(b)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all border-2 ${
                  bonus === b ? 'bg-[#2d7dd2] text-white border-[#2d7dd2]' : 'bg-gray-50 text-[#374151] border-gray-200 hover:border-[#2d7dd2]'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Score display */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-[#94a3b8] font-medium uppercase tracking-widest">Predicted Total</p>
          <p className="text-3xl font-black text-[#1a2340] mt-0.5">
            {total} <span className="text-base font-semibold text-[#94a3b8]">/ 45</span>
          </p>
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-xs font-bold"
          style={{
            backgroundColor: pct >= 85 ? '#dcfce7' : pct >= 70 ? '#fef9c3' : '#fee2e2',
            color: pct >= 85 ? '#15803d' : pct >= 70 ? '#a16207' : '#b91c1c',
          }}
        >
          {pct}%
        </div>
      </div>

      <div className="sticky bottom-0 pb-6 pt-2 bg-[#f1f5f9]">
        <button
          onClick={() => {
            try { sessionStorage.setItem('odds_ib_state', JSON.stringify({ subjects, bonus })) } catch {}
            router.push(`/odds?step=target&board=${board}&points=${total}`)
          }}
          disabled={!canProceed}
          className={`w-full font-bold py-4 rounded-2xl text-base transition-colors shadow-lg ${
            canProceed ? 'bg-[#1a2340] text-white hover:bg-[#2d7dd2]' : 'bg-gray-200 text-[#94a3b8] cursor-not-allowed'
          }`}
        >
          {canProceed ? 'Next: Pick my university →' : 'Select all 6 subjects to continue'}
        </button>
      </div>
    </>
  )
}

// ─── AP Entry ─────────────────────────────────────────────────────────────────
const AP_SCORE_TO_GRADE: Record<number, string> = { 5: 'A*', 4: 'A', 3: 'B', 2: 'C', 1: 'D' }

const AP_SUBJECTS = [
  'AP Calculus AB', 'AP Calculus BC', 'AP Statistics',
  'AP Chemistry', 'AP Biology', 'AP Physics 1', 'AP Physics 2', 'AP Physics C: Mechanics',
  'AP Computer Science A', 'AP Computer Science Principles',
  'AP English Language', 'AP English Literature',
  'AP US History', 'AP World History', 'AP European History',
  'AP Economics (Macro)', 'AP Economics (Micro)',
  'AP Psychology', 'AP US Government', 'AP Comparative Government',
  'AP Art History', 'AP Spanish Language', 'AP French Language',
  'AP Environmental Science', 'AP Human Geography',
]

interface APSubject { name: string; score: number | null }

function APEntry({ board }: { board: string }) {
  const router = useRouter()
  const [subjects, setSubjects] = useState<APSubject[]>([{ name: '', score: null }])

  // Restore saved state on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('odds_ap_state')
      if (!saved) return
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) setSubjects(parsed)
    } catch {}
  }, [])

  const addSubject = () => setSubjects(prev => [...prev, { name: '', score: null }])
  const removeSubject = (i: number) => setSubjects(prev => prev.filter((_, idx) => idx !== i))
  const updateName = (i: number, name: string) => setSubjects(prev => prev.map((s, idx) => idx === i ? { ...s, name } : s))
  const updateScore = (i: number, score: number) => setSubjects(prev => prev.map((s, idx) => idx === i ? { ...s, score } : s))

  const grades = subjects
    .filter(s => s.name && s.score !== null)
    .map(s => AP_SCORE_TO_GRADE[s.score!])
    .filter(Boolean)

  const overallGrade = [...grades]
    .sort((a, b) => (GRADE_POINTS[b] ?? 0) - (GRADE_POINTS[a] ?? 0))
    .slice(0, 3)
    .join('')

  const canProceed = overallGrade.length > 0

  const usedNames = subjects.map(s => s.name).filter(Boolean)

  return (
    <>
      <p className="text-sm text-[#64748b] text-center mb-6">
        Add your AP subjects and select your score (1–5). We'll map them to grade equivalents and compare against university offers.
      </p>

      <div className="space-y-3 mb-4">
        {subjects.map((s, i) => {
          const apOptions = AP_SUBJECTS.map(sub => ({ value: sub, label: sub, disabled: usedNames.includes(sub) && sub !== s.name }))
          return (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4" style={{ animation: 'card-rise 0.3s ease both' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1 min-w-0">
                <CustomSelect
                  value={s.name}
                  onChange={v => updateName(i, v)}
                  options={apOptions}
                  placeholder="Select AP subject…"
                />
              </div>
              {subjects.length > 1 && (
                <button onClick={() => removeSubject(i)} className="text-xs text-[#94a3b8] hover:text-red-400 font-bold transition-colors shrink-0 ml-2">✕</button>
              )}
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(score => (
                <button
                  key={score}
                  onClick={() => updateScore(i, score)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all border-2 ${
                    s.score === score
                      ? 'bg-[#1a2340] text-white border-[#1a2340] scale-105'
                      : 'bg-gray-50 text-[#374151] border-gray-200 hover:border-[#2d7dd2] hover:text-[#2d7dd2]'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
            {s.score && (
              <p className="text-xs text-[#64748b] mt-2 text-center font-medium">
                Score {s.score} ≈ <span className="font-black" style={{ color: GRADE_COLORS[AP_SCORE_TO_GRADE[s.score]]?.text }}>{AP_SCORE_TO_GRADE[s.score]}</span> grade equivalent
              </p>
            )}
          </div>
          )
        })}
      </div>

      <button
        onClick={addSubject}
        className="w-full border-2 border-dashed border-gray-300 rounded-2xl py-3.5 text-sm font-bold text-[#64748b] hover:border-[#2d7dd2] hover:text-[#2d7dd2] transition-all mb-6"
      >
        + Add AP Subject
      </button>

      {grades.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
          <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-3">Your Overall (Top 3 AP)</p>
          <div className="flex items-center gap-4">
            <p className="text-3xl font-black tracking-wide text-[#1a2340]">
              {(overallGrade.match(/A\*|[A-E]/g) ?? []).map((g, idx) => (
                <span key={idx} className="inline-block mr-0.5" style={{ color: GRADE_COLORS[g]?.text ?? '#1a2340' }}>{g}</span>
              ))}
            </p>
            <p className="flex-1 text-xs text-[#64748b] leading-relaxed">
              {grades.length < 3 ? `${grades.length} subject${grades.length > 1 ? 's' : ''} scored. Add more for a fuller comparison.` : 'Based on your top 3 AP scores.'}
            </p>
          </div>
        </div>
      )}

      <div className="sticky bottom-0 pb-6 pt-2 bg-[#f1f5f9]">
        <button
          onClick={() => {
            try { sessionStorage.setItem('odds_ap_state', JSON.stringify(subjects)) } catch {}
            router.push(`/odds?step=target&board=${board}&grade=${encodeURIComponent(overallGrade)}`)
          }}
          disabled={!canProceed}
          className={`w-full font-bold py-4 rounded-2xl text-base transition-colors shadow-lg ${
            canProceed ? 'bg-[#1a2340] text-white hover:bg-[#2d7dd2]' : 'bg-gray-200 text-[#94a3b8] cursor-not-allowed'
          }`}
        >
          {canProceed ? 'Next: Pick my university →' : 'Score at least one AP to continue'}
        </button>
      </div>
    </>
  )
}

// ─── Page shell ───────────────────────────────────────────────────────────────
export default function OddsGradeEntry({ board }: { board: string }) {
  const boardLabels: Record<string, string> = {
    ib: 'IB', alevel: 'A Level', igcse: 'IGCSE', as: 'AS Level', ap: 'AP',
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/odds?step=board" className="text-xs font-bold text-[#64748b] hover:text-[#1a2340] transition-colors">← Back</Link>
          <Link href="/odds"><Image src="/logo.png" alt="sortmyprep" width={571} height={106} className="h-5 w-auto" /></Link>
          <span className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest">Step 2 of 3</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl sm:text-3xl font-black text-[#1a2340] mb-1 text-center">
          Your {boardLabels[board] ?? board} grades
        </h1>

        {board === 'ib'  && <IBEntry board={board} />}
        {board === 'ap'  && <APEntry board={board} />}
        {board !== 'ib' && board !== 'ap' && <MultiSubjectEntry board={board} />}
      </main>
    </div>
  )
}
