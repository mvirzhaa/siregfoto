import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'

export async function GET(
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

    return NextResponse.json({ success: true, data: registrasi })
  } catch (error) {
    console.error('[API /admin/pendaftar/[id] GET]', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function PATCH(
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
    const body = await request.json()
    const { nama, npm, gmail, fakultas, programStudi } = body

    if (!nama || !npm || !gmail || !fakultas || !programStudi) {
      return NextResponse.json(
        { success: false, message: 'Semua field wajib diisi' },
        { status: 400 }
      )
    }

    const registrasi = await prisma.registrasi.findUnique({ where: { id } })
    if (!registrasi) {
      return NextResponse.json(
        { success: false, message: 'Data tidak ditemukan' },
        { status: 404 }
      )
    }

    // Hanya izinkan edit jika status belum APPROVED / COMPLETED
    if (registrasi.status !== 'PENDING' && registrasi.status !== 'VALIDATED') {
      return NextResponse.json(
        { success: false, message: 'Data tidak dapat diedit setelah disetujui atau selesai.' },
        { status: 400 }
      )
    }

    const updated = await prisma.registrasi.update({
      where: { id },
      data: {
        nama: nama.trim(),
        npm: npm.trim(),
        gmail: gmail.trim().toLowerCase(),
        fakultas: fakultas.trim(),
        programStudi: programStudi.trim(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Data pendaftar berhasil diperbarui',
      data: updated,
    })
  } catch (error) {
    console.error('[API /admin/pendaftar/[id] PATCH]', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

