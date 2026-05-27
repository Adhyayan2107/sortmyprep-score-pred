import type { IBSubjectData } from './types'

import biologyHL from '@/data/ib/biology-hl.json'
import biologySL from '@/data/ib/biology-sl.json'
import businessManagementHL from '@/data/ib/business-management-hl.json'
import businessManagementSL from '@/data/ib/business-management-sl.json'
import chemistryHL from '@/data/ib/chemistry-hl.json'
import chemistrySL from '@/data/ib/chemistry-sl.json'
import computerScienceHL from '@/data/ib/computer-science-hl.json'
import computerScienceSL from '@/data/ib/computer-science-sl.json'
import economicsHL from '@/data/ib/economics-hl.json'
import economicsSL from '@/data/ib/economics-sl.json'
import englishAHL from '@/data/ib/english-a-hl.json'
import englishASL from '@/data/ib/english-a-sl.json'
import englishBHL from '@/data/ib/english-b-hl.json'
import englishBSL from '@/data/ib/english-b-sl.json'
import essSL from '@/data/ib/ess-sl.json'
import filmHL from '@/data/ib/film-hl.json'
import filmSL from '@/data/ib/film-sl.json'
import frenchBHL from '@/data/ib/french-b-hl.json'
import frenchBSL from '@/data/ib/french-b-sl.json'
import geographyHL from '@/data/ib/geography-hl.json'
import geographySL from '@/data/ib/geography-sl.json'
import germanBHL from '@/data/ib/german-b-hl.json'
import germanBSL from '@/data/ib/german-b-sl.json'
import globalPoliticsHL from '@/data/ib/global-politics-hl.json'
import globalPoliticsSL from '@/data/ib/global-politics-sl.json'
import historyHL from '@/data/ib/history-hl.json'
import historySL from '@/data/ib/history-sl.json'
import mandarinBHL from '@/data/ib/mandarin-b-hl.json'
import mandarinBSL from '@/data/ib/mandarin-b-sl.json'
import mathsAAHL from '@/data/ib/maths-aa-hl.json'
import mathsAASL from '@/data/ib/maths-aa-sl.json'
import mathsAIHL from '@/data/ib/maths-ai-hl.json'
import mathsAISL from '@/data/ib/maths-ai-sl.json'
import musicHL from '@/data/ib/music-hl.json'
import musicSL from '@/data/ib/music-sl.json'
import physicsHL from '@/data/ib/physics-hl.json'
import physicsSL from '@/data/ib/physics-sl.json'
import psychologyHL from '@/data/ib/psychology-hl.json'
import psychologySL from '@/data/ib/psychology-sl.json'
import spanishBHL from '@/data/ib/spanish-b-hl.json'
import spanishBSL from '@/data/ib/spanish-b-sl.json'
import theatreHL from '@/data/ib/theatre-hl.json'
import theatreSL from '@/data/ib/theatre-sl.json'
import visualArtsHL from '@/data/ib/visual-arts-hl.json'
import visualArtsSL from '@/data/ib/visual-arts-sl.json'

const IB_DATA: Record<string, IBSubjectData> = {
  'biology-hl': biologyHL as IBSubjectData,
  'biology-sl': biologySL as IBSubjectData,
  'business-management-hl': businessManagementHL as IBSubjectData,
  'business-management-sl': businessManagementSL as IBSubjectData,
  'chemistry-hl': chemistryHL as IBSubjectData,
  'chemistry-sl': chemistrySL as IBSubjectData,
  'computer-science-hl': computerScienceHL as IBSubjectData,
  'computer-science-sl': computerScienceSL as IBSubjectData,
  'economics-hl': economicsHL as IBSubjectData,
  'economics-sl': economicsSL as IBSubjectData,
  'english-a-hl': englishAHL as IBSubjectData,
  'english-a-sl': englishASL as IBSubjectData,
  'english-b-hl': englishBHL as IBSubjectData,
  'english-b-sl': englishBSL as IBSubjectData,
  'ess-sl': essSL as IBSubjectData,
  'film-hl': filmHL as IBSubjectData,
  'film-sl': filmSL as IBSubjectData,
  'french-b-hl': frenchBHL as IBSubjectData,
  'french-b-sl': frenchBSL as IBSubjectData,
  'geography-hl': geographyHL as IBSubjectData,
  'geography-sl': geographySL as IBSubjectData,
  'german-b-hl': germanBHL as IBSubjectData,
  'german-b-sl': germanBSL as IBSubjectData,
  'global-politics-hl': globalPoliticsHL as IBSubjectData,
  'global-politics-sl': globalPoliticsSL as IBSubjectData,
  'history-hl': historyHL as IBSubjectData,
  'history-sl': historySL as IBSubjectData,
  'mandarin-b-hl': mandarinBHL as IBSubjectData,
  'mandarin-b-sl': mandarinBSL as IBSubjectData,
  'maths-aa-hl': mathsAAHL as IBSubjectData,
  'maths-aa-sl': mathsAASL as IBSubjectData,
  'maths-ai-hl': mathsAIHL as IBSubjectData,
  'maths-ai-sl': mathsAISL as IBSubjectData,
  'music-hl': musicHL as IBSubjectData,
  'music-sl': musicSL as IBSubjectData,
  'physics-hl': physicsHL as IBSubjectData,
  'physics-sl': physicsSL as IBSubjectData,
  'psychology-hl': psychologyHL as IBSubjectData,
  'psychology-sl': psychologySL as IBSubjectData,
  'spanish-b-hl': spanishBHL as IBSubjectData,
  'spanish-b-sl': spanishBSL as IBSubjectData,
  'theatre-hl': theatreHL as IBSubjectData,
  'theatre-sl': theatreSL as IBSubjectData,
  'visual-arts-hl': visualArtsHL as IBSubjectData,
  'visual-arts-sl': visualArtsSL as IBSubjectData,
}

export function getIBSubjectData(fileBase: string, level: string): IBSubjectData | null {
  const key = level === 'sl' ? `${fileBase}-sl` : `${fileBase}-hl`
  return IB_DATA[key] ?? IB_DATA[`${fileBase}-sl`] ?? null
}
