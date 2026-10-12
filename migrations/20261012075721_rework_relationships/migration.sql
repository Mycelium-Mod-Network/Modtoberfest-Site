/*
  Warnings:

  - The primary key for the `UserRepositoryRelation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `reason` on the `UserRepositoryRelation` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `UserRepositoryRelation` table. All the data in the column will be lost.
  - Added the required column `github_user_id` to the `UserRepositoryRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relationship` to the `UserRepositoryRelation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `UserRepositoryRelation` DROP FOREIGN KEY `UserRepositoryRelation_user_id_fkey`;

-- AlterTable
ALTER TABLE `UserRepositoryRelation` DROP PRIMARY KEY,
    DROP COLUMN `reason`,
    DROP COLUMN `user_id`,
    ADD COLUMN `github_user_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `relationship` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`repository_id`, `github_user_id`);
