# Studio BPPSI — Registrasi Foto Ijazah & Sidik Jari UIKA

Studio BPPSI adalah sistem registrasi foto ijazah dan sidik jari untuk mahasiswa Universitas Ibn Khaldun (UIKA) Bogor. Sistem ini dikelola oleh Biro Perencanaan, Pelaporan & Sistem Informasi (BPPSI) UIKA.

Dibangun menggunakan [Next.js](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), dan [Prisma ORM](https://www.prisma.io/).

## Fitur Utama

- **Pendaftaran Online** — Mahasiswa mendaftar dan memilih jadwal kedatangan.
- **Manajemen Layanan** — Pilihan Foto + Cap 3 Jari atau hanya Cap 3 Jari.
- **Kwitansi Digital** — PDF kwitansi dikirim otomatis ke email setelah sesi selesai.
- **Admin Dashboard** — Kelola data pendaftar, jadwal, dan laporan (export Excel).
- **2-Step Login Admin** — Username + password + OTP via email.

## Persyaratan

- Node.js >= 18.x
- PostgreSQL (atau jalankan via Docker)

## Development Lokal

```bash
# 1. Nyalakan database
docker compose up db -d

# 2. Install dependencies
npm install

# 3. Migrasi database
npx prisma migrate dev

# 4. Seed master data
npm run db:seed

# 5. Buat akun admin
npm run admin:create

# 6. Jalankan dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Script

| Perintah               | Fungsi                      |
| ---------------------- | --------------------------- |
| `npm run dev`          | Dev server                  |
| `npm run build`        | Build production            |
| `npm run db:seed`      | Seed master data            |
| `npm run admin:create` | Buat akun admin             |
| `npm run admin:update` | Update email/password admin |

## Deploy

Lihat panduan lengkap di [`DEPLOY.md`](./DEPLOY.md).
