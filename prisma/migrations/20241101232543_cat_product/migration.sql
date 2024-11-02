/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Category_Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Category_Product_title_key" ON "Category_Product"("title");
