/*
  Warnings:

  - You are about to drop the column `participant_id` on the `Claim` table. All the data in the column will be lost.
  - Added the required column `account_id` to the `Claim` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Claim` DROP COLUMN `participant_id`,
    ADD COLUMN `account_id` VARCHAR(191) NOT NULL;
