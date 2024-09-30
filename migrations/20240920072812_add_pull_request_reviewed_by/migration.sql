-- AlterTable
ALTER TABLE `PullRequestStatus` ADD COLUMN `reviewed_by` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `PullRequestStatus` ADD CONSTRAINT `PullRequestStatus_reviewed_by_fkey` FOREIGN KEY (`reviewed_by`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
