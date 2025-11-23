-- AlterTable: Change Settings.value from VARCHAR(191) to TEXT
ALTER TABLE `Settings` MODIFY `value` TEXT NOT NULL;

-- AlterTable: Change Post text fields to TEXT for better content storage
ALTER TABLE `Post` MODIFY `content` TEXT NOT NULL;
ALTER TABLE `Post` MODIFY `excerpt` TEXT NULL;
ALTER TABLE `Post` MODIFY `metaDescription` TEXT NULL;

-- AlterTable: Change Project text fields to TEXT
ALTER TABLE `Project` MODIFY `description` TEXT NOT NULL;
ALTER TABLE `Project` MODIFY `content` TEXT NULL;

-- Add missing Post reaction columns if they don't exist
ALTER TABLE `Post` ADD COLUMN IF NOT EXISTS `reactionsLove` INTEGER NOT NULL DEFAULT 0;
ALTER TABLE `Post` ADD COLUMN IF NOT EXISTS `reactionsLike` INTEGER NOT NULL DEFAULT 0;
ALTER TABLE `Post` ADD COLUMN IF NOT EXISTS `reactionsWow` INTEGER NOT NULL DEFAULT 0;
ALTER TABLE `Post` ADD COLUMN IF NOT EXISTS `reactionsFire` INTEGER NOT NULL DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS `Post_categoryId_idx` ON `Post`(`categoryId`);
CREATE INDEX IF NOT EXISTS `Post_published_publishedAt_idx` ON `Post`(`published`, `publishedAt`);
CREATE INDEX IF NOT EXISTS `Post_published_views_idx` ON `Post`(`published`, `views`);
CREATE INDEX IF NOT EXISTS `Project_views_idx` ON `Project`(`views`);
CREATE INDEX IF NOT EXISTS `Media_createdAt_idx` ON `Media`(`createdAt`);
