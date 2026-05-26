'use client'
import type { ALevelSubjectData } from '@/lib/types'
import CustomSelect from '@/components/shared/CustomSelect'

const SUBJECTS = [
  { label: '9709 · Mathematics (CIE)', file: 'mathematics' },
  { label: '9702 · Physics (CIE)', file: 'physics' },
  { label: '9701 · Chemistry (CIE)', file: 'chemistry' },
  { label: '9700 · Biology (CIE)', file: 'biology' },
  { label: '9708 · Economics (CIE)', file: 'economics' },
  { label: '9609 · Business (CIE)', file: 'business' },
  { label: '9618 · Computer Science (CIE)', file: 'computer-science' },
  { label: '9489 · History (CIE)', file: 'history' },
]

const OPTIONS = SUBJECTS.map(s => ({ value: s.file, label: s.label }))

interface Props {
  selectedFile: string
  onSubjectChange: (subject: ALevelSubjectData, file: string) => void
}

export default function SubjectSelector({ selectedFile, onSubjectChange }: Props) {
  const handleChange = async (file: string) => {
    if (!file) return
    const data = await import(`@/data/alevel/${file}.json`)
    onSubjectChange(data.default as ALevelSubjectData, file)
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
