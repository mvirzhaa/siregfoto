export const HARGA = {
  FOTO_CAP: 15000,
  CAP_ONLY: 10000,
} as const

export const LABEL_LAYANAN = {
  FOTO_CAP: 'Foto Ijazah + Cap 3 Jari',
  CAP_ONLY: 'Cap 3 Jari Saja',
} as const

export const LABEL_STATUS = {
  PENDING:   'Menunggu Validasi',
  VALIDATED: 'Sudah Divalidasi',
  APPROVED:  'Disetujui',
  COMPLETED: 'Selesai',
} as const

export const WARNA_STATUS = {
  PENDING:   'badge-pending',
  VALIDATED: 'badge-validated',
  APPROVED:  'badge-approved',
  COMPLETED: 'badge-completed',
} as const

export const JAM_TERSEDIA = [
  '08:00', '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00',
] as const

export const DAFTAR_FAKULTAS = [
  'FAI — Fakultas Agama Islam',
  'FTS — Fakultas Teknik dan Sains',
  'FEB — Fakultas Ekonomi dan Bisnis',
  'FKIP — Fakultas Keguruan dan Ilmu Pendidikan',
  'FH — Fakultas Hukum',
  'FIKES — Fakultas Ilmu Kesehatan',
  'PASCA — Sekolah Pascasarjana',
] as const

