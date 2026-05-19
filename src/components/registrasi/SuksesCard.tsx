'use client'

import { CheckCircle2, Calendar, Clock, Hash } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { formatTanggal } from '@/lib/utils'

interface SuksesData {
  nomorRegistrasi: string
  nama: string
  npm: string
  tanggalPilihan: string
  waktuPilihan: string
}

interface SuksesCardProps {
  data: SuksesData
}

export function SuksesCard({ data }: SuksesCardProps) {
  return (
    <div className="text-center space-y-6">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-uika-100 flex items-center justify-center">
          <CheckCircle2 size={44} className="text-uika-700" />
        </div>
      </div>

      {/* Pesan */}
      <div>
        <h2 className="text-xl font-bold text-uika-800 mb-1">Pendaftaran Berhasil!</h2>
        <p className="text-slate-500 text-sm">
          Halo <strong>{data.nama}</strong>, pendaftaran Anda telah diterima.
          Datang sesuai jadwal berikut.
        </p>
      </div>

      {/* Detail */}
      <div className="bg-uika-50 border border-uika-200 rounded-xl p-4 text-left space-y-3">
        <div className="flex items-center gap-3">
          <Hash size={16} className="text-uika-600 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-500">Nomor Registrasi</p>
            <p className="text-sm font-bold text-uika-800 tracking-wider">{data.nomorRegistrasi}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Calendar size={16} className="text-uika-600 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-500">Tanggal</p>
            <p className="text-sm font-medium text-slate-800">{formatTanggal(data.tanggalPilihan)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock size={16} className="text-uika-600 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-500">Jam</p>
            <p className="text-sm font-medium text-slate-800">{data.waktuPilihan} WIB</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-kuning-50 border border-kuning-200 rounded-xl p-4 text-left">
        <p className="text-sm font-semibold text-kuning-800 mb-1">📌 Yang perlu diperhatikan</p>
        <ul className="text-xs text-kuning-700 space-y-1 list-disc list-inside">
          <li>Simpan nomor registrasi Anda</li>
          <li>Datang tepat waktu sesuai jadwal</li>
          <li>Bawa KTM dan berpakaian rapi</li>
          <li>Kwitansi pembayaran akan dikirim ke Gmail setelah layanan selesai</li>
        </ul>
      </div>

      {/* Action */}
      <Link href="/daftar">
        <Button variant="outline" className="w-full">
          Daftar Lagi
        </Button>
      </Link>
    </div>
  )
}
