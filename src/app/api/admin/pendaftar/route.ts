import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session.isLoggedIn)
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const status       = searchParams.get('status')
    const search       = searchParams.get('search')
    const fakultas     = searchParams.get('fakultas')
    const programStudi = searchParams.get('programStudi')
    const page         = parseInt(searchParams.get('page') ?? '1')
    const limit        = parseInt(searchParams.get('limit') ?? '20')
    const skip         = (page - 1) * limit

    const where: Prisma.RegistrasiWhereInput = {}

    if (status && status !== 'ALL')
      where.status = status as Prisma.EnumStatusRegistrasiFilter

    if (search)
      where.OR = [
        { nama:  { contains: search, mode: 'insensitive' } },
        { npm:   { contains: search, mode: 'insensitive' } },
        { gmail: { contains: search, mode: 'insensitive' } },
      ]

    if (fakultas)
      where.fakultas = { contains: fakultas, mode: 'insensitive' }

    if (programStudi)
      where.programStudi = { contains: programStudi, mode: 'insensitive' }

    const [data, total, statsRaw] = await Promise.all([
      prisma.registrasi.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.registrasi.count({ where }),
      prisma.registrasi.groupBy({ by: ['status'], _count: true }),
    ])

    const stats = Object.fromEntries(statsRaw.map((s) => [s.status, s._count]))

    return NextResponse.json({
      success: true,
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      stats,
    })
  } catch (error) {
    console.error('[GET /api/admin/pendaftar]', error)
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
