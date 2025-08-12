'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ConceptSheet } from './concept-sheet';
import { useCreateConceptMutation } from '@/api/use-create-concept-mutation';
import { toast } from 'sonner';
import { NewConcept } from '@contexthub/core';

export function AddConceptButton() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { mutateAsync: createConcept } = useCreateConceptMutation();

  const handleSubmit = async (concept: NewConcept) => {
    await createConcept({ concept });
    toast.success('Concept created');
    setIsSheetOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsSheetOpen(true)}>
        <Plus />
        Add concept
      </Button>
      <ConceptSheet
        concept={null}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSubmit={handleSubmit}
      />
    </>
  );
}
