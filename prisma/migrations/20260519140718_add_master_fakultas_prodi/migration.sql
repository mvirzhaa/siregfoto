-- DropEnum
DROP TYPE "Fakultas";

-- CreateTable
CREATE TABLE "MasterFakultas" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterFakultas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterProdi" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "fakultasId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterProdi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MasterFakultas_kode_key" ON "MasterFakultas"("kode");

-- CreateIndex
CREATE INDEX "MasterFakultas_aktif_idx" ON "MasterFakultas"("aktif");

-- CreateIndex
CREATE INDEX "MasterProdi_fakultasId_idx" ON "MasterProdi"("fakultasId");

-- CreateIndex
CREATE INDEX "MasterProdi_aktif_idx" ON "MasterProdi"("aktif");

-- CreateIndex
CREATE UNIQUE INDEX "MasterProdi_kode_fakultasId_key" ON "MasterProdi"("kode", "fakultasId");

-- CreateIndex
CREATE INDEX "Registrasi_fakultas_idx" ON "Registrasi"("fakultas");

-- CreateIndex
CREATE INDEX "Registrasi_programStudi_idx" ON "Registrasi"("programStudi");

-- AddForeignKey
ALTER TABLE "MasterProdi" ADD CONSTRAINT "MasterProdi_fakultasId_fkey" FOREIGN KEY ("fakultasId") REFERENCES "MasterFakultas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
