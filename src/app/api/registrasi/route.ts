import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { RegistrasiSchema } from '@/types/registrasi'
import { generateNomorRegistrasi } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const parsed = RegistrasiSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Data tidak valid',
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      )
    }

    const data = parsed.data

    // Cek apakah NPM sudah pernah daftar dengan status aktif
    const existingActive = await prisma.registrasi.findFirst({
      where: {
        npm: data.npm.toUpperCase(),
        status: { in: ['PENDING', 'VALIDATED', 'APPROVED'] },
      },
    })

    if (existingActive) {
      return NextResponse.json(
        {
          success: false,
          message: `NPM ${data.npm} sudah memiliki pendaftaran aktif dengan status: ${existingActive.status}. Silakan hubungi admin.`,
        },
        { status: 409 }
      )
    }

    const registrasi = await prisma.registrasi.create({
      data: {
        nomorRegistrasi: generateNomorRegistrasi(),
        nama: data.nama.trim(),
        npm: data.npm.trim().toUpperCase(),
        gmail: data.gmail.trim().toLowerCase(),
        fakultas: data.fakultas,
        programStudi: data.programStudi.trim(),
        tanggalPilihan: new Date(data.tanggalPilihan),
        waktuPilihan: data.waktuPilihan,
        status: 'PENDING',
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Pendaftaran berhasil! Datang sesuai jadwal yang dipilih.',
        data: {
          id: registrasi.id,
          nomorRegistrasi: registrasi.nomorRegistrasi,
          nama: registrasi.nama,
          npm: registrasi.npm,
          tanggalPilihan: registrasi.tanggalPilihan.toISOString(),
          waktuPilihan: registrasi.waktuPilihan,
          status: registrasi.status,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[API /registrasi POST]', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server. Coba lagi.' },
      { status: 500 }
    )
  }
}
