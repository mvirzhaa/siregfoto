'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { DAFTAR_FAKULTAS, JAM_TERSEDIA } from '@/lib/constants'
import type { RegistrasiInput } from '@/types/registrasi'

type FormErrors = Partial<Record<keyof RegistrasiInput, string>>

const FAKULTAS_OPTIONS = DAFTAR_FAKULTAS.map((f) => ({ value: f, label: f }))
const JAM_OPTIONS = JAM_TERSEDIA.map((j) => ({ value: j, label: `${j} WIB` }))

// Minimal tanggal: hari ini
function getTodayString() {
  return new Date().toISOString().split('T')[0]
}

export function FormRegistrasi() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const [form, setForm] = useState<RegistrasiInput>({
    nama: '',
    npm: '',
    gmail: '',
    fakultas: '',
    programStudi: '',
    tanggalPilihan: '',
    waktuPilihan: '' as RegistrasiInput['waktuPilihan'],
  })

  function handleChange(field: keyof RegistrasiInput, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const res = await fetch('/api/registrasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const json = await res.json()

      if (!res.ok) {
        if (res.status === 422 && json.errors) {
          const mapped: FormErrors = {}
          for (const [key, msgs] of Object.entries(json.errors)) {
            mapped[key as keyof RegistrasiInput] = (msgs as string[])[0]
          }
          setErrors(mapped)
          toast.error('Mohon periksa kembali isian form.')
        } else {
          toast.error(json.message ?? 'Terjadi kesalahan. Coba lagi.')
        }
        return
      }

      toast.success('Pendaftaran berhasil!')
      // Simpan data sukses ke sessionStorage untuk halaman sukses
      sessionStorage.setItem('registrasi_sukses', JSON.stringify(json.data))
      router.push('/daftar/sukses')
    } catch {
      toast.error('Terjadi kesalahan jaringan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Data Diri */}
      <div>
        <h3 className="text-sm font-semibold text-uika-700 uppercase tracking-wide mb-3">
          Data Diri Mahasiswa
        </h3>
        <div className="space-y-4">
          <Input
            label="Nama Lengkap"
            placeholder="Sesuai ijazah"
            value={form.nama}
            onChange={(e) => handleChange('nama', e.target.value)}
            error={errors.nama}
            required
            autoComplete="name"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="NPM"
              placeholder="Nomor Pokok Mahasiswa"
              value={form.npm}
              onChange={(e) => handleChange('npm', e.target.value)}
              error={errors.npm}
              required
              autoComplete="off"
            />
            <Input
              label="Gmail"
              type="email"
              placeholder="nama@gmail.com"
              value={form.gmail}
              onChange={(e) => handleChange('gmail', e.target.value)}
              error={errors.gmail}
              hint="Kwitansi akan dikirim ke email ini"
              required
              autoComplete="email"
            />
          </div>
          <Select
            label="Fakultas"
            placeholder="— Pilih Fakultas —"
            value={form.fakultas}
            onChange={(e) => handleChange('fakultas', e.target.value)}
            options={FAKULTAS_OPTIONS}
            error={errors.fakultas}
            required
          />
          <Input
            label="Program Studi"
            placeholder="Nama program studi Anda"
            value={form.programStudi}
            onChange={(e) => handleChange('programStudi', e.target.value)}
            error={errors.programStudi}
            required
          />
        </div>
      </div>

      {/* Jadwal */}
      <div>
        <h3 className="text-sm font-semibold text-uika-700 uppercase tracking-wide mb-3">
          Pilih Jadwal Kedatangan
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Tanggal"
            type="date"
            value={form.tanggalPilihan}
            min={getTodayString()}
            onChange={(e) => handleChange('tanggalPilihan', e.target.value)}
            error={errors.tanggalPilihan}
            required
          />
          <Select
            label="Jam Kedatangan"
            placeholder="— Pilih Jam —"
            value={form.waktuPilihan}
            onChange={(e) => handleChange('waktuPilihan', e.target.value)}
            options={JAM_OPTIONS}
            error={errors.waktuPilihan}
            required
          />
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        className="w-full"
      >
        {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
      </Button>
    </form>
  )
}
