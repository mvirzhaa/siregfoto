'use client'

import { Suspense, useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { Lock, Eye, EyeOff, Mail, AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

type Step = 'credentials' | 'otp'

// ── Step indicator ────────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {(['credentials', 'otp'] as Step[]).map((s, i) => {
        const done = current === 'otp' && i === 0
        const active = current === s
        return (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
              done   ? 'bg-uika-600 text-white' :
              active ? 'bg-kuning-400 text-uika-900' :
                       'bg-slate-100 text-slate-400'}`}>
              {done ? '✓' : i + 1}
            </div>
            <span className={`text-xs hidden sm:block transition-colors ${active ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
              {i === 0 ? 'Username & Password' : 'Kode OTP Email'}
            </span>
            {i === 0 && (
              <div className={`flex-1 h-0.5 rounded-full transition-colors ${current === 'otp' ? 'bg-uika-400' : 'bg-slate-100'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Login Flow ────────────────────────────────────────────────────────────────
function LoginFlow() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/admin'

  const [step, setStep] = useState<Step>('credentials')
  const [loading, setLoading] = useState(false)
  const [locked, setLocked] = useState(false)

  // Step 1
  const [username, setUsername]   = useState('')
  const [password, setPassword]   = useState('')
  const [showPw, setShowPw]       = useState(false)

  // Step 2
  const [otpCode, setOtpCode]         = useState('')
  const [maskedEmail, setMaskedEmail] = useState('')
  const otpRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (step === 'otp') setTimeout(() => otpRef.current?.focus(), 100)
  }, [step])

  // ── Step 1 ─────────────────────────────────────────────────────────────────
  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim() || !password) { toast.error('Username dan password wajib diisi'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      const json = await res.json()

      if (res.status === 429) { setLocked(true); toast.error(json.message); return }
      if (!res.ok) { toast.error(json.message ?? 'Login gagal'); setPassword(''); return }

      setMaskedEmail(json.maskedEmail ?? '')
      setStep('otp')
      toast.success(`Kode OTP dikirim ke ${json.maskedEmail}`, { icon: '📧' })
    } catch { toast.error('Terjadi kesalahan jaringan') }
    finally { setLoading(false) }
  }

  // ── Step 2 ─────────────────────────────────────────────────────────────────
  async function handleOtp(e: React.FormEvent) {
    e.preventDefault()
    if (otpCode.length !== 6) { toast.error('Kode harus 6 digit'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login/totp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: otpCode }),
      })
      const json = await res.json()

      if (res.status === 429) { setLocked(true); toast.error(json.message); return }
      if (json.expired) {
        toast.error('Kode OTP kadaluarsa. Silakan login ulang.')
        setStep('credentials'); setOtpCode(''); return
      }
      if (!res.ok) { toast.error(json.message ?? 'Kode salah'); setOtpCode(''); return }

      toast.success('Login berhasil!')
      router.push(redirect)
      router.refresh()
    } catch { toast.error('Terjadi kesalahan jaringan') }
    finally { setLoading(false) }
  }

  // Kirim ulang OTP
  async function handleResend() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error('Gagal kirim ulang. Silakan login dari awal.')
        setStep('credentials'); return
      }
      setOtpCode('')
      toast.success(`Kode baru dikirim ke ${json.maskedEmail}`, { icon: '📧' })
    } catch { toast.error('Terjadi kesalahan jaringan') }
    finally { setLoading(false) }
  }

  const inputCls = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-uika-700 focus:border-transparent hover:border-uika-400 transition-colors'

  // Locked
  if (locked) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto">
          <AlertTriangle size={24} className="text-red-500" />
        </div>
        <div>
          <p className="font-semibold text-slate-800">Akun Terkunci Sementara</p>
          <p className="text-sm text-slate-500 mt-1">Terlalu banyak percobaan gagal.<br/>Tunggu 15 menit dan coba lagi.</p>
        </div>
        <button onClick={() => { setLocked(false); setStep('credentials'); setPassword(''); setOtpCode('') }}
          className="text-sm text-uika-700 underline">
          ← Kembali ke login
        </button>
      </div>
    )
  }

  return (
    <div>
      <StepIndicator current={step} />

      {step === 'credentials' ? (
        /* ── Form Step 1 ── */
        <form onSubmit={handleCredentials} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="text-sm font-medium text-slate-700">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              id="username" type="text" value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Masukkan username" autoComplete="username"
              className={inputCls} required autoFocus
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password" type={showPw ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Masukkan password" autoComplete="current-password"
                className={`${inputCls} pr-10`} required
              />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPw ? 'Sembunyikan' : 'Tampilkan'}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            {loading ? 'Memeriksa...' : 'Lanjut'}
          </Button>
        </form>
      ) : (
        /* ── Form Step 2 ── */
        <form onSubmit={handleOtp} className="space-y-4">
          <div className="flex items-start gap-3 bg-uika-50 border border-uika-100 rounded-xl p-3.5">
            <Mail size={17} className="text-uika-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-uika-800">
              Kode OTP 6 digit telah dikirim ke<br/>
              <strong>{maskedEmail}</strong><br/>
              <span className="text-xs text-uika-600">Berlaku 5 menit</span>
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="otp" className="text-sm font-medium text-slate-700">
              Kode OTP <span className="text-red-500">*</span>
            </label>
            <input
              ref={otpRef} id="otp" type="text" inputMode="numeric"
              value={otpCode}
              onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="_ _ _ _ _ _"
              autoComplete="one-time-code"
              className={`${inputCls} text-center text-2xl tracking-[0.6em] font-mono py-3`}
              maxLength={6} required
            />
          </div>

          <Button type="submit" variant="primary" size="lg" loading={loading}
            disabled={otpCode.length !== 6} className="w-full">
            {loading ? 'Memverifikasi...' : 'Verifikasi & Masuk'}
          </Button>

          <div className="flex items-center justify-between text-sm pt-1">
            <button type="button" onClick={() => { setStep('credentials'); setOtpCode('') }}
              className="text-slate-400 hover:text-slate-600 transition-colors">
              ← Kembali
            </button>
            <button type="button" onClick={handleResend} disabled={loading}
              className="flex items-center gap-1 text-uika-600 hover:text-uika-800 transition-colors disabled:opacity-50">
              <RotateCcw size={13} />
              Kirim ulang kode
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-uika-gradient">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-kuning-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock size={28} className="text-uika-900" />
          </div>
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <p className="text-uika-300 text-sm mt-1">Studio BPPSI UIKA</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-uika-lg p-6 sm:p-8">
          <Suspense fallback={<div className="py-8"><Spinner size="md" /></div>}>
            <LoginFlow />
          </Suspense>
        </div>

        <p className="text-center text-uika-400 text-xs mt-5">
          © {new Date().getFullYear()} BPPSI UIKA — Dilindungi 2-Step Verification
        </p>
      </div>
    </div>
  )
}
