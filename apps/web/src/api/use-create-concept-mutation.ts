import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CONCEPTS_QUERY_KEY } from './query-keys';
import { NewConcept } from '@contexthub/core';

async function createConcept({ concept }: { concept: NewConcept }) {
  const response = await fetch(`/api/context/concept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(concept),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create concept.');
  }
  return;
}

export function useCreateConceptMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ concept }: { concept: NewConcept }) =>
      createConcept({ concept }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CONCEPTS_QUERY_KEY],
      });
    },
  });
}
