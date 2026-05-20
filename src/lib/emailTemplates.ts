import { formatRupiah, formatTanggal } from './utils'
import { LABEL_LAYANAN } from './constants'

interface KwitansiData {
  nomorKwitansi: string
  nomorRegistrasi: string
  nama: string
  npm: string
  gmail: string
  fakultas: string
  programStudi: string
  jenisLayanan: 'FOTO_CAP' | 'CAP_ONLY'
  nominal: number
  tanggalPilihan: Date | string
  waktuPilihan: string
  disetujuiAt: Date | string
}

export function generateKwitansiHtml(data: KwitansiData): string {
  const tanggal = formatTanggal(data.tanggalPilihan)
  const tanggalApprove = formatTanggal(data.disetujuiAt)
  const nominal = formatRupiah(data.nominal)
  const layanan = LABEL_LAYANAN[data.jenisLayanan]

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kwitansi Pembayaran — SiRegFoto UIKA</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f0fdf4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(21,128,61,0.12);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#15803d 0%,#166534 60%,#052e16 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">
                SiRegFoto
              </h1>
              <p style="margin:4px 0 0;color:#bbf7d0;font-size:13px;">
                Sistem Registrasi Foto Ijazah &amp; Sidik Jari
              </p>
              <p style="margin:2px 0 0;color:#86efac;font-size:12px;">
                Universitas Ibn Khaldun (UIKA) Bogor
              </p>
            </td>
          </tr>

          <!-- Kwitansi Badge -->
          <tr>
            <td style="background:#facc15;padding:12px 40px;text-align:center;">
              <span style="font-size:13px;font-weight:700;color:#166534;letter-spacing:1px;text-transform:uppercase;">
                ✅ KWITANSI PEMBAYARAN
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              
              <p style="margin:0 0 20px;color:#374151;font-size:15px;">
                Halo, <strong>${data.nama}</strong>!<br/>
                Pembayaran Anda telah dikonfirmasi. Berikut adalah kwitansi resmi Anda.
              </p>

              <!-- Nomor Kwitansi -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:10px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;text-align:center;">
                    <p style="margin:0;color:#15803d;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;">Nomor Kwitansi</p>
                    <p style="margin:4px 0 0;color:#052e16;font-size:22px;font-weight:700;letter-spacing:2px;">${data.nomorKwitansi}</p>
                    <p style="margin:4px 0 0;color:#6b7280;font-size:11px;">Tanggal: ${tanggalApprove}</p>
                  </td>
                </tr>
              </table>

              <!-- Detail -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
                <tr>
                  <td colspan="3" style="padding:8px 0;border-bottom:2px solid #15803d;">
                    <span style="font-size:13px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:0.5px;">Data Pendaftar</span>
                  </td>
                </tr>
                ${row('Nomor Registrasi', data.nomorRegistrasi)}
                ${row('Nama Lengkap', data.nama)}
                ${row('NPM', data.npm)}
                ${row('Email', data.gmail)}
                ${row('Fakultas', data.fakultas)}
                ${row('Program Studi', data.programStudi)}
                <tr><td colspan="3" style="height:16px;"></td></tr>
                <tr>
                  <td colspan="3" style="padding:8px 0;border-bottom:2px solid #15803d;">
                    <span style="font-size:13px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:0.5px;">Detail Layanan</span>
                  </td>
                </tr>
                ${row('Jadwal', `${tanggal} — ${data.waktuPilihan} WIB`)}
                ${row('Layanan', layanan)}
                <tr>
                  <td style="padding:10px 0 4px;color:#6b7280;font-size:13px;width:40%;">Total Pembayaran</td>
                  <td style="padding:10px 8px 4px;color:#6b7280;font-size:13px;width:4%;">:</td>
                  <td style="padding:10px 0 4px;">
                    <span style="font-size:18px;font-weight:700;color:#15803d;">${nominal}</span>
                  </td>
                </tr>
              </table>

              <!-- Status -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#dcfce7;border:1.5px solid #86efac;border-radius:10px;margin-bottom:24px;">
                <tr>
                  <td style="padding:14px 20px;text-align:center;">
                    <p style="margin:0;color:#15803d;font-size:14px;font-weight:700;">
                      ✔ Pembayaran Lunas — Layanan Selesai
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Catatan -->
              <p style="margin:0;color:#6b7280;font-size:12px;line-height:1.6;">
                <strong>PENTING:</strong> Kami telah melampirkan file <strong>Kwitansi Pembayaran Resmi (PDF)</strong> pada email ini. Silakan unduh dan simpan atau cetak sebagai bukti sah pembayaran Anda.<br/><br/>
                Jika ada pertanyaan, hubungi admin SiRegFoto UIKA.<br/>
                Email ini dikirim otomatis oleh sistem — mohon tidak membalas email ini.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:11px;">
                © ${new Date().getFullYear()} SiRegFoto — Universitas Ibn Khaldun (UIKA) Bogor<br/>
                Sistem ini dikelola oleh Bagian Akademik UIKA.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

function row(label: string, value: string): string {
  return `
  <tr>
    <td style="padding:8px 0;color:#6b7280;font-size:13px;vertical-align:top;width:40%;">${label}</td>
    <td style="padding:8px 8px;color:#6b7280;font-size:13px;vertical-align:top;width:4%;">:</td>
    <td style="padding:8px 0;color:#111827;font-size:13px;font-weight:500;vertical-align:top;">${value}</td>
  </tr>
`
}

export function generateFotoHasilHtml(nama: string): string {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Foto Hasil Ijazah — SiRegFoto UIKA</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f0fdf4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(21,128,61,0.12);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#15803d 0%,#166534 60%,#052e16 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">
                SiRegFoto
              </h1>
              <p style="margin:4px 0 0;color:#bbf7d0;font-size:13px;">
                Sistem Registrasi Foto Ijazah &amp; Sidik Jari
              </p>
              <p style="margin:2px 0 0;color:#86efac;font-size:12px;">
                Universitas Ibn Khaldun (UIKA) Bogor
              </p>
            </td>
          </tr>

          <!-- Badge -->
          <tr>
            <td style="background:#15803d;padding:12px 40px;text-align:center;">
              <span style="font-size:13px;font-weight:700;color:#ffffff;letter-spacing:1px;text-transform:uppercase;">
                📸 FOTO HASIL IJAZAH SELESAI
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              
              <p style="margin:0 0 20px;color:#374151;font-size:15px;">
                Halo, <strong>${nama}</strong>!<br/>
                Foto hasil ijazah Anda telah selesai diproses dan diedit oleh tim BPPSI UIKA Bogor.
              </p>

              <p style="margin:0 0 24px;color:#374151;font-size:14px;line-height:1.6;">
                Kami telah melampirkan file foto hasil tersebut pada email ini. Silakan unduh dan periksa hasilnya.
              </p>

              <!-- Status -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#dcfce7;border:1.5px solid #86efac;border-radius:10px;margin-bottom:24px;">
                <tr>
                  <td style="padding:14px 20px;text-align:center;">
                    <p style="margin:0;color:#15803d;font-size:14px;font-weight:700;">
                      ✔ Foto Hasil Berhasil Dikirim ke Email Anda
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Catatan -->
              <p style="margin:0;color:#6b7280;font-size:12px;line-height:1.6;">
                Jika ada pertanyaan atau keluhan terkait hasil foto, silakan hubungi admin BPPSI UIKA Bogor.<br/><br/>
                Email ini dikirim otomatis oleh sistem — mohon tidak membalas email ini.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:11px;">
                © ${new Date().getFullYear()} SiRegFoto — Universitas Ibn Khaldun (UIKA) Bogor<br/>
                Sistem ini dikelola oleh Bagian Akademik UIKA.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

