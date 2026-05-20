import { z } from 'zod'

export const RegistrasiSchema = z.object({
  nama: z
    .string()
    .min(3, 'Nama minimal 3 karakter')
    .max(100, 'Nama terlalu panjang')
    .regex(/^[a-zA-Z\s.'`-]+$/, 'Nama hanya boleh huruf dan spasi'),

  npm: z
    .string()
    .min(5, 'NPM minimal 5 karakter')
    .max(20, 'NPM terlalu panjang')
    .regex(/^[0-9A-Za-z]+$/, 'Format NPM tidak valid'),

  gmail: z
    .string()
    .email('Format email tidak valid'),

  fakultas: z.string().min(2, 'Pilih fakultas'),

  programStudi: z
    .string()
    .min(3, 'Program studi minimal 3 karakter')
    .max(100, 'Program studi terlalu panjang'),

  tanggalPilihan: z.string().refine((val) => {
    const date = new Date(val)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today
  }, 'Tanggal tidak boleh di masa lalu'),

  waktuPilihan: z.enum(
    ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
    { error: 'Pilih jam yang tersedia' }
  ),
})

export type RegistrasiInput = z.infer<typeof RegistrasiSchema>

export type RegistrasiResponse = {
  id: string
  nomorRegistrasi: string
  nama: string
  npm: string
  gmail: string
  fakultas: string
  programStudi: string
  tanggalPilihan: string
  waktuPilihan: string
  jenisLayanan: string | null
  nominal: number | null
  status: string
  nomorKwitansi: string | null
  createdAt: string
}
