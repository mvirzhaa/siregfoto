'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SuksesCard } from '@/components/registrasi/SuksesCard'
import { Spinner } from '@/components/ui/Spinner'

interface SuksesData {
  nomorRegistrasi: string
  nama: string
  npm: string
  tanggalPilihan: string
  waktuPilihan: string
}

export default function SuksesPage() {
  const router = useRouter()
  const [data, setData] = useState<SuksesData | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('registrasi_sukses')
    if (!raw) {
      // Tidak ada data — redirect ke halaman daftar
      router.replace('/daftar')
      return
    }
    try {
      setData(JSON.parse(raw))
      sessionStorage.removeItem('registrasi_sukses')
    } catch {
      router.replace('/daftar')
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-md">
          {data ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
              <SuksesCard data={data} />
            </div>
          ) : (
            <Spinner size="lg" text="Memuat..." />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
