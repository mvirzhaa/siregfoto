import ExcelJS from 'exceljs'
import { formatRupiah, formatTanggal, formatDateTime } from './utils'
import { LABEL_LAYANAN, LABEL_STATUS } from './constants'

interface RegistrasiRow {
  nomorRegistrasi: string
  nama: string
  npm: string
  gmail: string
  fakultas: string
  programStudi: string
  tanggalPilihan: Date | string
  waktuPilihan: string
  jenisLayanan: 'FOTO_CAP' | 'CAP_ONLY' | null
  nominal: number | null
  status: string
  nomorKwitansi: string | null
  kwitansiTerkirim: boolean
  createdAt: Date | string
  disetujuiAt: Date | string | null
}

const UIKA_GREEN = '15803d'
const UIKA_GREEN_LIGHT = 'dcfce7'
const UIKA_YELLOW = 'facc15'

export async function generateLaporanExcel(
  data: RegistrasiRow[],
  filter?: { status?: string; dateFrom?: string; dateTo?: string; fakultas?: string; programStudi?: string }
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'SiRegFoto UIKA'
  workbook.created = new Date()

  const sheet = workbook.addWorksheet('Laporan Registrasi', {
    pageSetup: {
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
    },
  })

  // ── Title Block ──────────────────────────────────────────────────────────
  sheet.mergeCells('A1:N1')
  const titleCell = sheet.getCell('A1')
  titleCell.value = 'LAPORAN REGISTRASI — SIREGFOTO UIKA'
  titleCell.font = { bold: true, size: 14, color: { argb: 'FF' + UIKA_GREEN } }
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
  sheet.getRow(1).height = 28

  sheet.mergeCells('A2:N2')
  const subCell = sheet.getCell('A2')
  subCell.value = `Universitas Ibn Khaldun (UIKA) Bogor  |  Dicetak: ${formatDateTime(new Date())}`
  subCell.font = { size: 10, color: { argb: 'FF6B7280' } }
  subCell.alignment = { horizontal: 'center', vertical: 'middle' }
  sheet.getRow(2).height = 18

  if (filter?.status || filter?.dateFrom || filter?.dateTo) {
    sheet.mergeCells('A3:N3')
    const filterParts: string[] = []
    if (filter.status && filter.status !== 'ALL') filterParts.push(`Status: ${filter.status}`)
    if (filter.fakultas) filterParts.push(`Fakultas: ${filter.fakultas}`)
    if (filter.programStudi) filterParts.push(`Prodi: ${filter.programStudi}`)
    if (filter.dateFrom) filterParts.push(`Dari: ${filter.dateFrom}`)
    if (filter.dateTo) filterParts.push(`Sampai: ${filter.dateTo}`)
    const filterCell = sheet.getCell('A3')
    filterCell.value = `Filter — ${filterParts.join('  |  ')}`
    filterCell.font = { size: 9, italic: true, color: { argb: 'FF6B7280' } }
    filterCell.alignment = { horizontal: 'center' }
    sheet.getRow(3).height = 16
  }

  const headerRow = 4

  // ── Column Definitions ───────────────────────────────────────────────────
  sheet.columns = [
    { key: 'no',               width: 5  },
    { key: 'nomorRegistrasi',  width: 22 },
    { key: 'nama',             width: 28 },
    { key: 'npm',              width: 14 },
    { key: 'gmail',            width: 30 },
    { key: 'fakultas',         width: 14 },
    { key: 'programStudi',     width: 28 },
    { key: 'tanggalPilihan',   width: 18 },
    { key: 'waktuPilihan',     width: 8  },
    { key: 'jenisLayanan',     width: 24 },
    { key: 'nominal',          width: 14 },
    { key: 'status',           width: 16 },
    { key: 'nomorKwitansi',    width: 22 },
    { key: 'createdAt',        width: 20 },
  ]

  const headers = [
    'No', 'No. Registrasi', 'Nama Mahasiswa', 'NPM', 'Gmail',
    'Fakultas', 'Program Studi', 'Tanggal Pilih', 'Jam',
    'Jenis Layanan', 'Nominal', 'Status', 'No. Kwitansi', 'Tgl Daftar',
  ]

  // ── Header Row ───────────────────────────────────────────────────────────
  const hRow = sheet.getRow(headerRow)
  hRow.height = 22
  headers.forEach((h, i) => {
    const cell = hRow.getCell(i + 1)
    cell.value = h
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF' + UIKA_GREEN },
    }
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF' + UIKA_GREEN } },
      bottom: { style: 'thin', color: { argb: 'FF' + UIKA_GREEN } },
      left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      right: { style: 'thin', color: { argb: 'FFFFFFFF' } },
    }
  })

  // ── Data Rows ────────────────────────────────────────────────────────────
  data.forEach((reg, idx) => {
    const row = sheet.addRow({
      no: idx + 1,
      nomorRegistrasi: reg.nomorRegistrasi,
      nama: reg.nama,
      npm: reg.npm,
      gmail: reg.gmail,
      fakultas: reg.fakultas,
      programStudi: reg.programStudi,
      tanggalPilihan: formatTanggal(reg.tanggalPilihan),
      waktuPilihan: reg.waktuPilihan,
      jenisLayanan: reg.jenisLayanan ? LABEL_LAYANAN[reg.jenisLayanan] : '—',
      nominal: reg.nominal ? formatRupiah(reg.nominal) : '—',
      status: LABEL_STATUS[reg.status as keyof typeof LABEL_STATUS] ?? reg.status,
      nomorKwitansi: reg.nomorKwitansi ?? '—',
      createdAt: formatDateTime(reg.createdAt),
    })

    row.height = 18
    const isEven = idx % 2 === 0

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.font = { size: 9 }
      cell.alignment = {
        horizontal: colNumber === 3 || colNumber === 7 ? 'left' : 'center',
        vertical: 'middle',
      }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isEven ? 'FFFFFFFF' : 'FF' + UIKA_GREEN_LIGHT },
      }
      cell.border = {
        bottom: { style: 'hair', color: { argb: 'FFD1FAE5' } },
      }
    })

    // Warna status
    const statusCell = row.getCell(12)
    switch (reg.status) {
      case 'PENDING':
        statusCell.font = { size: 9, bold: true, color: { argb: 'FFD97706' } }
        break
      case 'VALIDATED':
        statusCell.font = { size: 9, bold: true, color: { argb: 'FF1D4ED8' } }
        break
      case 'APPROVED':
        statusCell.font = { size: 9, bold: true, color: { argb: 'FF15803D' } }
        break
      case 'COMPLETED':
        statusCell.font = { size: 9, bold: true, color: { argb: 'FF374151' } }
        break
    }
  })

  // ── Summary Row ──────────────────────────────────────────────────────────
  sheet.addRow([])
  const sumRow = sheet.addRow([
    '', `Total: ${data.length} pendaftar`, '', '', '', '', '', '', '', '',
    formatRupiah(data.reduce((acc, r) => acc + (r.nominal ?? 0), 0)),
    '', '', '',
  ])
  sumRow.height = 20
  sumRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    cell.font = {
      bold: true,
      size: 10,
      color: { argb: colNumber === 11 ? 'FF15803D' : 'FF374151' },
    }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF' + UIKA_YELLOW },
    }
    cell.alignment = { horizontal: 'center', vertical: 'middle' }
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFF59E0B' } },
    }
  })

  // ── Freeze panes ─────────────────────────────────────────────────────────
  sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: headerRow }]

  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer)
}
