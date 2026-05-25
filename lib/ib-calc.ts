import type { IBPaper, IBSession, IBGrade, IBSubjectResult, DiplomaResult, TOKEEGrade } from './types'

function gradeFromScore(score: number, sessions: IBSession[]): IBGrade {
  const boundaries = medianBoundary(sessions)
  const grades: IBGrade[] = [7, 6, 5, 4, 3, 2, 1]
  for (const g of grades) {
    if (score >= boundaries[g]) return g
  }
  return 1
}

function medianBoundary(sessions: IBSession[]): Record<IBGrade, number> {
  const grades: IBGrade[] = [7, 6, 5, 4, 3, 2, 1]
  const result = {} as Record<IBGrade, number>
  for (const g of grades) {
    const vals = sessions.map(s => s.boundaries[g]).sort((a, b) => a - b)
    const mid = Math.floor(vals.length / 2)
    result[g] = vals.length % 2 === 0 ? Math.round((vals[mid - 1] + vals[mid]) / 2) : vals[mid]
  }
  return result
}

export function calculateIBGrade(
  ia: { maxMark: number; weight: number },
  papers: IBPaper[],
  iaMark: number | null,
  paperMarks: (number | null)[],
  sessions: IBSession[]
): IBSubjectResult {
  let combinedScore = 0
  let totalWeight = 0

  if (iaMark !== null) {
    combinedScore += (iaMark / ia.maxMark) * ia.weight * 100
    totalWeight += ia.weight
  }

  for (let i = 0; i < papers.length; i++) {
    const mark = paperMarks[i]
    if (mark === null) continue
    combinedScore += (mark / papers[i].maxMark) * papers[i].weight * 100
    totalWeight += papers[i].weight
  }

  const normalisedScore = totalWeight > 0 ? combinedScore / totalWeight : 0

  const likelyGrade = gradeFromScore(normalisedScore, sessions)

  const optimisticSession = sessions.reduce((best, s) => s.boundaries[7] < best.boundaries[7] ? s : best, sessions[0])
  const conservativeSession = sessions.reduce((hardest, s) => s.boundaries[7] > hardest.boundaries[7] ? s : hardest, sessions[0])

  const optimisticGrade = gradeFromScore(normalisedScore, [optimisticSession])
  const conservativeGrade = gradeFromScore(normalisedScore, [conservativeSession])

  return {
    combinedScore: Number(normalisedScore.toFixed(2)),
    likelyGrade,
    conservativeGrade,
    optimisticGrade,
  }
}

export function calculateIBRequiredMarks(
  ia: { maxMark: number; weight: number },
  papers: IBPaper[],
  iaMark: number | null,
  paperMarks: (number | null)[],
  targetGrade: IBGrade,
  sessions: IBSession[]
): { paper: IBPaper; index: number; requiredMark: number; maxMark: number; achievable: boolean }[] {
  const boundaries = medianBoundary(sessions)
  const targetScore = boundaries[targetGrade]

  let lockedScore = 0
  let lockedWeight = 0

  if (iaMark !== null) {
    lockedScore += (iaMark / ia.maxMark) * ia.weight * 100
    lockedWeight += ia.weight
  }

  const unlockedIndices: number[] = []
  for (let i = 0; i < papers.length; i++) {
    const mark = paperMarks[i]
    if (mark !== null) {
      lockedScore += (mark / papers[i].maxMark) * papers[i].weight * 100
      lockedWeight += papers[i].weight
    } else {
      unlockedIndices.push(i)
    }
  }

  const remainingWeight = unlockedIndices.reduce((sum, i) => sum + papers[i].weight, 0)

  return unlockedIndices.map(i => {
    const paper = papers[i]
    const needed = targetScore - lockedScore
    const componentShare = paper.weight / remainingWeight
    const requiredRaw = (needed * componentShare) / (paper.weight * 100) * paper.maxMark

    const requiredMark = Math.ceil(requiredRaw)
    return {
      paper,
      index: i,
      requiredMark,
      maxMark: paper.maxMark,
      achievable: requiredMark <= paper.maxMark && requiredMark >= 0,
    }
  })
}

export function calculateDiploma(
  subjectGrades: { grade: IBGrade; level: 'HL' | 'SL' }[],
  tokGrade: TOKEEGrade | null,
  eeGrade: TOKEEGrade | null,
  coreMatrix: Record<string, Record<string, number | 'fail'>>
): DiplomaResult {
  const warnings: string[] = []
  let coreBonus = 0

  if (tokGrade && eeGrade) {
    const bonus = coreMatrix[tokGrade]?.[eeGrade]
    if (bonus === 'fail') {
      warnings.push('E in TOK and/or EE — diploma not awarded')
      coreBonus = 0
    } else {
      coreBonus = bonus as number
    }
  }

  const grades = subjectGrades.map(s => s.grade)
  const hlGrades = subjectGrades.filter(s => s.level === 'HL').map(s => s.grade)
  const totalPoints = grades.reduce((a, b) => a + b, 0) + coreBonus

  if (totalPoints < 24) warnings.push('Total below 24 — diploma not awarded')
  if (grades.some(g => g < 2)) warnings.push('Grade below 2 in at least one subject')
  if (grades.filter(g => g === 2).length > 2) warnings.push('More than 2 grade 2s')
  if (grades.filter(g => g <= 3).length > 3) warnings.push('More than 3 grades of 3 or below')
  if (hlGrades.length > 0 && hlGrades.reduce((a, b) => a + b, 0) < 12) warnings.push('HL subjects total below 12')

  const passes = warnings.length === 0 && subjectGrades.length > 0

  return { totalPoints, coreBonus, passes, warnings }
}
