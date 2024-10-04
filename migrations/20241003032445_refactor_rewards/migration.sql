/*
  Warnings:

  - You are about to drop the `ClaimedCode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RewardCode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ClaimedCode` DROP FOREIGN KEY `ClaimedCode_claimed_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `ClaimedCode` DROP FOREIGN KEY `ClaimedCode_code_id_fkey`;

-- DropForeignKey
ALTER TABLE `RewardCode` DROP FOREIGN KEY `RewardCode_reward_id_fkey`;

-- DropTable
DROP TABLE `ClaimedCode`;

-- DropTable
DROP TABLE `RewardCode`;

-- CreateTable
CREATE TABLE `DigitalRewardCodes` (
    `id` VARCHAR(191) NOT NULL,
    `reward_id` VARCHAR(191) NOT NULL,
    `code` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DigitalRewardClaim` (
    `code_id` VARCHAR(191) NOT NULL,
    `claimer_github_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`code_id`, `claimer_github_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PhysicalRewardClaim` (
    `id` VARCHAR(191) NOT NULL,
    `reward_id` VARCHAR(191) NOT NULL,
    `claimer_github_id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `address1` VARCHAR(191) NOT NULL,
    `address2` VARCHAR(191) NULL,
    `city` VARCHAR(191) NOT NULL,
    `zip` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DigitalRewardCodes` ADD CONSTRAINT `DigitalRewardCodes_reward_id_fkey` FOREIGN KEY (`reward_id`) REFERENCES `Reward`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DigitalRewardClaim` ADD CONSTRAINT `DigitalRewardClaim_code_id_fkey` FOREIGN KEY (`code_id`) REFERENCES `DigitalRewardCodes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DigitalRewardClaim` ADD CONSTRAINT `DigitalRewardClaim_claimer_github_id_fkey` FOREIGN KEY (`claimer_github_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PhysicalRewardClaim` ADD CONSTRAINT `PhysicalRewardClaim_reward_id_fkey` FOREIGN KEY (`reward_id`) REFERENCES `Reward`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PhysicalRewardClaim` ADD CONSTRAINT `PhysicalRewardClaim_claimer_github_id_fkey` FOREIGN KEY (`claimer_github_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
