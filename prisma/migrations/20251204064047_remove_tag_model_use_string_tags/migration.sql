/*
  Warnings:

  - You are about to drop the `_posttags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_posttags` DROP FOREIGN KEY `_PostTags_A_fkey`;

-- DropForeignKey
ALTER TABLE `_posttags` DROP FOREIGN KEY `_PostTags_B_fkey`;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `tags` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_posttags`;

-- DropTable
DROP TABLE `tag`;
