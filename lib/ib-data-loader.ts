import type { IBSubjectData } from './types'

import biologyHL          from '@/data/ib/biology-hl.json'
import biologySL          from '@/data/ib/biology-sl.json'
import businessMgmtHL     from '@/data/ib/business-management-hl.json'
import businessMgmtSL     from '@/data/ib/business-management-sl.json'
import chemistryHL        from '@/data/ib/chemistry-hl.json'
import chemistrySL        from '@/data/ib/chemistry-sl.json'
import economicsHL        from '@/data/ib/economics-hl.json'
import economicsSL        from '@/data/ib/economics-sl.json'
import mathsAAHL          from '@/data/ib/maths-aa-hl.json'
import mathsAASL          from '@/data/ib/maths-aa-sl.json'
import mathsAIHL          from '@/data/ib/maths-ai-hl.json'
import mathsAISL          from '@/data/ib/maths-ai-sl.json'
import physicsHL          from '@/data/ib/physics-hl.json'
import physicsSL          from '@/data/ib/physics-sl.json'

const IB_DATA: Record<string, IBSubjectData> = {
  'biology-hl':           biologyHL          as IBSubjectData,
  'biology-sl':           biologySL          as IBSubjectData,
  'business-management-hl': businessMgmtHL   as IBSubjectData,
  'business-management-sl': businessMgmtSL   as IBSubjectData,
  'chemistry-hl':         chemistryHL        as IBSubjectData,
  'chemistry-sl':         chemistrySL        as IBSubjectData,
  'economics-hl':         economicsHL        as IBSubjectData,
  'economics-sl':         economicsSL        as IBSubjectData,
  'maths-aa-hl':          mathsAAHL          as IBSubjectData,
  'maths-aa-sl':          mathsAASL          as IBSubjectData,
  'maths-ai-hl':          mathsAIHL          as IBSubjectData,
  'maths-ai-sl':          mathsAISL          as IBSubjectData,
  'physics-hl':           physicsHL          as IBSubjectData,
  'physics-sl':           physicsSL          as IBSubjectData,
}

export function getIBSubjectData(fileBase: string, level: string): IBSubjectData | null {
  const key = level === 'sl' ? `${fileBase}-sl` : `${fileBase}-hl`
  return IB_DATA[key] ?? IB_DATA[`${fileBase}-sl`] ?? null
}
