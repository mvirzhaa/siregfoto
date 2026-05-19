-- CreateEnum
CREATE TYPE "StatusRegistrasi" AS ENUM ('PENDING', 'VALIDATED', 'APPROVED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "JenisLayanan" AS ENUM ('FOTO_CAP', 'CAP_ONLY');

-- CreateEnum
CREATE TYPE "Fakultas" AS ENUM ('FKIP', 'FIKES', 'FATEK', 'FEKON', 'FAPERTA', 'FAI', 'FISIPOL', 'PASCASARJANA');

-- CreateTable
CREATE TABLE "Registrasi" (
    "id" TEXT NOT NULL,
    "nomorRegistrasi" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "npm" TEXT NOT NULL,
    "gmail" TEXT NOT NULL,
    "fakultas" TEXT NOT NULL,
    "programStudi" TEXT NOT NULL,
    "tanggalPilihan" TIMESTAMP(3) NOT NULL,
    "waktuPilihan" TEXT NOT NULL,
    "jenisLayanan" "JenisLayanan",
    "nominal" INTEGER,
    "status" "StatusRegistrasi" NOT NULL DEFAULT 'PENDING',
    "catatanAdmin" TEXT,
    "divalidasiOleh" TEXT,
    "divalidasiAt" TIMESTAMP(3),
    "disetujuiAt" TIMESTAMP(3),
    "kwitansiTerkirim" BOOLEAN NOT NULL DEFAULT false,
    "kwitansiTerkirimAt" TIMESTAMP(3),
    "nomorKwitansi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Registrasi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Registrasi_nomorRegistrasi_key" ON "Registrasi"("nomorRegistrasi");

-- CreateIndex
CREATE INDEX "Registrasi_status_idx" ON "Registrasi"("status");

-- CreateIndex
CREATE INDEX "Registrasi_npm_idx" ON "Registrasi"("npm");

-- CreateIndex
CREATE INDEX "Registrasi_gmail_idx" ON "Registrasi"("gmail");

-- CreateIndex
CREATE INDEX "Registrasi_tanggalPilihan_idx" ON "Registrasi"("tanggalPilihan");

-- CreateIndex
CREATE INDEX "Registrasi_createdAt_idx" ON "Registrasi"("createdAt");
