'use client'
import type { ASSubjectData } from '@/lib/types'
import CustomSelect from '@/components/shared/CustomSelect'

const SUBJECTS = [
  // Sciences & Mathematics
  { label: '9709 · Mathematics (CIE)', file: 'mathematics' },
  { label: '9231 · Further Mathematics (CIE)', file: 'further-mathematics' },
  { label: '9702 · Physics (CIE)', file: 'physics' },
  { label: '9701 · Chemistry (CIE)', file: 'chemistry' },
  { label: '9700 · Biology (CIE)', file: 'biology' },
  { label: '9618 · Computer Science (CIE)', file: 'computer-science' },
  // Humanities & Social Sciences
  { label: '9708 · Economics (CIE)', file: 'economics' },
  { label: '9609 · Business (CIE)', file: 'business' },
  { label: '9706 · Accounting (CIE)', file: 'accounting' },
  { label: '9489 · History (CIE)', file: 'history' },
  { label: '9696 · Geography (CIE)', file: 'geography' },
  { label: '9699 · Sociology (CIE)', file: 'sociology' },
  { label: '9990 · Psychology (CIE)', file: 'psychology' },
  { label: '9084 · Law (CIE)', file: 'law' },
  // English & Literature
  { label: '9093 · English Language (CIE)', file: 'english-language' },
  { label: '9695 · English Literature (CIE)', file: 'english-literature' },
  // Languages
  { label: '9716 · French (CIE)', file: 'french' },
  { label: '9719 · Spanish (CIE)', file: 'spanish' },
]

const OPTIONS = SUBJECTS.map(s => ({ value: s.file, label: s.label }))

interface Props {
  selectedFile: string
  onSubjectChange: (subject: ASSubjectData, file: string) => void
}

export default function SubjectSelector({ selectedFile, onSubjectChange }: Props) {
  const handleChange = async (file: string) => {
    if (!file) return
    const data = await import(`@/data/as/${file}.json`)
    onSubjectChange(data.default as ASSubjectData, file)
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
