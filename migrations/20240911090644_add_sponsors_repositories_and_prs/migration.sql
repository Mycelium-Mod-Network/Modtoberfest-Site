/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `Sponsor` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `summary` TEXT NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Sponsor_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SponsorLinks` (
    `id` VARCHAR(191) NOT NULL,
    `sponsor_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SponsorLinks_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Repository` (
    `id` VARCHAR(191) NOT NULL,
    `repository_id` VARCHAR(191) NOT NULL,
    `submitter` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Repository_repository_id_key`(`repository_id`),
    UNIQUE INDEX `Repository_id_repository_id_key`(`id`, `repository_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SponsoredRepository` (
    `id` VARCHAR(191) NOT NULL,
    `repository_id` VARCHAR(191) NOT NULL,
    `sponsor_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SponsoredRepository_repository_id_key`(`repository_id`),
    UNIQUE INDEX `SponsoredRepository_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RepositoryStatus` (
    `id` VARCHAR(191) NOT NULL,
    `repository_id` VARCHAR(191) NOT NULL,
    `invalid` BOOLEAN NOT NULL,
    `reason` TEXT NULL,
    `reviewed` BOOLEAN NOT NULL DEFAULT false,
    `reviewed_by` VARCHAR(191) NULL,

    UNIQUE INDEX `RepositoryStatus_repository_id_key`(`repository_id`),
    UNIQUE INDEX `RepositoryStatus_id_repository_id_key`(`id`, `repository_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RepositoryCache` (
    `id` VARCHAR(191) NOT NULL,
    `repository_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `owner` VARCHAR(191) NOT NULL,
    `ownerHtmlUrl` VARCHAR(191) NOT NULL,
    `ownerAvatarUrl` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `stars` INTEGER NOT NULL,
    `openIssues` INTEGER NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `RepositoryCache_repository_id_key`(`repository_id`),
    UNIQUE INDEX `RepositoryCache_id_repository_id_key`(`id`, `repository_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PullRequest` (
    `id` VARCHAR(191) NOT NULL,
    `pr_id` INTEGER NOT NULL,
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
    `repository_id` VARCHAR(191) NOT NULL,
    `merged` BOOLEAN NOT NULL,

    UNIQUE INDEX `PullRequest_pr_id_key`(`pr_id`),
    UNIQUE INDEX `PullRequest_id_pr_id_key`(`id`, `pr_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PullRequestStatus` (
    `id` VARCHAR(191) NOT NULL,
    `pr_id` INTEGER NOT NULL,
    `invalid` BOOLEAN NOT NULL,
    `reason` TEXT NULL,
    `reviewed` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `PullRequestStatus_pr_id_key`(`pr_id`),
    UNIQUE INDEX `PullRequestStatus_id_pr_id_key`(`id`, `pr_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Session_id_key` ON `Session`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `User_id_key` ON `User`(`id`);

-- AddForeignKey
ALTER TABLE `SponsorLinks` ADD CONSTRAINT `SponsorLinks_sponsor_id_fkey` FOREIGN KEY (`sponsor_id`) REFERENCES `Sponsor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Repository` ADD CONSTRAINT `Repository_submitter_fkey` FOREIGN KEY (`submitter`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SponsoredRepository` ADD CONSTRAINT `SponsoredRepository_repository_id_fkey` FOREIGN KEY (`repository_id`) REFERENCES `Repository`(`repository_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SponsoredRepository` ADD CONSTRAINT `SponsoredRepository_sponsor_id_fkey` FOREIGN KEY (`sponsor_id`) REFERENCES `Sponsor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepositoryStatus` ADD CONSTRAINT `RepositoryStatus_repository_id_fkey` FOREIGN KEY (`repository_id`) REFERENCES `Repository`(`repository_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepositoryStatus` ADD CONSTRAINT `RepositoryStatus_reviewed_by_fkey` FOREIGN KEY (`reviewed_by`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepositoryCache` ADD CONSTRAINT `RepositoryCache_repository_id_fkey` FOREIGN KEY (`repository_id`) REFERENCES `Repository`(`repository_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PullRequest` ADD CONSTRAINT `PullRequest_repository_id_fkey` FOREIGN KEY (`repository_id`) REFERENCES `Repository`(`repository_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PullRequestStatus` ADD CONSTRAINT `PullRequestStatus_pr_id_fkey` FOREIGN KEY (`pr_id`) REFERENCES `PullRequest`(`pr_id`) ON DELETE CASCADE ON UPDATE CASCADE;
