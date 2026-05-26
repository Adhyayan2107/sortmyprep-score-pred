'use client'
import { useState, useEffect } from 'react'
import type { IGCSESubjectData, IGCSEGrade } from '@/lib/types'
import { calculateIGCSEGrade } from '@/lib/igcse-calc'
import { getStoredEmail } from '@/lib/email-gate'
import SubjectSelector from './SubjectSelector'
import ComponentInputs from './ComponentInputs'
import GradeOutput from './GradeOutput'
import GradeBar from './GradeBar'
import ReverseMode from './ReverseMode'
import EmailGateModal from '@/components/shared/EmailGateModal'

type Mode = 'predict' | 'reverse'

const IGCSE_GRADES: IGCSEGrade[] = ['A*', 'A', 'B', 'C', 'D', 'E']
const GRADE_COLORS: Partial<Record<IGCSEGrade, { bg: string; text: string }>> = {
  'A*': { bg: '#f0fdf4', text: '#16a34a' },
  'A':  { bg: '#f0fdf4', text: '#22c55e' },
  'B':  { bg: '#eff6ff', text: '#2563eb' },
  'C':  { bg: '#fefce8', text: '#854d0e' },
  'D':  { bg: '#fff7ed', text: '#c2410c' },
  'E':  { bg: '#fef2f2', text: '#dc2626' },
}

export default function IGCSECalculator() {
  const [subject, setSubject] = useState<IGCSESubjectData | null>(null)
  const [selectedFile, setSelectedFile] = useState('')
  const [marks, setMarks] = useState<(number | null)[]>([])
  const [mode, setMode] = useState<Mode>('predict')
  const [targetGrade, setTargetGrade] = useState<IGCSEGrade>('A')
  const [hasEmail, setHasEmail] = useState(false)
  const [showGate, setShowGate] = useState(false)

  useEffect(() => {
    if (getStoredEmail()) setHasEmail(true)
  }, [])

  const handleSubjectChange = (data: IGCSESubjectData, file: string) => {
    setSubject(data)
    setSelectedFile(file)
    setMarks(new Array(data.components.length).fill(null))
    setMode('predict')
  }

  const handleMarkChange = (index: number, value: number | null) => {
    setMarks(prev => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const hasValidMark = marks.some(m => m !== null && m >= 0)
  const isPartial = hasValidMark && marks.some(m => m === null)

  const result = subject && hasValidMark
    ? calculateIGCSEGrade(subject.components, marks, subject.sessions)
    : null

  return (
    <div>
      <SubjectSelector selectedFile={selectedFile} onSubjectChange={handleSubjectChange} />

      {subject && (
        <>
          {/* Mode switcher */}
          <div className="flex gap-1 mb-4 p-1 bg-white rounded-xl border border-gray-200 shadow-sm">
            {([
              { key: 'predict', label: 'Predict my grade' },
              { key: 'reverse', label: 'What do I need?' },
            ] as { key: Mode; label: string }[]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setMode(key); setMarks(new Array(subject.components.length).fill(null)) }}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                  mode === key
                    ? key === 'reverse'
                      ? 'bg-[#2d7dd2] text-white shadow-sm'
                      : 'bg-[#1a2340] text-white shadow-sm'
                    : 'text-[#94a3b8] hover:text-[#374151]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* PREDICT MODE */}
          {mode === 'predict' && (
            <>
              <ComponentInputs
                components={subject.components}
                marks={marks}
                onChange={handleMarkChange}
              />

              {result && hasEmail && (
                <>
                  <GradeOutput result={result} isPartial={isPartial} />
                  <GradeBar result={result} score={result.weightedScore} />
                </>
              )}

              {result && !hasEmail && (
                <div
                  className="relative cursor-pointer select-none"
                  onClick={() => setShowGate(true)}
                >
                  <div className="blur-sm pointer-events-none opacity-70">
                    <GradeOutput result={result} isPartial={isPartial} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-6 py-4 text-center">
                      <div className="text-2xl mb-1">🔒</div>
                      <p className="text-sm font-bold text-[#1a2340]">Tap to unlock your grade</p>
                      <p className="text-xs text-[#94a3b8] mt-1">One-time email · free forever</p>
                    </div>
                  </div>
                </div>
              )}

              {!hasValidMark && (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
                  <div className="text-4xl mb-3">📝</div>
                  <p className="text-sm font-semibold text-[#94a3b8]">Enter your marks above</p>
                  <p className="text-xs text-[#94a3b8] mt-1">Your grade prediction will appear here</p>
                </div>
              )}
            </>
          )}

          {/* REVERSE MODE */}
          {mode === 'reverse' && (
            <>
              {/* Target grade — at top */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
                <label className="block text-xs font-bold text-[#1a2340] uppercase tracking-widest mb-3">Target Grade</label>
                <div className="flex gap-2">
                  {IGCSE_GRADES.map(g => {
                    const c = GRADE_COLORS[g]
                    return (
                      <button
                        key={g}
                        onClick={() => setTargetGrade(g)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-black border-2 transition-all ${
                          targetGrade === g ? 'shadow-sm scale-105 border-transparent' : 'border-gray-200 text-gray-400 hover:border-gray-300 bg-white'
                        }`}
                        style={targetGrade === g && c ? { backgroundColor: c.bg, color: c.text } : {}}
                      >
                        {g}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Required marks results */}
              <ReverseMode
                components={subject.components}
                enteredMarks={marks}
                sessions={subject.sessions}
                targetGrade={targetGrade}
              />

              {/* Already scored inputs */}
              <div className="mt-4">
                <ComponentInputs
                  components={subject.components}
                  marks={marks}
                  onChange={handleMarkChange}
                  label="Already scored"
                  note="Leave blank for papers not yet taken"
                />
              </div>
            </>
          )}
        </>
      )}

      {!subject && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <div className="text-5xl mb-4">🎓</div>
          <p className="text-base font-bold text-[#1a2340]">Select a subject to get started</p>
          <p className="text-sm text-[#94a3b8] mt-1">10 IGCSE subjects available</p>
        </div>
      )}

      {showGate && (
        <EmailGateModal onComplete={() => { setHasEmail(true); setShowGate(false) }} />
      )}
    </div>
  )
}
