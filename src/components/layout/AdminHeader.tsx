'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, LayoutDashboard, FileSpreadsheet, Database } from 'lucide-react'
import toast from 'react-hot-toast'

export function AdminHeader() {
  const router = useRouter()

  async function handleLogout() {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      toast.success('Logout berhasil')
      router.push('/admin/login')
      router.refresh()
    } catch {
      toast.error('Gagal logout')
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-uika-gradient shadow-uika-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-kuning-400 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-uika-900 font-bold text-sm">A</span>
          </div>
          <div>
            <span className="text-white font-bold text-base leading-none">Admin Panel</span>
            <span className="block text-uika-300 text-xs leading-none mt-0.5">SiRegFoto UIKA</span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 text-uika-200 hover:text-white hover:bg-uika-800 rounded-lg text-sm transition-colors"
          >
            <LayoutDashboard size={15} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            href="/admin/laporan"
            className="flex items-center gap-1.5 px-3 py-1.5 text-uika-200 hover:text-white hover:bg-uika-800 rounded-lg text-sm transition-colors"
          >
            <FileSpreadsheet size={15} />
            <span className="hidden sm:inline">Laporan</span>
          </Link>
          <Link
            href="/admin/master"
            className="flex items-center gap-1.5 px-3 py-1.5 text-uika-200 hover:text-white hover:bg-uika-800 rounded-lg text-sm transition-colors"
          >
            <Database size={15} />
            <span className="hidden sm:inline">Master Data</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-uika-200 hover:text-red-300 hover:bg-uika-800 rounded-lg text-sm transition-colors ml-1"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
