/*
  Warnings:

  - Added the required column `description` to the `Robots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Robots" ADD COLUMN     "description" TEXT NOT NULL;
