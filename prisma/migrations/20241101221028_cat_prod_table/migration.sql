/*
  Warnings:

  - Added the required column `category_product_id` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category_product_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Category_Product" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_Product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_product_id_fkey" FOREIGN KEY ("category_product_id") REFERENCES "Category_Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
