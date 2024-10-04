/*
  Warnings:

  - The primary key for the `DigitalRewardClaim` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `claimer_github_id` on the `DigitalRewardClaim` table. All the data in the column will be lost.
  - You are about to drop the column `claimer_github_id` on the `PhysicalRewardClaim` table. All the data in the column will be lost.
  - Added the required column `claimer_id` to the `DigitalRewardClaim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `claimer_id` to the `PhysicalRewardClaim` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `DigitalRewardClaim` DROP FOREIGN KEY `DigitalRewardClaim_claimer_github_id_fkey`;

-- DropForeignKey
ALTER TABLE `PhysicalRewardClaim` DROP FOREIGN KEY `PhysicalRewardClaim_claimer_github_id_fkey`;

-- AlterTable
ALTER TABLE `DigitalRewardClaim` DROP PRIMARY KEY,
    DROP COLUMN `claimer_github_id`,
    ADD COLUMN `claimer_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`code_id`, `claimer_id`);

-- AlterTable
ALTER TABLE `PhysicalRewardClaim` DROP COLUMN `claimer_github_id`,
    ADD COLUMN `claimer_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `DigitalRewardClaim` ADD CONSTRAINT `DigitalRewardClaim_claimer_id_fkey` FOREIGN KEY (`claimer_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PhysicalRewardClaim` ADD CONSTRAINT `PhysicalRewardClaim_claimer_id_fkey` FOREIGN KEY (`claimer_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
