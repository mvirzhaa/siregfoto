# Docker — SiRegFoto UIKA

## Catatan Penting

> ⚠️ **Port 5432 sudah dipakai PostgreSQL lokal di Windows.**  
> Docker container DB menggunakan **port 5433** agar tidak konflik.  
> `.env.local` sudah dikonfigurasi dengan `localhost:5433`.

---

## Cara Pakai

### Opsi 1 — DB saja di Docker (Direkomendasikan untuk development)

Jalankan hanya container PostgreSQL, lalu app tetap dijalankan normal dengan `npm run dev`.

```bash
# Nyalakan container DB
docker compose up db -d

# Tunggu DB siap, lalu jalankan migrasi
npx prisma migrate dev --name init_registrasi

# Jalankan app
npm run dev
```

`.env.local` sudah dikonfigurasi dengan `localhost:5432` — langsung bisa dipakai.

---

### Opsi 2 — Full stack di Docker (App + DB)

```bash
# Build image app terlebih dahulu
docker compose --profile full build

# Nyalakan semua service (DB + App)
docker compose --profile full up -d

# Cek log
docker compose logs -f
```

App berjalan di `http://localhost:3000`.

> **Catatan:** Saat menggunakan opsi ini, migrasi database dijalankan otomatis saat container app start via `docker-entrypoint.sh`.

---

## Perintah Berguna

```bash
# Hentikan semua container
docker compose down

# Hentikan dan hapus volume (data DB ikut terhapus)
docker compose down -v

# Cek status container
docker compose ps

# Masuk ke container DB
docker exec -it siregfoto_db psql -U postgres -d siregfoto

# Lihat log DB
docker compose logs db -f

# Rebuild image app
docker compose --profile full build --no-cache app
```

---

## Struktur File

| File                   | Fungsi                                                |
| ---------------------- | ----------------------------------------------------- |
| `docker-compose.yml`   | Definisi service DB dan App                           |
| `Dockerfile`           | Multi-stage build untuk Next.js app                   |
| `docker-entrypoint.sh` | Script startup: migrate → run app                     |
| `.dockerignore`        | File yang dikecualikan dari Docker build context      |
| `.env.docker`          | Referensi env untuk full-stack Docker (jangan commit) |
