-- DropForeignKey
ALTER TABLE `PullRequestStatus` DROP FOREIGN KEY `PullRequestStatus_pr_id_fkey`;

-- AddForeignKey
ALTER TABLE `PullRequestStatus` ADD CONSTRAINT `PullRequestStatus_pr_id_fkey` FOREIGN KEY (`pr_id`) REFERENCES `PullRequest`(`pr_id`) ON DELETE CASCADE ON UPDATE CASCADE;
