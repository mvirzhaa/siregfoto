'use client'

import Link from 'next/link'
import { Eye, ImageOff, ImageIcon } from 'lucide-react'
import { Table, Thead, Tbody, Th, Td, Tr } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { formatTanggalPendek, formatDateTime } from '@/lib/utils'
import type { RegistrasiData } from '@/types/admin'

interface TabelPendaftarProps {
  data: RegistrasiData[]
  loading?: boolean
}

export function TabelPendaftar({ data, loading }: TabelPendaftarProps) {
  if (loading) {
    return (
      <div className="py-16">
        <Spinner size="md" text="Memuat data..." />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="py-16 text-center text-slate-500">
        <p className="text-sm">Tidak ada data pendaftar.</p>
      </div>
    )
  }

  return (
    <Table>
      <Thead>
        <tr>
          <Th>No. Registrasi</Th>
          <Th>Nama / NPM</Th>
          <Th className="hidden md:table-cell">Jadwal</Th>
          <Th className="hidden lg:table-cell">Tgl Daftar</Th>
          <Th>Status</Th>
          <Th className="hidden sm:table-cell text-center">Foto</Th>
          <Th className="text-center">Aksi</Th>
        </tr>
      </Thead>
      <Tbody>
        {data.map((reg) => (
          <Tr key={reg.id}>
            <Td className="font-mono text-xs">{reg.nomorRegistrasi}</Td>
            <Td>
              <p className="font-medium text-slate-800 text-sm">{reg.nama}</p>
              <p className="text-xs text-slate-400">{reg.npm}</p>
            </Td>
            <Td className="hidden md:table-cell text-xs">
              <p>{formatTanggalPendek(reg.tanggalPilihan)}</p>
              <p className="text-slate-400">{reg.waktuPilihan} WIB</p>
            </Td>
            <Td className="hidden lg:table-cell text-xs text-slate-500">
              {formatDateTime(reg.createdAt)}
            </Td>
            <Td>
              <Badge status={reg.status} />
            </Td>
            <Td className="hidden sm:table-cell text-center">
              <FotoBadge terkirim={reg.fotoHasilTerkirim} status={reg.status} />
            </Td>
            <Td className="text-center">
              <Link
                href={`/admin/detail/${reg.id}`}
                className="inline-flex items-center gap-1 text-xs text-uika-700 hover:text-uika-900 font-medium"
                title="Lihat detail"
              >
                <Eye size={14} />
                <span className="hidden sm:inline">Detail</span>
              </Link>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

// ── Badge status foto ─────────────────────────────────────────────────────────
function FotoBadge({
  terkirim,
  status,
}: {
  terkirim: boolean
  status: RegistrasiData['status']
}) {
  // Hanya relevan jika sudah APPROVED atau COMPLETED
  if (status === 'PENDING' || status === 'VALIDATED') {
    return <span className="text-slate-300 text-xs">—</span>
  }

  if (terkirim) {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full"
        title="Foto hasil sudah dikirim"
      >
        <ImageIcon size={11} />
        Terkirim
      </span>
    )
  }

  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full"
      title="Foto hasil belum dikirim"
    >
      <ImageOff size={11} />
      Belum
    </span>
  )
}
