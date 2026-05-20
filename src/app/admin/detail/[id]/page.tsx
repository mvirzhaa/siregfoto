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
import { ArrowLeft, Mail, CheckCheck, ClipboardCheck, Image, Upload, Trash2, Edit2, Save, X } from 'lucide-react'
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

  // State untuk kirim foto hasil
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [sendingPhoto, setSendingPhoto] = useState(false)

  // State untuk edit data pendaftar oleh admin
  const [isEditing, setIsEditing] = useState(false)
  const [editNama, setEditNama] = useState('')
  const [editNpm, setEditNpm] = useState('')
  const [editGmail, setEditGmail] = useState('')
  const [editFakultas, setEditFakultas] = useState('')
  const [editProgramStudi, setEditProgramStudi] = useState('')
  const [saveLoading, setSaveLoading] = useState(false)

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
          setEditNama(json.data.nama || '')
          setEditNpm(json.data.npm || '')
          setEditGmail(json.data.gmail || '')
          setEditFakultas(json.data.fakultas || '')
          setEditProgramStudi(json.data.programStudi || '')
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

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar (JPEG, PNG, dll).')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran file foto maksimal adalah 10MB.')
      return
    }

    setPhotoFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  function handleRemovePhoto() {
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  async function handleSendPhoto() {
    if (!photoFile) {
      toast.error('Silakan pilih file foto terlebih dahulu.')
      return
    }

    setSendingPhoto(true)
    const formData = new FormData()
    formData.append('file', photoFile)

    try {
      const res = await fetch(`/api/admin/send-photo/${id}`, {
        method: 'POST',
        body: formData,
      })
      const json = await res.json()
      if (json.success) {
        toast.success(json.message ?? 'Foto hasil berhasil dikirim ke email.')
        if (json.data) setData(json.data)
        setPhotoFile(null)
        setPhotoPreview(null)
      } else {
        toast.error(json.message ?? 'Gagal mengirim foto.')
      }
    } catch {
      toast.error('Terjadi kesalahan jaringan.')
    } finally {
      setSendingPhoto(false)
    }
  }

  async function handleSaveEdit() {
    if (!editNama.trim() || !editNpm.trim() || !editGmail.trim() || !editFakultas.trim() || !editProgramStudi.trim()) {
      toast.error('Semua data wajib diisi')
      return
    }

    setSaveLoading(true)
    try {
      const res = await fetch(`/api/admin/pendaftar/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: editNama,
          npm: editNpm,
          gmail: editGmail,
          fakultas: editFakultas,
          programStudi: editProgramStudi,
        }),
      })
      const json = await res.json()
      if (json.success) {
        toast.success('Data pendaftar berhasil diperbarui')
        setData(json.data)
        setIsEditing(false)
      } else {
        toast.error(json.message ?? 'Gagal memperbarui data')
      }
    } catch {
      toast.error('Terjadi kesalahan jaringan')
    } finally {
      setSaveLoading(false)
    }
  }

  function handleCancelEdit() {
    if (data) {
      setEditNama(data.nama)
      setEditNpm(data.npm)
      setEditGmail(data.gmail)
      setEditFakultas(data.fakultas)
      setEditProgramStudi(data.programStudi)
    }
    setIsEditing(false)
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
          {isEditing ? (
            <Card className="border-uika-500 ring-1 ring-uika-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-uika-700">Edit Data Pendaftar</h2>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{data.nomorRegistrasi}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nama */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-500">Nama Lengkap</label>
                    <input
                      type="text"
                      value={editNama}
                      onChange={(e) => setEditNama(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-uika-700 focus:border-transparent hover:border-uika-400 transition-colors"
                    />
                  </div>

                  {/* NPM */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-500">NPM</label>
                    <input
                      type="text"
                      value={editNpm}
                      onChange={(e) => setEditNpm(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-uika-700 focus:border-transparent hover:border-uika-400 transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500">Email</label>
                    <input
                      type="email"
                      value={editGmail}
                      onChange={(e) => setEditGmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-uika-700 focus:border-transparent hover:border-uika-400 transition-colors"
                    />
                  </div>

                  {/* Fakultas */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-500">Fakultas</label>
                    <input
                      type="text"
                      value={editFakultas}
                      onChange={(e) => setEditFakultas(e.target.value)}
                      placeholder="Contoh: Fakultas Agama Islam"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-uika-700 focus:border-transparent hover:border-uika-400 transition-colors"
                    />
                  </div>

                  {/* Program Studi */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-500">Program Studi</label>
                    <input
                      type="text"
                      value={editProgramStudi}
                      onChange={(e) => setEditProgramStudi(e.target.value)}
                      placeholder="Contoh: Pendidikan Agama Islam"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-uika-700 focus:border-transparent hover:border-uika-400 transition-colors"
                    />
                  </div>
                </div>
              </CardBody>
              <CardFooter className="flex items-center justify-end gap-2 bg-slate-50 border-t border-slate-100">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={saveLoading}
                >
                  Batal
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  loading={saveLoading}
                  onClick={handleSaveEdit}
                  icon={<Save size={13} />}
                >
                  Simpan Perubahan
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-400 font-mono">{data.nomorRegistrasi}</p>
                    <h1 className="text-lg font-bold text-slate-800 mt-0.5">{data.nama}</h1>
                    <p className="text-sm text-slate-500">{data.npm} — {data.gmail}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge status={data.status} />
                    {(data.status === 'PENDING' || data.status === 'VALIDATED') && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Edit2 size={13} />}
                        onClick={() => setIsEditing(true)}
                        className="text-xs py-1 px-2.5 h-auto text-slate-600 border-slate-200 hover:border-uika-400 hover:text-uika-700"
                      >
                        Edit Data
                      </Button>
                    )}
                  </div>
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
          )}

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

          {/* Aksi: Kirim Foto Hasil (APPROVED atau COMPLETED) */}
          {(data.status === 'APPROVED' || data.status === 'COMPLETED') && (
            <Card>
              <CardHeader>
                <h2 className="text-sm font-semibold text-uika-700 flex items-center gap-2">
                  <Image size={16} />
                  Kirim Foto Hasil Ijazah
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <p className="text-sm text-slate-600">
                  Unggah file foto hasil ijazah yang sudah diedit untuk dikirim ke email mahasiswa.
                </p>

                {data.fotoHasilTerkirim && data.fotoHasilTerkirimAt && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-800 flex items-center gap-2">
                    <CheckCheck size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>
                      Foto hasil sudah pernah dikirim pada{' '}
                      <strong>{formatTanggal(new Date(data.fotoHasilTerkirimAt))}</strong> pukul{' '}
                      <strong>{new Date(data.fotoHasilTerkirimAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</strong>.
                    </span>
                  </div>
                )}

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50 hover:bg-slate-100 hover:border-uika-400 transition-colors relative">
                  {photoPreview ? (
                    <div className="text-center space-y-3 w-full">
                      <img
                        src={photoPreview}
                        alt="Preview Foto Hasil"
                        className="max-h-48 rounded-lg border border-slate-200 shadow-sm mx-auto object-contain"
                      />
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs text-slate-500 font-mono max-w-[200px] truncate">
                          {photoFile?.name}
                        </span>
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Hapus foto"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full py-4">
                      <Upload className="text-slate-400 mb-2" size={24} />
                      <span className="text-sm font-semibold text-uika-700 hover:text-uika-800">
                        Pilih File Foto
                      </span>
                      <span className="text-xs text-slate-400 mt-1">
                        Format: JPG, PNG, WEBP (Maksimal 10MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </CardBody>
              <CardFooter>
                <Button
                  variant="primary"
                  size="md"
                  loading={sendingPhoto}
                  disabled={!photoFile}
                  icon={<Image size={15} />}
                  onClick={handleSendPhoto}
                  className="w-full"
                >
                  Kirim Foto Hasil ke Email
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
