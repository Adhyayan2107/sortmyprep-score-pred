'use client'

import type { IGCSESubjectData } from '@/lib/types'
import CustomSelect from '@/components/shared/CustomSelect'

const SUBJECTS = [
  { label: 'Mathematics', file: 'mathematics' },
  { label: 'Physics', file: 'physics' },
  { label: 'Chemistry', file: 'chemistry' },
  { label: 'Biology', file: 'biology' },
  { label: 'English Language', file: 'english-language' },
  { label: 'Economics', file: 'economics' },
  { label: 'Business Studies', file: 'business' },
  { label: 'Computer Science', file: 'computer-science' },
  { label: 'History', file: 'history' },
  { label: 'Geography', file: 'geography' },
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
