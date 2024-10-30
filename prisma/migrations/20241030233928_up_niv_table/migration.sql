/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Nivel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Nivel_title_key" ON "Nivel"("title");
