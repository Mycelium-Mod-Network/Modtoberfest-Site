-- CreateTable
CREATE TABLE `Reward` (
    `id` VARCHAR(191) NOT NULL,
    `title` TEXT NOT NULL,
    `summary` LONGTEXT NOT NULL,
    `description` LONGTEXT NOT NULL,
    `logo_url` TEXT NOT NULL,
    `banner_url` TEXT NOT NULL,
    `digital` BOOLEAN NOT NULL,
    `sponsor_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reward` ADD CONSTRAINT `Reward_sponsor_id_fkey` FOREIGN KEY (`sponsor_id`) REFERENCES `Sponsor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
