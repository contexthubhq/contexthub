/*
  Warnings:

  - Added the required column `name` to the `data_source_connections` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "data_source_connections" ADD COLUMN     "name" TEXT NOT NULL;
