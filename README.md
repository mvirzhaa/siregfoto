# SiRegFoto — Registrasi Foto Ijazah & Sidik Jari UIKA

SiRegFoto adalah Sistem Registrasi Foto Ijazah dan Sidik Jari untuk mahasiswa Universitas Ibn Khaldun (UIKA) Bogor. Sistem ini dikelola oleh Biro Perencanaan, Pelaporan & Sistem Informasi (BPPSI) UIKA.

Aplikasi ini dibangun menggunakan [Next.js](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), dan [Prisma ORM](https://www.prisma.io/).

## Fitur Utama

- **Pendaftaran Online**: Mahasiswa dapat mendaftar untuk sesi foto dan rekam sidik jari serta memilih jadwal kedatangan.
- **Manajemen Layanan**: Mendukung pilihan layanan (Foto + Cap 3 Jari atau hanya Cap 3 Jari).
- **Kwitansi Digital**: Menghasilkan kwitansi dalam format PDF yang otomatis dikirim setelah sesi selesai.
- **Notifikasi Email**: Mengirimkan konfirmasi pendaftaran langsung ke email pendaftar.
- **Admin Dashboard**: Disediakan untuk staf BPPSI dalam mengelola data pendaftar, jadwal, dan pelaporan (termasuk export ke Excel).

## Persyaratan Sistem

- Node.js >= 18.x
- PostgreSQL

## Cara Memulai (Development)

1. Clone repositori ini.
2. Salin `.env.example` ke `.env` (atau `.env.local`) dan sesuaikan nilai konfigurasi di dalamnya, terutama `DATABASE_URL`.
3. Instal dependensi:

```bash
npm install
```

4. Sinkronisasikan skema Prisma dengan database:

```bash
npx prisma db push
```

5. (Opsional) Jalankan seed database jika diperlukan:

```bash
npm run db:seed
```

6. Jalankan server pengembangan:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat aplikasi berjalan.

## Script yang Tersedia

Beberapa perintah tambahan yang bisa dijalankan di dalam proyek:

- `npm run admin:create` — Membuat user admin baru (CLI).
- `npm run admin:update` — Memperbarui password/data admin (CLI).
- `npm run build` — Membangun aplikasi untuk production.
- `npm run lint` — Memeriksa gaya penulisan kode (linting).

## Deployment

Aplikasi ini dapat di-deploy ke Vercel atau menggunakan kontainer. Untuk deployment menggunakan Docker, silakan merujuk pada `docker-compose.yml` dan dokumentasi deployment yang terlampir pada `DOCKER.md` atau `DEPLOY.md`.
