/*
  Warnings:

  - The primary key for the `Robots` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cancelReason` on the `Robots` table. All the data in the column will be lost.
  - You are about to drop the column `canceledAt` on the `Robots` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `Robots` table. All the data in the column will be lost.
  - You are about to drop the column `usersId` on the `Robots` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Robots" DROP CONSTRAINT "Robots_usersId_fkey";

-- AlterTable
ALTER TABLE "Robots" DROP CONSTRAINT "Robots_pkey",
DROP COLUMN "cancelReason",
DROP COLUMN "canceledAt",
DROP COLUMN "startedAt",
DROP COLUMN "usersId",
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Robots_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Robots_id_seq";

-- CreateTable
CREATE TABLE "UserRobots" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "usersId" TEXT NOT NULL,
    "robotsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "cancelReason" TEXT,

    CONSTRAINT "UserRobots_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserRobots" ADD CONSTRAINT "UserRobots_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRobots" ADD CONSTRAINT "UserRobots_robotsId_fkey" FOREIGN KEY ("robotsId") REFERENCES "Robots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
