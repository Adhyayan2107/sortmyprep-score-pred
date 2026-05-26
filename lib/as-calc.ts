import type { ASComponent, ASSession, ASGrade, ASResult } from './types'

const GRADE_ORDER: ASGrade[] = ['A', 'B', 'C', 'D', 'E', 'U']

function boundaryToEntries(boundaries: ASBoundary): { grade: ASGrade; min: number }[] {
  const entries: { grade: ASGrade; min: number }[] = [
    { grade: 'A' as ASGrade, min: boundaries.A },
    { grade: 'B' as ASGrade, min: boundaries.B },
    { grade: 'C' as ASGrade, min: boundaries.C },
    { grade: 'D' as ASGrade, min: boundaries.D },
    { grade: 'E' as ASGrade, min: boundaries.E },
    { grade: 'U' as ASGrade, min: 0 },
  ]
  return entries.sort((a, b) => b.min - a.min)
}

type ASBoundary = ASSession['boundaries']

function gradeFromScore(score: number, boundaries: ASBoundary): ASGrade {
  for (const entry of boundaryToEntries(boundaries)) {
    if (score >= entry.min) return entry.grade
  }
  return 'U'
}

function medianBoundary(sessions: ASSession[]): ASBoundary {
  const keys: (keyof ASBoundary)[] = ['A', 'B', 'C', 'D', 'E']
  const result = {} as ASBoundary
  for (const key of keys) {
    const vals = sessions.map(s => s.boundaries[key]).sort((a, b) => a - b)
    const mid = Math.floor(vals.length / 2)
    result[key] = vals.length % 2 === 0 ? Math.round((vals[mid - 1] + vals[mid]) / 2) : vals[mid]
  }
  return result
}

export function calculateASGrade(
  components: ASComponent[],
  enteredMarks: (number | null)[],
  sessions: ASSession[]
): ASResult {
  let weightedScore = 0
  let totalWeight = 0

  for (let i = 0; i < components.length; i++) {
    const mark = enteredMarks[i]
    if (mark === null || mark === undefined) continue
    const comp = components[i]
    weightedScore += (mark / comp.maxMark) * comp.weight * 100
    totalWeight += comp.weight
  }

  const normalisedScore = totalWeight > 0 ? weightedScore / totalWeight : 0

  const medBoundary = medianBoundary(sessions)
  const entries = boundaryToEntries(medBoundary)
  const boundaryRanges: ASResult['boundaryRanges'] = []
  for (let i = 0; i < entries.length; i++) {
    const max = i === 0 ? 100 : entries[i - 1].min - 0.01
    boundaryRanges.push({ grade: entries[i].grade, min: entries[i].min, max: Number(max.toFixed(2)) })
  }

  const predictedGrade = gradeFromScore(normalisedScore, medBoundary)
  const optimisticSession = sessions.reduce((best, s) => s.boundaries.A < best.boundaries.A ? s : best, sessions[0])
  const optimisticGrade = gradeFromScore(normalisedScore, optimisticSession.boundaries)
  const conservativeSession = sessions.reduce((hard, s) => s.boundaries.A > hard.boundaries.A ? s : hard, sessions[0])
  const conservativeGrade = gradeFromScore(normalisedScore, conservativeSession.boundaries)

  return {
    weightedScore: Number(normalisedScore.toFixed(2)),
    predictedGrade,
    conservativeGrade,
    optimisticGrade,
    boundaryRanges,
  }
}

export function calculateASRequiredMark(
  components: ASComponent[],
  lockedMarks: (number | null)[],
  targetGrade: ASGrade,
  sessions: ASSession[]
): { component: ASComponent; index: number; requiredMark: number; maxMark: number; achievable: boolean }[] {
  const medBoundary = medianBoundary(sessions)
  const targetScore = targetGrade === 'U' ? 0 : medBoundary[targetGrade as keyof ASBoundary]

  let lockedScore = 0
  const unlockedIndices: number[] = []

  for (let i = 0; i < components.length; i++) {
    const mark = lockedMarks[i]
    if (mark !== null && mark !== undefined) {
      lockedScore += (mark / components[i].maxMark) * components[i].weight * 100
    } else {
      unlockedIndices.push(i)
    }
  }

  const remainingWeight = unlockedIndices.reduce((sum, i) => sum + components[i].weight, 0)

  return unlockedIndices.map(i => {
    const comp = components[i]
    const needed = targetScore - lockedScore
    const componentShare = comp.weight / remainingWeight
    const requiredWeightedContrib = needed * componentShare
    const requiredRaw = (requiredWeightedContrib / (comp.weight * 100)) * comp.maxMark
    const requiredMark = Math.ceil(requiredRaw)
    return {
      component: comp,
      index: i,
      requiredMark,
      maxMark: comp.maxMark,
      achievable: requiredMark <= comp.maxMark && requiredMark >= 0,
    }
  })
}
