-- CreateTable
CREATE TABLE "context_revisions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parentId" TEXT,
    "content" JSONB NOT NULL,

    CONSTRAINT "context_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "context_branches" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "context_branches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "context_branches_name_key" ON "context_branches"("name");

-- AddForeignKey
ALTER TABLE "context_revisions" ADD CONSTRAINT "context_revisions_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "context_revisions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "context_branches" ADD CONSTRAINT "context_branches_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "context_revisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
