'use client'

import { useState, useRef, useEffect } from 'react'
import type { IBGrade, TOKEEGrade, IBCoreMatrix } from '@/lib/types'
import type { SelectedSubject } from './SubjectBuilder'
import SubjectBuilder from './SubjectBuilder'
import SubjectCard from './SubjectCard'
import CoreCalculator from './CoreCalculator'
import DiplomaPanel from './DiplomaPanel'
import EmailGateModal from '@/components/shared/EmailGateModal'
import { calculateDiploma } from '@/lib/ib-calc'
import { getStoredEmail } from '@/lib/email-gate'
import coreMatrix from '@/data/ib-core-matrix.json'

export default function IBCalculator() {
  const [subjects, setSubjects] = useState<SelectedSubject[]>([])
  const [subjectGrades, setSubjectGrades] = useState<Record<number, IBGrade>>({})
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [tokGrade, setTokGrade] = useState<TOKEEGrade | null>(null)
  const [eeGrade, setEeGrade] = useState<TOKEEGrade | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [hasEmail, setHasEmail] = useState(false)
  const [showGate, setShowGate] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (getStoredEmail()) setHasEmail(true)
  }, [])

  const handleAdd = (subject: SelectedSubject) => {
    setSubjects(prev => [...prev, subject])
    setOpenIndex(subjects.length)
  }

  const handleRemove = (index: number) => {
    setSubjects(prev => prev.filter((_, i) => i !== index))
    setSubjectGrades(prev => {
      const next: Record<number, IBGrade> = {}
      Object.entries(prev).forEach(([k, v]) => {
        const ki = Number(k)
        if (ki < index) next[ki] = v
        else if (ki > index) next[ki - 1] = v
      })
      return next
    })
    setOpenIndex(prev => {
      if (prev === null) return null
      if (prev === index) return null
      if (prev > index) return prev - 1
      return prev
    })
  }

  const handleGradeChange = (index: number, grade: IBGrade) => {
    setSubjectGrades(prev => ({ ...prev, [index]: grade }))
  }

  const completedCount = Object.keys(subjectGrades).filter(k => Number(k) < subjects.length).length

  const gradedSubjects = subjects
    .map((s, i) => subjectGrades[i] !== undefined ? { grade: subjectGrades[i], level: s.level } : null)
    .filter((x): x is { grade: IBGrade; level: 'HL' | 'SL' } => x !== null)

  const diplomaResult = calculateDiploma(
    gradedSubjects,
    tokGrade,
    eeGrade,
    (coreMatrix as IBCoreMatrix).matrix
  )

  const canCheck = completedCount > 0
  const progressPct = subjects.length === 0 ? 0 : Math.round((completedCount / Math.max(subjects.length, 1)) * 100)

  const revealSummary = () => {
    setShowSummary(true)
    setTimeout(() => summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const handleCheckSummary = () => {
    if (!hasEmail) { setShowGate(true); return }
    revealSummary()
  }

  const handleEmailComplete = () => {
    setHasEmail(true)
    setShowGate(false)
    revealSummary()
  }

  return (
    // Extra bottom padding so the sticky bar doesn't overlap content
    <div className="pb-28">
      <SubjectBuilder
        selected={subjects}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />

      {subjects.length > 0 && (
        <div className="mb-4">
          {subjects.map((s, i) => (
            <SubjectCard
              key={`${s.file}-${s.level}-${i}`}
              subject={s.data}
              level={s.level}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              onRemove={() => handleRemove(i)}
              onGradeChange={grade => handleGradeChange(i, grade)}
            />
          ))}
        </div>
      )}

      {subjects.length > 0 && (
        <CoreCalculator
          matrix={coreMatrix as IBCoreMatrix}
          tokGrade={tokGrade}
          eeGrade={eeGrade}
          onTokChange={setTokGrade}
          onEeChange={setEeGrade}
        />
      )}

      {/* Diploma summary — only shown after clicking Check */}
      {showSummary && completedCount > 0 && (
        <div ref={summaryRef} className="mt-4">
          <DiplomaPanel result={diplomaResult} subjectCount={completedCount} />
        </div>
      )}

      {subjects.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-[#94a3b8] text-sm">Add subjects above to build your IB diploma calculator</p>
        </div>
      )}

      {showGate && <EmailGateModal onComplete={handleEmailComplete} />}

      {/* Sticky bottom progress bar — only when subjects are added */}
      {subjects.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t-2 border-gray-200 shadow-lg">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              {/* Progress section */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-[#374151]">
                    {completedCount}/{subjects.length} grades entered
                  </span>
                  {completedCount > 0 && (
                    <span className="text-xs font-bold text-[#2d7dd2]">
                      {diplomaResult.totalPoints} pts so far
                    </span>
                  )}
                </div>
                {/* Segmented bar */}
                <div className="flex gap-1 h-2.5">
                  {subjects.map((_, i) => {
                    const hasGrade = subjectGrades[i] !== undefined
                    const grade = subjectGrades[i]
                    const color = hasGrade
                      ? grade >= 6 ? '#16a34a'
                      : grade >= 4 ? '#2d7dd2'
                      : grade >= 3 ? '#f97316'
                      : '#dc2626'
                      : undefined
                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-300 ${
                          hasGrade ? '' : 'bg-gray-200'
                        }`}
                        style={hasGrade ? { backgroundColor: color } : {}}
                      />
                    )
                  })}
                  {/* Empty slots up to 6 */}
                  {Array.from({ length: Math.max(0, 6 - subjects.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className="flex-1 rounded-full bg-gray-100 border border-dashed border-gray-300" />
                  ))}
                </div>
              </div>

              {/* CTA button */}
              <button
                disabled={!canCheck}
                onClick={handleCheckSummary}
                className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  canCheck
                    ? 'bg-[#1a2340] text-white hover:bg-[#2d7dd2] shadow-md hover:shadow-lg active:scale-95'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Check summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
