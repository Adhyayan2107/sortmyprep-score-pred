'use client'

import { useState, useRef, useEffect } from 'react'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  meta?: string
}

interface Props {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
}

export default function CustomSelect({ value, onChange, options, placeholder = 'Select…', className = '' }: Props) {
  const [open, setOpen] = useState(false)
  const [openUpward, setOpenUpward] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedLabel = options.find(o => o.value === value)?.label

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = () => {
    if (!open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setOpenUpward(window.innerHeight - rect.bottom < 260)
    }
    setOpen(prev => !prev)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        className={`w-full flex items-center justify-between rounded-xl border-2 bg-white px-4 py-3 text-sm font-semibold text-left focus:outline-none transition-colors ${
          open ? 'border-[#2d7dd2]' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <span className={selectedLabel ? 'text-[#1a2340]' : 'text-[#94a3b8]'}>
          {selectedLabel ?? placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-[#94a3b8] shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className={`absolute z-50 left-0 right-0 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden ${
          openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
        }`}>
          <div className="max-h-56 overflow-y-auto overscroll-contain">
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                disabled={opt.disabled}
                onClick={() => {
                  if (!opt.disabled) { onChange(opt.value); setOpen(false) }
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between gap-2 ${
                  opt.disabled
                    ? 'text-gray-300 cursor-not-allowed bg-white'
                    : opt.value === value
                    ? 'bg-[#dbeafe] text-[#1d4ed8] font-bold'
                    : 'text-[#374151] font-medium hover:bg-gray-50'
                }`}
              >
                <span>{opt.label}</span>
                {opt.value === value && !opt.disabled && (
                  <svg className="w-4 h-4 text-[#2d7dd2] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {opt.meta && (
                  <span className="text-xs text-[#94a3b8] shrink-0">{opt.meta}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
