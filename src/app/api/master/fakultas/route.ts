import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { z } from 'zod'

const FakultasSchema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 karakter').max(100),
  kode: z.string().min(2, 'Kode minimal 2 karakter').max(20).toUpperCase(),
  urutan: z.number().int().min(0).optional().default(0),
  aktif: z.boolean().optional().default(true),
})

// GET — public (untuk form registrasi mahasiswa)
// Param: ?all=true untuk admin (termasuk nonaktif)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeAll = searchParams.get('all') === 'true'

    // Endpoint ?all=true hanya boleh diakses admin
    if (includeAll) {
      const session = await getAdminSession()
      if (!session.isLoggedIn)
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const data = await prisma.masterFakultas.findMany({
      where: includeAll ? {} : { aktif: true },
      orderBy: [{ urutan: 'asc' }, { nama: 'asc' }],
      select: { id: true, nama: true, kode: true, urutan: true, aktif: true },
    })
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[GET /api/master/fakultas]', error)
    return NextResponse.json({ success: false, message: 'Gagal memuat data' }, { status: 500 })
  }
}

// POST — admin only
export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session.isLoggedIn)
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const parsed = FakultasSchema.safeParse(body)
    if (!parsed.success)
      return NextResponse.json({ success: false, errors: parsed.error.flatten().fieldErrors }, { status: 422 })

    const existing = await prisma.masterFakultas.findUnique({ where: { kode: parsed.data.kode } })
    if (existing)
      return NextResponse.json({ success: false, message: `Kode '${parsed.data.kode}' sudah digunakan` }, { status: 409 })

    const data = await prisma.masterFakultas.create({ data: parsed.data })
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/master/fakultas]', error)
    return NextResponse.json({ success: false, message: 'Gagal menyimpan data' }, { status: 500 })
  }
}
