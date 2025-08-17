-- CreateTable
CREATE TABLE "context_agent_results" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "closedAt" TIMESTAMP(3),
    "branchName" TEXT,
    "mergeRevisionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "context_agent_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "context_agent_results_jobId_key" ON "context_agent_results"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "context_agent_results_branchName_key" ON "context_agent_results"("branchName");

-- CreateIndex
CREATE UNIQUE INDEX "context_agent_results_mergeRevisionId_key" ON "context_agent_results"("mergeRevisionId");
