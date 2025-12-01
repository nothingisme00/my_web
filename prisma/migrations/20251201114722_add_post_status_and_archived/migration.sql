/*
  Warnings:

  - You are about to drop the `galleryphoto` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `post` ADD COLUMN `archivedAt` DATETIME(3) NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'draft';

-- DropTable
DROP TABLE `galleryphoto`;

-- CreateTable
CREATE TABLE `Watchlist` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'Anime',
    `genre` VARCHAR(191) NULL,
    `totalEpisode` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Completed',
    `rating` DOUBLE NULL,
    `notes` TEXT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `year` INTEGER NULL,
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Watchlist_status_idx`(`status`),
    INDEX `Watchlist_type_idx`(`type`),
    INDEX `Watchlist_rating_idx`(`rating`),
    INDEX `Watchlist_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Post_status_idx` ON `Post`(`status`);

-- CreateIndex
CREATE INDEX `Post_status_publishedAt_idx` ON `Post`(`status`, `publishedAt`);
