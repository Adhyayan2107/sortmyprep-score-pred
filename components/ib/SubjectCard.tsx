'use client'

import { useState, useEffect } from 'react'
import type { IBSubjectData, IBGrade, Level } from '@/lib/types'
import { calculateIBGrade, calculateIBRequiredMarks } from '@/lib/ib-calc'

type InputMode = 'detailed' | 'quick' | 'reverse'

interface Props {
  subject: IBSubjectData
  level: Level
  isOpen: boolean
  onToggle: () => void
  onRemove: () => void
  onGradeChange: (grade: IBGrade) => void
}

const GRADE_COLORS: Record<IBGrade, { bg: string; text: string; border: string }> = {
  7: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
  6: { bg: '#f0fdf4', text: '#22c55e', border: '#bbf7d0' },
  5: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
  4: { bg: '#fefce8', text: '#854d0e', border: '#fef08a' },
  3: { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
  2: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  1: { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
}

export default function SubjectCard({ subject, level, isOpen, onToggle, onRemove, onGradeChange }: Props) {
  const [inputMode, setInputMode] = useState<InputMode>('detailed')
  const [quickGrade, setQuickGrade] = useState<IBGrade | null>(null)
  const [iaMark, setIaMark] = useState<number | null>(null)
  const [paperMarks, setPaperMarks] = useState<(number | null)[]>(new Array(subject.papers.length).fill(null))
  const [targetGrade, setTargetGrade] = useState<IBGrade>(6)

  const detailedResult = (iaMark !== null || paperMarks.some(m => m !== null))
    ? calculateIBGrade(subject.ia, subject.papers, iaMark, paperMarks, subject.sessions)
    : null

  const displayGrade: IBGrade | null = inputMode === 'quick'
    ? quickGrade
    : detailedResult?.likelyGrade ?? null

  useEffect(() => {
    if (displayGrade) onGradeChange(displayGrade)
  }, [displayGrade])

  const reverseResults = inputMode === 'reverse'
    ? calculateIBRequiredMarks(subject.ia, subject.papers, iaMark, paperMarks, targetGrade, subject.sessions)
    : []

  const colors = displayGrade ? GRADE_COLORS[displayGrade] : null

  const MODES: { key: InputMode; label: string }[] = [
    { key: 'detailed', label: 'From marks' },
    { key: 'quick', label: 'Quick grade' },
    { key: 'reverse', label: 'What do I need?' },
  ]

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden mb-3">
      {/* Header row — always visible */}
      <div
        className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors select-none"
        onClick={onToggle}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-[#1a2340] truncate">{subject.subject}</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              level === 'HL'
                ? 'bg-[#1a2340] text-white'
                : 'bg-gray-200 text-gray-700'
            }`}>
              {level}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {displayGrade && colors ? (
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-black border-2 shadow-sm"
              style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}
            >
              {displayGrade}
            </div>
          ) : (
            <div className="w-11 h-11 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-sm text-[#94a3b8] font-bold">?</span>
            </div>
          )}

          <span className="text-[#94a3b8] text-xs font-medium w-4 text-center">
            {isOpen ? '▲' : '▼'}
          </span>

          <button
            onClick={e => { e.stopPropagation(); onRemove() }}
            className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors flex items-center justify-center font-bold text-base leading-none"
          >
            ×
          </button>
        </div>
      </div>

      {/* Expanded panel */}
      {isOpen && (
        <div className="border-t-2 border-gray-100 px-5 pb-5 pt-4">
          {/* Mode tabs */}
          <div className="flex gap-1 mb-4 p-1 bg-gray-100 rounded-xl">
            {MODES.map(m => (
              <button
                key={m.key}
                onClick={() => setInputMode(m.key)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  inputMode === m.key
                    ? m.key === 'reverse'
                      ? 'bg-[#2d7dd2] text-white shadow-sm'
                      : 'bg-white text-[#1a2340] shadow-sm'
                    : 'text-[#94a3b8] hover:text-[#374151]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* FROM MARKS / REVERSE shared inputs */}
          {(inputMode === 'detailed' || inputMode === 'reverse') && (
            <div className="space-y-2 mb-3">
              {/* IA */}
              <div className="flex items-center justify-between rounded-xl border-2 border-gray-200 hover:border-[#2d7dd2]/40 px-4 py-3 transition-colors">
                <div>
                  <p className="text-xs font-bold text-[#374151]">Internal Assessment (IA)</p>
                  <p className="text-xs text-[#94a3b8]">Weight: {Math.round(subject.ia.weight * 100)}%</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    max={subject.ia.maxMark}
                    value={iaMark ?? ''}
                    onChange={e => setIaMark(e.target.value === '' ? null : Number(e.target.value))}
                    placeholder="—"
                    className="w-16 text-center rounded-lg border-2 border-gray-200 focus:border-[#2d7dd2] px-2 py-2 text-sm font-black focus:outline-none text-[#1a2340] bg-white transition-colors"
                  />
                  <span className="text-xs text-[#94a3b8] font-medium">/{subject.ia.maxMark}</span>
                </div>
              </div>

              {/* Papers */}
              {subject.papers.map((paper, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border-2 border-gray-200 hover:border-[#2d7dd2]/40 px-4 py-3 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-[#374151]">{paper.name}</p>
                    <p className="text-xs text-[#94a3b8]">Weight: {Math.round(paper.weight * 100)}%</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={paper.maxMark}
                      value={paperMarks[i] ?? ''}
                      onChange={e => {
                        const val = e.target.value === '' ? null : Number(e.target.value)
                        setPaperMarks(prev => { const next = [...prev]; next[i] = val; return next })
                      }}
                      placeholder="—"
                      className="w-16 text-center rounded-lg border-2 border-gray-200 focus:border-[#2d7dd2] px-2 py-2 text-sm font-black focus:outline-none text-[#1a2340] bg-white transition-colors"
                    />
                    <span className="text-xs text-[#94a3b8] font-medium">/{paper.maxMark}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DETAILED result */}
          {inputMode === 'detailed' && detailedResult && (
            <div
              className="rounded-xl px-4 py-3 flex items-center justify-between border-2"
              style={{
                backgroundColor: GRADE_COLORS[detailedResult.likelyGrade].bg,
                borderColor: GRADE_COLORS[detailedResult.likelyGrade].border,
              }}
            >
              <div>
                <p className="text-xs text-[#94a3b8]">
                  Range:{' '}
                  <span className="font-bold text-[#374151]">{detailedResult.conservativeGrade}</span>
                  {' – '}
                  <span className="font-bold text-[#374151]">{detailedResult.optimisticGrade}</span>
                </p>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  Score: <span className="font-bold text-[#374151]">{detailedResult.combinedScore.toFixed(0)}</span>/100
                </p>
              </div>
              <div style={{ color: GRADE_COLORS[detailedResult.likelyGrade].text }}>
                <span className="text-3xl font-black">{detailedResult.likelyGrade}</span>
                <span className="text-xs block text-center font-semibold opacity-70">likely</span>
              </div>
            </div>
          )}

          {/* QUICK GRADE */}
          {inputMode === 'quick' && (
            <div>
              <p className="text-xs text-[#94a3b8] mb-3">Tap your predicted or received grade</p>
              <div className="flex gap-1.5">
                {([7, 6, 5, 4, 3, 2, 1] as IBGrade[]).map(g => {
                  const c = GRADE_COLORS[g]
                  const isSelected = quickGrade === g
                  return (
                    <button
                      key={g}
                      onClick={() => setQuickGrade(isSelected ? null : g)}
                      className={`flex-1 py-3 rounded-xl text-sm font-black border-2 transition-all ${
                        isSelected ? 'shadow-md scale-105' : 'border-gray-200 text-gray-400 hover:border-gray-300 bg-white'
                      }`}
                      style={isSelected ? { backgroundColor: c.bg, color: c.text, borderColor: c.border } : {}}
                    >
                      {g}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* REVERSE MODE */}
          {inputMode === 'reverse' && (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <p className="text-xs font-bold text-[#374151] shrink-0">Target grade:</p>
                <div className="flex gap-1 flex-1">
                  {([7, 6, 5, 4, 3] as IBGrade[]).map(g => {
                    const c = GRADE_COLORS[g]
                    return (
                      <button
                        key={g}
                        onClick={() => setTargetGrade(g)}
                        className={`flex-1 py-2 rounded-lg text-sm font-black border-2 transition-all ${
                          targetGrade === g ? 'shadow-sm' : 'border-gray-200 text-gray-400 bg-white'
                        }`}
                        style={targetGrade === g ? { backgroundColor: c.bg, color: c.text, borderColor: c.border } : {}}
                      >
                        {g}
                      </button>
                    )
                  })}
                </div>
              </div>

              {reverseResults.length === 0 ? (
                <div className="rounded-xl bg-[#f0fdf4] border border-green-200 px-4 py-3 text-sm text-[#16a34a] font-medium">
                  All papers entered — nothing left to calculate
                </div>
              ) : (
                <div className="space-y-2">
                  {reverseResults.map(r => (
                    <div
                      key={r.index}
                      className={`rounded-xl border-2 px-4 py-3 flex items-center justify-between ${
                        r.achievable
                          ? 'bg-[#eff6ff] border-[#bfdbfe]'
                          : 'bg-[#fef2f2] border-[#fecaca]'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-[#374151]">{r.paper.name}</p>
                        {r.achievable && (
                          <p className="text-xs text-[#94a3b8] mt-0.5">
                            {Math.round((r.requiredMark / r.maxMark) * 100)}% of marks needed
                          </p>
                        )}
                      </div>
                      {r.achievable ? (
                        <div className="text-right">
                          <span className="text-2xl font-black text-[#1a2340]">{r.requiredMark}</span>
                          <span className="text-xs text-[#94a3b8] font-medium ml-0.5">/{r.maxMark}</span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-[#dc2626]">Not achievable</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-[#94a3b8] mt-3">
                Based on median boundaries · Papers with a mark entered are treated as done; empty ones show what you need
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
