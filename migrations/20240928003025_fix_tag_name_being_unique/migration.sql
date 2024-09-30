/*
  Warnings:

  - The primary key for the `TaggedRepository` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX `TaggedRepository_tag_name_repository_id_key` ON `TaggedRepository`;

-- AlterTable
ALTER TABLE `TaggedRepository` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`tag_name`, `repository_id`);
