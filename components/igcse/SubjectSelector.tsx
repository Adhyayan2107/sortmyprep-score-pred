'use client'
import type { IGCSESubjectData } from '@/lib/types'

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
      <select
        value={selectedFile}
        onChange={e => handleChange(e.target.value)}
        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#1a2340] focus:outline-none focus:border-[#2d7dd2] transition-colors cursor-pointer appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          backgroundSize: '18px',
          paddingRight: '40px',
        }}
      >
        <option value="">Choose a subject…</option>
        {SUBJECTS.map(s => (
          <option key={s.file} value={s.file}>{s.label}</option>
        ))}
      </select>
    </div>
  )
}
