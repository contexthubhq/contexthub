/*
  Warnings:

  - Made the column `branchName` on table `context_agent_results` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "context_agent_results" ALTER COLUMN "branchName" SET NOT NULL;
