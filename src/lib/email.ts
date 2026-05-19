import nodemailer from 'nodemailer'
import { generateKwitansiHtml } from './emailTemplates'

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

function createTransporter() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD

  if (!user || !pass) {
    throw new Error('GMAIL_USER atau GMAIL_APP_PASSWORD belum dikonfigurasi di .env.local')
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
}

export async function sendKwitansi(data: RegistrasiForEmail): Promise<void> {
  if (!data.nomorKwitansi || !data.jenisLayanan || !data.nominal || !data.disetujuiAt) {
    throw new Error('Data kwitansi tidak lengkap — pastikan nomorKwitansi, jenisLayanan, nominal, dan disetujuiAt tersedia')
  }

  const transporter = createTransporter()

  const htmlContent = generateKwitansiHtml({
    nomorKwitansi: data.nomorKwitansi,
    nomorRegistrasi: data.nomorRegistrasi,
    nama: data.nama,
    npm: data.npm,
    gmail: data.gmail,
    fakultas: data.fakultas,
    programStudi: data.programStudi,
    jenisLayanan: data.jenisLayanan,
    nominal: data.nominal,
    tanggalPilihan: data.tanggalPilihan,
    waktuPilihan: data.waktuPilihan,
    disetujuiAt: data.disetujuiAt,
  })

  await transporter.sendMail({
    from: `"SiRegFoto UIKA" <${process.env.GMAIL_USER}>`,
    to: data.gmail,
    subject: `Kwitansi Pembayaran ${data.nomorKwitansi} — SiRegFoto UIKA`,
    html: htmlContent,
  })
}
