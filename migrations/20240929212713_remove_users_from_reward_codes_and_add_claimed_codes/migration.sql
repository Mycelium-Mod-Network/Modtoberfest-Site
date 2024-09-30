/*
  Warnings:

  - You are about to drop the column `claimed_user` on the `RewardCode` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `RewardCode` DROP FOREIGN KEY `RewardCode_claimed_user_fkey`;

-- AlterTable
ALTER TABLE `RewardCode` DROP COLUMN `claimed_user`;

-- CreateTable
CREATE TABLE `ClaimedCode` (
    `code_id` VARCHAR(191) NOT NULL,
    `claimed_user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`code_id`, `claimed_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ClaimedCode` ADD CONSTRAINT `ClaimedCode_code_id_fkey` FOREIGN KEY (`code_id`) REFERENCES `RewardCode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClaimedCode` ADD CONSTRAINT `ClaimedCode_claimed_user_id_fkey` FOREIGN KEY (`claimed_user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
