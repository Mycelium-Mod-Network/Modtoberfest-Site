/*
  Warnings:

  - You are about to drop the column `repositoryId` on the `Tag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Tag` DROP FOREIGN KEY `Tag_repositoryId_fkey`;

-- AlterTable
ALTER TABLE `Tag` DROP COLUMN `repositoryId`;

-- CreateTable
CREATE TABLE `TaggedRepository` (
    `tag_name` VARCHAR(191) NOT NULL,
    `repository_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `TaggedRepository_tag_name_repository_id_key`(`tag_name`, `repository_id`),
    PRIMARY KEY (`tag_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TaggedRepository` ADD CONSTRAINT `TaggedRepository_tag_name_fkey` FOREIGN KEY (`tag_name`) REFERENCES `Tag`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaggedRepository` ADD CONSTRAINT `TaggedRepository_repository_id_fkey` FOREIGN KEY (`repository_id`) REFERENCES `Repository`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
