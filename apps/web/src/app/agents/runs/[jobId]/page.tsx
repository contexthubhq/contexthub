import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { JobSection } from './job-section';
import { ResultSection } from './result-section';

export const dynamic = 'force-dynamic';

export default async function ResultPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;

  return (
    <div className="space-y-4">
      <div className="pt-6">
        <Breadcrumbs jobId={jobId} />
      </div>
      <JobSection jobId={jobId} />
      <ResultSection jobId={jobId} />
    </div>
  );
}

function Breadcrumbs({ jobId }: { jobId: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/agents/runs">Agent runs</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{jobId}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
