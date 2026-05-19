import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { generateLaporanExcel } from '@/lib/excel'
import { format } from 'date-fns'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session.isLoggedIn) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const where: Prisma.RegistrasiWhereInput = {}

    if (status && status !== 'ALL') {
      where.status = status as Prisma.EnumStatusRegistrasiFilter
    }

    if (dateFrom || dateTo) {
      where.tanggalPilihan = {}
      if (dateFrom) where.tanggalPilihan.gte = new Date(dateFrom)
      if (dateTo) {
        const toDate = new Date(dateTo)
        toDate.setHours(23, 59, 59, 999)
        where.tanggalPilihan.lte = toDate
      }
    }

    const data = await prisma.registrasi.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    const buffer = await generateLaporanExcel(data, { status: status ?? undefined, dateFrom: dateFrom ?? undefined, dateTo: dateTo ?? undefined })
    const fileName = `Laporan_SiRegFoto_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': String(buffer.length),
      },
    })
  } catch (error) {
    console.error('[API /admin/export GET]', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengekspor data' },
      { status: 500 }
    )
  }
}
