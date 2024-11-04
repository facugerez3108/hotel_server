/*
  Warnings:

  - Added the required column `status` to the `Caja` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Caja" ADD COLUMN     "status" BOOLEAN NOT NULL;
