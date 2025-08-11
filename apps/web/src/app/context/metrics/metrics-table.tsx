'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Metric } from '@contexthub/core';
import { Check } from 'lucide-react';
import { MetricSheet } from './metric-sheet';
import { useState } from 'react';
import { toast } from 'sonner';
import { useMetricsQuery } from '@/api/use-metrics-query';
import { useUpdateMetricMutation } from '@/api/use-update-metric-mutation';

export function MetricsTable() {
  const { data: metrics } = useMetricsQuery();
  const { mutateAsync: updateMetric } = useUpdateMetricMutation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<Metric | undefined>(
    undefined
  );

  const handleEditMetric = (metric: Metric) => {
    setSelectedMetric(metric);
    setIsSheetOpen(true);
  };

  const handleSubmit = async (metric: Metric) => {
    await updateMetric({ metric });
    toast.success('Metric saved');
    setIsSheetOpen(false);
    setSelectedMetric(undefined);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Formula</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Example queries</TableHead>
            <TableHead>Unit of measure</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(metrics ?? []).map((metric) => (
            <TableRow
              key={metric.id}
              onClick={() => handleEditMetric(metric)}
              role="button"
              className="hover:bg-muted cursor-pointer"
            >
              <TableCell>{metric.name}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {metric.description ?? ''}
              </TableCell>
              <TableCell>
                {metric.formula ? (
                  <Check className="size-4 text-muted-foreground" />
                ) : null}
              </TableCell>
              <TableCell>{metric.tags.join(', ')}</TableCell>
              <TableCell>
                {metric.exampleQueries.length > 0 ? (
                  <span className="text-muted-foreground italic">
                    {metric.exampleQueries.length}{' '}
                    {metric.exampleQueries.length === 1 ? 'query' : 'queries'}
                  </span>
                ) : null}
              </TableCell>
              <TableCell>{metric.unitOfMeasure ?? ''}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedMetric && (
        <MetricSheet
          metric={selectedMetric}
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
