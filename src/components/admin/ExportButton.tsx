'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

interface ExportButtonProps {
  status?: string
  dateFrom?: string
  dateTo?: string
  fakultas?: string
  programStudi?: string
}

export function ExportButton({ status, dateFrom, dateTo, fakultas, programStudi }: ExportButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (status) params.set('status', status)
      if (dateFrom) params.set('dateFrom', dateFrom)
      if (dateTo) params.set('dateTo', dateTo)
      if (fakultas) params.set('fakultas', fakultas)
      if (programStudi) params.set('programStudi', programStudi)

      const res = await fetch(`/api/admin/export?${params.toString()}`)

      if (!res.ok) {
        toast.error('Gagal mengekspor data')
        return
      }

      // Trigger download
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const disposition = res.headers.get('Content-Disposition') ?? ''
      const match = disposition.match(/filename="(.+)"/)
      a.download = match ? match[1] : 'Laporan_SiRegFoto.xlsx'
      a.href = url
      a.click()
      URL.revokeObjectURL(url)

      toast.success('Laporan berhasil diunduh')
    } catch {
      toast.error('Terjadi kesalahan saat mengekspor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      loading={loading}
      icon={<Download size={15} />}
      onClick={handleExport}
    >
      Export Excel
    </Button>
  )
}
