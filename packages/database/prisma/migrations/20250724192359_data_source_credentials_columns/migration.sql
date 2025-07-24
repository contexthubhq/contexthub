/*
  Warnings:

  - Added the required column `credentials` to the `data_source_credentials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `data_source_credentials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "data_source_credentials" ADD COLUMN     "credentials" JSONB NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
