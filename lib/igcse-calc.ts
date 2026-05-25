import type { IGCSEComponent, IGCSESession, IGCSEGrade, IGCSEResult } from './types'

const GRADE_ORDER: IGCSEGrade[] = ['A*', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'U']

function boundaryToScore(boundaries: IGCSESession['boundaries']): { grade: IGCSEGrade; min: number }[] {
  const entries: { grade: IGCSEGrade; min: number }[] = [
    { grade: 'A*', min: boundaries.Astar },
    { grade: 'A', min: boundaries.A },
    { grade: 'B', min: boundaries.B },
    { grade: 'C', min: boundaries.C },
    { grade: 'D', min: boundaries.D },
    { grade: 'E', min: boundaries.E },
  ]
  if (boundaries.F !== undefined) entries.push({ grade: 'F', min: boundaries.F })
  if (boundaries.G !== undefined) entries.push({ grade: 'G', min: boundaries.G })
  entries.push({ grade: 'U', min: 0 })
  return entries.sort((a, b) => b.min - a.min)
}

function gradeFromScore(score: number, session: IGCSESession): IGCSEGrade {
  const entries = boundaryToScore(session.boundaries)
  for (const entry of entries) {
    if (score >= entry.min) return entry.grade
  }
  return 'U'
}

function medianBoundary(sessions: IGCSESession[]): IGCSESession['boundaries'] {
  const keys: (keyof IGCSESession['boundaries'])[] = ['Astar', 'A', 'B', 'C', 'D', 'E', 'F', 'G']
  const result: IGCSESession['boundaries'] = { Astar: 0, A: 0, B: 0, C: 0, D: 0, E: 0 }
  for (const key of keys) {
    const vals = sessions.map(s => s.boundaries[key]).filter((v): v is number => v !== undefined)
    if (vals.length === 0) continue
    vals.sort((a, b) => a - b)
    const mid = Math.floor(vals.length / 2)
    ;(result as unknown as Record<string, number>)[key] = vals.length % 2 === 0 ? Math.round((vals[mid - 1] + vals[mid]) / 2) : vals[mid]
  }
  return result
}

export function calculateIGCSEGrade(
  components: IGCSEComponent[],
  enteredMarks: (number | null)[],
  sessions: IGCSESession[]
): IGCSEResult {
  let weightedScore = 0
  let totalWeight = 0

  for (let i = 0; i < components.length; i++) {
    const mark = enteredMarks[i]
    if (mark === null || mark === undefined) continue
    const comp = components[i]
    weightedScore += (mark / comp.maxMark) * comp.weight * 100
    totalWeight += comp.weight
  }

  // Normalise to full weight if partial entry
  const normalisedScore = totalWeight > 0 ? weightedScore / totalWeight * 1 : 0

  // Build boundary ranges from median session
  const medBoundary = medianBoundary(sessions)
  const entries = boundaryToScore(medBoundary)
  const boundaryRanges: IGCSEResult['boundaryRanges'] = []
  for (let i = 0; i < entries.length; i++) {
    const max = i === 0 ? 100 : entries[i - 1].min - 0.01
    boundaryRanges.push({ grade: entries[i].grade, min: entries[i].min, max: Number(max.toFixed(2)) })
  }

  // Likely = median boundary
  const medSession: IGCSESession = { id: 'median', boundaries: medBoundary }
  const predictedGrade = gradeFromScore(normalisedScore, medSession)

  // Optimistic = lowest threshold (easiest session)
  const optimisticSession = sessions.reduce((best, s) => s.boundaries.Astar < best.boundaries.Astar ? s : best, sessions[0])
  const optimisticGrade = gradeFromScore(normalisedScore, optimisticSession)

  // Conservative = highest threshold (hardest session)
  const conservativeSession = sessions.reduce((hardest, s) => s.boundaries.Astar > hardest.boundaries.Astar ? s : hardest, sessions[0])
  const conservativeGrade = gradeFromScore(normalisedScore, conservativeSession)

  return {
    weightedScore: Number(normalisedScore.toFixed(2)),
    predictedGrade,
    conservativeGrade,
    optimisticGrade,
    boundaryRanges,
  }
}

export function calculateRequiredMark(
  components: IGCSEComponent[],
  lockedMarks: (number | null)[],
  targetGrade: IGCSEGrade,
  sessions: IGCSESession[]
): { component: IGCSEComponent; index: number; requiredMark: number; maxMark: number; achievable: boolean }[] {
  const medBoundary = medianBoundary(sessions)
  const targetBoundaryKey = targetGrade === 'A*' ? 'Astar' : targetGrade as keyof IGCSESession['boundaries']
  const targetScore = (medBoundary as unknown as Record<string, number>)[targetBoundaryKey] ?? 0

  let lockedScore = 0
  let lockedWeight = 0
  const unlockedIndices: number[] = []

  for (let i = 0; i < components.length; i++) {
    const mark = lockedMarks[i]
    if (mark !== null && mark !== undefined) {
      lockedScore += (mark / components[i].maxMark) * components[i].weight * 100
      lockedWeight += components[i].weight
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
