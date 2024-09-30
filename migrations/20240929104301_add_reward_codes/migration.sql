-- CreateTable
CREATE TABLE `RewardCode` (
    `id` VARCHAR(191) NOT NULL,
    `reward_id` VARCHAR(191) NOT NULL,
    `code` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RewardCode` ADD CONSTRAINT `RewardCode_reward_id_fkey` FOREIGN KEY (`reward_id`) REFERENCES `Reward`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
