import PDFDocument from 'pdfkit'
import { formatRupiah, formatTanggal } from './utils'
import { LABEL_LAYANAN } from './constants'

interface RegistrasiForEmail {
  nomorKwitansi: string | null
  nomorRegistrasi: string
  nama: string
  npm: string
  gmail: string
  fakultas: string
  programStudi: string
  jenisLayanan: 'FOTO_CAP' | 'CAP_ONLY' | null
  nominal: number | null
  tanggalPilihan: Date
  waktuPilihan: string
  disetujuiAt: Date | null
}

export function terbilang(nominal: number): string {
  const words = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
  if (nominal < 0) return "";
  if (nominal < 12) {
    return words[nominal];
  } else if (nominal < 20) {
    return terbilang(nominal - 10) + " Belas";
  } else if (nominal < 100) {
    return words[Math.floor(nominal / 10)] + " Puluh " + terbilang(nominal % 10);
  } else if (nominal < 200) {
    return "Seratus " + terbilang(nominal - 100);
  } else if (nominal < 1000) {
    return words[Math.floor(nominal / 100)] + " Ratus " + terbilang(nominal % 100);
  } else if (nominal < 2000) {
    return "Seribu " + terbilang(nominal - 1000);
  } else if (nominal < 1000000) {
    return terbilang(Math.floor(nominal / 1000)) + " Ribu " + terbilang(nominal % 1000);
  }
  return "";
}

export async function generateKwitansiPdf(data: RegistrasiForEmail): Promise<Buffer> {
  const nominal = data.nominal ?? 0
  const nominalString = formatRupiah(nominal)
  const terbilangString = terbilang(nominal) ? `${terbilang(nominal)} Rupiah` : '-'
  const layananString = data.jenisLayanan ? LABEL_LAYANAN[data.jenisLayanan] : '-'
  const tanggalLayanan = formatTanggal(data.tanggalPilihan)
  const tanggalApprove = data.disetujuiAt ? formatTanggal(data.disetujuiAt) : formatTanggal(new Date())

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 })
    const buffers: Buffer[] = []
    
    doc.on('data', buffers.push.bind(buffers))
    doc.on('end', () => resolve(Buffer.concat(buffers)))
    doc.on('error', reject)

    // Double Border page
    doc.rect(15, 15, 595.28 - 30, 841.89 - 30).lineWidth(1.5).strokeColor('#15803d').stroke()
    doc.rect(19, 19, 595.28 - 38, 841.89 - 38).lineWidth(0.5).strokeColor('#15803d').stroke()

    // Kop Surat (Header)
    doc.fillColor('#15803d')
       .font('Helvetica-Bold')
       .fontSize(14)
       .text('UNIVERSITAS ISLAM IBNU KHALDUN (UIKA) BOGOR', { align: 'center' })
       
    doc.fillColor('#111827')
       .fontSize(11)
       .text('BIRO PERENCANAAN, PELAPORAN & SISTEM INFORMASI (BPPSI)', { align: 'center' })
       
    doc.fillColor('#4b5563')
       .font('Helvetica')
       .fontSize(8.5)
       .text('Jl. Sholeh Iskandar Km. 2 Kedung Badak, Tanah Sereal, Kota Bogor 16162', { align: 'center' })
       .text('Telp. (0251) 8335335 | Website: uika-bogor.ac.id | Email: bppsi@uika-bogor.ac.id', { align: 'center' })

    // Divider Line
    doc.moveTo(40, 106).lineTo(555, 106).lineWidth(2).strokeColor('#15803d').stroke()
    doc.moveTo(40, 110).lineTo(555, 110).lineWidth(0.5).strokeColor('#15803d').stroke()

    // Title
    doc.fillColor('#111827')
       .font('Helvetica-Bold')
       .fontSize(13)
       .text('BUKTI PEMBAYARAN RESMI (KWITANSI)', 40, 135, { align: 'center' })
       
    doc.font('Helvetica')
       .fontSize(10)
       .text(`Nomor: ${data.nomorKwitansi || '-'}`, { align: 'center' })

    // Details Grid
    const startY = 180
    const rowHeight = 24
    const labelX = 50
    const colonX = 190
    const valueX = 205
    
    const details = [
      { label: 'Telah Diterima Dari', value: data.nama },
      { label: 'NPM', value: data.npm },
      { label: 'Fakultas / Program Studi', value: `${data.fakultas} / ${data.programStudi}` },
      { label: 'Untuk Pembayaran', value: layananString },
      { label: 'Jadwal Layanan', value: `${tanggalLayanan} - Pukul ${data.waktuPilihan} WIB` },
      { label: 'Terbilang', value: terbilangString }
    ]

    doc.font('Helvetica').fontSize(10).fillColor('#374151')

    details.forEach((row, i) => {
      const currentY = startY + (i * rowHeight)
      
      // Draw Label
      doc.font('Helvetica-Bold').text(row.label, labelX, currentY)
      // Draw Colon
      doc.font('Helvetica').text(':', colonX, currentY)
      // Draw Value
      doc.font('Helvetica').text(row.value, valueX, currentY, { width: 340, align: 'left' })
      
      // Draw horizontal separator lines inside the grid
      doc.moveTo(50, currentY + 18).lineTo(545, currentY + 18).lineWidth(0.5).strokeColor('#e5e7eb').stroke()
    })

    // Total Amount Box
    const boxY = startY + (details.length * rowHeight) + 10
    doc.roundedRect(50, boxY, 495, 48, 6)
       .fillColor('#f0fdf4')
       .fill()
       .roundedRect(50, boxY, 495, 48, 6)
       .lineWidth(1.5)
       .strokeColor('#22c55e')
       .stroke()

    // Text inside box
    doc.fillColor('#15803d')
       .font('Helvetica-Bold')
       .fontSize(13)
       .text('JUMLAH: ', 70, boxY + 18)
       .fontSize(16)
       .text(nominalString, 130, boxY + 15)

    doc.fillColor('#15803d')
       .font('Helvetica-Bold')
       .fontSize(14)
       .text('STATUS: LUNAS', 380, boxY + 17, { align: 'right', width: 145 })

    // Footer section
    const footerY = boxY + 80

    // Signature on the right
    const sigX = 300
    const sigWidth = 245
    doc.fillColor('#111827')
       .font('Helvetica')
       .fontSize(10)
       .text(`Bogor, ${tanggalApprove}`, sigX, footerY, { align: 'center', width: sigWidth })
       .text('Biro Perencanaan, Pelaporan & Sistem Informasi', sigX, footerY + 15, { align: 'center', width: sigWidth })
       .text('Universitas Islam Ibnu Khaldun Bogor', sigX, footerY + 28, { align: 'center', width: sigWidth })

    // Seal/Verified badge representation
    doc.fillColor('#22c55e')
       .font('Helvetica-BoldOblique')
       .fontSize(9)
       .text('[ VERIFIED BY SIREGFOTO ]', sigX, footerY + 60, { align: 'center', width: sigWidth })
       .fillColor('#9ca3af')
       .font('Helvetica-Oblique')
       .fontSize(7.5)
       .text('(Dokumen ini ditandatangani secara digital)', sigX, footerY + 72, { align: 'center', width: sigWidth })

    doc.fillColor('#111827')
       .font('Helvetica-Bold')
       .fontSize(10.5)
       .text('BPPSI UIKA BOGOR', sigX, footerY + 95, { align: 'center', width: sigWidth })

    doc.end()
  })
}
