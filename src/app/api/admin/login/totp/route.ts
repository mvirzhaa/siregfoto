import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { verifyOtp, checkRateLimit, recordFailedAttempt, clearAttempts, getClientIp } from '@/lib/auth'

// ── Step 2: Verifikasi Email OTP ──────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  try {
    const session = await getAdminSession()

    // Harus sudah lewat step 1
    if (!session.pendingTotpUserId) {
      return NextResponse.json(
        { success: false, message: 'Sesi tidak valid. Silakan login ulang.' },
        { status: 401 }
      )
    }

    // Pending session maksimal 10 menit
    if (session.pendingTotpAt) {
      const elapsed = Date.now() - new Date(session.pendingTotpAt).getTime()
      if (elapsed > 10 * 60 * 1000) {
        session.destroy()
        return NextResponse.json(
          { success: false, message: 'Sesi kadaluarsa. Silakan login ulang.' },
          { status: 401 }
        )
      }
    }

    // Rate limit per-IP untuk step OTP
    const limit = checkRateLimit(`otp:${ip}`)
    if (!limit.allowed) {
      const minutes = Math.ceil((limit.remainingMs ?? 0) / 60000)
      return NextResponse.json(
        { success: false, message: `Terlalu banyak percobaan. Coba lagi dalam ${minutes} menit.` },
        { status: 429 }
      )
    }

    const { code } = await request.json()
    if (!code || typeof code !== 'string' || code.trim().length !== 6) {
      return NextResponse.json({ success: false, message: 'Kode OTP harus 6 digit' }, { status: 400 })
    }

    const user = await prisma.adminUser.findUnique({ where: { id: session.pendingTotpUserId } })
    if (!user || !user.otpCode || !user.otpExpiry) {
      return NextResponse.json(
        { success: false, message: 'Kode OTP tidak ditemukan. Silakan request ulang.' },
        { status: 401 }
      )
    }

    // Cek apakah OTP sudah kadaluarsa
    if (user.otpExpiry < new Date()) {
      await prisma.adminUser.update({ where: { id: user.id }, data: { otpCode: null, otpExpiry: null } })
      return NextResponse.json(
        { success: false, message: 'Kode OTP sudah kadaluarsa. Silakan login ulang.', expired: true },
        { status: 401 }
      )
    }

    const valid = await verifyOtp(code.trim(), user.otpCode)
    if (!valid) {
      recordFailedAttempt(`otp:${ip}`)
      return NextResponse.json(
        { success: false, message: 'Kode OTP salah.' },
        { status: 401 }
      )
    }

    // ✅ Login berhasil
    clearAttempts(`otp:${ip}`)

    // Hapus OTP dari DB setelah dipakai (single-use)
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { otpCode: null, otpExpiry: null, lastLoginAt: new Date() },
    })

    session.isLoggedIn = true
    session.loginAt = new Date().toISOString()
    session.pendingTotpUserId = undefined
    session.pendingTotpAt = undefined
    await session.save()

    return NextResponse.json({ success: true, message: 'Login berhasil' })
  } catch (error) {
    console.error('[POST /api/admin/login/totp]', error)
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
