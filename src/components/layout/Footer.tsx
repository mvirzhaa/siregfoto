export function Footer() {
  return (
    <footer className="mt-auto py-6 border-t border-uika-100 bg-white/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()}{' '}
          <span className="font-medium text-uika-700">SiRegFoto</span> —
          Sistem Registrasi Foto Ijazah &amp; Sidik Jari
          <br />
          Universitas Ibn Khaldun (UIKA) Bogor
        </p>
      </div>
    </footer>
  )
}
