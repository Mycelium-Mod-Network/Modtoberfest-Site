/*
  Warnings:

  - A unique constraint covering the columns `[code_id]` on the table `DigitalRewardClaim` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `DigitalRewardClaim_code_id_key` ON `DigitalRewardClaim`(`code_id`);
