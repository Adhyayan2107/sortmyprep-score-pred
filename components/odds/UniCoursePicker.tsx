'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { UNIVERSITIES, POPULAR_UNI_IDS, COURSE_LABELS } from '@/data/universities'

const COURSE_ICONS: Record<string, string> = {
  medicine:    '🩺',
  engineering: '⚙️',
  cs:          '💻',
  economics:   '📈',
  law:         '⚖️',
  sciences:    '🔬',
  humanities:  '📚',
  business:    '💼',
  arts:        '🎨',
}

export default function UniCoursePicker({
  board,
  points,
  grade,
}: {
  board: string
  points?: string | null
  grade?: string | null
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [selectedUni, setSelectedUni] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)

  const popularUnis = POPULAR_UNI_IDS.map(id => UNIVERSITIES.find(u => u.id === id)).filter(Boolean)

  const filtered = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return UNIVERSITIES.filter(u => u.name.toLowerCase().includes(q) || u.location.toLowerCase().includes(q))
  }, [query])

  const handleSeeOdds = () => {
    if (!selectedUni || !selectedCourse) return
    const params = new URLSearchParams({ step: 'result', uni: selectedUni, course: selectedCourse, board })
    if (points) params.set('points', points)
    if (grade) params.set('grade', grade)
    router.push(`/odds?${params.toString()}`)
  }

  const backParams = new URLSearchParams({ step: 'grades', board })
  if (points) backParams.set('points', points)
  if (grade) backParams.set('grade', grade)

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href={`/odds?${backParams.toString()}`}>
            <Image src="/logo.png" alt="sortmyprep" width={571} height={106} className="h-5 w-auto" />
          </Link>
          <span className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest">Step 3 of 3</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 pb-32">
        <h1 className="text-2xl sm:text-3xl font-black text-[#1a2340] mb-1 text-center">
          Pick your dream uni &amp; course
        </h1>
        <p className="text-sm text-[#64748b] text-center mb-8">We'll compare your grade against their typical offer.</p>

        {/* University picker */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
          <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-3">University</p>

          <input
            type="text"
            placeholder="Search university..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1a2340] placeholder:text-[#94a3b8] outline-none focus:border-[#2d7dd2] mb-3"
          />

          {filtered.length > 0 && (
            <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
              {filtered.map(u => u && (
                <button
                  key={u.id}
                  onClick={() => { setSelectedUni(u.id); setQuery('') }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                >
                  <span className="font-semibold text-[#1a2340]">{u.name}</span>
                  <span className="text-[#94a3b8] ml-2">{u.location}</span>
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {popularUnis.map(u => u && (
              <button
                key={u.id}
                onClick={() => setSelectedUni(u.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  selectedUni === u.id
                    ? 'bg-[#1a2340] text-white border-[#1a2340]'
                    : 'bg-gray-50 text-[#374151] border-gray-200 hover:border-[#2d7dd2] hover:text-[#2d7dd2]'
                }`}
              >
                {u.name}
              </button>
            ))}
          </div>
        </div>

        {/* Course picker */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
          <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-3">Course</p>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(COURSE_LABELS).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setSelectedCourse(id)}
                className={`rounded-xl py-3 px-2 flex flex-col items-center gap-1.5 transition-all border-2 ${
                  selectedCourse === id
                    ? 'bg-[#1a2340] text-white border-[#1a2340]'
                    : 'bg-gray-50 text-[#374151] border-gray-100 hover:border-[#2d7dd2]'
                }`}
              >
                <span className="text-xl">{COURSE_ICONS[id]}</span>
                <span className="text-[11px] font-bold leading-tight text-center">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-[#f1f5f9]/90 backdrop-blur-md border-t border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          {selectedUni && selectedCourse && (
            <p className="text-xs text-center text-[#64748b] mb-2 font-medium">
              {UNIVERSITIES.find(u => u.id === selectedUni)?.name} · {COURSE_LABELS[selectedCourse]}
            </p>
          )}
          <button
            onClick={handleSeeOdds}
            disabled={!selectedUni || !selectedCourse}
            className={`w-full font-bold py-4 rounded-2xl text-base transition-colors shadow-lg ${
              selectedUni && selectedCourse
                ? 'bg-[#1a2340] text-white hover:bg-[#2d7dd2]'
                : 'bg-gray-200 text-[#94a3b8] cursor-not-allowed'
            }`}
          >
            {selectedUni && selectedCourse ? 'See My Odds →' : 'Pick uni + course to continue'}
          </button>
        </div>
      </div>
    </div>
  )
}
