'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { MdExpandMore } from 'react-icons/md'
import { getCategoryIcon } from '@/lib/categoryIcons'

type SelectOption = {
  id: string
  name: string
  icon?: string
}

interface ThemedSelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  className?: string
}

export default function ThemedSelect({ value, onChange, options, className = '' }: ThemedSelectProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  const selected = useMemo(
    () => options.find((option) => option.id === value) ?? options[0],
    [options, value]
  )
  const SelectedIcon = getCategoryIcon(selected?.icon)

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!rootRef.current) return
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <div ref={rootRef} className={`relative w-full sm:w-auto min-w-[220px] ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-foreground font-medium cursor-pointer transition-colors hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <span className="flex items-center gap-2 pr-8">
          <SelectedIcon className="text-lg text-muted-foreground shrink-0" />
          <span className="block text-left truncate">{selected?.name ?? 'Select category'}</span>
        </span>
        <MdExpandMore
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-xl text-muted-foreground transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-card shadow-lg overflow-hidden">
          <div className="max-h-56 overflow-y-auto scrollbar-thin py-1">
            {options.map((option) => {
              const isActive = option.id === value
              const OptionIcon = getCategoryIcon(option.icon)

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onChange(option.id)
                    setOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2.5 cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-foreground text-background'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <OptionIcon className="text-lg shrink-0" />
                    <span className="truncate">{option.name}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
