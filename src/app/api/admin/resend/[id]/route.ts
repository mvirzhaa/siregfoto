import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { sendKwitansi } from '@/lib/email'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session.isLoggedIn) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const registrasi = await prisma.registrasi.findUnique({ where: { id } })

    if (!registrasi) {
      return NextResponse.json(
        { success: false, message: 'Data pendaftaran tidak ditemukan' },
        { status: 404 }
      )
    }

    if (!registrasi.nomorKwitansi) {
      return NextResponse.json(
        { success: false, message: 'Kwitansi belum dibuat. Silakan validasi dan setujui terlebih dahulu.' },
        { status: 400 }
      )
    }

    // Kirim kwitansi email
    try {
      await sendKwitansi(registrasi)

      // Update ke COMPLETED setelah email berhasil terkirim
      const updated = await prisma.registrasi.update({
        where: { id },
        data: {
          kwitansiTerkirim: true,
          kwitansiTerkirimAt: new Date(),
          status: 'COMPLETED',
        },
      })

      return NextResponse.json({
        success: true,
        message: `Kwitansi berhasil dikirim ulang ke ${updated.gmail}`,
        data: updated,
      })
    } catch (emailError) {
      console.error('[resendKwitansi] Gagal kirim email:', emailError)
      return NextResponse.json(
        {
          success: false,
          message: 'Gagal mengirim ulang email kwitansi. Silakan periksa jaringan server atau konfigurasi SMTP.',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[API /admin/resend/[id] POST]', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
