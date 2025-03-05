/*
  Warnings:

  - You are about to drop the column `isBoth` on the `Promise` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Promise" DROP COLUMN "isBoth",
ADD COLUMN     "isShare" BOOLEAN NOT NULL DEFAULT false;
