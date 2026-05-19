import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { z } from 'zod'

const ProdiSchema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 karakter').max(150),
  kode: z.string().min(2, 'Kode minimal 2 karakter').max(20).toUpperCase(),
  fakultasId: z.string().min(1, 'Pilih fakultas'),
  urutan: z.number().int().min(0).optional().default(0),
  aktif: z.boolean().optional().default(true),
})

// GET — public, dengan query ?fakultasId=xxx
// Param: ?all=true untuk admin (termasuk nonaktif)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fakultasId  = searchParams.get('fakultasId')
    const includeAll  = searchParams.get('all') === 'true'

    if (includeAll) {
      const session = await getAdminSession()
      if (!session.isLoggedIn)
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const data = await prisma.masterProdi.findMany({
      where: {
        ...(includeAll ? {} : { aktif: true }),
        ...(fakultasId ? { fakultasId } : {}),
      },
      orderBy: [{ urutan: 'asc' }, { nama: 'asc' }],
      select: {
        id: true, nama: true, kode: true, urutan: true, aktif: true,
        fakultasId: true,
        fakultas: { select: { id: true, nama: true, kode: true } },
      },
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[GET /api/master/prodi]', error)
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
    const parsed = ProdiSchema.safeParse(body)
    if (!parsed.success)
      return NextResponse.json({ success: false, errors: parsed.error.flatten().fieldErrors }, { status: 422 })

    const existing = await prisma.masterProdi.findUnique({
      where: { kode_fakultasId: { kode: parsed.data.kode, fakultasId: parsed.data.fakultasId } },
    })
    if (existing)
      return NextResponse.json(
        { success: false, message: `Kode '${parsed.data.kode}' sudah ada di fakultas ini` },
        { status: 409 }
      )

    const data = await prisma.masterProdi.create({ data: parsed.data })
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/master/prodi]', error)
    return NextResponse.json({ success: false, message: 'Gagal menyimpan data' }, { status: 500 })
  }
}
