/*
  Warnings:

  - You are about to drop the column `habitacionId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `habitacionId` on the `Nivel` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Habitacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nivelId` to the `Habitacion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_habitacionId_fkey";

-- DropForeignKey
ALTER TABLE "Nivel" DROP CONSTRAINT "Nivel_habitacionId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "habitacionId";

-- AlterTable
ALTER TABLE "Habitacion" ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "nivelId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Nivel" DROP COLUMN "habitacionId";

-- AddForeignKey
ALTER TABLE "Habitacion" ADD CONSTRAINT "Habitacion_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Habitacion" ADD CONSTRAINT "Habitacion_nivelId_fkey" FOREIGN KEY ("nivelId") REFERENCES "Nivel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
