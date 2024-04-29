/*
  Warnings:

  - Added the required column `dorm` to the `StudentOverlay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dormRoom` to the `StudentOverlay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gradYear` to the `StudentOverlay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `StudentOverlay` ADD COLUMN `dorm` VARCHAR(191) NOT NULL,
    ADD COLUMN `dormRoom` VARCHAR(191) NOT NULL,
    ADD COLUMN `gradYear` VARCHAR(191) NOT NULL;
