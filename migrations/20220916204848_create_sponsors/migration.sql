-- CreateTable
CREATE TABLE `Sponsor` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,
    `summary` TEXT NOT NULL,
    `website_url` VARCHAR(191) NULL,
    `github_user` VARCHAR(191) NULL,
    `twitter_handle` VARCHAR(191) NULL,
    `subreddit` VARCHAR(191) NULL,
    `discord` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
