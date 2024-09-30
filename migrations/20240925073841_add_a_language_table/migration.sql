/*
  Warnings:

  - You are about to drop the column `language` on the `RepositoryCache` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `RepositoryCache` DROP COLUMN `language`,
    ADD COLUMN `languageName` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Language` (
    `name` VARCHAR(191) NOT NULL,
    `color` TEXT NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RepositoryCache` ADD CONSTRAINT `RepositoryCache_languageName_fkey` FOREIGN KEY (`languageName`) REFERENCES `Language`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;
