-- DropForeignKey
ALTER TABLE `TaggedRepository` DROP FOREIGN KEY `TaggedRepository_tag_name_fkey`;

-- AddForeignKey
ALTER TABLE `TaggedRepository` ADD CONSTRAINT `TaggedRepository_tag_name_fkey` FOREIGN KEY (`tag_name`) REFERENCES `Tag`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;
