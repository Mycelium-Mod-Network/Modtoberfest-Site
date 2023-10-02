-- AddForeignKey
ALTER TABLE `Repository` ADD CONSTRAINT `Repository_repository_id_fkey` FOREIGN KEY (`repository_id`) REFERENCES `RepositoryCache`(`repository_id`) ON DELETE CASCADE ON UPDATE CASCADE;
