import Link from 'next/link'
import type { Metadata } from 'next'
import {
  Camera,
  Fingerprint,
  ClipboardList,
  UserCheck,
  Mail,
  ArrowRight,
  CheckCircle2,
  Users,
  Shirt,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { formatRupiah } from '@/lib/utils'
import { HARGA, LABEL_LAYANAN } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'SiRegFoto — Registrasi Foto Ijazah & Sidik Jari UIKA',
  description:
    'Sistem Registrasi Foto Ijazah dan Sidik Jari mahasiswa UIKA Bogor, dikelola oleh BPPSI Universitas Ibn Khaldun.',
}

/* ─── Data ──────────────────────────────────────────────────────────── */
const ALUR = [
  {
    step: '01',
    icon: ClipboardList,
    title: 'Daftar Online',
    desc: 'Isi formulir pendaftaran dengan data diri dan pilih jadwal kedatangan.',
  },
  {
    step: '02',
    icon: UserCheck,
    title: 'Datang ke BPPSI',
    desc: 'Hadir sesuai jadwal yang dipilih dengan berpakaian sesuai ketentuan.',
  },
  {
    step: '03',
    icon: Camera,
    title: 'Foto & Sidik Jari',
    desc: 'Petugas BPPSI melakukan pengambilan foto resmi dan scan sidik jari.',
  },
  {
    step: '04',
    icon: Mail,
    title: 'Terima Kwitansi',
    desc: 'Kwitansi pembayaran dikirim otomatis ke Gmail Anda setelah selesai.',
  },
]

const KETENTUAN_PRIA = [
  'Jas resmi warna hitam',
  'Dasi warna hitam',
  'Kemeja warna putih',
  'Rambut rapi dan sopan',
]

const KETENTUAN_WANITA = [
  'Kerudung / jilbab warna hitam',
  'Kemeja warna putih',
  'Penampilan rapi dan sopan',
]

const KETENTUAN_UMUM = [
  'Tidak memakai kacamata hitam',
  'Ekspresi wajah natural dan serius',
  'Latar belakang foto ditentukan sistem',
]

/* ─── Component ─────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">

        {/* ══ HERO ══════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-uika-gradient py-16 sm:py-24 px-4">
          {/* decorative circles */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-32 -left-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative max-w-4xl mx-auto text-center">
            {/* BPPSI badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-kuning-400 animate-pulse" />
              <span className="text-white/90 text-xs sm:text-sm font-medium tracking-wide">
                BPPSI — Universitas Ibn Khaldun Bogor
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Si<span className="text-kuning-400">Reg</span>Foto
            </h1>
            <p className="mt-3 text-uika-200 text-lg sm:text-xl font-medium">
              Sistem Registrasi Foto Ijazah &amp; Sidik Jari
            </p>
            <p className="mt-2 text-uika-300 text-sm sm:text-base max-w-xl mx-auto">
              Layanan resmi pengambilan foto ijazah dan scan sidik jari
              mahasiswa Universitas Ibn Khaldun (UIKA) Bogor, dikelola oleh{' '}
              <strong className="text-kuning-400">BPPSI UIKA</strong>.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/daftar"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-kuning-400 text-uika-900 font-bold text-base rounded-xl hover:bg-kuning-300 transition-colors shadow-lg"
              >
                Daftar Sekarang
                <ArrowRight size={18} />
              </Link>
              <a
                href="#ketentuan"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 border border-white/25 text-white font-semibold text-base rounded-xl hover:bg-white/20 transition-colors"
              >
                Lihat Ketentuan Foto
              </a>
            </div>
          </div>
        </section>

        {/* ══ TENTANG BPPSI ═════════════════════════════════════════════ */}
        <section className="py-14 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Logo placeholder BPPSI */}
              <div className="flex-shrink-0">
                <div className="w-28 h-28 rounded-2xl bg-uika-gradient flex flex-col items-center justify-center shadow-uika-lg">
                  <span className="text-white font-black text-2xl leading-none">BPPSI</span>
                  <span className="text-uika-300 text-xs mt-1 font-medium tracking-widest">UIKA</span>
                </div>
              </div>

              <div>
                <div className="inline-block bg-uika-100 text-uika-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                  Tentang Pengelola
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3">
                  Biro Perencanaan, Pelaporan &amp;<br className="hidden sm:block" /> Sistem Informasi (BPPSI) UIKA
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  BPPSI adalah unit yang bertanggung jawab atas pengelolaan sistem informasi
                  dan layanan administratif di Universitas Ibn Khaldun Bogor. Salah satu
                  layanan BPPSI adalah pengambilan foto resmi untuk keperluan ijazah dan
                  scan sidik jari mahasiswa yang akan diwisuda.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {['Foto Ijazah Resmi', 'Scan Sidik Jari', 'Kwitansi Digital', 'Terjadwal'].map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-uika-700 bg-uika-50 border border-uika-200 rounded-full px-3 py-1"
                    >
                      <CheckCircle2 size={11} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ LAYANAN ═══════════════════════════════════════════════════ */}
        <section className="py-14 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-block bg-uika-100 text-uika-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                Layanan &amp; Tarif
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                Pilih Jenis Layanan
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                Jenis layanan dikonfirmasi oleh petugas BPPSI saat Anda datang.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
              {/* Card Foto + Cap */}
              <div className="bg-white rounded-2xl border-2 border-uika-200 p-6 shadow-sm relative overflow-hidden group hover:border-uika-500 hover:shadow-uika transition-all duration-200">
                <div className="absolute top-0 right-0 w-24 h-24 bg-uika-50 rounded-bl-full pointer-events-none" />
                <div className="w-12 h-12 rounded-xl bg-uika-100 flex items-center justify-center mb-4">
                  <Camera size={22} className="text-uika-700" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">{LABEL_LAYANAN.FOTO_CAP}</h3>
                <p className="text-slate-500 text-sm mt-1 mb-4 leading-relaxed">
                  Pengambilan foto resmi ijazah beserta scan sidik jari (cap 3 jari).
                </p>
                <div className="text-2xl font-black text-uika-700">
                  {formatRupiah(HARGA.FOTO_CAP)}
                </div>
              </div>

              {/* Card Cap Only */}
              <div className="bg-white rounded-2xl border-2 border-kuning-200 p-6 shadow-sm relative overflow-hidden group hover:border-kuning-400 hover:shadow-md transition-all duration-200">
                <div className="absolute top-0 right-0 w-24 h-24 bg-kuning-50 rounded-bl-full pointer-events-none" />
                <div className="w-12 h-12 rounded-xl bg-kuning-100 flex items-center justify-center mb-4">
                  <Fingerprint size={22} className="text-kuning-700" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">{LABEL_LAYANAN.CAP_ONLY}</h3>
                <p className="text-slate-500 text-sm mt-1 mb-4 leading-relaxed">
                  Hanya pengambilan data sidik jari (cap 3 jari), tanpa sesi foto.
                </p>
                <div className="text-2xl font-black text-kuning-700">
                  {formatRupiah(HARGA.CAP_ONLY)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ KETENTUAN FOTO ════════════════════════════════════════════ */}
        <section id="ketentuan" className="py-14 px-4 bg-white scroll-mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-block bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                Wajib Dibaca
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                Ketentuan Pakaian Foto Ijazah
              </h2>
              <p className="text-slate-500 text-sm mt-2 max-w-lg mx-auto">
                Peserta yang tidak berpakaian sesuai ketentuan akan diminta untuk
                kembali lain waktu. Pastikan Anda mempersiapkan diri sebelum datang.
              </p>
            </div>

            {/* Warning banner */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 max-w-2xl mx-auto">
              <span className="text-amber-500 text-xl flex-shrink-0">⚠️</span>
              <p className="text-amber-800 text-sm font-medium leading-relaxed">
                Ketentuan pakaian bersifat <strong>wajib</strong> dan akan diperiksa
                oleh petugas BPPSI sebelum sesi foto dimulai.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Laki-laki */}
              <div className="bg-slate-800 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Users size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-base">Laki-laki</p>
                    <p className="text-slate-400 text-xs">Putra / Male</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {KETENTUAN_PRIA.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-uika-700 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 size={12} className="text-white" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                {/* Ilustrasi warna pakaian */}
                <div className="mt-5 flex gap-2 items-center">
                  <div className="w-8 h-8 rounded-lg bg-black border-2 border-slate-600" title="Jas hitam" />
                  <div className="w-8 h-8 rounded-lg bg-black border-2 border-slate-600" title="Dasi hitam" />
                  <div className="w-8 h-8 rounded-lg bg-white border-2 border-slate-300" title="Kemeja putih" />
                  <span className="text-slate-400 text-xs ml-1">Hitam · Hitam · Putih</span>
                </div>
              </div>

              {/* Perempuan */}
              <div className="bg-uika-gradient rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Shirt size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-base">Perempuan</p>
                    <p className="text-uika-300 text-xs">Putri / Female</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {KETENTUAN_WANITA.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-uika-100">
                      <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 size={12} className="text-white" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex gap-2 items-center">
                  <div className="w-8 h-8 rounded-lg bg-black border-2 border-uika-600" title="Kerudung hitam" />
                  <div className="w-8 h-8 rounded-lg bg-white border-2 border-uika-300" title="Kemeja putih" />
                  <span className="text-uika-300 text-xs ml-1">Kerudung Hitam · Kemeja Putih</span>
                </div>
              </div>
            </div>

            {/* Ketentuan Umum */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-2xl mx-auto">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                Ketentuan Umum (Semua Gender)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {KETENTUAN_UMUM.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 size={14} className="text-uika-600 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ ALUR PENDAFTARAN ══════════════════════════════════════════ */}
        <section className="py-14 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-block bg-uika-100 text-uika-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                Cara Daftar
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                Alur Pendaftaran
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {ALUR.map(({ step, icon: Icon, title, desc }) => (
                <div key={step} className="relative bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  {/* Step number */}
                  <div className="absolute -top-3 left-5 bg-uika-700 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                    {step}
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-uika-50 flex items-center justify-center mb-4 mt-2">
                    <Icon size={20} className="text-uika-700" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA ═══════════════════════════════════════════════════════ */}
        <section className="py-16 px-4 bg-uika-gradient relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative max-w-xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Siap untuk mendaftar?
            </h2>
            <p className="text-uika-200 text-sm sm:text-base mb-8">
              Isi formulir online sekarang dan pilih jadwal kedatangan Anda ke BPPSI UIKA.
            </p>
            <Link
              href="/daftar"
              className="inline-flex items-center gap-2 px-10 py-4 bg-kuning-400 text-uika-900 font-bold text-base rounded-xl hover:bg-kuning-300 transition-colors shadow-lg"
            >
              Mulai Daftar
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
