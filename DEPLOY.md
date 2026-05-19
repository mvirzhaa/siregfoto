# Panduan Deploy SiRegFoto BPPSI UIKA ke Server

## Persyaratan Server

| Kebutuhan | Spesifikasi Minimal                     |
| --------- | --------------------------------------- |
| OS        | Ubuntu 22.04 LTS                        |
| CPU       | 1 vCPU                                  |
| RAM       | 1 GB (2 GB recommended)                 |
| Storage   | 10 GB                                   |
| Domain    | Sudah diarahkan ke IP server (A record) |

---

## TAHAP 1 — Persiapan di Laptop (Sebelum ke Server)

### 1.1 Push kode ke GitHub

Pastikan semua file sudah di-commit. Buka terminal di folder `siregfoto`:

```bash
git init
git add .
git commit -m "initial commit"
```

Buat repository baru di [github.com](https://github.com), lalu:

```bash
git remote add origin https://github.com/username/siregfoto.git
git push -u origin main
```

> **Pastikan file `.env.local` dan `.env` tidak ikut ter-commit.**
> Cek `.gitignore` sudah mengecualikan `.env*`.

---

## TAHAP 2 — Setup Server

SSH ke server:

```bash
ssh user@ip-server-anda
```

### 2.1 Install Docker

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# Verifikasi
docker --version
docker compose version
```

### 2.2 Install Nginx

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 2.3 Install Certbot (SSL gratis)

```bash
sudo apt install certbot python3-certbot-nginx -y
```

---

## TAHAP 3 — Upload & Konfigurasi Project

### 3.1 Clone project

```bash
cd /opt
sudo git clone https://github.com/username/siregfoto.git
sudo chown -R $USER:$USER siregfoto
cd siregfoto
```

### 3.2 Buat file `.env`

File ini **wajib dibuat manual** di server — tidak ada di Git:

```bash
cp .env.example .env
nano .env
```

Isi dengan nilai production:

```env
# Database — sesuaikan password
DATABASE_URL="postgresql://postgres:GANTI_PASSWORD_DB@db:5432/siregfoto"

ADMIN_PIN="tidak-dipakai"
ADMIN_SESSION_SECRET="isi-dengan-string-acak-panjang-minimal-32-karakter"

# Gmail untuk kirim kwitansi & OTP admin
GMAIL_USER="bppsi-uika@gmail.com"
GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"

NEXT_PUBLIC_APP_URL="https://siregfoto.uika.ac.id"
NEXT_PUBLIC_APP_NAME="SiRegFoto UIKA"
NODE_ENV="production"
```

Simpan: `Ctrl+X` → `Y` → `Enter`

> ⚠️ Ganti `GANTI_PASSWORD_DB` dengan password yang kuat.
> ⚠️ `DATABASE_URL` menggunakan `@db:5432` (hostname Docker internal), **bukan** `localhost`.

### 3.3 Sesuaikan password DB di `docker-compose.yml`

Buka file:

```bash
nano docker-compose.yml
```

Ubah baris ini di bagian service `db`:

```yaml
POSTGRES_PASSWORD: postgres
```

Ganti `postgres` dengan password yang sama seperti di `DATABASE_URL` tadi. Simpan.

Juga update bagian `app` environment:

```yaml
DATABASE_URL: postgresql://postgres:GANTI_PASSWORD_DB@db:5432/siregfoto
```

---

## TAHAP 4 — Build & Jalankan Aplikasi

### 4.1 Build image (pertama kali, ~5–10 menit)

```bash
docker compose --profile full build
```

### 4.2 Jalankan semua service

```bash
docker compose --profile full up -d
```

### 4.3 Cek status

```bash
docker compose ps
```

Harus tampil dua container dengan status `Up` dan `healthy`:

```
NAME             STATUS
siregfoto_db     Up (healthy)
siregfoto_app    Up
```

### 4.4 Verifikasi aplikasi berjalan

```bash
curl http://localhost:3000/api/health
```

Harus return: `{"status":"ok","database":"connected",...}`

---

## TAHAP 5 — Setup Data Awal

### 5.1 Seed master data (fakultas & prodi)

```bash
docker exec -it siregfoto_app npm run db:seed
```

### 5.2 Buat akun admin pertama

```bash
docker exec -it siregfoto_app npx tsx scripts/create-admin.ts
```

Isi saat diminta:

- **Username**: nama login admin (contoh: `bppsi`)
- **Email admin**: email yang akan menerima kode OTP saat login
- **Password**: minimal 8 karakter, kombinasi huruf & angka

---

## TAHAP 6 — Konfigurasi Nginx & SSL

### 6.1 Buat konfigurasi Nginx

```bash
sudo nano /etc/nginx/sites-available/siregfoto
```

Paste konfigurasi ini (ganti domain sesuai milik Anda):

```nginx
server {
    listen 80;
    server_name siregfoto.uika.ac.id;

    location / {
        proxy_pass          http://localhost:3000;
        proxy_http_version  1.1;
        proxy_set_header    Upgrade $http_upgrade;
        proxy_set_header    Connection 'upgrade';
        proxy_set_header    Host $host;
        proxy_set_header    X-Real-IP $remote_addr;
        proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header    X-Forwarded-Proto $scheme;
        proxy_cache_bypass  $http_upgrade;
        proxy_read_timeout  60s;
    }
}
```

### 6.2 Aktifkan & reload Nginx

```bash
sudo ln -s /etc/nginx/sites-available/siregfoto /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Cek di browser: `http://siregfoto.uika.ac.id` — harus muncul landing page.

### 6.3 Pasang SSL (HTTPS)

```bash
sudo certbot --nginx -d siregfoto.uika.ac.id
```

Ikuti instruksi, pilih opsi redirect HTTP → HTTPS.
Setelah selesai, cek: `https://siregfoto.uika.ac.id`

> Certbot auto-renew SSL setiap 90 hari secara otomatis.

---

## TAHAP 7 — Firewall

```bash
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
sudo ufw status
```

> Port 5433 (database) sengaja tidak dibuka — DB hanya bisa diakses dari dalam jaringan Docker.

---

## Update Aplikasi (saat ada perubahan kode)

```bash
cd /opt/siregfoto

# Pull kode terbaru
git pull origin main

# Rebuild image app
docker compose --profile full build app

# Restart app (DB tidak perlu restart)
docker compose --profile full up -d app

# Pantau log
docker compose logs app -f --tail=50
```

---

## Perintah Berguna

```bash
# Lihat status container
docker compose ps

# Log real-time semua service
docker compose logs -f

# Log app saja
docker compose logs app -f

# Restart app
docker compose restart app

# Masuk ke shell container app
docker exec -it siregfoto_app sh

# Masuk ke database PostgreSQL
docker exec -it siregfoto_db psql -U postgres -d siregfoto

# Backup database
docker exec siregfoto_db pg_dump -U postgres siregfoto > backup_$(date +%Y%m%d_%H%M).sql

# Restore dari backup
docker exec -i siregfoto_db psql -U postgres siregfoto < backup_20250101_1200.sql

# Update email/password admin
docker exec -it siregfoto_app npm run admin:update

# Tambah akun admin baru
docker exec -it siregfoto_app npx tsx scripts/create-admin.ts
```

---

## Troubleshooting

| Masalah                      | Periksa                                                                                 |
| ---------------------------- | --------------------------------------------------------------------------------------- |
| App tidak muncul di browser  | `docker compose logs app` — cari baris ERROR                                            |
| Database tidak terkoneksi    | `docker compose ps` — pastikan `db` statusnya `healthy`                                 |
| OTP email tidak masuk        | Cek `GMAIL_USER` dan `GMAIL_APP_PASSWORD` di `.env`. Pastikan Gmail App Password aktif. |
| Migrasi gagal saat startup   | `docker exec -it siregfoto_app npx prisma migrate deploy`                               |
| SSL error / expired          | `sudo certbot renew --dry-run` lalu `sudo certbot renew`                                |
| Port 3000 tidak bisa diakses | Pastikan Nginx sudah reload dan konfigurasi proxy_pass benar                            |

---

## Checklist Deploy

- [ ] Kode sudah di-push ke GitHub
- [ ] Docker terinstall di server
- [ ] File `.env` sudah dibuat dan diisi lengkap di server
- [ ] Password DB sudah diganti di `.env` dan `docker-compose.yml`
- [ ] `docker compose --profile full up -d` berjalan
- [ ] `curl http://localhost:3000/api/health` return `"status":"ok"`
- [ ] Master data ter-seed (`npm run db:seed`)
- [ ] Akun admin sudah dibuat (`admin:create`)
- [ ] Nginx konfigurasi sudah aktif
- [ ] SSL sudah terpasang (HTTPS aktif)
- [ ] Firewall sudah dikonfigurasi
- [ ] Login admin berhasil dan OTP email masuk
