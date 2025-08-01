ALTER TABLE
  "data_source_credentials" RENAME TO "data_source_connections";

ALTER INDEX "data_source_credentials_pkey" RENAME TO "data_source_connections_pkey";
