/*
  Warnings:

  - Added the required column `claimed_user` to the `RewardCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `RewardCode` ADD COLUMN `claimed_user` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `RewardCode` ADD CONSTRAINT `RewardCode_claimed_user_fkey` FOREIGN KEY (`claimed_user`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
