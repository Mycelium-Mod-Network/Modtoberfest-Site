-- AlterTable
ALTER TABLE `User` ADD COLUMN `access_token` TEXT NULL,
    ADD COLUMN `admin` BOOLEAN NOT NULL DEFAULT false;
