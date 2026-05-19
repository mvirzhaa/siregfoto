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

export async function sendOtpEmail(toEmail: string, otpCode: string, username: string): Promise<void> {
  const transporter = createTransporter()

  const html = `
<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f0fdf4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;padding:32px 16px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(21,128,61,0.12);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#15803d 0%,#052e16 100%);padding:24px 32px;text-align:center;">
            <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">SiRegFoto BPPSI UIKA</p>
            <p style="margin:4px 0 0;color:#bbf7d0;font-size:12px;">Kode Verifikasi Login Admin</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;color:#374151;font-size:14px;">Halo <strong>${username}</strong>,</p>
            <p style="margin:0 0 24px;color:#6b7280;font-size:13px;">Masukkan kode berikut untuk menyelesaikan login. Kode berlaku selama <strong>5 menit</strong>.</p>
            <!-- OTP Box -->
            <div style="background:#f0fdf4;border:2px solid #86efac;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
              <p style="margin:0 0 4px;color:#15803d;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Kode OTP</p>
              <p style="margin:0;color:#052e16;font-size:36px;font-weight:900;letter-spacing:10px;font-family:monospace;">${otpCode}</p>
            </div>
            <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
              Jika Anda tidak mencoba login, abaikan email ini.<br/>
              Jangan bagikan kode ini kepada siapapun.<br/>
              Email ini dikirim otomatis — mohon tidak membalas.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e5e7eb;padding:16px 32px;text-align:center;">
            <p style="margin:0;color:#9ca3af;font-size:11px;">© ${new Date().getFullYear()} BPPSI — Universitas Ibn Khaldun (UIKA) Bogor</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  await transporter.sendMail({
    from: `"SiRegFoto BPPSI UIKA" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `[${otpCode}] Kode Login Admin SiRegFoto`,
    html,
  })
}
