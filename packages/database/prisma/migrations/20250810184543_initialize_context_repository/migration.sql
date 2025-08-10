-- Initialize the context repository with a main branch and an initial revision.
INSERT INTO
  "context_revisions" ("id", "createdAt", "parentId", "content")
VALUES
  ('initial', NOW(), NULL, '{}');

INSERT INTO
  "context_branches" (
    "id",
    "name",
    "createdAt",
    "updatedAt",
    "revisionId"
  )
VALUES
  ('main', 'main', NOW(), NOW(), 'initial');
