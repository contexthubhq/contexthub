'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Concept } from '@contexthub/core';
import { ConceptSheet } from './concept-sheet';
import { useState } from 'react';
import { toast } from 'sonner';
import { useConceptsQuery } from '@/api/use-concepts-query';
import { useUpdateConceptMutation } from '@/api/use-update-concept-mutation';

export function ConceptsTable() {
  const { data: concepts } = useConceptsQuery();
  const { mutateAsync: updateConcept } = useUpdateConceptMutation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<Concept | undefined>(
    undefined
  );

  const handleEditConcept = (concept: Concept) => {
    setSelectedConcept(concept);
    setIsSheetOpen(true);
  };

  const handleSubmit = async (concept: Concept) => {
    await updateConcept({ concept });
    toast.success('Concept saved');
    setIsSheetOpen(false);
    setSelectedConcept(undefined);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Synonyms</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Example values</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(concepts ?? []).map((concept) => (
            <TableRow
              key={concept.id}
              onClick={() => handleEditConcept(concept)}
              role="button"
              className="hover:bg-muted cursor-pointer"
            >
              <TableCell>{concept.name}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {concept.description ?? ''}
              </TableCell>
              <TableCell>{concept.synonyms.join(', ')}</TableCell>
              <TableCell>{concept.tags.join(', ')}</TableCell>
              <TableCell>
                {concept.exampleValues.length > 0 ? (
                  <span className="text-muted-foreground italic">
                    {concept.exampleValues.length}{' '}
                    {concept.exampleValues.length === 1 ? 'value' : 'values'}
                  </span>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedConcept && (
        <ConceptSheet
          concept={selectedConcept}
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
