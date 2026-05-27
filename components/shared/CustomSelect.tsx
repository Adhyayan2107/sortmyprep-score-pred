'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

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

interface DropPos {
  top?: number
  bottom?: number
  left: number
  width: number
}

export default function CustomSelect({ value, onChange, options, placeholder = 'Select…', className = '' }: Props) {
  const [open, setOpen] = useState(false)
  const [dropPos, setDropPos] = useState<DropPos | null>(null)
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedLabel = options.find(o => o.value === value)?.label

  useEffect(() => { setMounted(true) }, [])

  // Close on outside click or page scroll
  useEffect(() => {
    if (!open) return
    const handleClose = (e: MouseEvent) => {
      if (
        containerRef.current?.contains(e.target as Node) ||
        dropRef.current?.contains(e.target as Node)
      ) return
      setOpen(false)
    }
    const handleScroll = (e: Event) => {
      if (dropRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleClose)
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      document.removeEventListener('mousedown', handleClose)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [open])

  const handleToggle = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      // Width: at least 320px, at most full viewport minus margins
      const dropW = Math.min(Math.max(rect.width, 320), window.innerWidth - 32)
      // Left: align to trigger, clamp so it doesn't overflow right edge
      const left = Math.min(rect.left, window.innerWidth - dropW - 8)
      const spaceBelow = window.innerHeight - rect.bottom
      if (spaceBelow >= 280 || rect.top < 280) {
        setDropPos({ top: rect.bottom + 6, left, width: dropW })
      } else {
        setDropPos({ bottom: window.innerHeight - rect.top + 6, left, width: dropW })
      }
    }
    setOpen(v => !v)
  }

  const dropdown = (
    <div
      ref={dropRef}
      style={{
        position: 'fixed',
        zIndex: 9999,
        top: dropPos?.top,
        bottom: dropPos?.bottom,
        left: dropPos?.left,
        width: dropPos?.width,
        animation: 'card-rise 0.16s ease both',
      }}
      className="bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden"
    >
      <div className="max-h-72 overflow-y-auto overscroll-contain">
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
            <span className="truncate">{opt.label}</span>
            <div className="flex items-center gap-1.5 shrink-0">
              {opt.meta && <span className="text-xs text-[#94a3b8]">{opt.meta}</span>}
              {opt.value === value && !opt.disabled && (
                <svg className="w-4 h-4 text-[#2d7dd2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className={`w-full flex items-center justify-between rounded-xl border-2 bg-white px-4 py-3 text-sm font-semibold text-left focus:outline-none transition-colors ${
          open ? 'border-[#2d7dd2]' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <span className={`truncate ${selectedLabel ? 'text-[#1a2340]' : 'text-[#94a3b8]'}`}>
          {selectedLabel ?? placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-[#94a3b8] shrink-0 ml-2 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && dropPos && mounted && createPortal(dropdown, document.body)}
    </div>
  )
}
