import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import {
  verifyPassword,
  generateOtpCode,
  hashOtp,
  otpExpiry,
  checkRateLimit,
  recordFailedAttempt,
  clearAttempts,
  getClientIp,
} from '@/lib/auth'
import { sendOtpEmail } from '@/lib/email'

// ── Step 1: Username + Password → kirim OTP ke email admin ───────────────────
export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  try {
    // Cek rate limit per-IP
    const limit = checkRateLimit(ip)
    if (!limit.allowed) {
      const minutes = Math.ceil((limit.remainingMs ?? 0) / 60000)
      return NextResponse.json(
        { success: false, message: `Terlalu banyak percobaan. Coba lagi dalam ${minutes} menit.`, locked: true },
        { status: 429 }
      )
    }

    const { username, password } = await request.json()
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username dan password diperlukan' },
        { status: 400 }
      )
    }

    const user = await prisma.adminUser.findUnique({ where: { username: username.trim() } })

    if (!user || !user.aktif) {
      recordFailedAttempt(ip)
      await new Promise(r => setTimeout(r, 1000)) // anti-timing
      return NextResponse.json(
        { success: false, message: 'Username atau password salah.' },
        { status: 401 }
      )
    }

    // Cek lockout DB
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000)
      return NextResponse.json(
        { success: false, message: `Akun terkunci. Coba lagi dalam ${minutes} menit.`, locked: true },
        { status: 429 }
      )
    }

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) {
      const result = recordFailedAttempt(ip)
      const newFailed = user.failedAttempts + 1
      await prisma.adminUser.update({
        where: { id: user.id },
        data: {
          failedAttempts: newFailed,
          lockedUntil: newFailed >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null,
        },
      })
      return NextResponse.json(
        {
          success: false,
          message: result.locked
            ? 'Akun terkunci 15 menit karena terlalu banyak percobaan.'
            : `Username atau password salah. Sisa percobaan: ${result.attemptsLeft}`,
        },
        { status: 401 }
      )
    }

    // ✅ Password benar — reset brute force counter
    clearAttempts(ip)
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { failedAttempts: 0, lockedUntil: null },
    })

    // Generate & kirim OTP ke email admin
    const otpCode = generateOtpCode()
    const otpHash = await hashOtp(otpCode)

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { otpCode: otpHash, otpExpiry: otpExpiry() },
    })

    // Simpan pending session
    const session = await getAdminSession()
    session.pendingTotpUserId = user.id
    session.pendingTotpAt = new Date().toISOString()
    await session.save()

    // Kirim email OTP (non-blocking untuk response cepat, tapi await untuk pastikan terkirim)
    try {
      await sendOtpEmail(user.email, otpCode, user.username)
    } catch (emailErr) {
      console.error('[sendOtpEmail]', emailErr)
      return NextResponse.json(
        { success: false, message: 'Gagal mengirim kode OTP ke email. Periksa konfigurasi SMTP.' },
        { status: 500 }
      )
    }

    // Sensor email: tampilkan sebagian saja (u***@gmail.com)
    const maskedEmail = maskEmail(user.email)

    return NextResponse.json({
      success: true,
      requiresOtp: true,
      maskedEmail,
      message: `Kode OTP telah dikirim ke ${maskedEmail}. Berlaku 5 menit.`,
    })
  } catch (error) {
    console.error('[POST /api/admin/login]', error)
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  const visible = local.slice(0, 2)
  return `${visible}${'*'.repeat(Math.max(2, local.length - 2))}@${domain}`
}
