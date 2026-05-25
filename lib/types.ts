export type IGCSEGrade = 'A*' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'U'
export type IBGrade = 1 | 2 | 3 | 4 | 5 | 6 | 7
export type TOKEEGrade = 'A' | 'B' | 'C' | 'D' | 'E'
export type Track = 'core' | 'extended'
export type Level = 'HL' | 'SL'
export type Board = 'igcse' | 'ib'

export interface IGCSEComponent {
  name: string
  maxMark: number
  weight: number
}

export interface IGCSEBoundary {
  Astar: number
  A: number
  B: number
  C: number
  D: number
  E: number
  F?: number
  G?: number
}

export interface IGCSESession {
  id: string
  boundaries: IGCSEBoundary
}

export interface IGCSESubjectData {
  subject: string
  board: 'CIE' | 'Edexcel'
  syllabusCode: string
  track: Track
  components: IGCSEComponent[]
  sessions: IGCSESession[]
}

export interface IBPaper {
  name: string
  maxMark: number
  weight: number
}

export interface IBBoundary {
  7: number
  6: number
  5: number
  4: number
  3: number
  2: number
  1: number
}

export interface IBSession {
  id: string
  boundaries: IBBoundary
}

export interface IBSubjectData {
  subject: string
  code: string
  level: Level
  ia: { maxMark: number; weight: number }
  papers: IBPaper[]
  sessions: IBSession[]
}

export interface IGCSEResult {
  weightedScore: number
  predictedGrade: IGCSEGrade
  conservativeGrade: IGCSEGrade
  optimisticGrade: IGCSEGrade
  boundaryRanges: { grade: IGCSEGrade; min: number; max: number }[]
}

export interface IBSubjectResult {
  combinedScore: number
  likelyGrade: IBGrade
  conservativeGrade: IBGrade
  optimisticGrade: IBGrade
}

export interface DiplomaResult {
  totalPoints: number
  coreBonus: number
  passes: boolean
  warnings: string[]
}

export interface IBCoreMatrix {
  matrix: {
    [tok in TOKEEGrade]: {
      [ee in TOKEEGrade]: number | 'fail'
    }
  }
}
