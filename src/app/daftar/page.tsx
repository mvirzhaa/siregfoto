import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FormRegistrasi } from '@/components/registrasi/FormRegistrasi'
import { HargaHint } from '@/components/registrasi/HargaHint'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daftar Layanan — SiRegFoto UIKA',
  description: 'Form pendaftaran foto ijazah dan scan sidik jari UIKA Bogor',
}

export default function DaftarPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Hero */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-uika-800">
              Registrasi Foto Ijazah
            </h1>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Daftarkan jadwal Anda untuk layanan foto ijazah &amp; scan sidik jari.
            </p>
          </div>

          {/* Info Harga */}
          <HargaHint />

          {/* Form */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-base font-semibold text-slate-800 mb-5">
              Isi Formulir Pendaftaran
            </h2>
            <FormRegistrasi />
          </div>

          {/* Catatan */}
          <p className="text-center text-xs text-slate-400 pb-4">
            Dengan mendaftar, Anda menyetujui penggunaan data untuk keperluan administrasi UIKA.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
