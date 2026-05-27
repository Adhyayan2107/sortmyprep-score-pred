import type { University } from '@/data/universities'

export type Verdict = 'COMPETITIVE' | 'BORDERLINE' | 'REACH' | 'STRONG_REACH'

const GRADE_POINTS: Record<string, number> = {
  'A*': 6, 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1, 'U': 0,
}

function avgGradeString(s: string): number {
  const matches = s.match(/A\*|[A-E]/g) ?? []
  if (!matches.length) return 0
  return matches.reduce((sum, g) => sum + (GRADE_POINTS[g] ?? 0), 0) / matches.length
}

export function computeVerdict(
  board: string,
  university: University,
  points?: string | null,
  grade?: string | null,
): Verdict {
  if (board === 'ib') {
    const pts = parseInt(points ?? '0', 10)
    const { competitive, borderline, reach } = university.offers.ib
    if (pts >= competitive) return 'COMPETITIVE'
    if (pts >= borderline) return 'BORDERLINE'
    if (pts >= reach)      return 'REACH'
    return 'STRONG_REACH'
  }

  const studentScore = GRADE_POINTS[grade ?? ''] ?? 0
  const boardKey = board as 'alevel' | 'igcse' | 'as'
  const thresholds = university.offers[boardKey]
  if (!thresholds) return 'STRONG_REACH'

  const compScore   = avgGradeString(thresholds.competitive)
  const borderScore = avgGradeString(thresholds.borderline)
  const reachScore  = avgGradeString(thresholds.reach)

  if (studentScore >= compScore)   return 'COMPETITIVE'
  if (studentScore >= borderScore) return 'BORDERLINE'
  if (studentScore >= reachScore)  return 'REACH'
  return 'STRONG_REACH'
}

export const VERDICT_THEME: Record<Verdict, { bg: string; accent: string; label: string }> = {
  COMPETITIVE:  { bg: '#052e16', accent: '#22c55e', label: 'COMPETITIVE' },
  BORDERLINE:   { bg: '#422006', accent: '#f59e0b', label: 'BORDERLINE' },
  REACH:        { bg: '#450a0a', accent: '#ef4444', label: 'REACH' },
  STRONG_REACH: { bg: '#09090b', accent: '#6b7280', label: 'STRONG REACH' },
}

export function getVerdictCopy(
  verdict: Verdict,
  uniName: string,
  scoreDisplay: string,
): string {
  switch (verdict) {
    case 'COMPETITIVE':
      return `Your ${scoreDisplay} clears ${uniName}'s typical offer. You're in a strong position.`
    case 'BORDERLINE':
      return `Your ${scoreDisplay} sits just at ${uniName}'s typical offer range. You're close — one subject makes the difference.`
    case 'REACH':
      return `Your ${scoreDisplay} is below ${uniName}'s typical offer. Achievable with a strong push.`
    case 'STRONG_REACH':
      return `Your ${scoreDisplay} is significantly below ${uniName}'s typical offer. A long shot — but long shots do land.`
  }
}

export function getScoreDisplay(board: string, points?: string | null, grade?: string | null): string {
  if (board === 'ib') return `${points ?? 0} IB points`
  return `predicted ${grade ?? '?'}`
}

export function getGapToNextTier(
  verdict: Verdict,
  board: string,
  university: University,
  points?: string | null,
): number {
  if (board !== 'ib') return 0
  const pts = parseInt(points ?? '0', 10)
  const { competitive, borderline, reach } = university.offers.ib
  if (verdict === 'BORDERLINE')   return competitive - pts
  if (verdict === 'REACH')        return borderline - pts
  if (verdict === 'STRONG_REACH') return reach - pts
  return 0
}
