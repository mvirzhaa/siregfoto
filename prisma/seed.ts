import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])

const SEED_DATA = [
  {
    kode: 'FAI',
    nama: 'Fakultas Agama Islam',
    urutan: 1,
    prodi: [
      { kode: 'PAI', nama: 'Pendidikan Agama Islam', urutan: 1 },
      { kode: 'HKI', nama: 'Hukum Keluarga Islam (Ahwal Syakhshiyyah)', urutan: 2 },
      { kode: 'KPI', nama: 'Komunikasi dan Penyiaran Islam', urutan: 3 },
      { kode: 'ESY', nama: 'Ekonomi Syariah', urutan: 4 },
      { kode: 'PGMI', nama: 'Pendidikan Guru Madrasah Ibtidaiyah', urutan: 5 },
      { kode: 'BKPI', nama: 'Bimbingan dan Konseling Pendidikan Islam', urutan: 6 },
      { kode: 'MHU', nama: 'Manajemen Haji dan Umroh', urutan: 7 },
      { kode: 'IAT', nama: 'Ilmu Al-Qur\'an dan Tafsir', urutan: 8 },
    ],
  },
  {
    kode: 'FTS',
    nama: 'Fakultas Teknik dan Sains',
    urutan: 2,
    prodi: [
      { kode: 'TS', nama: 'Teknik Sipil', urutan: 1 },
      { kode: 'TM', nama: 'Teknik Mesin', urutan: 2 },
      { kode: 'TE', nama: 'Teknik Elektro', urutan: 3 },
      { kode: 'TIF', nama: 'Teknik Informatika', urutan: 4 },
      { kode: 'SI', nama: 'Sistem Informasi', urutan: 5 },
      { kode: 'RPB', nama: 'Rekayasa Pertanian dan Biosistem', urutan: 6 },
      { kode: 'IL', nama: 'Ilmu Lingkungan', urutan: 7 },
    ],
  },
  {
    kode: 'FEB',
    nama: 'Fakultas Ekonomi dan Bisnis',
    urutan: 3,
    prodi: [
      { kode: 'MNJ', nama: 'Manajemen', urutan: 1 },
      { kode: 'AKUN', nama: 'Akuntansi', urutan: 2 },
      { kode: 'KP', nama: 'Keuangan dan Perbankan', urutan: 3 },
    ],
  },
  {
    kode: 'FKIP',
    nama: 'Fakultas Keguruan dan Ilmu Pendidikan',
    urutan: 4,
    prodi: [
      { kode: 'PBI', nama: 'Pendidikan Bahasa Inggris', urutan: 1 },
      { kode: 'PLS', nama: 'Pendidikan Luar Sekolah (Pendidikan Masyarakat)', urutan: 2 },
      { kode: 'TP', nama: 'Teknologi Pendidikan', urutan: 3 },
      { kode: 'PVDF', nama: 'Pendidikan Vokasional Desain Fashion', urutan: 4 },
    ],
  },
  {
    kode: 'FH',
    nama: 'Fakultas Hukum',
    urutan: 5,
    prodi: [
      { kode: 'IH', nama: 'Ilmu Hukum', urutan: 1 },
    ],
  },
  {
    kode: 'FIKES',
    nama: 'Fakultas Ilmu Kesehatan',
    urutan: 6,
    prodi: [
      { kode: 'KM', nama: 'Kesehatan Masyarakat', urutan: 1 },
      { kode: 'GIZI', nama: 'Gizi', urutan: 2 },
    ],
  },
  {
    kode: 'PASCA',
    nama: 'Sekolah Pascasarjana',
    urutan: 7,
    prodi: [
      { kode: 'MM', nama: 'Magister Manajemen', urutan: 1 },
      { kode: 'MTP', nama: 'Magister Teknologi Pendidikan', urutan: 2 },
      { kode: 'MPAI', nama: 'Magister Pendidikan Agama Islam', urutan: 3 },
      { kode: 'MES', nama: 'Magister Ekonomi Syariah', urutan: 4 },
      { kode: 'MKPI', nama: 'Magister Komunikasi dan Penyiaran Islam', urutan: 5 },
      { kode: 'DPI', nama: 'Doktor Pendidikan Islam', urutan: 6 },
      { kode: 'DES', nama: 'Doktor Ekonomi Syariah', urutan: 7 },
    ],
  },
]

async function main() {
  console.log('🧹 Cleaning existing master data...')
  await prisma.masterProdi.deleteMany({})
  await prisma.masterFakultas.deleteMany({})

  console.log('🌱 Seeding master data fakultas & prodi...')

  for (const fak of SEED_DATA) {
    const fakultas = await prisma.masterFakultas.upsert({
      where: { kode: fak.kode },
      update: { nama: fak.nama, urutan: fak.urutan },
      create: { kode: fak.kode, nama: fak.nama, urutan: fak.urutan },
    })

    for (const prodi of fak.prodi) {
      await prisma.masterProdi.upsert({
        where: { kode_fakultasId: { kode: prodi.kode, fakultasId: fakultas.id } },
        update: { nama: prodi.nama, urutan: prodi.urutan },
        create: {
          kode: prodi.kode,
          nama: prodi.nama,
          urutan: prodi.urutan,
          fakultasId: fakultas.id,
        },
      })
    }

    console.log(`  ✓ ${fak.kode} — ${fak.prodi.length} prodi`)
  }

  console.log('✅ Seeding selesai.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
