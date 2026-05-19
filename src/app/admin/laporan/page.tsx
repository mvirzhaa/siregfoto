'use client'

import { useEffect, useState } from 'react'
import { AdminHeader } from '@/components/layout/AdminHeader'
import { ExportButton } from '@/components/admin/ExportButton'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { LABEL_STATUS } from '@/lib/constants'
import type { MasterFakultas, MasterProdi } from '@/types/admin'

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Semua Status' },
  ...Object.entries(LABEL_STATUS).map(([value, label]) => ({ value, label })),
]

const selectCls = 'w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-uika-700 focus:border-transparent hover:border-uika-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

export default function LaporanPage() {
  const [status, setStatus] = useState('ALL')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [fakultas, setFakultas] = useState('')
  const [programStudi, setProgramStudi] = useState('')

  const [fakultasList, setFakultasList] = useState<MasterFakultas[]>([])
  const [prodiList, setProdiList] = useState<MasterProdi[]>([])

  useEffect(() => {
    fetch('/api/master/fakultas').then(r => r.json()).then(j => { if (j.success) setFakultasList(j.data) })
  }, [])

  useEffect(() => {
    if (!fakultas) { setProdiList([]); setProgramStudi(''); return }
    const fak = fakultasList.find(f => f.nama === fakultas)
    if (!fak) { setProdiList([]); return }
    fetch(`/api/master/prodi?fakultasId=${fak.id}`).then(r => r.json()).then(j => { if (j.success) setProdiList(j.data) })
    setProgramStudi('')
  }, [fakultas, fakultasList])

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-1 py-6 px-4 sm:px-6">
        <div className="max-w-xl mx-auto space-y-5">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-uika-700 hover:text-uika-900">
            <ArrowLeft size={15} /> Kembali ke Dashboard
          </Link>

          <div>
            <h1 className="text-xl font-bold text-slate-800">Laporan &amp; Export</h1>
            <p className="text-sm text-slate-500 mt-0.5">Download laporan registrasi dalam format Excel (.xlsx)</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-700">Filter Data Export</h2>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}>
                {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>

            {/* Fakultas */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Fakultas</label>
              <select value={fakultas} onChange={(e) => setFakultas(e.target.value)} className={selectCls}>
                <option value="">— Semua Fakultas —</option>
                {fakultasList.map(f => <option key={f.id} value={f.nama}>{f.nama}</option>)}
              </select>
            </div>

            {/* Program Studi */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Program Studi</label>
              <select
                value={programStudi}
                onChange={(e) => setProgramStudi(e.target.value)}
                disabled={!fakultas || prodiList.length === 0}
                className={selectCls}
              >
                <option value="">— Semua Prodi —</option>
                {prodiList.map(p => <option key={p.id} value={p.nama}>{p.nama}</option>)}
              </select>
            </div>

            {/* Tanggal */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Dari Tanggal</label>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={selectCls} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Sampai Tanggal</label>
                <input type="date" value={dateTo} min={dateFrom} onChange={(e) => setDateTo(e.target.value)} className={selectCls} />
              </div>
            </div>

            <ExportButton
              status={status !== 'ALL' ? status : undefined}
              dateFrom={dateFrom || undefined}
              dateTo={dateTo || undefined}
              fakultas={fakultas || undefined}
              programStudi={programStudi || undefined}
            />
          </div>

          <p className="text-xs text-slate-400 text-center">File Excel diunduh otomatis. Header hijau UIKA, data terformat lengkap.</p>
        </div>
      </main>
    </div>
  )
}
