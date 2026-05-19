import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { z } from 'zod'

const UpdateSchema = z.object({
  nama: z.string().min(3).max(100).optional(),
  kode: z.string().min(2).max(20).toUpperCase().optional(),
  urutan: z.number().int().min(0).optional(),
  aktif: z.boolean().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session.isLoggedIn)
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await request.json()
    const parsed = UpdateSchema.safeParse(body)
    if (!parsed.success)
      return NextResponse.json({ success: false, errors: parsed.error.flatten().fieldErrors }, { status: 422 })

    const data = await prisma.masterFakultas.update({ where: { id }, data: parsed.data })
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[PATCH /api/master/fakultas/[id]]', error)
    return NextResponse.json({ success: false, message: 'Gagal mengupdate data' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session.isLoggedIn)
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    // Cek apakah ada prodi aktif
    const prodiCount = await prisma.masterProdi.count({ where: { fakultasId: id, aktif: true } })
    if (prodiCount > 0)
      return NextResponse.json(
        { success: false, message: `Tidak bisa dihapus, masih ada ${prodiCount} program studi aktif.` },
        { status: 400 }
      )

    // Soft delete (nonaktifkan)
    await prisma.masterFakultas.update({ where: { id }, data: { aktif: false } })
    return NextResponse.json({ success: true, message: 'Fakultas dinonaktifkan' })
  } catch (error) {
    console.error('[DELETE /api/master/fakultas/[id]]', error)
    return NextResponse.json({ success: false, message: 'Gagal menghapus data' }, { status: 500 })
  }
}
