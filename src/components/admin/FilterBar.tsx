'use client'

import { Search, X } from 'lucide-react'
import { LABEL_STATUS } from '@/lib/constants'

interface FilterBarProps {
  search: string
  status: string
  onSearchChange: (v: string) => void
  onStatusChange: (v: string) => void
  onReset: () => void
}

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Semua Status' },
  ...Object.entries(LABEL_STATUS).map(([value, label]) => ({ value, label })),
]

export function FilterBar({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onReset,
}: FilterBarProps) {
  const hasFilter = search || status !== 'ALL'

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Cari nama, NPM, atau email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-uika-700 focus:border-transparent hover:border-uika-400 transition-colors"
        />
      </div>

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-uika-700 focus:border-transparent hover:border-uika-400 transition-colors min-w-[160px]"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Reset */}
      {hasFilter && (
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <X size={14} />
          Reset
        </button>
      )}
    </div>
  )
}
