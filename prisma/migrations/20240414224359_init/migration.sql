/*
  Warnings:

  - Added the required column `photoPath` to the `StudentOverlay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `StudentOverlay` ADD COLUMN `photoPath` VARCHAR(191) NOT NULL;
