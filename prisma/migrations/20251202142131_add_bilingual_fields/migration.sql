-- AlterTable
ALTER TABLE `post` ADD COLUMN `contentEn` TEXT NULL,
    ADD COLUMN `excerptEn` TEXT NULL,
    ADD COLUMN `metaDescriptionEn` TEXT NULL,
    ADD COLUMN `titleEn` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `project` ADD COLUMN `descriptionEn` TEXT NULL;

-- CreateTable
CREATE TABLE `LoginActivity` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `ipAddress` VARCHAR(191) NOT NULL,
    `userAgent` TEXT NULL,
    `success` BOOLEAN NOT NULL DEFAULT false,
    `reason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `LoginActivity_email_idx`(`email`),
    INDEX `LoginActivity_ipAddress_idx`(`ipAddress`),
    INDEX `LoginActivity_createdAt_idx`(`createdAt`),
    INDEX `LoginActivity_success_idx`(`success`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
