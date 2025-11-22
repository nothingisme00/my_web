-- AlterTable
ALTER TABLE `post` MODIFY `content` TEXT NOT NULL,
    MODIFY `excerpt` TEXT NULL,
    MODIFY `metaDescription` TEXT NULL;

-- AlterTable
ALTER TABLE `project` MODIFY `description` TEXT NOT NULL,
    MODIFY `content` TEXT NULL;

-- CreateIndex
CREATE INDEX `Media_createdAt_idx` ON `Media`(`createdAt`);

-- CreateIndex
CREATE INDEX `Post_published_publishedAt_idx` ON `Post`(`published`, `publishedAt`);

-- CreateIndex
CREATE INDEX `Post_published_views_idx` ON `Post`(`published`, `views`);

-- CreateIndex
CREATE INDEX `Project_views_idx` ON `Project`(`views`);

-- RedefineIndex
CREATE INDEX `Post_categoryId_idx` ON `Post`(`categoryId`);
DROP INDEX `Post_categoryId_fkey` ON `post`;
