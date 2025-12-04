/*
  Migration: Add bilingual notes to Watchlist
  - Rename notes to notesId (Indonesian)
  - Add notesEn (English auto-translated)
*/

-- Step 1: Add new columns
ALTER TABLE `watchlist` ADD COLUMN `notesId` TEXT NULL;
ALTER TABLE `watchlist` ADD COLUMN `notesEn` TEXT NULL;

-- Step 2: Copy existing notes to notesId
UPDATE `watchlist` SET `notesId` = `notes` WHERE `notes` IS NOT NULL;

-- Step 3: Drop the old notes column
ALTER TABLE `watchlist` DROP COLUMN `notes`;
