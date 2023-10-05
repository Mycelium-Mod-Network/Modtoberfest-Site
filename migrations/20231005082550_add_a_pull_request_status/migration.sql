/*
  Warnings:

  - You are about to drop the column `invalid` on the `PullRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,pr_id]` on the table `PullRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `PullRequest` DROP COLUMN `invalid`;

-- CreateTable
CREATE TABLE `PullRequestStatus` (
    `id` VARCHAR(191) NOT NULL,
    `pr_id` INTEGER NOT NULL,
    `invalid` BOOLEAN NOT NULL,
    `reason` TEXT NULL,

    UNIQUE INDEX `PullRequestStatus_pr_id_key`(`pr_id`),
    UNIQUE INDEX `PullRequestStatus_id_pr_id_key`(`id`, `pr_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `PullRequest_id_pr_id_key` ON `PullRequest`(`id`, `pr_id`);

-- AddForeignKey
ALTER TABLE `PullRequestStatus` ADD CONSTRAINT `PullRequestStatus_pr_id_fkey` FOREIGN KEY (`pr_id`) REFERENCES `PullRequest`(`pr_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
