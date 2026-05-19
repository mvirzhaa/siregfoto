import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { HARGA } from '@/lib/constants'
import { z } from 'zod'

const ValidateSchema = z.object({
  jenisLayanan: z.enum(['FOTO_CAP', 'CAP_ONLY']),
  catatanAdmin: z.string().optional(),
})

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
    const parsed = ValidateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const registrasi = await prisma.registrasi.findUnique({ where: { id } })

    if (!registrasi) {
      return NextResponse.json(
        { success: false, message: 'Data tidak ditemukan' },
        { status: 404 }
      )
    }

    if (registrasi.status !== 'PENDING') {
      return NextResponse.json(
        {
          success: false,
          message: `Status saat ini ${registrasi.status}, tidak bisa divalidasi`,
        },
        { status: 400 }
      )
    }

    const updated = await prisma.registrasi.update({
      where: { id },
      data: {
        jenisLayanan: parsed.data.jenisLayanan,
        nominal: HARGA[parsed.data.jenisLayanan],
        catatanAdmin: parsed.data.catatanAdmin,
        status: 'VALIDATED',
        divalidasiAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Registrasi berhasil divalidasi',
      data: updated,
    })
  } catch (error) {
    console.error('[API /admin/validate/[id] PATCH]', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
