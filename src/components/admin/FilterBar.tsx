'use client'

import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { LABEL_STATUS } from '@/lib/constants'
import type { MasterFakultas, MasterProdi } from '@/types/admin'

interface FilterBarProps {
  search: string
  status: string
  fakultas: string
  programStudi: string
  fotoTerkirim: string
  onSearchChange: (v: string) => void
  onStatusChange: (v: string) => void
  onFakultasChange: (v: string) => void
  onProdiChange: (v: string) => void
  onFotoChange: (v: string) => void
  onReset: () => void
}

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Semua Status' },
  ...Object.entries(LABEL_STATUS).map(([value, label]) => ({ value, label })),
]

export function FilterBar({
  search, status, fakultas, programStudi, fotoTerkirim,
  onSearchChange, onStatusChange, onFakultasChange, onProdiChange, onFotoChange, onReset,
}: FilterBarProps) {
  const [fakultasList, setFakultasList] = useState<MasterFakultas[]>([])
  const [prodiList, setProdiList] = useState<MasterProdi[]>([])

  // Load fakultas
  useEffect(() => {
    fetch('/api/master/fakultas')
      .then(r => r.json())
      .then(j => { if (j.success) setFakultasList(j.data) })
      .catch(() => {})
  }, [])

  // Load prodi saat fakultas berubah
  useEffect(() => {
    if (!fakultas) { setProdiList([]); return }
    const fak = fakultasList.find(f => f.nama === fakultas)
    if (!fak) { setProdiList([]); return }
    fetch(`/api/master/prodi?fakultasId=${fak.id}`)
      .then(r => r.json())
      .then(j => { if (j.success) setProdiList(j.data) })
      .catch(() => {})
  }, [fakultas, fakultasList])

  const hasFilter = search || status !== 'ALL' || fakultas || programStudi || fotoTerkirim !== 'ALL'

  const selectCls = 'px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-uika-700 focus:border-transparent hover:border-uika-400 transition-colors'

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: search + status */}
      <div className="flex flex-col sm:flex-row gap-3">
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
        <select value={status} onChange={(e) => onStatusChange(e.target.value)} className={`${selectCls} min-w-[160px]`}>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={fotoTerkirim}
          onChange={(e) => onFotoChange(e.target.value)}
          className={`${selectCls} min-w-[160px]`}
          title="Filter status pengiriman foto hasil"
        >
          <option value="ALL">— Semua Foto —</option>
          <option value="SENT">Foto Sudah Dikirim</option>
          <option value="NOT_SENT">Foto Belum Dikirim</option>
        </select>
      </div>

      {/* Row 2: fakultas + prodi + reset */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={fakultas}
          onChange={(e) => { onFakultasChange(e.target.value); onProdiChange('') }}
          className={`${selectCls} flex-1`}
        >
          <option value="">— Semua Fakultas —</option>
          {fakultasList.map(f => (
            <option key={f.id} value={f.nama}>{f.nama}</option>
          ))}
        </select>

        <select
          value={programStudi}
          onChange={(e) => onProdiChange(e.target.value)}
          disabled={!fakultas || prodiList.length === 0}
          className={`${selectCls} flex-1 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <option value="">— Semua Prodi —</option>
          {prodiList.map(p => (
            <option key={p.id} value={p.nama}>{p.nama}</option>
          ))}
        </select>

        {hasFilter && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <X size={14} />
            Reset
          </button>
        )}
      </div>
    </div>
  )
}
