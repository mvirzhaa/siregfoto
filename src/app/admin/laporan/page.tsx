'use client'

import { AdminHeader } from '@/components/layout/AdminHeader'
import { ExportButton } from '@/components/admin/ExportButton'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { LABEL_STATUS } from '@/lib/constants'

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Semua Status' },
  ...Object.entries(LABEL_STATUS).map(([value, label]) => ({ value, label })),
]

export default function LaporanPage() {
  const [status, setStatus] = useState('ALL')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />

      <main className="flex-1 py-6 px-4 sm:px-6">
        <div className="max-w-xl mx-auto space-y-5">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-uika-700 hover:text-uika-900"
          >
            <ArrowLeft size={15} />
            Kembali ke Dashboard
          </Link>

          <div>
            <h1 className="text-xl font-bold text-slate-800">Laporan & Export</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Download laporan registrasi dalam format Excel (.xlsx)
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-700">Filter Data Export</h2>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-uika-700 focus:border-transparent"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Tanggal Range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Dari Tanggal</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-uika-700 focus:border-transparent"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Sampai Tanggal</label>
                <input
                  type="date"
                  value={dateTo}
                  min={dateFrom}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-uika-700 focus:border-transparent"
                />
              </div>
            </div>

            {/* Export Button */}
            <ExportButton
              status={status !== 'ALL' ? status : undefined}
              dateFrom={dateFrom || undefined}
              dateTo={dateTo || undefined}
            />
          </div>

          <div className="text-xs text-slate-400 text-center">
            File Excel akan diunduh otomatis ke perangkat Anda.
            Header berwarna hijau UIKA dengan data terformat.
          </div>
        </div>
      </main>
    </div>
  )
}
