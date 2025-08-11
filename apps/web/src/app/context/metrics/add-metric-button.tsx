'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { MetricSheet } from './metric-sheet';
import { useCreateMetricMutation } from '@/api/use-create-metric-mutation';
import { toast } from 'sonner';
import { NewMetric } from '@contexthub/core';

export function AddMetricButton() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { mutateAsync: createMetric } = useCreateMetricMutation();

  const handleSubmit = async (metric: NewMetric) => {
    await createMetric({ metric });
    toast.success('Metric created');
    setIsSheetOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsSheetOpen(true)}>
        <Plus />
        Add metric
      </Button>
      <MetricSheet
        metric={null}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSubmit={handleSubmit}
      />
    </>
  );
}
