/*
  Warnings:

  - Added the required column `invalid` to the `PullRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PullRequest` ADD COLUMN `invalid` BOOLEAN NOT NULL;
