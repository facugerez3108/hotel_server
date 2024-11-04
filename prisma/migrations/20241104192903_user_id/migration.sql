/*
  Warnings:

  - Added the required column `userId` to the `Caja` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Caja" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Caja" ADD CONSTRAINT "Caja_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
