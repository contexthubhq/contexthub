import React from 'react';
import { PageHeader } from '@/components/layout/page-header';

export const dynamic = 'force-dynamic';

export default async function ContextSourcesPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Context sources" />
    </div>
  );
}
