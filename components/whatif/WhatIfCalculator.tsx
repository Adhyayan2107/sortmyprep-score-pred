'use client'
import { useState, useMemo } from 'react'
import CustomSelect from '@/components/shared/CustomSelect'

type WBoard = 'igcse' | 'as' | 'alevel'

interface WComponent { name: string; maxMark: number; weight: number }
interface WSubject {
  subject: string
  components: WComponent[]
  boundaries: Record<string, number>
  hasAstar: boolean
}

const GRADE_STYLE: Record<string, { bg: string; text: string }> = {
  'A*': { bg: '#7c3aed', text: '#fff' },
  'A':  { bg: '#16a34a', text: '#fff' },
  'B':  { bg: '#2563eb', text: '#fff' },
  'C':  { bg: '#d97706', text: '#fff' },
  'D':  { bg: '#ea580c', text: '#fff' },
  'E':  { bg: '#dc2626', text: '#fff' },
  'U':  { bg: '#e5e7eb', text: '#6b7280' },
}

const IGCSE_SUBJECTS = [
  { label: '0580 · Mathematics', file: 'mathematics' },
  { label: '0606 · Additional Mathematics', file: 'additional-mathematics' },
  { label: '0625 · Physics', file: 'physics' },
  { label: '0620 · Chemistry', file: 'chemistry' },
  { label: '0610 · Biology', file: 'biology' },
  { label: '0478 · Computer Science', file: 'computer-science' },
  { label: '0417 · ICT', file: 'ict' },
  { label: '0680 · Environmental Management', file: 'environmental-management' },
  { label: '0455 · Economics', file: 'economics' },
  { label: '0450 · Business', file: 'business' },
  { label: '0452 · Accounting', file: 'accounting' },
  { label: '0470 · History', file: 'history' },
  { label: '0460 · Geography', file: 'geography' },
  { label: '0495 · Sociology', file: 'sociology' },
  { label: '0457 · Global Perspectives', file: 'global-perspectives' },
  { label: '0500 · English Language', file: 'english-language' },
  { label: '0475 · English Literature', file: 'english-literature' },
  { label: '0520 · French', file: 'french' },
  { label: '0530 · Spanish', file: 'spanish' },
  { label: '0544 · Arabic', file: 'arabic' },
  { label: '0549 · Hindi', file: 'hindi' },
  { label: '0539 · Urdu', file: 'urdu' },
  { label: '0400 · Art & Design', file: 'art-design' },
  { label: '0445 · Design & Technology', file: 'design-technology' },
]

const AS_SUBJECTS = [
  { label: '9709 · Mathematics', file: 'mathematics' },
  { label: '9231 · Further Mathematics', file: 'further-mathematics' },
  { label: '9702 · Physics', file: 'physics' },
  { label: '9701 · Chemistry', file: 'chemistry' },
  { label: '9700 · Biology', file: 'biology' },
  { label: '9618 · Computer Science', file: 'computer-science' },
  { label: '9708 · Economics', file: 'economics' },
  { label: '9609 · Business', file: 'business' },
  { label: '9706 · Accounting', file: 'accounting' },
  { label: '9489 · History', file: 'history' },
  { label: '9696 · Geography', file: 'geography' },
  { label: '9699 · Sociology', file: 'sociology' },
  { label: '9990 · Psychology', file: 'psychology' },
  { label: '9084 · Law', file: 'law' },
  { label: '9093 · English Language', file: 'english-language' },
  { label: '9695 · English Literature', file: 'english-literature' },
  { label: '9716 · French', file: 'french' },
  { label: '9719 · Spanish', file: 'spanish' },
]

const ALEVEL_SUBJECTS = [
  { label: '9709 · Mathematics', file: 'mathematics' },
  { label: '9231 · Further Mathematics', file: 'further-mathematics' },
  { label: '9702 · Physics', file: 'physics' },
  { label: '9701 · Chemistry', file: 'chemistry' },
  { label: '9700 · Biology', file: 'biology' },
  { label: '9618 · Computer Science', file: 'computer-science' },
  { label: '9708 · Economics', file: 'economics' },
  { label: '9609 · Business', file: 'business' },
  { label: '9706 · Accounting', file: 'accounting' },
  { label: '9489 · History', file: 'history' },
  { label: '9696 · Geography', file: 'geography' },
  { label: '9699 · Sociology', file: 'sociology' },
  { label: '9990 · Psychology', file: 'psychology' },
  { label: '9084 · Law', file: 'law' },
  { label: '9093 · English Language', file: 'english-language' },
  { label: '9695 · English Literature', file: 'english-literature' },
  { label: '9716 · French', file: 'french' },
  { label: '9719 · Spanish', file: 'spanish' },
]

const SUBJECT_LISTS: Record<WBoard, typeof IGCSE_SUBJECTS> = {
  igcse: IGCSE_SUBJECTS,
  as: AS_SUBJECTS,
  alevel: ALEVEL_SUBJECTS,
}

function calcScore(components: WComponent[], marks: number[]): number {
  let score = 0, totalWeight = 0
  for (let i = 0; i < components.length; i++) {
    score += (marks[i] / components[i].maxMark) * components[i].weight * 100
    totalWeight += components[i].weight
  }
  return totalWeight > 0 ? score / totalWeight : 0
}

function scoreToGrade(score: number, boundaries: Record<string, number>, hasAstar: boolean): string {
  if (hasAstar && boundaries.Astar !== undefined && score >= boundaries.Astar) return 'A*'
  if (score >= boundaries.A) return 'A'
  if (score >= boundaries.B) return 'B'
  if (score >= boundaries.C) return 'C'
  if (score >= boundaries.D) return 'D'
  if (score >= boundaries.E) return 'E'
  return 'U'
}

function gridSteps(maxMark: number): number[] {
  const N = 6
  return Array.from({ length: N + 1 }, (_, i) => Math.round(maxMark * i / N))
}

const BOARD_LABELS: Record<WBoard, string> = { igcse: 'IGCSE', as: 'AS Level', alevel: 'A Level' }

export default function WhatIfCalculator() {
  const [board, setBoard] = useState<WBoard>('igcse')
  const [selectedFile, setSelectedFile] = useState('')
  const [subject, setSubject] = useState<WSubject | null>(null)
  const [marks, setMarks] = useState<number[]>([])
  const [xIdx, setXIdx] = useState(0)
  const [yIdx, setYIdx] = useState(1)

  const handleBoardChange = (b: WBoard) => {
    setBoard(b)
    setSelectedFile('')
    setSubject(null)
    setMarks([])
  }

  const handleSubjectChange = async (file: string) => {
    if (!file) return
    setSelectedFile(file)
    let raw: any
    if (board === 'igcse') raw = (await import(`@/data/igcse/${file}.json`)).default
    else if (board === 'as') raw = (await import(`@/data/as/${file}.json`)).default
    else raw = (await import(`@/data/alevel/${file}.json`)).default

    const hasAstar = board !== 'as'
    setSubject({
      subject: raw.subject,
      components: raw.components,
      boundaries: raw.sessions[0].boundaries,
      hasAstar,
    })
    // Default marks: 50% of max for each component (middle of slider)
    setMarks(raw.components.map((c: WComponent) => Math.round(c.maxMark * 0.7)))
    setXIdx(0)
    setYIdx(Math.min(1, raw.components.length - 1))
  }

  const currentScore = subject ? calcScore(subject.components, marks) : 0
  const currentGrade = subject ? scoreToGrade(currentScore, subject.boundaries, subject.hasAstar) : null
  const gradeStyle = currentGrade ? GRADE_STYLE[currentGrade] : null

  const xSteps = useMemo(() => subject ? gridSteps(subject.components[xIdx].maxMark) : [], [subject, xIdx])
  const ySteps = useMemo(() => subject ? [...gridSteps(subject.components[yIdx].maxMark)].reverse() : [], [subject, yIdx])

  const getGradeAt = (xMark: number, yMark: number): string => {
    if (!subject) return 'U'
    const m = [...marks]
    m[xIdx] = xMark
    m[yIdx] = yMark
    return scoreToGrade(calcScore(subject.components, m), subject.boundaries, subject.hasAstar)
  }

  const closestX = xSteps.length ? xSteps.reduce((a, b) => Math.abs(a - marks[xIdx]) < Math.abs(b - marks[xIdx]) ? a : b) : null
  const closestY = ySteps.length ? ySteps.reduce((a, b) => Math.abs(a - marks[yIdx]) < Math.abs(b - marks[yIdx]) ? a : b) : null

  const subjectOptions = SUBJECT_LISTS[board].map(s => ({ value: s.file, label: s.label }))

  return (
    <div>
      {/* Board toggle */}
      <div className="flex gap-1 mb-4 p-1 bg-white rounded-xl border border-gray-200 shadow-sm">
        {(['igcse', 'as', 'alevel'] as WBoard[]).map(b => (
          <button
            key={b}
            onClick={() => handleBoardChange(b)}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              board === b ? 'bg-[#1a2340] text-white shadow-sm' : 'text-[#94a3b8] hover:text-[#374151]'
            }`}
          >
            {BOARD_LABELS[b]}
          </button>
        ))}
      </div>

      {/* Subject selector */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <label className="block text-xs font-bold text-[#1a2340] uppercase tracking-widest mb-3">
          Select Subject
        </label>
        <CustomSelect
          value={selectedFile}
          onChange={handleSubjectChange}
          options={subjectOptions}
          placeholder="Choose a subject…"
        />
      </div>

      {!subject && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <div className="text-5xl mb-4">🎲</div>
          <p className="text-base font-bold text-[#1a2340]">What if you got different marks?</p>
          <p className="text-sm text-[#94a3b8] mt-1">Pick a subject and slide through every grade outcome</p>
        </div>
      )}

      {subject && (
        <>
          {/* Mark sliders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#1a2340] uppercase tracking-widest">Your Marks</span>
              {currentGrade && gradeStyle && (
                <span
                  className="text-sm font-black px-3 py-1 rounded-full"
                  style={{ backgroundColor: gradeStyle.bg, color: gradeStyle.text }}
                >
                  {currentGrade}
                </span>
              )}
            </div>

            <div className="space-y-5">
              {subject.components.map((comp, i) => {
                const pct = Math.round((marks[i] / comp.maxMark) * 100)
                return (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-sm font-semibold text-[#374151] leading-tight">{comp.name}</span>
                      <span className="text-sm font-black text-[#1a2340] ml-2 shrink-0">
                        {marks[i]}<span className="text-[#94a3b8] font-normal">/{comp.maxMark}</span>
                        <span className="text-xs text-[#94a3b8] ml-1">({pct}%)</span>
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={comp.maxMark}
                      step={1}
                      value={marks[i]}
                      onChange={e => {
                        const next = [...marks]
                        next[i] = parseInt(e.target.value)
                        setMarks(next)
                      }}
                      className="w-full cursor-pointer accent-[#1a2340]"
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Live grade card */}
          {currentGrade && gradeStyle && (
            <div
              className="rounded-2xl p-5 mb-4 text-center"
              style={{ backgroundColor: gradeStyle.bg }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-60" style={{ color: gradeStyle.text }}>
                Predicted Grade
              </p>
              <p className="text-6xl font-black" style={{ color: gradeStyle.text }}>{currentGrade}</p>
              <p className="text-xs mt-2 opacity-70 font-medium" style={{ color: gradeStyle.text }}>
                Weighted score: {currentScore.toFixed(1)}%
              </p>
            </div>
          )}

          {/* Criss-Cross Grid */}
          {subject.components.length >= 2 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
              <p className="text-xs font-bold text-[#1a2340] uppercase tracking-widest mb-1">Criss Cross</p>
              <p className="text-xs text-[#94a3b8] mb-4">Every grade outcome for any two papers — your estimate is highlighted</p>

              {/* Axis selectors if 3+ components */}
              {subject.components.length > 2 && (
                <div className="flex gap-2 mb-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest block mb-1">X Axis</label>
                    <select
                      className="w-full text-xs font-semibold border border-gray-200 rounded-lg px-2 py-1.5 text-[#374151]"
                      value={xIdx}
                      onChange={e => {
                        const v = parseInt(e.target.value)
                        setXIdx(v)
                        if (v === yIdx) setYIdx(v === 0 ? 1 : 0)
                      }}
                    >
                      {subject.components.map((c, i) => (
                        <option key={i} value={i}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest block mb-1">Y Axis</label>
                    <select
                      className="w-full text-xs font-semibold border border-gray-200 rounded-lg px-2 py-1.5 text-[#374151]"
                      value={yIdx}
                      onChange={e => {
                        const v = parseInt(e.target.value)
                        setYIdx(v)
                        if (v === xIdx) setXIdx(v === 0 ? 1 : 0)
                      }}
                    >
                      {subject.components.map((c, i) => (
                        <option key={i} value={i}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Grid */}
              <div className="overflow-x-auto -mx-1">
                <table className="w-full border-separate border-spacing-0.5 text-center text-xs font-black" style={{ minWidth: '280px' }}>
                  <thead>
                    <tr>
                      <td className="text-[9px] text-[#94a3b8] font-medium pb-1 pr-1 text-right align-bottom" style={{ maxWidth: '50px' }}>
                        <span className="block truncate" title={subject.components[yIdx].name}>{subject.components[yIdx].name.split(' ')[0]}</span>
                        <span className="text-[#cbd5e1]">↕</span>
                      </td>
                      {xSteps.map(x => (
                        <td key={x} className="text-[9px] text-[#94a3b8] font-bold pb-1 px-0.5">{x}</td>
                      ))}
                    </tr>
                    <tr>
                      <td />
                      <td colSpan={xSteps.length} className="text-[9px] text-[#94a3b8] font-medium pb-1 text-center">
                        {subject.components[xIdx].name.split(' ')[0]} →
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {ySteps.map(y => (
                      <tr key={y}>
                        <td className="text-[9px] text-[#94a3b8] font-bold pr-1 text-right">{y}</td>
                        {xSteps.map(x => {
                          const g = getGradeAt(x, y)
                          const style = GRADE_STYLE[g]
                          const isHighlighted = x === closestX && y === closestY
                          return (
                            <td
                              key={x}
                              className="rounded-md transition-all"
                              style={{
                                backgroundColor: style.bg,
                                color: style.text,
                                padding: '5px 2px',
                                outline: isHighlighted ? '2px solid #1a2340' : 'none',
                                outlineOffset: '1px',
                                position: 'relative',
                              }}
                            >
                              {g}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(GRADE_STYLE).map(([grade, s]) => (
                  <span key={grade} className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>
                    {grade}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sensitivity strip */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-bold text-[#1a2340] uppercase tracking-widest mb-1">Grade Sensitivity</p>
            <p className="text-xs text-[#94a3b8] mb-4">How each paper affects your grade if you adjust by ±5 marks</p>
            <div className="space-y-3">
              {subject.components.map((comp, i) => {
                const steps = [-10, -5, 0, 5, 10].map(delta => {
                  const m = [...marks]
                  m[i] = Math.max(0, Math.min(comp.maxMark, marks[i] + delta))
                  const g = scoreToGrade(calcScore(subject.components, m), subject.boundaries, subject.hasAstar)
                  return { delta, actual: m[i], grade: g }
                })
                return (
                  <div key={i}>
                    <p className="text-xs font-semibold text-[#374151] mb-1.5 truncate">{comp.name}</p>
                    <div className="flex gap-1">
                      {steps.map(({ delta, actual, grade }) => {
                        const s = GRADE_STYLE[grade]
                        const isCurrent = delta === 0
                        return (
                          <div
                            key={delta}
                            className="flex-1 rounded-lg py-1.5 text-center"
                            style={{
                              backgroundColor: s.bg,
                              color: s.text,
                              outline: isCurrent ? '2px solid #1a2340' : 'none',
                              outlineOffset: '1px',
                            }}
                          >
                            <div className="text-[10px] font-black">{grade}</div>
                            <div className="text-[8px] opacity-70">{actual}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-[10px] text-[#94a3b8] mt-3 text-center">Outlined = your current mark</p>
          </div>
        </>
      )}
    </div>
  )
}
