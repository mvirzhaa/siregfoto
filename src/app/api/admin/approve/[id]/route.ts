import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { sendKwitansi } from '@/lib/email'
import { generateNomorKwitansi } from '@/lib/utils'

export async function PATCH(
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
        { success: false, message: 'Data tidak ditemukan' },
        { status: 404 }
      )
    }

    if (registrasi.status !== 'VALIDATED') {
      return NextResponse.json(
        {
          success: false,
          message: 'Hanya registrasi VALIDATED yang bisa di-approve',
        },
        { status: 400 }
      )
    }

    const nomorKwitansi = generateNomorKwitansi()

    // Update ke APPROVED + set nomorKwitansi
    const updated = await prisma.registrasi.update({
      where: { id },
      data: {
        status: 'APPROVED',
        nomorKwitansi,
        disetujuiAt: new Date(),
      },
    })

    // Kirim kwitansi email
    try {
      await sendKwitansi(updated)

      // Update ke COMPLETED setelah email berhasil terkirim
      await prisma.registrasi.update({
        where: { id },
        data: {
          kwitansiTerkirim: true,
          kwitansiTerkirimAt: new Date(),
          status: 'COMPLETED',
        },
      })

      return NextResponse.json({
        success: true,
        message: `Disetujui! Kwitansi telah dikirim ke ${updated.gmail}`,
        data: { ...updated, status: 'COMPLETED', kwitansiTerkirim: true },
      })
    } catch (emailError) {
      console.error('[sendKwitansi] Gagal kirim email:', emailError)

      // Tetap return sukses tapi tandai email gagal
      return NextResponse.json({
        success: true,
        message: `Disetujui, namun pengiriman email kwitansi gagal. Silakan kirim ulang manual.`,
        data: { ...updated, emailError: true },
      })
    }
  } catch (error) {
    console.error('[API /admin/approve/[id] PATCH]', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
