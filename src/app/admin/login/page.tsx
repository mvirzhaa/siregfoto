'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Metadata } from 'next'

// Metadata tidak bisa di 'use client', tapi bisa di layout kalau diperlukan
export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/admin'

  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!pin.trim()) {
      toast.error('PIN tidak boleh kosong')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })

      const json = await res.json()

      if (!res.ok) {
        toast.error(json.message ?? 'Login gagal')
        setPin('')
        return
      }

      toast.success('Login berhasil!')
      router.push(redirect)
      router.refresh()
    } catch {
      toast.error('Terjadi kesalahan jaringan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-uika-gradient">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-kuning-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-uika-900 font-bold text-2xl">A</span>
          </div>
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <p className="text-uika-300 text-sm mt-1">SiRegFoto UIKA</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-uika-lg p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={18} className="text-uika-700" />
            <h2 className="text-base font-semibold text-slate-800">Masuk dengan PIN</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="pin" className="text-sm font-medium text-slate-700">
                PIN Admin <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="pin"
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Masukkan PIN"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-10 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-uika-700 focus:border-transparent hover:border-uika-400 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPin((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPin ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
                >
                  {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </Button>
          </form>
        </div>

        <p className="text-center text-uika-400 text-xs mt-4">
          © {new Date().getFullYear()} SiRegFoto UIKA
        </p>
      </div>
    </div>
  )
}
