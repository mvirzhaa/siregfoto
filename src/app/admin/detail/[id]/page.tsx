'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { AdminHeader } from '@/components/layout/AdminHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Spinner } from '@/components/ui/Spinner'
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/Card'
import { formatRupiah, formatTanggal, formatDateTime } from '@/lib/utils'
import { HARGA, LABEL_LAYANAN } from '@/lib/constants'
import type { RegistrasiData } from '@/types/admin'
import { ArrowLeft, Mail, CheckCheck, ClipboardCheck } from 'lucide-react'
import Link from 'next/link'

export default function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [data, setData] = useState<RegistrasiData | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Validasi form state
  const [jenisLayanan, setJenisLayanan] = useState<'FOTO_CAP' | 'CAP_ONLY' | ''>('')
  const [catatanAdmin, setCatatanAdmin] = useState('')

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`/api/admin/pendaftar/${id}`)
        if (res.status === 401) { router.push('/admin/login'); return }
        const json = await res.json()
        if (json.success) {
          setData(json.data)
          if (json.data.jenisLayanan) setJenisLayanan(json.data.jenisLayanan)
          if (json.data.catatanAdmin) setCatatanAdmin(json.data.catatanAdmin)
        } else {
          toast.error('Data tidak ditemukan')
          router.push('/admin')
        }
      } catch {
        toast.error('Gagal memuat data')
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id, router])

  async function handleValidate() {
    if (!jenisLayanan) { toast.error('Pilih jenis layanan terlebih dahulu'); return }
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/validate/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jenisLayanan, catatanAdmin: catatanAdmin || undefined }),
      })
      const json = await res.json()
      if (json.success) {
        toast.success('Berhasil divalidasi')
        setData(json.data)
      } else {
        toast.error(json.message ?? 'Gagal memvalidasi')
      }
    } catch {
      toast.error('Terjadi kesalahan jaringan')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleApprove() {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/approve/${id}`, { method: 'PATCH' })
      const json = await res.json()
      if (json.success) {
        toast.success(json.message ?? 'Berhasil disetujui')
        if (json.data) {
          setData(json.data)
        } else {
          setData((prev) => prev ? { ...prev, status: 'COMPLETED', kwitansiTerkirim: true } : prev)
        }
      } else {
        toast.error(json.message ?? 'Gagal menyetujui')
      }
    } catch {
      toast.error('Terjadi kesalahan jaringan')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleResend() {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/resend/${id}`, { method: 'POST' })
      const json = await res.json()
      if (json.success) {
        toast.success(json.message ?? 'Kwitansi berhasil dikirim ulang')
        if (json.data) setData(json.data)
      } else {
        toast.error(json.message ?? 'Gagal mengirim ulang kwitansi')
      }
    } catch {
      toast.error('Terjadi kesalahan jaringan')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <AdminHeader />
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" text="Memuat data..." />
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />

      <main className="flex-1 py-6 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Back */}
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-uika-700 hover:text-uika-900"
          >
            <ArrowLeft size={15} />
            Kembali ke Dashboard
          </Link>

          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400 font-mono">{data.nomorRegistrasi}</p>
                  <h1 className="text-lg font-bold text-slate-800 mt-0.5">{data.nama}</h1>
                  <p className="text-sm text-slate-500">{data.npm} — {data.gmail}</p>
                </div>
                <Badge status={data.status} />
              </div>
            </CardHeader>
            <CardBody>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {[
                  ['Fakultas', data.fakultas],
                  ['Program Studi', data.programStudi],
                  ['Jadwal', `${formatTanggal(data.tanggalPilihan)}, ${data.waktuPilihan} WIB`],
                  ['Tgl Daftar', formatDateTime(data.createdAt)],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs text-slate-400">{label}</dt>
                    <dd className="text-slate-800 font-medium mt-0.5">{value}</dd>
                  </div>
                ))}
              </dl>
            </CardBody>
          </Card>

          {/* Layanan Card (jika sudah validated) */}
          {data.status !== 'PENDING' && data.jenisLayanan && data.nominal && (
            <Card>
              <CardHeader>
                <h2 className="text-sm font-semibold text-slate-800">Detail Layanan</h2>
              </CardHeader>
              <CardBody>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-slate-400">Jenis Layanan</dt>
                    <dd className="font-medium text-slate-800 mt-0.5">
                      {LABEL_LAYANAN[data.jenisLayanan]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-400">Nominal</dt>
                    <dd className="font-bold text-uika-700 text-base mt-0.5">
                      {formatRupiah(data.nominal)}
                    </dd>
                  </div>
                  {data.catatanAdmin && (
                    <div className="col-span-2">
                      <dt className="text-xs text-slate-400">Catatan Admin</dt>
                      <dd className="text-slate-700 mt-0.5">{data.catatanAdmin}</dd>
                    </div>
                  )}
                </dl>
              </CardBody>
              {data.nomorKwitansi && (
                <CardFooter>
                  <div className="flex items-center gap-2 text-xs">
                    <Mail size={13} className="text-uika-600" />
                    <span className="text-slate-600">
                      Kwitansi: <span className="font-mono font-medium">{data.nomorKwitansi}</span>
                      {data.kwitansiTerkirim && (
                        <span className="ml-2 text-uika-700 font-medium">✔ Terkirim</span>
                      )}
                    </span>
                  </div>
                </CardFooter>
              )}
            </Card>
          )}

          {/* Aksi: PENDING → Validasi */}
          {data.status === 'PENDING' && (
            <Card>
              <CardHeader>
                <h2 className="text-sm font-semibold text-uika-700 flex items-center gap-2">
                  <ClipboardCheck size={16} />
                  Validasi Pendaftaran
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <Select
                  label="Jenis Layanan"
                  placeholder="— Pilih Layanan —"
                  value={jenisLayanan}
                  onChange={(e) => setJenisLayanan(e.target.value as 'FOTO_CAP' | 'CAP_ONLY')}
                  options={[
                    { value: 'FOTO_CAP', label: `${LABEL_LAYANAN.FOTO_CAP} — ${formatRupiah(HARGA.FOTO_CAP)}` },
                    { value: 'CAP_ONLY', label: `${LABEL_LAYANAN.CAP_ONLY} — ${formatRupiah(HARGA.CAP_ONLY)}` },
                  ]}
                  required
                />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-700">
                    Catatan Admin <span className="text-slate-400 font-normal">(opsional)</span>
                  </label>
                  <textarea
                    value={catatanAdmin}
                    onChange={(e) => setCatatanAdmin(e.target.value)}
                    rows={2}
                    placeholder="Tambahkan catatan jika diperlukan..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-uika-700 focus:border-transparent hover:border-uika-400 transition-colors resize-none"
                  />
                </div>
              </CardBody>
              <CardFooter>
                <Button
                  variant="primary"
                  size="md"
                  loading={actionLoading}
                  icon={<ClipboardCheck size={15} />}
                  onClick={handleValidate}
                  className="w-full"
                >
                  Validasi Pendaftaran
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Aksi: VALIDATED → Approve */}
          {data.status === 'VALIDATED' && (
            <Card>
              <CardHeader>
                <h2 className="text-sm font-semibold text-uika-700 flex items-center gap-2">
                  <CheckCheck size={16} />
                  Konfirmasi Selesai & Kirim Kwitansi
                </h2>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-slate-600">
                  Pastikan layanan sudah selesai dan pembayaran{' '}
                  <strong>{data.nominal ? formatRupiah(data.nominal) : '-'}</strong> telah diterima.
                  Kwitansi akan dikirim otomatis ke <strong>{data.gmail}</strong>.
                </p>
              </CardBody>
              <CardFooter>
                <Button
                  variant="secondary"
                  size="md"
                  loading={actionLoading}
                  icon={<Mail size={15} />}
                  onClick={handleApprove}
                  className="w-full"
                >
                  Setujui & Kirim Kwitansi
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Aksi: APPROVED (Email Kwitansi Gagal) */}
          {data.status === 'APPROVED' && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <h2 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                  <Mail size={16} className="text-amber-600" />
                  Pengiriman Email Kwitansi Gagal
                </h2>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-amber-700">
                  Pendaftaran telah disetujui, tetapi email kwitansi gagal dikirim ke <strong>{data.gmail}</strong>. Anda dapat mencoba mengirim kembali kwitansi ke email tersebut.
                </p>
              </CardBody>
              <CardFooter>
                <Button
                  variant="primary"
                  size="md"
                  loading={actionLoading}
                  icon={<Mail size={15} />}
                  onClick={handleResend}
                  className="w-full bg-amber-600 hover:bg-amber-700 border-transparent text-white"
                >
                  Kirim Ulang Kwitansi
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Status COMPLETED */}
          {data.status === 'COMPLETED' && (
            <div className="bg-uika-50 border border-uika-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-uika-700 font-medium">
              <span>✅ Pendaftaran ini sudah selesai diproses.</span>
              <Button
                variant="secondary"
                size="sm"
                loading={actionLoading}
                icon={<Mail size={13} />}
                onClick={handleResend}
                className="text-xs py-1 px-3 w-full sm:w-auto"
              >
                Kirim Ulang Email
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
