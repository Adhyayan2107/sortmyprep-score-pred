import type { ALevelComponent, ALevelSession, ALevelGrade, ALevelResult } from './types'

type ALevelBoundary = ALevelSession['boundaries']

function boundaryToEntries(b: ALevelBoundary): { grade: ALevelGrade; min: number }[] {
  const entries: { grade: ALevelGrade; min: number }[] = [
    { grade: 'A*', min: b.Astar },
    { grade: 'A',  min: b.A },
    { grade: 'B',  min: b.B },
    { grade: 'C',  min: b.C },
    { grade: 'D',  min: b.D },
    { grade: 'E',  min: b.E },
    { grade: 'U',  min: 0 },
  ]
  return entries.sort((a, b) => b.min - a.min)
}

function gradeFromScore(score: number, b: ALevelBoundary): ALevelGrade {
  for (const entry of boundaryToEntries(b)) {
    if (score >= entry.min) return entry.grade
  }
  return 'U'
}

function medianBoundary(sessions: ALevelSession[]): ALevelBoundary {
  const keys: (keyof ALevelBoundary)[] = ['Astar', 'A', 'B', 'C', 'D', 'E']
  const result = {} as ALevelBoundary
  for (const key of keys) {
    const vals = sessions.map(s => s.boundaries[key]).sort((a, b) => a - b)
    const mid = Math.floor(vals.length / 2)
    result[key] = vals.length % 2 === 0 ? Math.round((vals[mid - 1] + vals[mid]) / 2) : vals[mid]
  }
  return result
}

export function calculateALevelGrade(
  components: ALevelComponent[],
  enteredMarks: (number | null)[],
  sessions: ALevelSession[]
): ALevelResult {
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

  const boundaryRanges: ALevelResult['boundaryRanges'] = []
  for (let i = 0; i < entries.length; i++) {
    const max = i === 0 ? 100 : entries[i - 1].min - 0.01
    boundaryRanges.push({ grade: entries[i].grade, min: entries[i].min, max: Number(max.toFixed(2)) })
  }

  const predictedGrade = gradeFromScore(normalisedScore, medBoundary)
  const optimisticSession = sessions.reduce((b, s) => s.boundaries.Astar < b.boundaries.Astar ? s : b, sessions[0])
  const optimisticGrade = gradeFromScore(normalisedScore, optimisticSession.boundaries)
  const conservativeSession = sessions.reduce((b, s) => s.boundaries.Astar > b.boundaries.Astar ? s : b, sessions[0])
  const conservativeGrade = gradeFromScore(normalisedScore, conservativeSession.boundaries)

  return { weightedScore: Number(normalisedScore.toFixed(2)), predictedGrade, conservativeGrade, optimisticGrade, boundaryRanges }
}

export function calculateALevelRequiredMark(
  components: ALevelComponent[],
  lockedMarks: (number | null)[],
  targetGrade: ALevelGrade,
  sessions: ALevelSession[]
): { component: ALevelComponent; index: number; requiredMark: number; maxMark: number; achievable: boolean }[] {
  const medBoundary = medianBoundary(sessions)
  const targetScore = targetGrade === 'U' ? 0
    : targetGrade === 'A*' ? medBoundary.Astar
    : medBoundary[targetGrade as keyof ALevelBoundary]

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
    const share = comp.weight / remainingWeight
    const requiredMark = Math.ceil((needed * share / (comp.weight * 100)) * comp.maxMark)
    return { component: comp, index: i, requiredMark, maxMark: comp.maxMark, achievable: requiredMark <= comp.maxMark && requiredMark >= 0 }
  })
}
