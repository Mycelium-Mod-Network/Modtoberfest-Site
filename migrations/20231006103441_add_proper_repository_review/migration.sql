/*
  Warnings:

  - You are about to drop the column `valid` on the `Repository` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Repository` DROP COLUMN `valid`;

-- CreateTable
CREATE TABLE `RepositoryStatus` (
    `id` VARCHAR(191) NOT NULL,
    `repository_id` VARCHAR(191) NOT NULL,
    `invalid` BOOLEAN NOT NULL,
    `reason` TEXT NULL,
    `reviewed` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `RepositoryStatus_repository_id_key`(`repository_id`),
    UNIQUE INDEX `RepositoryStatus_id_repository_id_key`(`id`, `repository_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RepositoryStatus` ADD CONSTRAINT `RepositoryStatus_repository_id_fkey` FOREIGN KEY (`repository_id`) REFERENCES `Repository`(`repository_id`) ON DELETE CASCADE ON UPDATE CASCADE;
