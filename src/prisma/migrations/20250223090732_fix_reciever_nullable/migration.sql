/*
  Warnings:

  - You are about to drop the column `lineId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Promise" DROP CONSTRAINT "Promise_receiverId_fkey";

-- DropIndex
DROP INDEX "User_lineId_key";

-- AlterTable
ALTER TABLE "Promise" ALTER COLUMN "receiverId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "lineId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- AddForeignKey
ALTER TABLE "Promise" ADD CONSTRAINT "Promise_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
