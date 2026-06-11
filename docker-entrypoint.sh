#!/bin/sh
set -e

echo "🚀 Studio BPPSI UIKA — Starting up..."

# Jalankan migrasi database sebelum start app
echo "📦 Menjalankan migrasi database..."
node node_modules/prisma/build/index.js migrate deploy

echo "✅ Migrasi selesai. Menjalankan aplikasi..."
exec node server.js
    