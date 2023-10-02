/*
  Warnings:

  - You are about to alter the column `stars` on the `RepositoryCache` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `RepositoryCache` MODIFY `stars` INTEGER NOT NULL;
