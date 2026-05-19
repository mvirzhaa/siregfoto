export function Footer() {
  return (
    <footer className="mt-auto border-t border-uika-100 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 bg-uika-gradient rounded-md flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black text-xs">SR</span>
              </div>
              <span className="font-bold text-slate-800 text-sm">SiRegFoto</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Sistem Registrasi Foto Ijazah &amp; Sidik Jari<br />
              Universitas Ibn Khaldun (UIKA) Bogor
            </p>
          </div>

          {/* BPPSI */}
          <div className="text-right sm:text-right">
            <p className="text-xs font-semibold text-uika-700 mb-0.5">Dikelola oleh</p>
            <p className="text-sm font-bold text-slate-800">
              BPPSI UIKA
            </p>
            <p className="text-xs text-slate-500">
              Biro Perencanaan, Pelaporan &amp; Sistem Informasi
            </p>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} BPPSI — Universitas Ibn Khaldun (UIKA) Bogor. Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  )
}
