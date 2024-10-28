-- DropForeignKey
ALTER TABLE `PullRequestStatus` DROP FOREIGN KEY `PullRequestStatus_pr_id_fkey`;

-- AlterTable
ALTER TABLE `PullRequest` MODIFY `pr_id` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `PullRequestStatus` MODIFY `pr_id` BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE `PullRequestStatus` ADD CONSTRAINT `PullRequestStatus_pr_id_fkey` FOREIGN KEY (`pr_id`) REFERENCES `PullRequest`(`pr_id`) ON DELETE CASCADE ON UPDATE CASCADE;
