-- CreateTable
CREATE TABLE `StudentOverlay` (
    `uid` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `pronouns` VARCHAR(191) NOT NULL,
    `photoPath` VARCHAR(191) NOT NULL,
    `showProfile` BOOLEAN NOT NULL DEFAULT true,
    `showDorm` BOOLEAN NOT NULL DEFAULT true,
    `showPhoto` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `StudentOverlay_uid_key`(`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
