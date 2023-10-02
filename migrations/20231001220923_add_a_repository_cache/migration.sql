/*
  Warnings:

  - A unique constraint covering the columns `[id,repository_id]` on the table `Repository` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Repository_id_key` ON `Repository`;

-- CreateTable
CREATE TABLE `RepositoryCache` (
    `id` VARCHAR(191) NOT NULL,
    `repository_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `owner` VARCHAR(191) NOT NULL,
    `ownerHtmlUrl` VARCHAR(191) NOT NULL,
    `ownerAvatarUrl` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `stars` VARCHAR(191) NOT NULL,
    `openIssues` INTEGER NOT NULL,

    UNIQUE INDEX `RepositoryCache_repository_id_key`(`repository_id`),
    UNIQUE INDEX `RepositoryCache_id_repository_id_key`(`id`, `repository_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Repository_id_repository_id_key` ON `Repository`(`id`, `repository_id`);
