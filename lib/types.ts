export type IGCSEGrade = 'A*' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'U'
export type IBGrade = 1 | 2 | 3 | 4 | 5 | 6 | 7
export type TOKEEGrade = 'A' | 'B' | 'C' | 'D' | 'E'
export type Track = 'core' | 'extended'
export type Level = 'HL' | 'SL'
export type Board = 'igcse' | 'ib' | 'alevel' | 'as' | 'whatif'
export type ALevelGrade = 'A*' | 'A' | 'B' | 'C' | 'D' | 'E' | 'U'

export interface ALevelComponent {
  name: string
  maxMark: number
  weight: number
}

export interface ALevelBoundary {
  Astar: number
  A: number
  B: number
  C: number
  D: number
  E: number
}

export interface ALevelSession {
  id: string
  boundaries: ALevelBoundary
}

export interface ALevelSubjectData {
  subject: string
  board: string
  syllabusCode: string
  components: ALevelComponent[]
  sessions: ALevelSession[]
}

export interface ALevelResult {
  weightedScore: number
  predictedGrade: ALevelGrade
  conservativeGrade: ALevelGrade
  optimisticGrade: ALevelGrade
  boundaryRanges: { grade: ALevelGrade; min: number; max: number }[]
}
export type ASGrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'U'

export interface ASComponent {
  name: string
  maxMark: number
  weight: number
}

export interface ASBoundary {
  A: number
  B: number
  C: number
  D: number
  E: number
}

export interface ASSession {
  id: string
  boundaries: ASBoundary
}

export interface ASSubjectData {
  subject: string
  board: string
  syllabusCode: string
  components: ASComponent[]
  sessions: ASSession[]
}

export interface ASResult {
  weightedScore: number
  predictedGrade: ASGrade
  conservativeGrade: ASGrade
  optimisticGrade: ASGrade
  boundaryRanges: { grade: ASGrade; min: number; max: number }[]
}

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
