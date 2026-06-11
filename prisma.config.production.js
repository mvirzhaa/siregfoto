// Konfigurasi Prisma untuk production (plain CommonJS, tanpa TypeScript imports)
// File ini digunakan di dalam Docker container saat prisma migrate deploy dijalankan.
// DATABASE_URL sudah di-inject oleh docker-compose.yml sebagai environment variable.
module.exports = {
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
}
