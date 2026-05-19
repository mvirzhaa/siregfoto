import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-uika-gradient shadow-uika-lg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo & Nama */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-kuning-400 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-kuning-300 transition-colors flex-shrink-0">
            <span className="text-uika-900 font-black text-xs">SR</span>
          </div>
          <div>
            <span className="text-white font-bold text-base leading-none">SiRegFoto</span>
            <span className="block text-uika-300 text-xs leading-none mt-0.5">BPPSI — UIKA Bogor</span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/#ketentuan"
            className="hidden sm:inline-flex px-3 py-1.5 text-uika-200 hover:text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
          >
            Ketentuan
          </Link>
          <Link
            href="/daftar"
            className="px-4 py-1.5 bg-kuning-400 text-uika-900 text-sm font-bold rounded-lg hover:bg-kuning-300 transition-colors shadow-sm"
          >
            Daftar Sekarang
          </Link>
        </nav>
      </div>
    </header>
  )
}
