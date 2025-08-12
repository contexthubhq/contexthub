import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { ConceptsTable } from './concepts-table';
import { AddConceptButton } from './add-concept-button';

export default async function ContextPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Concepts">
        <AddConceptButton />
      </PageHeader>
      <ConceptsTable />
    </div>
  );
}
