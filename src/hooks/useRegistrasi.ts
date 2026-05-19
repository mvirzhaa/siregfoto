'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import type { RegistrasiInput } from '@/types/registrasi'

type FormErrors = Partial<Record<keyof RegistrasiInput, string>>

const initialForm: RegistrasiInput = {
  nama: '',
  npm: '',
  gmail: '',
  fakultas: '',
  programStudi: '',
  tanggalPilihan: '',
  waktuPilihan: '' as RegistrasiInput['waktuPilihan'],
}

export function useRegistrasi() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [form, setForm] = useState<RegistrasiInput>(initialForm)

  function setField(field: keyof RegistrasiInput, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  async function submit() {
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
        return false
      }

      toast.success('Pendaftaran berhasil!')
      sessionStorage.setItem('registrasi_sukses', JSON.stringify(json.data))
      router.push('/daftar/sukses')
      return true
    } catch {
      toast.error('Terjadi kesalahan jaringan. Coba lagi.')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { form, errors, loading, setField, submit }
}
