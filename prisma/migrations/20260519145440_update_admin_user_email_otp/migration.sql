/*
  Warnings:

  - You are about to drop the column `totpSecret` on the `AdminUser` table. All the data in the column will be lost.
  - You are about to drop the column `totpVerified` on the `AdminUser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `AdminUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `AdminUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AdminUser" DROP COLUMN "totpSecret",
DROP COLUMN "totpVerified",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "otpCode" TEXT,
ADD COLUMN     "otpExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
