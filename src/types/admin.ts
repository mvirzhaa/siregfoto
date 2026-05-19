export type AdminStats = {
  PENDING?: number
  VALIDATED?: number
  APPROVED?: number
  COMPLETED?: number
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type AdminListResponse = {
  success: boolean
  data: RegistrasiData[]
  pagination: PaginationMeta
  stats: AdminStats
}

export type RegistrasiData = {
  id: string
  nomorRegistrasi: string
  nama: string
  npm: string
  gmail: string
  fakultas: string
  programStudi: string
  tanggalPilihan: string
  waktuPilihan: string
  jenisLayanan: 'FOTO_CAP' | 'CAP_ONLY' | null
  nominal: number | null
  status: 'PENDING' | 'VALIDATED' | 'APPROVED' | 'COMPLETED'
  catatanAdmin: string | null
  divalidasiOleh: string | null
  divalidasiAt: string | null
  disetujuiAt: string | null
  kwitansiTerkirim: boolean
  kwitansiTerkirimAt: string | null
  nomorKwitansi: string | null
  createdAt: string
  updatedAt: string
}

// ── Master Data ──────────────────────────────────────────────────────────────

export type MasterFakultas = {
  id: string
  nama: string
  kode: string
  urutan: number
  aktif: boolean
  createdAt: string
  updatedAt: string
}

export type MasterProdi = {
  id: string
  nama: string
  kode: string
  urutan: number
  aktif: boolean
  fakultasId: string
  fakultas?: Pick<MasterFakultas, 'id' | 'nama' | 'kode'>
  createdAt: string
  updatedAt: string
}
