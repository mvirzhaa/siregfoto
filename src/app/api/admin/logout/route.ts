import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'

export async function POST() {
  try {
    const session = await getAdminSession()
    session.destroy()
    return NextResponse.json({ success: true, message: 'Logout berhasil' })
  } catch (error) {
    console.error('[API /admin/logout POST]', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
