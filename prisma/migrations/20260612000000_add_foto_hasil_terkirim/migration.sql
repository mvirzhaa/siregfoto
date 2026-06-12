-- AlterTable: Tambahkan kolom fotoHasilTerkirim dan fotoHasilTerkirimAt ke tabel Registrasi
ALTER TABLE "Registrasi" ADD COLUMN "fotoHasilTerkirim" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Registrasi" ADD COLUMN "fotoHasilTerkirimAt" TIMESTAMP(3);
