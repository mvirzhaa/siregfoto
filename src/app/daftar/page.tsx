import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FormRegistrasi } from '@/components/registrasi/FormRegistrasi'
import { HargaHint } from '@/components/registrasi/HargaHint'
import { CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Formulir Pendaftaran — Studio BPPSI UIKA',
  description: 'Form pendaftaran foto ijazah dan scan sidik jari mahasiswa UIKA Bogor.',
}

export default function DaftarPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-7 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-5">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-uika-700 transition-colors">Beranda</Link>
            <ChevronRight size={12} />
            <span className="text-slate-800 font-medium">Formulir Pendaftaran</span>
          </nav>

          {/* Page Header */}
          <div>
            <div className="inline-block bg-uika-100 text-uika-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2">
              BPPSI UIKA
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Registrasi Foto Ijazah
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Daftarkan jadwal Anda untuk layanan foto ijazah &amp; scan sidik jari di BPPSI UIKA.
            </p>
          </div>

          {/* Pengingat pakaian */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Pastikan Anda berpakaian sesuai ketentuan saat datang:</p>
              <ul className="space-y-0.5 text-xs">
                <li className="flex items-center gap-1.5"><CheckCircle2 size={11} className="flex-shrink-0" /> <strong>Semua:</strong> Kemeja putih</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 size={11} className="flex-shrink-0" /> <strong>Laki-laki:</strong> Jas hitam + dasi hitam</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 size={11} className="flex-shrink-0" /> <strong>Perempuan:</strong> Kerudung hitam</li>
              </ul>
              <Link href="/#ketentuan" className="text-amber-700 font-semibold underline underline-offset-2 text-xs mt-1.5 inline-block">
                Lihat ketentuan lengkap →
              </Link>
            </div>
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

          <p className="text-center text-xs text-slate-400 pb-4">
            Dengan mendaftar, Anda menyetujui penggunaan data untuk keperluan administrasi UIKA.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
