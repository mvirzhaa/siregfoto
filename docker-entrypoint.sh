#!/bin/sh
set -e

echo "🚀 Studio BPPSI UIKA — Starting up..."

# Jalankan migrasi database sebelum start app
echo "📦 Menjalankan migrasi database..."
prisma migrate deploy

echo "✅ Migrasi selesai. Menjalankan aplikasi..."
exec node server.js
    