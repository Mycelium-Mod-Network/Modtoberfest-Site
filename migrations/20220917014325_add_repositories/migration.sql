-- CreateTable
CREATE TABLE `Repository` (
    `id` VARCHAR(191) NOT NULL,
    `repository_id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `valid` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Repository_repository_id_key`(`repository_id`),
    UNIQUE INDEX `Repository_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SponsoredRepository` (
    `id` VARCHAR(191) NOT NULL,
    `repository_id` VARCHAR(191) NOT NULL,
    `sponsor_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SponsoredRepository_repository_id_key`(`repository_id`),
    UNIQUE INDEX `SponsoredRepository_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SponsoredRepository` ADD CONSTRAINT `SponsoredRepository_repository_id_fkey` FOREIGN KEY (`repository_id`) REFERENCES `Repository`(`repository_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SponsoredRepository` ADD CONSTRAINT `SponsoredRepository_sponsor_id_fkey` FOREIGN KEY (`sponsor_id`) REFERENCES `Sponsor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
