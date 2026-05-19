import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])

const SEED_DATA = [
  {
    kode: 'FKIP',
    nama: 'Fakultas Keguruan dan Ilmu Pendidikan',
    urutan: 1,
    prodi: [
      { kode: 'PAUD', nama: 'Pendidikan Anak Usia Dini', urutan: 1 },
      { kode: 'PGSD', nama: 'Pendidikan Guru Sekolah Dasar', urutan: 2 },
      { kode: 'PBSI', nama: 'Pendidikan Bahasa & Sastra Indonesia', urutan: 3 },
      { kode: 'PBI',  nama: 'Pendidikan Bahasa Inggris', urutan: 4 },
      { kode: 'PMAT', nama: 'Pendidikan Matematika', urutan: 5 },
    ],
  },
  {
    kode: 'FIKES',
    nama: 'Fakultas Ilmu Kesehatan',
    urutan: 2,
    prodi: [
      { kode: 'KESMAS',  nama: 'Kesehatan Masyarakat', urutan: 1 },
      { kode: 'FARMASI', nama: 'Farmasi', urutan: 2 },
    ],
  },
  {
    kode: 'FATEK',
    nama: 'Fakultas Teknik',
    urutan: 3,
    prodi: [
      { kode: 'TS',  nama: 'Teknik Sipil', urutan: 1 },
      { kode: 'TI',  nama: 'Teknik Industri', urutan: 2 },
      { kode: 'TIF', nama: 'Teknik Informatika', urutan: 3 },
    ],
  },
  {
    kode: 'FEKON',
    nama: 'Fakultas Ekonomi',
    urutan: 4,
    prodi: [
      { kode: 'MNJ',  nama: 'Manajemen', urutan: 1 },
      { kode: 'AKUN', nama: 'Akuntansi', urutan: 2 },
      { kode: 'ESP',  nama: 'Ekonomi Syariah & Perbankan', urutan: 3 },
    ],
  },
  {
    kode: 'FAPERTA',
    nama: 'Fakultas Pertanian',
    urutan: 5,
    prodi: [
      { kode: 'AGR', nama: 'Agroteknologi', urutan: 1 },
    ],
  },
  {
    kode: 'FAI',
    nama: 'Fakultas Agama Islam',
    urutan: 6,
    prodi: [
      { kode: 'PAI',  nama: 'Pendidikan Agama Islam', urutan: 1 },
      { kode: 'HKI',  nama: 'Hukum Keluarga Islam', urutan: 2 },
      { kode: 'ESY',  nama: 'Ekonomi Syariah', urutan: 3 },
      { kode: 'KPI',  nama: 'Komunikasi dan Penyiaran Islam', urutan: 4 },
    ],
  },
  {
    kode: 'FISIPOL',
    nama: 'Fakultas Ilmu Sosial dan Politik',
    urutan: 7,
    prodi: [
      { kode: 'ADMNEG', nama: 'Administrasi Negara', urutan: 1 },
      { kode: 'ILKOM',  nama: 'Ilmu Komunikasi', urutan: 2 },
    ],
  },
  {
    kode: 'PASCA',
    nama: 'Program Pascasarjana',
    urutan: 8,
    prodi: [
      { kode: 'MPI',  nama: 'Manajemen Pendidikan Islam', urutan: 1 },
      { kode: 'MKEU', nama: 'Manajemen Keuangan dan Perbankan Syariah', urutan: 2 },
    ],
  },
]

async function main() {
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
