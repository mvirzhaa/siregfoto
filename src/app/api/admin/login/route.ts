import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json()

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json(
        { success: false, message: 'PIN diperlukan' },
        { status: 400 }
      )
    }

    const correctPin = process.env.ADMIN_PIN
    if (!correctPin) {
      console.error('ADMIN_PIN tidak dikonfigurasi di environment')
      return NextResponse.json(
        { success: false, message: 'Konfigurasi server bermasalah' },
        { status: 500 }
      )
    }

    if (pin !== correctPin) {
      // Delay mencegah brute force
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return NextResponse.json(
        { success: false, message: 'PIN salah' },
        { status: 401 }
      )
    }

    const session = await getAdminSession()
    session.isLoggedIn = true
    session.loginAt = new Date().toISOString()
    await session.save()

    return NextResponse.json({ success: true, message: 'Login berhasil' })
  } catch (error) {
    console.error('[API /admin/login POST]', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
