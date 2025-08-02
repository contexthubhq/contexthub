-- CreateTable
CREATE TABLE "selected_tables" (
    "id" TEXT NOT NULL,
    "fullyQualifiedName" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "selected_tables_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "selected_tables_connectionId_fullyQualifiedName_key" ON "selected_tables"("connectionId", "fullyQualifiedName");

-- AddForeignKey
ALTER TABLE "selected_tables" ADD CONSTRAINT "selected_tables_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "data_source_connections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
