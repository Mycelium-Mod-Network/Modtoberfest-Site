-- AddForeignKey
ALTER TABLE `RepositoryCache` ADD CONSTRAINT `RepositoryCache_repository_id_fkey` FOREIGN KEY (`repository_id`) REFERENCES `Repository`(`repository_id`) ON DELETE CASCADE ON UPDATE CASCADE;
