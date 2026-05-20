import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { sendFotoHasil } from '@/lib/email'

export async function POST(
  request: NextRequest,
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

    // Hanya izinkan kirim foto jika status pendaftaran sudah APPROVED atau COMPLETED
    if (registrasi.status !== 'APPROVED' && registrasi.status !== 'COMPLETED') {
      return NextResponse.json(
        {
          success: false,
          message: 'Foto hasil hanya dapat dikirim jika pendaftaran sudah disetujui atau selesai.',
        },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'File foto tidak ditemukan dalam request.' },
        { status: 400 }
      )
    }

    // Validasi tipe file (hanya izinkan gambar)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'File harus berupa gambar (JPEG, PNG, dll).' },
        { status: 400 }
      )
    }

    // Validasi ukuran file (maksimal 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'Ukuran file foto maksimal adalah 10MB.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Kirim email dengan attachment foto
    try {
      await sendFotoHasil(
        registrasi.gmail,
        registrasi.nama,
        buffer,
        file.name,
        file.type
      )

      // Update status fotoHasilTerkirim di database
      const updated = await prisma.registrasi.update({
        where: { id },
        data: {
          fotoHasilTerkirim: true,
          fotoHasilTerkirimAt: new Date(),
        },
      })

      return NextResponse.json({
        success: true,
        message: `Foto hasil berhasil dikirim ke ${updated.gmail}`,
        data: updated,
      })
    } catch (emailError) {
      console.error('[sendFotoHasil] Gagal kirim email:', emailError)
      return NextResponse.json(
        {
          success: false,
          message: 'Gagal mengirim email foto hasil. Silakan periksa koneksi SMTP atau email tujuan.',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[API /admin/send-photo/[id] POST]', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan internal server' },
      { status: 500 }
    )
  }
}
