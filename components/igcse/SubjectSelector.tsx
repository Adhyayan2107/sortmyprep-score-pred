'use client'

import type { IGCSESubjectData } from '@/lib/types'
import CustomSelect from '@/components/shared/CustomSelect'

const SUBJECTS = [
  // Sciences
  { label: '0580 · Mathematics (CIE)', file: 'mathematics' },
  { label: '0606 · Additional Mathematics (CIE)', file: 'additional-mathematics' },
  { label: '0625 · Physics (CIE)', file: 'physics' },
  { label: '0620 · Chemistry (CIE)', file: 'chemistry' },
  { label: '0610 · Biology (CIE)', file: 'biology' },
  { label: '0478 · Computer Science (CIE)', file: 'computer-science' },
  { label: '0417 · ICT (CIE)', file: 'ict' },
  { label: '0680 · Environmental Management (CIE)', file: 'environmental-management' },
  // Humanities & Social Sciences
  { label: '0455 · Economics (CIE)', file: 'economics' },
  { label: '0450 · Business Studies (CIE)', file: 'business' },
  { label: '0452 · Accounting (CIE)', file: 'accounting' },
  { label: '0470 · History (CIE)', file: 'history' },
  { label: '0460 · Geography (CIE)', file: 'geography' },
  { label: '0495 · Sociology (CIE)', file: 'sociology' },
  { label: '0457 · Global Perspectives (CIE)', file: 'global-perspectives' },
  // English & Literature
  { label: '0500 · English Language (CIE)', file: 'english-language' },
  { label: '0475 · English Literature (CIE)', file: 'english-literature' },
  // Languages
  { label: '0520 · French (CIE)', file: 'french' },
  { label: '0530 · Spanish (CIE)', file: 'spanish' },
  { label: '0508 · Arabic (CIE)', file: 'arabic' },
  { label: '0549 · Hindi (CIE)', file: 'hindi' },
  { label: '0539 · Urdu (CIE)', file: 'urdu' },
  // Arts & Design
  { label: '0400 · Art & Design (CIE)', file: 'art-design' },
  { label: '0445 · Design & Technology (CIE)', file: 'design-technology' },
]

const OPTIONS = SUBJECTS.map(s => ({ value: s.file, label: s.label }))

interface Props {
  selectedFile: string
  onSubjectChange: (subject: IGCSESubjectData, file: string) => void
}

export default function SubjectSelector({ selectedFile, onSubjectChange }: Props) {
  const handleChange = async (file: string) => {
    if (!file) return
    const data = await import(`@/data/igcse/${file}.json`)
    onSubjectChange(data.default as IGCSESubjectData, file)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
      <label className="block text-xs font-bold text-[#1a2340] uppercase tracking-widest mb-3">
        Select Subject
      </label>
      <CustomSelect
        value={selectedFile}
        onChange={handleChange}
        options={OPTIONS}
        placeholder="Choose a subject…"
      />
    </div>
  )
}
