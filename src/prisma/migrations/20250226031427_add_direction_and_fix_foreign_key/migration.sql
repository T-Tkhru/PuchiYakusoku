/*
  Warnings:

  - You are about to drop the column `receiverId` on the `Promise` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Promise` table. All the data in the column will be lost.
  - Added the required column `direction` to the `Promise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderUserId` to the `Promise` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Promise" DROP CONSTRAINT "Promise_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Promise" DROP CONSTRAINT "Promise_senderId_fkey";

-- AlterTable
ALTER TABLE "Promise" DROP COLUMN "receiverId",
DROP COLUMN "senderId",
ADD COLUMN     "direction" BOOLEAN NOT NULL,
ADD COLUMN     "receiverUserId" TEXT,
ADD COLUMN     "senderUserId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Promise" ADD CONSTRAINT "Promise_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promise" ADD CONSTRAINT "Promise_receiverUserId_fkey" FOREIGN KEY ("receiverUserId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
