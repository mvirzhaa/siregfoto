import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { z } from 'zod'

const UpdateSchema = z.object({
  nama: z.string().min(3).max(150).optional(),
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

    const data = await prisma.masterProdi.update({ where: { id }, data: parsed.data })
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[PATCH /api/master/prodi/[id]]', error)
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
    // Soft delete
    await prisma.masterProdi.update({ where: { id }, data: { aktif: false } })
    return NextResponse.json({ success: true, message: 'Program studi dinonaktifkan' })
  } catch (error) {
    console.error('[DELETE /api/master/prodi/[id]]', error)
    return NextResponse.json({ success: false, message: 'Gagal menghapus data' }, { status: 500 })
  }
}
