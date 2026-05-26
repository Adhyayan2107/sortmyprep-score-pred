'use client'
import { useState, useEffect, useRef } from 'react'
import type { IGCSESubjectData } from '@/lib/types'
import { calculateIGCSEGrade } from '@/lib/igcse-calc'
import { getStoredEmail } from '@/lib/email-gate'
import SubjectSelector from './SubjectSelector'
import ComponentInputs from './ComponentInputs'
import GradeOutput from './GradeOutput'
import GradeBar from './GradeBar'
import ReverseMode from './ReverseMode'
import EmailGateModal from '@/components/shared/EmailGateModal'

type Mode = 'predict' | 'reverse'

export default function IGCSECalculator() {
  const [subject, setSubject] = useState<IGCSESubjectData | null>(null)
  const [selectedFile, setSelectedFile] = useState('')
  const [marks, setMarks] = useState<(number | null)[]>([])
  const [mode, setMode] = useState<Mode>('predict')
  const [hasEmail, setHasEmail] = useState(false)
  const [showGate, setShowGate] = useState(false)
  const gateTriggered = useRef(false)

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
  const lockedIndices = marks.map((m, i) => m !== null ? i : -1).filter(i => i !== -1)

  const result = subject && hasValidMark
    ? calculateIGCSEGrade(subject.components, marks, subject.sessions)
    : null

  useEffect(() => {
    if (result && !hasEmail && !gateTriggered.current) {
      gateTriggered.current = true
      setShowGate(true)
    }
  }, [result, hasEmail])

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
                onClick={() => setMode(key)}
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

          <ComponentInputs
            components={subject.components}
            marks={marks}
            onChange={handleMarkChange}
            lockedIndices={mode === 'reverse' ? lockedIndices : []}
          />

          {mode === 'predict' && result && hasEmail && (
            <>
              <GradeOutput result={result} isPartial={isPartial} />
              <GradeBar result={result} score={result.weightedScore} />
            </>
          )}

{mode === 'predict' && !hasValidMark && (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-sm font-semibold text-[#94a3b8]">Enter your marks above</p>
              <p className="text-xs text-[#94a3b8] mt-1">Your grade prediction will appear here</p>
            </div>
          )}

          {mode === 'reverse' && (
            <ReverseMode
              components={subject.components}
              enteredMarks={marks}
              sessions={subject.sessions}
            />
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
