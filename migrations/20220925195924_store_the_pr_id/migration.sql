/*
  Warnings:

  - A unique constraint covering the columns `[pr_id]` on the table `PullRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pr_id` to the `PullRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PullRequest` ADD COLUMN `pr_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `PullRequest_pr_id_key` ON `PullRequest`(`pr_id`);
