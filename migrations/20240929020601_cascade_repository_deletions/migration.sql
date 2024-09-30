-- DropForeignKey
ALTER TABLE `TaggedRepository` DROP FOREIGN KEY `TaggedRepository_repository_id_fkey`;

-- AddForeignKey
ALTER TABLE `TaggedRepository` ADD CONSTRAINT `TaggedRepository_repository_id_fkey` FOREIGN KEY (`repository_id`) REFERENCES `Repository`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
