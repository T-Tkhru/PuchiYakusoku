/*
  Warnings:

  - You are about to drop the column `acceptedAt` on the `Promise` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Promise" DROP COLUMN "acceptedAt",
ADD COLUMN     "isAccepted" BOOLEAN;
