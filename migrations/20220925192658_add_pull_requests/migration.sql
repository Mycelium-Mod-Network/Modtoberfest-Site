/*
  Warnings:

  - A unique constraint covering the columns `[githubId]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,githubId]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Participant_id_key` ON `Participant`;

-- CreateTable
CREATE TABLE `PullRequest` (
    `id` VARCHAR(191) NOT NULL,
    `html_url` VARCHAR(191) NOT NULL,
    `number` INTEGER NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `title` TEXT NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `author_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `owner` VARCHAR(191) NOT NULL,
    `owner_id` VARCHAR(191) NOT NULL,
    `owner_avatar_url` TEXT NOT NULL,
    `repo_id` VARCHAR(191) NOT NULL,
    `repo_name` VARCHAR(191) NOT NULL,
    `merged` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Participant_githubId_key` ON `Participant`(`githubId`);

-- CreateIndex
CREATE UNIQUE INDEX `Participant_id_githubId_key` ON `Participant`(`id`, `githubId`);

-- AddForeignKey
ALTER TABLE `PullRequest` ADD CONSTRAINT `PullRequest_repo_id_fkey` FOREIGN KEY (`repo_id`) REFERENCES `Repository`(`repository_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PullRequest` ADD CONSTRAINT `PullRequest_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `Participant`(`githubId`) ON DELETE CASCADE ON UPDATE CASCADE;
